# OXXO y SPEI en Checkout — Diseño

**Fecha:** 2026-04-11  
**Proyecto:** Novapatch Storefront (`apps/storefront/`)  
**Alcance:** Implementar métodos de pago OXXO y SPEI via Openpay en el flujo de checkout existente

---

## Contexto

El checkout actual solo soporta tarjeta de crédito/débito (Visa, Mastercard, Amex) via tokenización con Openpay JS SDK. OXXO y SPEI están mencionados en FAQ y Términos pero no están implementados. Este spec define cómo agregarlos.

**Restricción de suscripciones:** OXXO y SPEI solo están disponibles para compras únicas. Los ítems de suscripción requieren tarjeta.

---

## Decisiones de diseño

| Decisión | Elección | Razón |
|---|---|---|
| Arquitectura de cargos | API routes Next.js (server-side) | OXXO/SPEI requieren private key de Openpay, no se puede exponer en el browser |
| Creación de orden en Medusa | Solo tras confirmación de webhook | Pago diferido — la orden no existe hasta que el cliente paga |
| Correlación webhook → cart | `order_id: cart_id` en el cargo de Openpay | Openpay devuelve `order_id` en el webhook, sin storage extra |
| UX post-confirmación | Modal sobre el checkout | Simple, sin página extra que mantener |
| Email | HTML inline via Resend, mismo patrón que `app/api/contact/route.ts` | Consistencia con emails existentes, sin dependencias externas |

---

## Arquitectura

### Flujo completo

```
1. Cliente selecciona OXXO o SPEI en el selector de método de pago
2. Completa el formulario de contacto y dirección (igual que tarjeta)
3. Click "Confirmar pedido"
4. Frontend POST /api/openpay/oxxo (o /spei) con { cart_id, amount, customer }
5. API route llama Openpay REST API con order_id = cart_id
6. Openpay devuelve referencia (OXXO) o CLABE + banco (SPEI)
7. API route envía email via Resend con la referencia/CLABE
8. Frontend muestra modal con la referencia/CLABE
9. [Horas/días después] Cliente paga
10. Openpay POST /api/openpay/webhook con { order_id: cart_id, status: "completed" }
11. Webhook handler llama medusa.checkout.completeCart(cart_id)
12. Medusa crea la orden → cliente recibe email de confirmación de pedido
```

### Componentes nuevos

| Archivo | Tipo | Responsabilidad |
|---|---|---|
| `lib/openpay-server.ts` | Server lib | Crea cargos OXXO/SPEI via Openpay REST API con private key |
| `app/api/openpay/oxxo/route.ts` | API route (POST) | Recibe cart_id + customer → crea cargo OXXO → envía email → devuelve referencia |
| `app/api/openpay/spei/route.ts` | API route (POST) | Recibe cart_id + customer → crea cargo SPEI → envía email → devuelve CLABE |
| `app/api/openpay/webhook/route.ts` | API route (POST) | Verifica cargo en Openpay → completa cart en Medusa |
| `components/PaymentMethodSelector.tsx` | Componente UI | Radio Tarjeta / OXXO / SPEI con lógica de suscripción |
| `components/PendingPaymentModal.tsx` | Componente UI | Modal con referencia OXXO o CLABE SPEI |

El email se implementa como HTML inline dentro de `app/api/openpay/oxxo/route.ts` y `app/api/openpay/spei/route.ts`, igual que el email de contacto.

---

## Variables de entorno necesarias

```bash
# Ya existe (pública)
NEXT_PUBLIC_OPENPAY_MERCHANT_ID=...
NEXT_PUBLIC_OPENPAY_PUBLIC_KEY=...
NEXT_PUBLIC_OPENPAY_SANDBOX=true

# Ya existe (privada, server-side)
OPENPAY_PRIVATE_KEY=...

# Ya existe
RESEND_SECRET_KEY=...
```

---

## Componente: PaymentMethodSelector

`components/PaymentMethodSelector.tsx` — client component.

**Props:**
```ts
interface PaymentMethodSelectorProps {
  value: "card" | "oxxo" | "spei"
  onChange: (method: "card" | "oxxo" | "spei") => void
  hasSubscriptionItems: boolean
}
```

