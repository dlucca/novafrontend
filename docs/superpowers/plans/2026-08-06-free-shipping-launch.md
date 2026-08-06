# Envío Gratis de Lanzamiento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** No cobrar envío en el lanzamiento — cargo real $0 vía promoción automática en Medusa, con display persuasivo (precio de zona tachado + "GRATIS") en el frontend, encendible/apagable por env var.

**Architecture:** El cargo autoritativo lo emite Medusa. Una promoción automática (target `shipping_methods`, 100% off) pone el envío en $0 para todo carrito MX. En el frontend, un flag `FREE_SHIPPING` (leído de `NEXT_PUBLIC_FREE_SHIPPING`) controla únicamente la UI: fila de envío tachada + "GRATIS" y total sin envío. El flag y la promo se encienden/apagan juntos.

**Tech Stack:** Next.js 15 App Router, React 19 (client components), TypeScript, Tailwind v4, Medusa v2 (Admin UI), Vercel (env vars).

## Global Constraints

- Región de la promo: **México (MXN)**. Argentina ya tiene envío $0 y no se toca.
- El flag del frontend es `NEXT_PUBLIC_FREE_SHIPPING` (string `"true"` para on). `NEXT_PUBLIC_` es obligatorio: se lee en client components.
- **No** agregar banner global de sitio. `components/home/CTABanner.tsx` se deja como está.
- El mecanismo de cupón de envío existente (`kind: "shipping"`) queda intacto.
- Con el flag `off`, el comportamiento debe ser idéntico al actual (sin regresiones).
- Color de "GRATIS": verde `#16A34A` (mismo verde usado en el summary del checkout, línea 1894). Precio tachado: gris `#9CA3AF` con `line-through`.
- No hay runner de unit tests; la verificación es `lint` + preview en browser con el flag on/off. No scaffoldear vitest/jest.
- Spec de referencia: `docs/superpowers/specs/2026-08-06-free-shipping-launch-design.md`.

---

## File Structure

- **Create** `apps/storefront/lib/free-shipping.ts` — expone la constante `FREE_SHIPPING`. Única fuente del flag; consumida por checkout y drawer.
- **Modify** `apps/storefront/app/[locale]/checkout/page.tsx` — fila de envío (tachado+GRATIS) y `displayShippingCost` forzado a 0 con el flag.
- **Modify** `apps/storefront/components/CartDrawer.tsx` — fila "Envío" muestra "GRATIS" con el flag.
- **Backend (Admin UI, sin cambios de código):** promoción automática en Medusa — documentada como runbook en Task 3.

Todos los comandos se corren desde `apps/storefront/`.

---

### Task 1: Flag `FREE_SHIPPING` + display en checkout

**Files:**
- Create: `apps/storefront/lib/free-shipping.ts`
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx` (import tras línea 20; `displayShippingCost` en línea 446; fila de envío en líneas 1906-1911)
- Modify (local, gitignoreado): `apps/storefront/.env.local` (solo para verificación local)

**Interfaces:**
- Produces: `FREE_SHIPPING: boolean` exportado desde `@/lib/free-shipping`. Consumido también por Task 2.

- [ ] **Step 1: Crear el helper del flag**

Create `apps/storefront/lib/free-shipping.ts`:

```ts
/**
 * Launch free-shipping flag. Controls the persuasive "GRATIS" display in the
 * checkout summary and cart drawer. The authoritative $0 charge comes from an
 * automatic promotion in Medusa (target: shipping_methods, 100% off) — this
 * flag governs UI only. Toggle both together.
 * See docs/superpowers/specs/2026-08-06-free-shipping-launch-design.md
 */
