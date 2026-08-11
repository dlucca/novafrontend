# MercadoPago Backend Core (México con tarjeta) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que la tienda de México cobre con tarjeta a través de MercadoPago (con 3DS) en lugar de Openpay, usando credenciales por país, sin tocar todavía el Payment Brick ni los métodos offline.

**Architecture:** Se colapsa la selección de proveedor de "por moneda `ars`" a "siempre MercadoPago con credenciales por país". Se centraliza la lógica pura (moneda→país, credenciales, modo 3DS, selección de provider, interpretación del pago) en un módulo testeable `src/lib/mp-payment.ts`. Los routes `/complete` y `/complete-3ds` se generalizan a MP; el `payment-provider-router` de suscripciones resuelve credenciales por país. Openpay **no se elimina en este plan** (se retira en el Plan 4, post go-live).

**Tech Stack:** Medusa v2 (framework/http, core-flows), TypeScript, Jest + `@swc/jest`, `fetch` nativo. Este plan vive en el repo `novabackend` salvo la Tarea 8 (frontend `novafrontend`).

## Global Constraints

- Repo backend: `/Users/dlucca/Projects/novapatch/novabackend`. Repo frontend: `/Users/dlucca/Projects/novapatch/novafrontend`.
- Tests unitarios: `TEST_TYPE=unit npx jest <path>` (ver `jest.config.js`). Los specs unitarios se nombran `*.unit.spec.ts` bajo `src/**/__tests__/`.
- Provider id de MP en DB: `pp_mercadopago_mercadopago`.
- Cada cuenta MP es **nacional**; el `charge()` NO envía `currency_id` (MP lo infiere del token de la cuenta).
- Env nuevas: `MP_ACCESS_TOKEN_MX`, `MP_3DS_MODE_MX` (default `optional`). Fallback legacy: `MP_ACCESS_TOKEN` (cuenta AR actual).
- No romper Argentina: el fallback a `MP_ACCESS_TOKEN` mantiene AR funcionando mientras no exista `MP_ACCESS_TOKEN_AR`.
- Openpay se conserva funcional en este plan; su retiro es el Plan 4.

---

### Task 1: Módulo de lógica pura de pago MP (`mp-payment.ts`)

**Files:**
- Create: `src/lib/mp-payment.ts`
- Test: `src/__tests__/lib/mp-payment.unit.spec.ts`

**Interfaces:**
- Produces:
  - `countryFromCurrency(currency: string): string` — `"mxn"→"mx"`, `"ars"→"ar"`, `"brl"→"br"`, `"clp"→"cl"`, `"cop"→"co"`; default `"mx"`.
  - `mpCredentialsFor(country: string): { accessToken: string; sandbox: boolean }` — lee `MP_ACCESS_TOKEN_<CC>` (uppercase) con fallback a `MP_ACCESS_TOKEN`; `sandbox = process.env.NODE_ENV !== "production"`. Lanza `Error("MercadoPago not configured for <country>")` si no hay token.
  - `mp3dsMode(country: string): "optional" | "mandatory" | "not_specified"` — lee `MP_3DS_MODE_<CC>`, default `"optional"`.
  - `selectPaymentProviderId(_currency: string): string` — devuelve siempre `"pp_mercadopago_mercadopago"`.

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/lib/mp-payment.unit.spec.ts
import {
  countryFromCurrency,
  mpCredentialsFor,
  mp3dsMode,
  selectPaymentProviderId,
} from "../../lib/mp-payment"

