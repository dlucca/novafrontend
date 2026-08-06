# Envío gratis de lanzamiento — Diseño

**Fecha:** 2026-08-06
**Estado:** Aprobado, listo para plan de implementación

## Problema

El costo de envío está frenando ventas. Para este lanzamiento se decidió **bonificar el
envío**: el cliente no debe pagar envío (cargo real $0, no solo el texto en pantalla).

## Decisión de mecanismo

El cargo final lo decide **Medusa** (backend), no el frontend. Al enviar el checkout, el
front pide las shipping options, aplica una con `addShippingMethod`, y Medusa devuelve el
`total` y `shipping_total` autoritativos que son lo que realmente se cobra. Por eso, poner
"Gratis" solo en el frontend no evita el cargo.

**Mecanismo elegido:** una **promoción automática en Medusa** que pone el envío en $0 para
todo carrito, más un **flag de env var en el frontend** que controla el mensaje persuasivo
(precio tachado + "GRATIS"). El flag es de display/UX; la fuente autoritativa del cobro
sigue siendo el `total` de Medusa.

## Alcance

- **Backend + frontend.**
- Región: **México (MXN)**. Argentina ya tiene envío en $0, no se ve afectada.
- Promo **temporal de lanzamiento**: debe poder encenderse/apagarse fácil.
- Comunicación UX: **precio de zona tachado + "GRATIS"** (ancla de ahorro), no un banner
  global de sitio.

## Backend — Promoción automática en Medusa

Se crea **una promoción automática** en Medusa v2 vía **Admin UI** (el usuario la crea; no
se comparten tokens por chat).

Campos:
- **Automática** (`is_automatic: true`), estado **activo**.
- **Sin código** (`code` vacío) — se aplica sola a todos los carritos.
- **Application method:**
  - `target_type: "shipping_methods"`
  - `type: "percentage"`, `value: 100` → pone en $0 cualquier método de envío sin importar
    la zona ($90 CDMX/EdoMex o $145 Nacional).
- **Región:** MX (MXN).

Efecto: cuando el checkout llama a `addShippingMethod`, Medusa aplica la promo y devuelve
`shipping_total: 0` y un `total` sin envío. El flujo de cobro del frontend **no cambia**.

**Apagar la promo** = desactivarla/eliminarla en el Admin UI.

El plan de implementación incluirá los pasos exactos del Admin UI y una checklist de
verificación (crear carrito de prueba MX, aplicar shipping method, confirmar
`shipping_total: 0`).

## Frontend

### Flag de encendido

Helper central `lib/free-shipping.ts`:

```ts
export const FREE_SHIPPING = process.env.NEXT_PUBLIC_FREE_SHIPPING === "true";
```

- `NEXT_PUBLIC_` porque el checkout y el cart drawer son client components.
- Se enciende/apaga desde Vercel cambiando la env var (sin redeploy de código).

### Checkout — `app/[locale]/checkout/page.tsx`

- **Fila de envío** (~línea 1906): con `FREE_SHIPPING` on, mostrar el monto de zona
  (`shippingPreview`, $90/$145 según CP) **tachado** + **"GRATIS"** en verde. Ese es el
  ancla de ahorro.
- **Totales:** con el flag on, forzar `displayShippingCost = 0` para que el botón "Pagar",
  el Total y la línea "antes" no sumen envío. Hoy el fallback
  `shippingCost > 0 ? shippingCost : shippingPreview` reintroduciría los $145 cuando Medusa
  devuelve 0 — debe gatearse con el flag.
- **`confirmedTotal` sigue autoritativo:** es el total real de Medusa post-`addShippingMethod`.
  Si por error la promo del backend no estuviera activa, el botón "Pagar" mostraría el
  total real con envío → **red de seguridad contra cobrar de más sin avisar**.
- No se toca la lógica de selección de shipping option ni de cupones.

### Cart drawer — `components/CartDrawer.tsx` (~línea 503)

En el drawer todavía no hay dirección → no hay monto de zona para tachar. Con
`FREE_SHIPPING` on, la fila "Envío" muestra **"GRATIS"** en verde (en vez de "Calculado al
pagar"). Honesto y simple.

### Fuera de alcance (YAGNI)

- **No** se agrega banner global de sitio. El `CTABanner` ya dice "Envío gratis"; se deja
  como está.
- El mecanismo de **cupón de envío** existente (`kind: "shipping"`, cupones diferidos) queda
  intacto — sigue funcionando por si se quieren códigos además de la promo automática.
- Con el flag **off**, todo vuelve al comportamiento actual sin cambios.

## Interacción entre flag y promo de backend

Deben encenderse/apagarse juntos:

- **Flag on + promo on** (estado deseado): front muestra tachado+GRATIS; Medusa cobra $0. OK.
- **Flag on + promo off** (error de config): front muestra Gratis en el preview, pero el
  `confirmedTotal` de Medusa incluiría envío → el botón "Pagar" mostraría el total real con
  envío. No se cobra de más en silencio, pero hay inconsistencia visual. **Mitigación:**
  documentar que ambos van juntos; la checklist de verificación lo cubre.
- **Flag off + promo on:** Medusa devuelve envío 0 pero el front mostraría el preview de
  zona. Inconsistencia menor. Mantenerlos en sync.

## Verificación

- Revisar smoke tests que tocan checkout (`tests/e2e/smoke/full-checkout.spec.ts`,
  `pre-checkout.spec.ts`) y ajustar expectativas si el flag está on en el entorno de test.
- Verificación manual con dev server:
  - Flag on → checkout muestra monto de zona tachado + GRATIS y Total sin envío; drawer
    muestra "GRATIS".
  - Flag off → comportamiento actual sin cambios.
- Verificación backend: carrito de prueba MX con shipping method aplicado devuelve
  `shipping_total: 0`.