export const FREE_SHIPPING = process.env.NEXT_PUBLIC_FREE_SHIPPING === "true";
```

- [ ] **Step 2: Importar el flag en el checkout**

En `apps/storefront/app/[locale]/checkout/page.tsx`, tras la línea 20 (`import { resolveShippingEta } from "@/lib/shipping-eta";`), agregar:

```ts
import { FREE_SHIPPING } from "@/lib/free-shipping";
```

- [ ] **Step 3: Forzar `displayShippingCost` a 0 con el flag**

En `apps/storefront/app/[locale]/checkout/page.tsx`, línea 446. Reemplazar:

```ts
  const displayShippingCost = shippingCost > 0 ? shippingCost : shippingPreview;
```

por:

```ts
  const displayShippingCost = FREE_SHIPPING
    ? 0
    : shippingCost > 0
      ? shippingCost
      : shippingPreview;
```

Esto asegura que el botón "Pagar", el Total y la línea "antes" (que usan `displayShippingCost`) no sumen envío. `confirmedTotal` de Medusa sigue siendo autoritativo si ya está seteado.

- [ ] **Step 4: Fila de envío tachada + "GRATIS"**

En `apps/storefront/app/[locale]/checkout/page.tsx`, líneas 1906-1911. Reemplazar:

```tsx
                {displayShippingCost > 0 && (
                  <div className="flex justify-between text-[13px] text-[#6B7280]">
                    <span>Envío{shippingCost === 0 && <span className="text-[11px] text-[#9CA3AF] ml-1">(estimado)</span>}</span>
                    <span className="font-semibold text-[#005088]">{fmt(displayShippingCost, cartRegion)}</span>
                  </div>
                )}
```

por:

```tsx
                {FREE_SHIPPING ? (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#6B7280]">Envío</span>
                    <span className="flex items-center gap-1.5">
                      {shippingPreview > 0 && (
                        <span className="text-[#9CA3AF] line-through">{fmt(shippingPreview, cartRegion)}</span>
                      )}
                      <span className="font-bold text-[#16A34A]">GRATIS</span>
                    </span>
                  </div>
                ) : (
                  displayShippingCost > 0 && (
                    <div className="flex justify-between text-[13px] text-[#6B7280]">
                      <span>Envío{shippingCost === 0 && <span className="text-[11px] text-[#9CA3AF] ml-1">(estimado)</span>}</span>
                      <span className="font-semibold text-[#005088]">{fmt(displayShippingCost, cartRegion)}</span>
                    </div>
                  )
                )}
```

Nota: cuando aún no hay dirección/zona (`shippingPreview === 0`, p. ej. AR o antes de escribir el CP), se muestra solo "GRATIS" sin precio tachado.

- [ ] **Step 5: Lint**

Run: `pnpm run lint`
Expected: sin errores nuevos en `app/[locale]/checkout/page.tsx` ni `lib/free-shipping.ts`.

- [ ] **Step 6: Verificación en browser — flag ON**

1. Agregar a `apps/storefront/.env.local`: `NEXT_PUBLIC_FREE_SHIPPING=true`
2. Iniciar el dev server (preview_start con el server de `.claude/launch.json`; si no existe, crear una config `runtimeExecutable: "pnpm"`, `runtimeArgs: ["run","dev"]`, `port: 3000`).
3. Navegar a la tienda, agregar un producto, ir al checkout y escribir una dirección MX con CP de CDMX (preview esperado $90) y otra de otro estado (preview $145).

Expected: en el resumen, la fila "Envío" muestra el monto de zona **tachado** ($90 o $145) + **"GRATIS"** en verde; el **Total** y el botón **"Pagar"** NO incluyen envío (igual al subtotal con descuentos).

- [ ] **Step 7: Verificación en browser — flag OFF**

1. Cambiar en `.env.local`: `NEXT_PUBLIC_FREE_SHIPPING=false` (o quitar la línea) y reiniciar el dev server (el flag se lee en build/arranque, requiere reinicio).
2. Repetir el checkout con dirección MX.

Expected: comportamiento actual — fila "Envío" muestra el monto ($90/$145) sin tachar, Total incluye envío. Sin regresiones.

- [ ] **Step 8: Commit**

Dejar `.env.local` sin commitear (está gitignoreado). Commit:

```bash
git add apps/storefront/lib/free-shipping.ts "apps/storefront/app/[locale]/checkout/page.tsx"
git commit -m "feat(checkout): free-shipping launch flag with struck price + GRATIS

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Display "GRATIS" en el cart drawer

