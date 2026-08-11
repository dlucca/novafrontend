# MercadoPago como gateway único LATAM (México) — Diseño

**Fecha:** 2026-08-10
**Estado:** En revisión
**Repos afectados:** `novafrontend` (storefront) y `novabackend` (Medusa)

## Problema y objetivo

Hoy la tienda de México cobra con **Openpay** y el resto de LATAM (AR, y a futuro BR/CL/CO)
con **MercadoPago**. Se decidió **unificar todo LATAM en MercadoPago** y **retirar Openpay
por completo** (corte limpio). Además, el checkout debe habilitar **todos los medios de pago
que ofrece MercadoPago** —no solo tarjeta— vía **Payment Brick** tematizado.

Este trabajo **enciende únicamente México** ahora. Argentina ya opera en MP; BR/CL/CO quedan
listos a nivel código/config y se activan cuando tengan cuenta MP y región Medusa poblada.

## Decisiones cerradas

1. **Reemplazo total:** MercadoPago es el gateway único. Openpay se retira (módulo, cliente,
   rutas, envs, scripts). No hay suscripciones Openpay legacy relevantes → corte limpio.
2. **Solo México se activa** en este trabajo. AR ya está en MP. BR/CL/CO: config-ready.
3. **Credenciales por país:** cada cuenta MP es nacional. Resolver por país en backend y
   frontend (no una credencial global).
4. **Payment Brick tematizado** reemplaza el formulario de tarjeta custom. Soporta tarjeta,
   OXXO, SPEI, wallet de Mercado Pago y meses sin intereses, con branding MP + paleta Novapatch.
5. **Todos los métodos, incluidos OXXO/SPEI** (offline/asíncronos): orden en estado
   *pendiente de pago*, pantalla de voucher/instrucciones, y **webhook** de MP como fuente de
   verdad que confirma el pago.
6. **Suscripciones = solo tarjeta/wallet.** El cobro recurrente de MP no puede re-cobrar un
   voucher OXXO. Si el carrito tiene suscripción, OXXO/SPEI no se ofrecen; quedan disponibles
   solo para compra única.
7. **3DS:** gestionado por el Brick + verificación server-side. `three_d_secure_mode`
   configurable por env (`MP_3DS_MODE_MX`, default `optional`). El webhook confirma el estado
   final.

## Arquitectura general

El "cambio de gateway" se compone de: (a) generalizar la selección de proveedor de
"por moneda `ars`" a "siempre MP con credenciales por país"; (b) reemplazar la UI de pago por
Payment Brick; (c) reescribir el endpoint de creación de pago para aceptar cualquier método
de MP y devolver el siguiente paso (aprobado / 3DS / voucher / rechazado); (d) manejar el
ciclo de orden pendiente para métodos offline; (e) webhook de MP idempotente; (f) apuntar la
región MX a MP y retirar Openpay.

**Puntos que hoy hardcodean el proveedor por moneda `ars` (se colapsan a "siempre MP"):**
- `novabackend/src/api/store/carts/[id]/payment-sessions/route.ts` (~L119)
- `novabackend/src/api/store/carts/[id]/complete/route.ts` (~L69)
- `novafrontend/apps/storefront/app/[locale]/checkout/page.tsx` (rama `cartRegion === "ars"`)

## 1. Credenciales por país

Cada cuenta MP infiere su moneda del país; no se envía `currency_id` en el charge (ya es así).

**Backend** — helper `mpCredentialsFor(country: string): { accessToken: string; sandbox: boolean }`
en `novabackend/src/lib/`. Lee `MP_ACCESS_TOKEN_MX`, `MP_ACCESS_TOKEN_AR`, etc., con fallback
al `MP_ACCESS_TOKEN` legacy para no romper AR durante el deploy. Se usa en:
- `complete/route.ts` (creación de pago)
- `complete-3ds` / confirmación
- webhook (para consultar el pago)
- `payment-provider-router.ts` (billing recurrente de suscripciones)

El país se deriva de la moneda del carrito/orden (`mxn`→mx, `ars`→ar, `brl`→br, `clp`→cl,
`cop`→co).

**Frontend** — `loadMercadoPago(country)` en `lib/mercadopago.ts` elige la public key
(`NEXT_PUBLIC_MP_PUBLIC_KEY_MX` / `_AR`) y el locale (`es-MX` / `es-AR`). Deja de hardcodear
`es-AR` y una sola key.

## 2. Frontend — Payment Brick

Reemplaza el `<form>` de tarjeta custom y las funciones `tokenizeCardMP` / `parseCardFormMP`
(que se eliminan) por el **Payment Brick** de MP.

- Se renderiza en la sección de pago del checkout, **conservando** el resto de la página:
  contacto, dirección + COPOMEX/Google Places, cupones, resumen, y el gate de suscripciones.
- Inicialización: `initialization: { amount: <total confirmado por Medusa>, payer: { email } }`.
- `customization.visual`: paleta Novapatch (coral `#E8503A`, navy `#005088`), bordes/radios
  para integrarse; se conserva el branding de métodos de MP (señal de confianza en MX).