describe("mp-payment pure helpers", () => {
  afterEach(() => {
    delete process.env.MP_ACCESS_TOKEN
    delete process.env.MP_ACCESS_TOKEN_MX
    delete process.env.MP_ACCESS_TOKEN_AR
    delete process.env.MP_3DS_MODE_MX
    delete process.env.NODE_ENV
  })

  describe("countryFromCurrency", () => {
    it("maps known currencies to country codes", () => {
      expect(countryFromCurrency("mxn")).toBe("mx")
      expect(countryFromCurrency("ARS")).toBe("ar")
      expect(countryFromCurrency("brl")).toBe("br")
    })
    it("defaults unknown currency to mx", () => {
      expect(countryFromCurrency("usd")).toBe("mx")
    })
  })

  describe("mpCredentialsFor", () => {
    it("prefers the country-specific token", () => {
      process.env.MP_ACCESS_TOKEN_MX = "MX-token"
      process.env.MP_ACCESS_TOKEN = "legacy-token"
      expect(mpCredentialsFor("mx").accessToken).toBe("MX-token")
    })
    it("falls back to the legacy MP_ACCESS_TOKEN", () => {
      process.env.MP_ACCESS_TOKEN = "legacy-token"
      expect(mpCredentialsFor("ar").accessToken).toBe("legacy-token")
    })
    it("throws when no token is configured", () => {
      expect(() => mpCredentialsFor("mx")).toThrow(/not configured for mx/)
    })
    it("sandbox is false in production", () => {
      process.env.MP_ACCESS_TOKEN_MX = "MX-token"
      process.env.NODE_ENV = "production"
      expect(mpCredentialsFor("mx").sandbox).toBe(false)
    })
  })

  describe("mp3dsMode", () => {
    it("defaults to optional", () => {
      expect(mp3dsMode("mx")).toBe("optional")
    })
    it("reads the country-specific override", () => {
      process.env.MP_3DS_MODE_MX = "mandatory"
      expect(mp3dsMode("mx")).toBe("mandatory")
    })
  })

  describe("selectPaymentProviderId", () => {
    it("always returns the MercadoPago provider id", () => {
      expect(selectPaymentProviderId("mxn")).toBe("pp_mercadopago_mercadopago")
      expect(selectPaymentProviderId("ars")).toBe("pp_mercadopago_mercadopago")
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-payment.unit.spec.ts`
Expected: FAIL — `Cannot find module '../../lib/mp-payment'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/mp-payment.ts
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  mxn: "mx",
  ars: "ar",
  brl: "br",
  clp: "cl",
  cop: "co",
}

export function countryFromCurrency(currency: string): string {
  return CURRENCY_TO_COUNTRY[(currency ?? "").toLowerCase()] ?? "mx"
}

export function mpCredentialsFor(country: string): { accessToken: string; sandbox: boolean } {
  const cc = country.toUpperCase()
  const accessToken = process.env[`MP_ACCESS_TOKEN_${cc}`] ?? process.env.MP_ACCESS_TOKEN ?? ""
  if (!accessToken) {
    throw new Error(`MercadoPago not configured for ${country} (set MP_ACCESS_TOKEN_${cc})`)
  }
  return { accessToken, sandbox: process.env.NODE_ENV !== "production" }
}

export function mp3dsMode(country: string): "optional" | "mandatory" | "not_specified" {
  const raw = process.env[`MP_3DS_MODE_${country.toUpperCase()}`]
  if (raw === "mandatory" || raw === "not_specified") return raw
  return "optional"
}

export function selectPaymentProviderId(_currency: string): string {
  return "pp_mercadopago_mercadopago"
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-payment.unit.spec.ts`
Expected: PASS (todos los casos verdes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/mp-payment.ts src/__tests__/lib/mp-payment.unit.spec.ts
git commit -m "feat(payments): per-country MP credentials and 3DS-mode helpers"
```

---

### Task 2: `MercadoPagoClient` — soporte 3DS y `getPayment`

**Files:**
- Modify: `src/modules/mercadopago-payment/mercadopago-client.ts`
- Test: `src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts`

**Interfaces:**
- Consumes: nada nuevo.
- Produces:
  - `MPPayment` extendido con `status_detail: string` y `three_ds_info?: { external_resource_url?: string; creq?: string }`.
  - `charge(params)` acepta `threeDSMode?: "optional" | "mandatory" | "not_specified"`; incluye `three_d_secure_mode` en el body cuando no es `not_specified`. **Ya no lanza** en `status === "pending"` (solo lanza en `rejected`).
  - `getPayment(id: string | number): Promise<MPPayment>` — `GET /v1/payments/{id}`.

- [ ] **Step 1: Write the failing test** (agregar al describe existente)

```ts
  describe("charge with 3DS", () => {
    it("includes three_d_secure_mode when provided", async () => {
      mockFetch.mockReturnValue(ok({ id: 1, status: "approved", status_detail: "accredited" }))
      await client.charge({
        token: "tok_1", amount: 500, currencyCode: "MXN",
        description: "order", mpCustomerId: "cust_1", threeDSMode: "optional",
      })
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.three_d_secure_mode).toBe("optional")
    })

    it("omits three_d_secure_mode when not_specified", async () => {
      mockFetch.mockReturnValue(ok({ id: 1, status: "approved", status_detail: "accredited" }))
      await client.charge({
        token: "tok_1", amount: 500, currencyCode: "MXN",
        description: "order", mpCustomerId: "cust_1", threeDSMode: "not_specified",
      })
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.three_d_secure_mode).toBeUndefined()
    })

    it("returns a pending payment without throwing (3DS challenge)", async () => {
      mockFetch.mockReturnValue(ok({
        id: 2, status: "pending", status_detail: "pending_challenge",
        three_ds_info: { external_resource_url: "https://mp/3ds" },
      }))
      const payment = await client.charge({
        token: "tok_2", amount: 500, currencyCode: "MXN",
        description: "order", mpCustomerId: "cust_1", threeDSMode: "optional",
      })
      expect(payment.status).toBe("pending")
      expect(payment.three_ds_info?.external_resource_url).toBe("https://mp/3ds")
    })

    it("still throws on rejected", async () => {
      mockFetch.mockReturnValue(ok({ id: 3, status: "rejected", status_detail: "cc_rejected_other_reason" }))
      await expect(client.charge({
        token: "tok_3", amount: 500, currencyCode: "MXN",
        description: "order", mpCustomerId: "cust_1",
      })).rejects.toThrow("cc_rejected_other_reason")
    })
  })

  describe("getPayment", () => {
    it("GETs /v1/payments/:id", async () => {
      mockFetch.mockReturnValue(ok({ id: 9, status: "approved", status_detail: "accredited" }))
      const p = await client.getPayment(9)
      expect(mockFetch.mock.calls[0][0]).toBe("https://api.mercadopago.com/v1/payments/9")
      expect(p.status).toBe("approved")
    })
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=integration:modules npx jest src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts`
Expected: FAIL — `three_d_secure_mode` undefined / `getPayment` no existe.

- [ ] **Step 3: Write minimal implementation**

En `src/modules/mercadopago-payment/mercadopago-client.ts`:

1. Extender el tipo `MPPayment`:

```ts
export type MPPayment = {
  id: number
  status: "approved" | "pending" | "rejected" | "cancelled" | "refunded" | "charged_back" | "in_process" | "authorized"
  status_detail: string
  transaction_amount: number
  currency_id: string
  three_ds_info?: { external_resource_url?: string; creq?: string }
}
```

2. Reemplazar la firma y el cuerpo de `charge()`:

```ts
  async charge(params: {
    token: string
    amount: number
    currencyCode: string
    description: string
    mpCustomerId: string
    externalReference?: string
    threeDSMode?: "optional" | "mandatory" | "not_specified"
  }): Promise<MPPayment> {
    const idempotencyKey = params.externalReference
      ? `${params.externalReference}-${Date.now()}`
      : `charge-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    const payment = await this.request<MPPayment>(
      "POST",
      "/v1/payments",
      {
        token: params.token,
        transaction_amount: params.amount,
        description: params.description,
        installments: 1,
        payer: { type: "customer", id: params.mpCustomerId },
        ...(params.externalReference ? { external_reference: params.externalReference } : {}),
        ...(params.threeDSMode && params.threeDSMode !== "not_specified"
          ? { three_d_secure_mode: params.threeDSMode }
          : {}),
      },
      { "X-Idempotency-Key": idempotencyKey }
    )

    if (payment.status === "rejected") {
      throw new Error(payment.status_detail)
    }

    return payment
  }

  async getPayment(id: string | number): Promise<MPPayment> {
    return this.request<MPPayment>("GET", `/v1/payments/${id}`)
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=integration:modules npx jest src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/modules/mercadopago-payment/mercadopago-client.ts src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts
git commit -m "feat(mp): add 3DS mode to charge and getPayment lookup"
```

---

### Task 3: Interpretación del resultado de pago (`interpretMpPayment`)

**Files:**
- Modify: `src/lib/mp-payment.ts`
- Test: `src/__tests__/lib/mp-payment.unit.spec.ts`

**Interfaces:**
- Consumes: `MPPayment` (import type desde el cliente).
- Produces: `interpretMpPayment(payment): { kind: "approved" | "challenge" | "rejected"; redirectUrl?: string }`.
  - `approved`/`authorized` → `{ kind: "approved" }`
  - `pending`/`in_process` con `three_ds_info.external_resource_url` → `{ kind: "challenge", redirectUrl }`
  - resto → `{ kind: "rejected" }`

- [ ] **Step 1: Write the failing test** (agregar al spec de Task 1)

```ts
import { interpretMpPayment } from "../../lib/mp-payment"

describe("interpretMpPayment", () => {
  it("approved payment → approved", () => {
    expect(interpretMpPayment({ status: "approved" } as any)).toEqual({ kind: "approved" })
  })
  it("pending with 3DS url → challenge", () => {
    const r = interpretMpPayment({
      status: "pending", status_detail: "pending_challenge",
      three_ds_info: { external_resource_url: "https://mp/3ds" },
    } as any)
    expect(r).toEqual({ kind: "challenge", redirectUrl: "https://mp/3ds" })
  })
  it("pending without 3DS url → rejected", () => {
    expect(interpretMpPayment({ status: "pending", status_detail: "pending_review_manual" } as any))
      .toEqual({ kind: "rejected" })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-payment.unit.spec.ts`
Expected: FAIL — `interpretMpPayment` no existe.

- [ ] **Step 3: Write minimal implementation** (append a `src/lib/mp-payment.ts`)

```ts
import type { MPPayment } from "../modules/mercadopago-payment/mercadopago-client"

export function interpretMpPayment(
  payment: MPPayment
): { kind: "approved" | "challenge" | "rejected"; redirectUrl?: string } {
  if (payment.status === "approved" || payment.status === "authorized") {
    return { kind: "approved" }
  }
  const url = payment.three_ds_info?.external_resource_url
  if ((payment.status === "pending" || payment.status === "in_process") && url) {
    return { kind: "challenge", redirectUrl: url }
  }
  return { kind: "rejected" }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-payment.unit.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mp-payment.ts src/__tests__/lib/mp-payment.unit.spec.ts
git commit -m "feat(payments): interpret MP payment result into next-step kind"
```

---

### Task 4: `payment-sessions` route — provider siempre MP

**Files:**
- Modify: `src/api/store/carts/[id]/payment-sessions/route.ts` (~L117-122)

**Interfaces:**
- Consumes: `selectPaymentProviderId` (Task 1).

- [ ] **Step 1: Reemplazar la selección de provider por moneda**

Cambiar el bloque:

```ts
  // ── Pick provider based on cart currency ──────────────────────────────────
  // MP for ARS (Argentina), Openpay for everything else (Mexico today)
  const providerId =
    collectionCurrency.toLowerCase() === "ars"
      ? "pp_mercadopago_mercadopago"
      : "pp_openpay_openpay"
```

por:

```ts
  // ── Provider: MercadoPago unified across LATAM ────────────────────────────
  const { selectPaymentProviderId } = await import("../../../../../lib/mp-payment")
  const providerId = selectPaymentProviderId(collectionCurrency)
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: sin errores nuevos en `payment-sessions/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/api/store/carts/[id]/payment-sessions/route.ts
git commit -m "feat(checkout): register MercadoPago payment session for all regions"
```

---

### Task 5: `complete` route — siempre MP, 3DS-aware, credenciales por país

**Files:**
- Modify: `src/api/store/carts/[id]/complete/route.ts`

**Interfaces:**
- Consumes: `countryFromCurrency`, `mpCredentialsFor`, `mp3dsMode`, `interpretMpPayment` (Tasks 1, 3); `MercadoPagoClient.charge` con `threeDSMode`, `getPayment` (Task 2).
- Produces: respuesta `{ type: "redirect", redirect_url }` en challenge; `res.json(result)` (order) en aprobado.

- [ ] **Step 1: Colapsar el ruteo a MP**

En el `POST`, reemplazar el bloque `isArgentina`:

```ts
  const isArgentina = currencyCode === "ars"

  try {
    if (isArgentina) {
      await completeMercadoPago({ req, res, cart, session, paymentAmount, cartId, body, logger })
    } else {
      await completeOpenpay({ req, res, cart, session, paymentAmount, cartId, body, logger })
    }
  } catch (err: unknown) {
```

por:

```ts
  try {
    await completeMercadoPago({ req, res, cart, session, paymentAmount, cartId, body, logger, currencyCode })
  } catch (err: unknown) {
```

(La función `completeOpenpay` queda en el archivo sin usar; se elimina en el Plan 4.)

- [ ] **Step 2: Actualizar `completeMercadoPago` para credenciales por país + 3DS**

Reemplazar el inicio de `completeMercadoPago` (la construcción del cliente y el `charge`) para usar los helpers. La firma pasa a recibir `currencyCode`:

```ts
async function completeMercadoPago({
  req, res, cart, session, paymentAmount, cartId, body, logger, currencyCode,
}: any) {
  const mpCardToken = body.mp_card_token as string | undefined
  const customerEmail = body.email as string | undefined

  if (!mpCardToken) {
    res.status(400).json({ message: "mp_card_token is required" })
    return
  }

  const { countryFromCurrency, mpCredentialsFor, mp3dsMode, interpretMpPayment } =
    await import("../../../../../lib/mp-payment")
  const country = countryFromCurrency(currencyCode)
  const { accessToken, sandbox } = mpCredentialsFor(country)
  const mp = new MercadoPagoClient({ accessToken, sandbox })
```

Dejar intactos los pasos de get-or-create customer (código existente). Reemplazar la llamada a `mp.charge(...)` para pasar el modo 3DS:

```ts
  const payment = await mp.charge({
    token: mpCardToken,
    amount: paymentAmount,
    currencyCode: (session.currency_code ?? cart.payment_collection?.currency_code ?? "MXN").toUpperCase(),
    description: `Novapatch order - ${cartId}`,
    mpCustomerId,
    externalReference: cartId,
    threeDSMode: mp3dsMode(country),
  })
  logger.info(`[CompleteCart/MP] payment_id=${payment.id} status=${payment.status} detail=${payment.status_detail}`)
```

- [ ] **Step 3: Ramificar por resultado (aprobado / challenge / rechazado)**

Inmediatamente después del `charge`, antes de listar tarjetas, insertar:

```ts
  const outcome = interpretMpPayment(payment)

  // Persistir el payment_id en la session para el retorno 3DS y el webhook (Plan 2)
  const paymentModulePre = req.scope.resolve(Modules.PAYMENT)
  await (paymentModulePre as any).updatePaymentSession({
    id: session.id,
    amount: paymentAmount,
    currency_code: session.currency_code ?? cart.payment_collection?.currency_code ?? "mxn",
    data: { ...(session.data ?? {}), mp_payment_id: String(payment.id), mp_customer_id: mpCustomerId },
  })

  if (outcome.kind === "challenge") {
    logger.info(`[CompleteCart/MP] 3DS challenge — awaiting return for cart=${cartId} payment=${payment.id}`)
    res.json({ type: "redirect", redirect_url: outcome.redirectUrl })
    return
  }

  if (outcome.kind === "rejected") {
    res.status(422).json({ message: payment.status_detail || "Payment rejected" })
    return
  }
  // outcome.kind === "approved" → continúa con el flujo existente (listCards, metadata, complete)
```

- [ ] **Step 4: Verify build compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: sin errores nuevos en `complete/route.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/api/store/carts/[id]/complete/route.ts
git commit -m "feat(checkout): route all completions through MercadoPago with 3DS"
```

---

### Task 6: `complete-3ds` route — reescrito para MercadoPago

**Files:**
- Modify: `src/api/store/carts/[id]/complete-3ds/route.ts`

**Interfaces:**
- Consumes: `countryFromCurrency`, `mpCredentialsFor` (Task 1); `MercadoPagoClient.getPayment` (Task 2); `completeCartWorkflow`.
- Produces: acepta `mp_payment_id` (body o query `?payment_id`/`?id`); completa la orden si el pago está `approved`.

- [ ] **Step 1: Reescribir el route para MP**

Reemplazar el contenido completo del archivo por:

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MercadoPagoClient } from "../../../../../modules/mercadopago-payment/mercadopago-client"
import { countryFromCurrency, mpCredentialsFor } from "../../../../../lib/mp-payment"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartId = req.params.id
  const logger = req.scope.resolve("logger")
  const body = req.body as Record<string, unknown>

  const mpPaymentId =
    (body.mp_payment_id as string | undefined) ??
    (req.query?.payment_id as string | undefined) ??
    (req.query?.id as string | undefined)

  if (!mpPaymentId) {
    res.status(400).json({ message: "mp_payment_id is required" })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  let cart: any = null
  try {
    const { data: carts } = await query.graph({
      entity: "cart",
      filters: { id: cartId },
      fields: [
        "id",
        "currency_code",
        "payment_collection.currency_code",
        "payment_collection.payment_sessions.id",
        "payment_collection.payment_sessions.data",
        "payment_collection.payment_sessions.amount",
        "payment_collection.payment_sessions.currency_code",
      ],
    })
    cart = carts?.[0] ?? null
  } catch { cart = null }

  if (!cart) {
    res.status(404).json({ message: "Cart not found" })
    return
  }
  const session = cart.payment_collection?.payment_sessions?.[0]
  if (!session?.id) {
    res.status(422).json({ message: "Cart has no payment session" })
    return
  }

  const currencyCode = cart.currency_code ?? cart.payment_collection?.currency_code ?? "mxn"
  const country = countryFromCurrency(currencyCode)

  try {
    const { accessToken, sandbox } = mpCredentialsFor(country)
    const mp = new MercadoPagoClient({ accessToken, sandbox })
    const payment = await mp.getPayment(mpPaymentId)
    logger.info(`[Complete3DS/MP] payment_id=${payment.id} status=${payment.status}`)

    if (payment.status !== "approved" && payment.status !== "authorized") {
      res.status(422).json({ message: "Payment not confirmed by MercadoPago" })
      return
    }

    const paymentModuleService = req.scope.resolve(Modules.PAYMENT)
    await (paymentModuleService as any).updatePaymentSession({
      id: session.id,
      amount: session.amount,
      currency_code: session.currency_code ?? currencyCode,
      data: { ...(session.data ?? {}), mp_payment_id: String(payment.id) },
    })

    const { result } = await completeCartWorkflow(req.scope).run({ input: { id: cartId } })

    const orderId = (result as any)?.order?.id ?? (result as any)?.id
    if (orderId) {
      try {
        const eventBus = req.scope.resolve(Modules.EVENT_BUS)
        await eventBus.emit([{ name: "order.payment_captured", data: { id: orderId } }])
      } catch (emitErr) {
        logger.error(`Failed to emit order.payment_captured for order ${orderId}: ${emitErr instanceof Error ? emitErr.message : String(emitErr)}`)
      }
    }
    res.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Cart completion failed"
    logger.error(`[Complete3DS/MP] Error for cart ${cartId}: ${err instanceof Error ? err.stack ?? err.message : JSON.stringify(err)}`)
    res.status(422).json({ message })
  }
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: sin errores nuevos en `complete-3ds/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/api/store/carts/[id]/complete-3ds/route.ts
git commit -m "feat(checkout): verify 3DS return against MercadoPago payment"
```

---

### Task 7: `payment-provider-router` — MP con credenciales por país

**Files:**
- Modify: `src/lib/payment-provider-router.ts` (`makeMercadoPagoChargeClient`)
- Test: `src/__tests__/lib/payment-provider-router.unit.spec.ts`

**Interfaces:**
- Consumes: `countryFromCurrency`, `mpCredentialsFor` (Task 1).
- El `chargeSubscription({ currency })` deriva el país de la moneda y arma el cliente MP con la credencial correcta.

- [ ] **Step 1: Write the failing test** (agregar al describe existente)

```ts
  it("MercadoPago client uses the country-specific token from currency", async () => {
    process.env.MP_ACCESS_TOKEN_MX = "MX-token"
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true, json: () => Promise.resolve({ id: "chg_1", status: "approved", status_detail: "accredited" }),
    })
    // @ts-expect-error test shim
    global.fetch = fetchMock
    const client = getChargeClient("pp_mercadopago_mercadopago", mockContainer as any)
    await client.chargeSubscription({
      customerId: "cust_1", cardId: "card_1", amount: 100, currency: "mxn", description: "sub",
    })
    const authHeader = fetchMock.mock.calls.at(-1)[1].headers.Authorization
    expect(authHeader).toBe("Bearer MX-token")
  })
```

Añadir en el `afterEach`: `delete process.env.MP_ACCESS_TOKEN_MX`.

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/payment-provider-router.unit.spec.ts`
Expected: FAIL — hoy usa `MP_ACCESS_TOKEN` global, no `MP_ACCESS_TOKEN_MX`.

- [ ] **Step 3: Reescribir `makeMercadoPagoChargeClient`**

```ts
function makeMercadoPagoChargeClient(_container: MedusaContainer): ChargeClient {
  return {
    async chargeSubscription({ customerId, cardId, amount, currency, description, externalReference }) {
      const { countryFromCurrency, mpCredentialsFor } = await import("./mp-payment")
      const { accessToken, sandbox } = mpCredentialsFor(countryFromCurrency(currency))
      const client = new MercadoPagoClient({ accessToken, sandbox })
      const chargeToken = await client.getCardToken(customerId, cardId)
      const payment = await client.charge({
        token: chargeToken,
        amount,
        currencyCode: currency,
        description,
        mpCustomerId: customerId,
        externalReference,
      })
      return { chargeId: String(payment.id) }
    },
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/payment-provider-router.unit.spec.ts`
Expected: PASS (los tests de Openpay existentes siguen verdes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/payment-provider-router.ts src/__tests__/lib/payment-provider-router.unit.spec.ts
git commit -m "feat(billing): resolve MP subscription credentials per country"
```

---

### Task 8: Script de región MX + variables de entorno

**Files:**
- Create: `src/scripts/update-mx-payment-provider.ts`
- Modify: `.env.template`

**Interfaces:**
- Consumes: `updateRegionsWorkflow` (core-flows), `Modules.REGION`.

- [ ] **Step 1: Crear el script (calcado del de AR)**

```ts
// src/scripts/update-mx-payment-provider.ts
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function updateMxPaymentProvider({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionService = container.resolve(Modules.REGION)

  logger.info("[update-mx-payment-provider] Looking for Mexico region...")
  const regions = await regionService.listRegions({ name: "Mexico" })
  if (!regions.length) {
    logger.error("[update-mx-payment-provider] Mexico region not found.")
    return
  }
  const mxRegion = regions[0]
  logger.info(`[update-mx-payment-provider] Found region: ${mxRegion.id}`)

  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: mxRegion.id },
      update: { payment_providers: ["pp_mercadopago_mercadopago"] },
    },
  })
  logger.info("[update-mx-payment-provider] Done. Mexico region now uses pp_mercadopago.")
}
```

- [ ] **Step 2: Documentar las envs nuevas en `.env.template`**

Agregar:

```
# ── MercadoPago (per-country) ──────────────────────────────
MP_ACCESS_TOKEN_MX=
MP_3DS_MODE_MX=optional
# MP_ACCESS_TOKEN (legacy, cuenta AR) — usar hasta migrar a MP_ACCESS_TOKEN_AR
```

- [ ] **Step 3: Verify build compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/update-mx-payment-provider.ts .env.template
git commit -m "chore(payments): add MX->MercadoPago region script and env template"
```

---

### Task 9: Frontend — enrutar México por MP y firma de `complete3DS`

**Files (repo `novafrontend/apps/storefront`):**
- Modify: `lib/markets.ts` (MX `paymentProvider`)
- Modify: `lib/mercadopago.ts` (`loadMercadoPago(country)`)
- Modify: `app/[locale]/checkout/page.tsx` (selección de proveedor)
- Modify: `lib/medusa.ts` (`complete3DS` firma + `CompleteCartPayload`)
- Modify: `app/[locale]/checkout/3ds-return/page.tsx` (leer `payment_id` de MP)

**Interfaces:**
- Consumes: backend Tasks 5-6 (contrato `{ type: "redirect" }` y `complete-3ds` con `mp_payment_id`).

- [ ] **Step 1: `markets.ts` — MX usa MercadoPago**

Cambiar en el objeto `mx`:

```ts
    paymentProvider: 'mercadopago' as const,
```

- [ ] **Step 2: `mercadopago.ts` — public key y locale por país**

Reemplazar `loadMercadoPago` para aceptar país:

```ts
export async function loadMercadoPago(country = "mx"): Promise<MPInstance> {
  if (mpInstance) return mpInstance
  await loadScript()

  const cc = country.toUpperCase()
  const publicKey =
    process.env[`NEXT_PUBLIC_MP_PUBLIC_KEY_${cc}`] ?? process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
  if (!publicKey) {
    throw new Error(`[MercadoPago] Falta NEXT_PUBLIC_MP_PUBLIC_KEY_${cc} en .env.local`)
  }
  if (!window.MercadoPago) {
    throw new Error("[MercadoPago] window.MercadoPago no disponible tras cargar el script")
  }
  const locale = country === "ar" ? "es-AR" : "es-MX"
  mpInstance = new window.MercadoPago(publicKey, { locale })
  return mpInstance
}
```

Y en `tokenizeCardMP`, propagar el país:

```ts
export async function tokenizeCardMP(cardData: MPCardData, country = "mx"): Promise<string> {
  const mp = await loadMercadoPago(country)
  try {
    const response = await mp.createCardToken(cardData)
    return response.id
  } catch (err) {
    console.error("[MercadoPago] Error tokenizando tarjeta:", err)
    throw new Error(translateMPError(err))
  }
}
```

- [ ] **Step 3: `checkout/page.tsx` — usar `market.paymentProvider`, no `cartRegion === "ars"`**

Reemplazar la condición de rama de proveedor. Cambiar:

```ts
      if (cartRegion === "ars") {
        // ── MercadoPago (AR) ──────────────────────────────────────────────
        try {
          const mp_card_token = await tokenizeCardMP(
            parseCardFormMP(card.number, card.name, card.expiry, card.cvv, card.dni)
          );
```

por:

```ts
      if (market.paymentProvider === "mercadopago") {
        // ── MercadoPago (LATAM) ───────────────────────────────────────────
        const mpCountry = cartRegion === "ars" ? "ar" : "mx";
        try {
          const mp_card_token = await tokenizeCardMP(
            parseCardFormMP(card.number, card.name, card.expiry, card.cvv, card.dni),
            mpCountry
          );
```

(El campo DNI ya está condicionado a `cartRegion === "ars"` en `validate()`, así que MX no lo exige; `parseCardFormMP` omite la identificación cuando el DNI está vacío.)

- [ ] **Step 4: `medusa.ts` — firma de `complete3DS`**

Reemplazar el método `complete3DS`:

```ts
  async complete3DS(
    cart_id: string,
    mp_payment_id: string
  ): Promise<Record<string, unknown>> {
    return medusaFetch<Record<string, unknown>>(
      `/store/carts/${cart_id}/complete-3ds`,
      { method: "POST", body: JSON.stringify({ mp_payment_id }) },
      null,
      COMPLETE_TIMEOUT_MS
    )
  },
```

- [ ] **Step 5: `3ds-return/page.tsx` — leer el `payment_id` de MP**

Cambiar la extracción del id (MP vuelve con `?payment_id=`), manteniendo compatibilidad:

```ts
    // MP redirige con ?payment_id=<id> (algunos flujos usan ?id=)
    const transactionId =
      searchParams.get("payment_id") ?? searchParams.get("id") ?? searchParams.get("Id");
```

La llamada existente `medusa.checkout.complete3DS(cartId, transactionId)` ahora manda `mp_payment_id` (por la nueva firma). No cambia nada más — el polling de carrito se conserva.

- [ ] **Step 6: Verify frontend compiles**

Run (desde `novafrontend/apps/storefront`): `pnpm run lint`
Expected: sin errores nuevos.

- [ ] **Step 7: Commit**

```bash
git add lib/markets.ts lib/mercadopago.ts app/[locale]/checkout/page.tsx lib/medusa.ts "app/[locale]/checkout/3ds-return/page.tsx"
git commit -m "feat(checkout): route Mexico through MercadoPago card flow with 3DS"
```

---

## Verificación end-to-end (manual, sandbox MP MX)

Tras completar las tareas y configurar `MP_ACCESS_TOKEN_MX` + `NEXT_PUBLIC_MP_PUBLIC_KEY_MX` (sandbox) y correr `npx medusa exec src/scripts/update-mx-payment-provider.ts`:

1. Checkout MX con **tarjeta de prueba aprobada** → orden creada, sin redirect.
2. Checkout MX con **tarjeta que dispara challenge 3DS** → redirect a MP → volver a `/checkout/3ds-return` → orden completada.
3. Checkout MX con **tarjeta rechazada** → mensaje de error traducido, sin orden.
4. Verificar en logs backend `[CompleteCart/MP]` y `[Complete3DS/MP]` con el `payment_id` correcto.

## Self-Review (cubierto por este plan)

- **Credenciales por país** → Task 1, 7, 9.
- **`/complete` siempre MP + 3DS** → Tasks 2, 3, 5.
- **`complete-3ds` MP** → Task 6.
- **payment-sessions provider MP** → Task 4.
- **Región MX → MP** → Task 8.
- **Frontend enruta MX por MP** → Task 9.
- **Openpay** se conserva (retiro en Plan 4). **Webhook + OXXO/SPEI** → Plan 2. **Payment Brick** → Plan 3.