**Files:**
- Modify: `apps/storefront/components/CartDrawer.tsx` (import; fila "Envío" en líneas 502-507)

**Interfaces:**
- Consumes: `FREE_SHIPPING` de `@/lib/free-shipping` (creado en Task 1).

- [ ] **Step 1: Importar el flag en el drawer**

En `apps/storefront/components/CartDrawer.tsx`, junto a los imports de `@/lib` (tras la línea 12, `import { formatPrice } from "@/lib/format";`), agregar:

```ts
import { FREE_SHIPPING } from "@/lib/free-shipping";
```

- [ ] **Step 2: Fila "Envío" muestra "GRATIS" con el flag**

En `apps/storefront/components/CartDrawer.tsx`, líneas 502-507. Reemplazar:

```tsx
                      <div className="flex justify-between text-[12px] text-gray-500">
                        <span>Envío</span>
                        <span className={shippingCoupon ? "text-green-600 font-semibold" : ""}>
                          {shippingCoupon ? "Gratis al pagar" : "Calculado al pagar"}
                        </span>
                      </div>
```

por:

```tsx
                      <div className="flex justify-between text-[12px] text-gray-500">
                        <span>Envío</span>
                        <span className={FREE_SHIPPING || shippingCoupon ? "text-green-600 font-semibold" : ""}>
                          {FREE_SHIPPING ? "GRATIS" : shippingCoupon ? "Gratis al pagar" : "Calculado al pagar"}
                        </span>
                      </div>
```

Nota: el drawer no conoce la zona (no hay dirección aún), por eso muestra solo "GRATIS" sin precio tachado.

- [ ] **Step 3: Lint**

Run: `pnpm run lint`
Expected: sin errores nuevos en `components/CartDrawer.tsx`.

- [ ] **Step 4: Verificación en browser — flag ON**

Con `NEXT_PUBLIC_FREE_SHIPPING=true` en `.env.local` y el dev server corriendo: abrir el cart drawer con al menos un producto.

Expected: la fila "Envío" muestra **"GRATIS"** en verde (en vez de "Calculado al pagar").

- [ ] **Step 5: Verificación en browser — flag OFF**

Con `NEXT_PUBLIC_FREE_SHIPPING=false` y dev server reiniciado: abrir el drawer.

Expected: la fila muestra "Calculado al pagar" (comportamiento actual).

- [ ] **Step 6: Commit**

```bash
git add apps/storefront/components/CartDrawer.tsx
git commit -m "feat(cart): show GRATIS shipping in drawer under launch flag

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Promoción automática en Medusa + activación en Vercel (runbook)

Esta task NO cambia código: crea la promo en el Admin UI de Medusa (Opción A elegida: el usuario la crea, sin compartir tokens) y activa el flag en Vercel. Incluye la checklist de verificación end-to-end.

- [ ] **Step 1: Crear la promoción automática en el Admin UI de Medusa**

Entrar al Admin de Medusa → **Promotions** → **Create promotion**, con estos valores:

- **Method:** Automatic (no code) — se aplica sola a todos los carritos.
- **Status:** Active.
- **Type:** Standard.
- **Application method:**
  - **Target:** Shipping methods (`target_type: "shipping_methods"`).
  - **Value type:** Percentage.
  - **Value:** `100` (100% off del envío → $0 sin importar la zona).
- **Región / Currency:** México (MXN).

Guardar.

- [ ] **Step 2: Verificar la promo contra un carrito de prueba (API)**

Crear un carrito MX de prueba, aplicarle un shipping method y confirmar que Medusa devuelve envío en 0. Con el backend y una dirección MX válida:

```bash
# 1) shipping options del carrito de prueba
curl -s "$MEDUSA_URL/store/shipping-options?cart_id=$CART_ID" \
  -H "x-publishable-api-key: $PUBLISHABLE_KEY"