**Comportamiento:**
- Muestra tres opciones: Tarjeta (con badges Visa/MC/Amex), OXXO ("Solo compras únicas"), SPEI ("Solo compras únicas")
- Si `hasSubscriptionItems === true`: OXXO y SPEI se muestran deshabilitados con aviso: _"Tu pedido incluye una suscripción. OXXO y SPEI solo están disponibles para compras únicas."_
- Cuando se selecciona OXXO o SPEI: los campos de tarjeta (número, nombre, fecha, CVV) se ocultan
- Integración en `checkout/page.tsx`: reemplaza el bloque de campos de tarjeta por `<PaymentMethodSelector>` + campos de tarjeta condicionales

---

## Componente: PendingPaymentModal

`components/PendingPaymentModal.tsx` — client component.

**Props:**
```ts
interface PendingPaymentModalProps {
  open: boolean
  method: "oxxo" | "spei"
  // OXXO
  reference?: string
  // SPEI
  clabe?: string
  bank?: string
  beneficiary?: string
  // Común
  amount: number
  onClose: () => void
}
```

**Comportamiento:**
- Modal full-screen overlay sobre el checkout
- OXXO: muestra referencia en formato `XXXX XXXX XXXX XXXX`, monto, instrucciones de 3 pasos, aviso de 72 horas
- SPEI: muestra CLABE en formato `XXXX XXXX XXXX XXXX XX`, banco, beneficiario (todos del response de Openpay), monto exacto con advertencia
- Ambos: aviso "📧 También enviamos esta información a tu correo"
- Al cerrar: vaciar carrito, mostrar mensaje "Tu pedido está pendiente de pago"

---

## lib/openpay-server.ts

Wrapper server-side para la API REST de Openpay. Usa `OPENPAY_PRIVATE_KEY` y `NEXT_PUBLIC_OPENPAY_MERCHANT_ID`.

**Base URL:**
- Sandbox: `https://sandbox-api.openpay.mx/v1/{merchant_id}`
- Producción: `https://api.openpay.mx/v1/{merchant_id}`

**Autenticación:** HTTP Basic Auth — `Authorization: Basic base64(private_key:)`

**Funciones exportadas:**

```ts
// Crea cargo OXXO — devuelve referencia
export async function createOxxoCharge(params: {
  amount: number
  order_id: string    // cart_id de Medusa
  customer: { name: string; email: string }
  description: string
}): Promise<{ id: string; reference: string; due_date: string }>

// Crea cargo SPEI — devuelve CLABE
export async function createSpeiCharge(params: {
  amount: number
  order_id: string    // cart_id de Medusa
  customer: { name: string; email: string }
  description: string
}): Promise<{ id: string; clabe: string; bank: string; beneficiary: string }>

// Verifica que un cargo existe y está en el estado esperado (para webhook)
export async function getCharge(charge_id: string): Promise<OpenpayCharge>
```

**Body para OXXO:**
```json
{
  "method": "store",
  "amount": 1249.00,
  "currency": "MXN",
  "description": "Pedido Novapatch",
  "order_id": "cart_01JR...",
  "customer": {
    "name": "María García",
    "email": "maria@example.com"
  }
}
```

**Body para SPEI:**
```json
{
  "method": "bank_account",
  "amount": 1249.00,
  "currency": "MXN",
  "description": "Pedido Novapatch",
  "order_id": "cart_01JR...",
  "customer": {
    "name": "María García",
    "email": "maria@example.com"
  }
}
```

---

## API Route: POST /api/openpay/oxxo

**Input:**
```ts
{
  cart_id: string
  amount: number
  customer: { name: string; email: string }
}
```

**Output (200):**
```ts
{
  reference: string
  due_date: string
  charge_id: string
}
```

**Flujo:**
1. Validar campos requeridos
2. `createOxxoCharge({ amount, order_id: cart_id, customer, description: "Pedido Novapatch" })`
3. Enviar email via Resend (`from: "Novapatch <hola@novapatch.care>"`, `to: customer.email`)
4. Devolver `{ reference, due_date, charge_id }`

**Errores:** Cualquier error de Openpay devuelve `{ error: string }` con status 400/500.

---

## API Route: POST /api/openpay/spei