- `customization.paymentMethods`: se habilitan tarjeta, ticket (OXXO), bank_transfer (SPEI),
  wallet, y `maxInstallments` para meses sin intereses.
- **Restricción por carrito:** si `hasSubscriptions`, se ocultan OXXO/SPEI (solo tarjeta/wallet).
- El `amount` del Brick debe ser el **total autoritativo de Medusa** (post-envío/cupones),
  no el estimado del frontend. El Brick se monta/actualiza una vez que el preload + shipping
  resolvieron el total (reusa la lógica de `confirmedTotal`).
- `onSubmit({ selectedPaymentMethod, formData })`: se hace POST al backend con `formData`
  (token de tarjeta, o método OXXO/SPEI/wallet) + email + cart_id. La respuesta indica el
  siguiente paso (ver §3).
- Se mantiene todo el tracking (`AddPaymentInfo`, `checkout_started`, y el stash de
  Purchase/Subscribe para la página `/gracias`).

## 3. Backend — endpoint de creación de pago (reshape de `/complete`)

`POST /store/carts/:id/complete` deja de aceptar solo `{ mp_card_token }` y pasa a aceptar el
`formData` genérico del Brick. El `CompleteCartPayload` en `lib/medusa.ts` se actualiza en
consecuencia (se elimina la variante `openpay_token_id`).

Flujo:
1. Resolver credenciales por país (§1) desde la moneda del carrito.
2. get-or-create MP customer (como hoy en el flujo MP de AR).
3. Crear el pago vía `POST /v1/payments` con los campos del método seleccionado:
   `token`/`payment_method_id`/`issuer_id`/`installments` (tarjeta), o `payment_method_id`
   `oxxo`/`spei` (offline), + `three_d_secure_mode` desde `MP_3DS_MODE_MX`, `payer`,
   `external_reference: cartId`, `X-Idempotency-Key`.
4. Ramificar según el resultado y responder al frontend:

| Resultado MP | Respuesta al front | Acción |
|---|---|---|
| `approved` (inmediato) | `{ type: "order" }` | Completa carrito → orden pagada, emite `order.payment_captured`. |
| `pending` + 3DS (`pending_challenge`) | `{ type: "redirect", redirect_url }` | El Brick/redirect maneja el challenge; confirma en §4. |
| `pending` + OXXO/SPEI | `{ type: "voucher", voucher }` | Completa carrito → **orden pendiente de pago**; **NO** emite `order.payment_captured`. Webhook confirma (§5). |
| `rejected` | `422 { message }` | Mensaje traducido (§Errores). |

**Importante (fulfillment):** para métodos offline la orden se crea pero **no** se dispara
`order.payment_captured` (que gatilla fulfillment) hasta que el webhook confirme el pago real.

## 4. 3DS (tarjeta)

- `three_d_secure_mode` sale de env `MP_3DS_MODE_MX` (default `optional`; `mandatory` fuerza
  challenge en el 100%). Configurable sin deploy de código.
- El Brick puede renderizar el challenge inline; cuando MP responde `pending_challenge` con
  `external_resource_url`, el backend devuelve `{ type: "redirect", redirect_url }` y se reusa
  la infra existente de `/checkout/3ds-return`.
- **`complete-3ds/route.ts` se reescribe para MP** (se borra el cliente Openpay): recibe
  `mp_payment_id`, consulta `GET /v1/payments/{id}` con las credenciales del país, y si quedó
  `approved` corre `completeCartWorkflow` + emite `order.payment_captured`.
- `/checkout/3ds-return/page.tsx` lee el id de pago de MP y llama `complete3DS(cartId, { mp_payment_id })`.
  **Se conserva la red de polling del carrito** (`confirmViaPolling`) — ideal para la asincronía
  de MP.
- `medusa.checkout.complete3DS` cambia su firma de `openpay_transaction_id` → `mp_payment_id`.

## 5. Webhook de MercadoPago (columna vertebral)

Nueva ruta `POST /webhooks/mercadopago` en `novabackend/src/api/webhooks/mercadopago/`.

- **Verificación de firma:** valida el HMAC de MP (`x-signature` + `x-request-id`) contra
  `MP_WEBHOOK_SECRET_MX`. Rechaza si no valida.
- **Idempotente:** ante `payment.updated`/`payment.created`, consulta el pago por id; si
  `approved` y la orden asociada (por `external_reference` = cartId) aún no está capturada,
  completa el carrito (si hiciera falta) y emite `order.payment_captured`. Si ya estaba
  procesada (por la página de retorno o un webhook anterior), **no-op**.
- **Casos que cubre** (que el polling NO cubre): usuario cierra la pestaña tras el 3DS; pagos
  OXXO/SPEI que se pagan horas/días después; aprobaciones diferidas por revisión de MP.
- Estados no-aprobados (`rejected`/`cancelled`/`expired` de un voucher) marcan la orden como
  no pagada / cancelada según corresponda.