# 2) aplicar el primer option_id y leer shipping_total / total
curl -s -X POST "$MEDUSA_URL/store/carts/$CART_ID/shipping-methods" \
  -H "x-publishable-api-key: $PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"option_id":"<PRIMER_OPTION_ID>"}'
```

Expected: en la respuesta del paso 2, `cart.shipping_total === 0` (y `cart.total` sin envío). Si `shipping_total > 0`, la promo no quedó bien creada — revisar target/valor/región en el Admin UI antes de seguir.

(Alternativa sin curl: correr `pnpm run test:e2e:smoke` — el smoke `full-checkout` aplica shipping method y asegura `total ≤ 30 MXN`; la promo automática solo baja más el total, la aserción sigue válida.)

- [ ] **Step 3: Activar el flag en Vercel**

En Vercel → Project Settings → Environment Variables:
- Agregar `NEXT_PUBLIC_FREE_SHIPPING=true` en **Production** (y Preview si se quiere probar antes).
- Redeploy para que la env var entre en el build (las `NEXT_PUBLIC_` se inyectan en build time).

- [ ] **Step 4: Verificación end-to-end en producción**

Con la promo activa y el flag `true` desplegado:
1. Abrir el sitio, agregar un producto, abrir el drawer → "Envío: GRATIS".
2. Ir al checkout, escribir dirección MX → fila "Envío" tachada + "GRATIS", Total sin envío.
3. Confirmar que el "Pagar" y el `confirmedTotal` (total autoritativo de Medusa tras aplicar el shipping method) NO incluyen envío.

Expected: los tres puntos se cumplen. Si el botón "Pagar" muestra envío pese al flag on, la promo del backend no está activa (recordatorio del spec: flag y promo van juntos) — revisar Step 1-2.

- [ ] **Step 5: Documentar el apagado**

Para terminar la promo de lanzamiento (ambos juntos):
1. Medusa Admin → Promotions → desactivar/eliminar la promo automática.
2. Vercel → poner `NEXT_PUBLIC_FREE_SHIPPING=false` (o eliminar la var) → redeploy.

No requiere cambios de código: con el flag off el frontend vuelve al cálculo por zona.

---

## Self-Review

**Spec coverage:**
- Backend promo automática (target shipping_methods, 100%, MX) → Task 3 Step 1-2. ✓
- Flag `NEXT_PUBLIC_FREE_SHIPPING` en `lib/free-shipping.ts` → Task 1 Step 1. ✓
- Checkout: fila tachada + GRATIS y `displayShippingCost=0` → Task 1 Steps 3-4. ✓
- `confirmedTotal` autoritativo como red de seguridad → Task 1 Step 3 (no se toca) + Task 3 Step 4. ✓
- Cart drawer "GRATIS" → Task 2. ✓
- Sin banner global; CTABanner intacto → fuera de alcance, no hay task. ✓
- Cupón de envío existente intacto → no se modifica. ✓
- Flag off = comportamiento actual → verificado en Task 1 Step 7 y Task 2 Step 5. ✓
- Verificación smoke tests → Task 3 Step 2 (alternativa). ✓
- Interacción flag/promo (encender juntos) → Task 3 Steps 4-5. ✓

**Placeholder scan:** sin TBD/TODO; todos los steps de código muestran el código exacto. ✓

**Type consistency:** `FREE_SHIPPING: boolean` se define en Task 1 y se consume con el mismo nombre en Task 2. `displayShippingCost`, `shippingPreview`, `shippingCost`, `cartRegion`, `fmt` y `shippingCoupon` son símbolos ya existentes en los archivos modificados. ✓