Idéntico a `/oxxo` pero con `createSpeiCharge`.

**Output (200):**
```ts
{
  clabe: string
  bank: string
  beneficiary: string
  charge_id: string
}
```

---

## API Route: POST /api/openpay/webhook

Openpay enviará un POST cuando el cargo esté completado.

**Verificación de autenticidad:** Openpay no firma webhooks con HMAC. El handler verifica la transacción consultando `GET /v1/{merchant}/charges/{charge_id}` en la API de Openpay antes de procesar. Si el cargo existe y está en estado `completed`, procede.

**Payload que llega:**
```json
{
  "type": "charge.succeeded",
  "transaction": {
    "id": "trq7axoite7vq8skkiex",
    "order_id": "cart_01JR...",
    "status": "completed",
    "amount": 1249.00,
    "method": "store"
  }
}
```

**Flujo:**
1. Parsear payload, ignorar eventos que no sean `charge.succeeded` (responder `200 OK`)
2. Extraer `transaction.id` y `transaction.order_id` (= cart_id)
3. Verificar cargo: `getCharge(transaction.id)` → confirmar `status === "completed"`
4. Llamar Medusa directamente via `fetch` server-side (el webhook es un API route — no puede usar `lib/medusa.ts` porque éste referencia `localStorage`). El call es:
   ```ts
   fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart_id}/complete`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
     },
     body: JSON.stringify({}),  // sin openpay_token_id — Openpay ya confirmó el pago
   })
   ```
5. Responder `200 OK`

**Nota:** `completeCart` en Medusa sin plugin de Openpay puede requerir que la sesión de pago ya esté en estado correcto. Este es un punto de integración a validar con el backend. Si `completeCart` falla por la sesión, la alternativa es crear la orden via `POST /store/orders` directamente.

**Idempotencia:** Si el webhook llega dos veces, `completeCart` fallará en el segundo intento (el cart ya no existe). El handler debe capturar ese error y responder `200 OK` de todas formas para que Openpay no reintente.

---

## Email de pago pendiente

HTML inline, mismo patrón que `app/api/contact/route.ts`:
- `from: "Novapatch <hola@novapatch.care>"`
- `to: customer.email`
- Header navy `#0D1B35` con logo `https://novapatch.care/logos/logowht.webp`
- Body cream `#FAF7F2`, acentos coral `#E8503A`

**OXXO subject:** `Tu referencia OXXO — Novapatch`  
**SPEI subject:** `Datos para tu transferencia SPEI — Novapatch`

**OXXO:** referencia grande + monto + instrucciones 3 pasos + resumen del pedido  
**SPEI:** CLABE + banco + beneficiario + monto exacto (con advertencia) + resumen del pedido

---

## Modificaciones al checkout existente

**`app/[locale]/checkout/page.tsx`:**

1. Agregar estado `paymentMethod: "card" | "oxxo" | "spei"` (default `"card"`)
2. Agregar estado `pendingPayment: OxxoResult | SpeiResult | null`
3. Detectar si el carrito tiene ítems de suscripción: `hasSubscriptionItems = items.some(i => i.metadata?.is_subscription === true)` — la clave `is_subscription` está confirmada en `lib/medusa.ts:241`
4. Reemplazar bloque de campos de tarjeta por:
   - `<PaymentMethodSelector>` siempre visible
   - Campos de tarjeta solo cuando `paymentMethod === "card"`
5. En el handler de submit:
   - Si `paymentMethod === "card"`: flujo existente (sin cambios)
   - Si `paymentMethod === "oxxo"`: `POST /api/openpay/oxxo` → set `pendingPayment` → mostrar modal
   - Si `paymentMethod === "spei"`: `POST /api/openpay/spei` → set `pendingPayment` → mostrar modal
6. Renderizar `<PendingPaymentModal>` cuando `pendingPayment !== null`

---

## Fuera del alcance de este spec

- Barcode/QR visual para OXXO (la referencia numérica es suficiente para el cajero)
- Página de estado de pedido pendiente en `/cuenta/pedidos` (fase posterior)
- Expiración y reintento de referencias vencidas
- MercadoPago para Brasil (spec separado)
- 3D Secure para tarjetas (spec separado)