## 6. Suscripciones y restricción de métodos

- El billing recurrente ya resuelve el proveedor desde el `provider_id` guardado en la orden
  (`resolve-payment-provider.ts`). Al crearse las órdenes MX con `pp_mercadopago_mercadopago`,
  las suscripciones MX cobran por MP automáticamente. El **default** de ese step pasa de
  `pp_openpay_openpay` a MP.
- `payment-provider-router.ts` (`getChargeClient`): se elimina el charge-client Openpay; el de
  MP usa credenciales por país (§1).
- El Brick oculta OXXO/SPEI cuando el carrito tiene suscripción (§2).

## 7. Config de región + retiro de Openpay (corte limpio)

- Script `novabackend/src/scripts/update-mx-payment-provider.ts` (calcado del de AR): región MX
  → `payment_providers: ["pp_mercadopago_mercadopago"]`.
- Se retira Openpay:
  - `medusa-config.ts`: quitar el provider Openpay de la lista.
  - Borrar `novabackend/src/modules/openpay-payment/` (módulo, cliente, migraciones, tests).
  - Quitar la rama Openpay de `complete/route.ts` y el cliente Openpay de `complete-3ds`.
  - `resolve-payment-provider.ts`: default → MP.
  - `novafrontend`: borrar `lib/openpay.ts`, imports, la rama Openpay del checkout, y los
    `<Script>`/`preconnect` de Openpay en `app/layout.tsx`.
  - `markets.ts`: MX `paymentProvider: 'mercadopago'`.
- **Env nuevas:** `MP_ACCESS_TOKEN_MX`, `NEXT_PUBLIC_MP_PUBLIC_KEY_MX`, `MP_WEBHOOK_SECRET_MX`,
  `MP_3DS_MODE_MX` (default `optional`). Se documentan en `.env.template`. Las `OPENPAY_*` se
  eliminan tras verificar el go-live.

## Manejo de errores

- Falta credencial MX → 500 con mensaje claro (`MercadoPago MX not configured`).
- Firma de webhook inválida → 401, sin procesar.
- `translateMPError` se extiende con los `status_detail` típicos de MX
  (`cc_rejected_insufficient_amount`, `cc_rejected_bad_filled_security_code`,
  `cc_rejected_bad_filled_date`, `cc_rejected_high_risk`, etc.).
- Timeout de 3DS → cubierto por el polling de carrito + webhook.
- Voucher OXXO/SPEI expirado → webhook marca la orden no pagada; el usuario puede reintentar.

## Testing

- **Sandbox MP MX:** happy path tarjeta, tarjeta rechazada, challenge 3DS OK, 3DS fallido,
  OXXO (pending → approved vía webhook simulado), SPEI (idem).
- **e2e Playwright** (`novafrontend/tests/e2e/checkout/*`): actualizar al flujo Brick; el
  helper `smoke/helpers/openpay-token.ts` → helper MP. Cubrir carrito con suscripción (métodos
  offline ocultos).
- **Unit backend:** resolver de credenciales por país; ramificación de `/complete` por tipo de
  resultado; idempotencia del webhook (doble notificación no duplica captura); verificación de
  firma; `complete-3ds` con `mp_payment_id`.

## Plan de cutover (secuencia de deploy)

1. Deploy **backend** con: código MP unificado + Brick-compatible `/complete` + webhook +
   3DS + credenciales por país. Dejar `OPENPAY_*` vivas todavía. Configurar `MP_ACCESS_TOKEN_MX`,
   `MP_WEBHOOK_SECRET_MX`, `MP_3DS_MODE_MX`, y registrar la URL del webhook en el panel MP MX.
2. Correr `update-mx-payment-provider.ts` → región MX apunta a MP.
3. Deploy **frontend** con el Brick y `NEXT_PUBLIC_MP_PUBLIC_KEY_MX`.
4. **Smoke test en producción** con un cobro real chico (tarjeta + un OXXO de prueba).
5. Verificado el go-live: borrar el código y las envs de Openpay (segundo PR de limpieza).

## Riesgos y mitigaciones

- **Credencial equivocada de país** → cobros fallan. Mitiga: resolver por moneda + validación
  temprana + smoke test.
- **Orden offline nunca confirmada** (webhook no llega) → mitiga: registrar webhook en panel MP,
  verificación en sandbox, y el polling de carrito como red secundaria para el caso online.
- **Brick con `amount` desincronizado** del total real de Medusa → cobro incorrecto. Mitiga:
  montar/actualizar el Brick solo con `confirmedTotal` post-shipping.
- **Retiro de Openpay rompe algo latente** → mitiga: retiro en un **segundo PR** tras verificar
  el go-live, no en el mismo deploy.

## Fuera de alcance

- Activar BR/CL/CO (quedan config-ready).
- Suscripciones con métodos offline (imposible por diseño de MP; se restringe a tarjeta/wallet).
- Migración de suscriptores Openpay (no hay legacy relevante — corte limpio).
