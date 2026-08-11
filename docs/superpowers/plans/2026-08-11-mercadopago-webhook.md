# MercadoPago Webhook (payment reconciliation) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a signature-verified, idempotent MercadoPago webhook that reconciles card payments server-side — completing the order even when the customer never returns from the 3DS challenge — closing the release gate left open by Plan 1.

**Architecture:** A new `POST /webhooks/mercadopago` route verifies MP's HMAC `x-signature`, fetches the payment by id with per-country credentials, locates the cart via the payment's `external_reference` (= cartId, set at charge time), and — if the payment is approved but the cart isn't completed yet — runs `completeCartWorkflow` and emits the custom `order.payment_captured` event that drives fulfillment. All decision logic lives in small pure helpers (`mp-webhook.ts` signature verification, `decideWebhookOrderAction` in `mp-payment.ts`) so it is unit-tested without a live server.

**Tech Stack:** Medusa v2 (framework/http, core-flows), Node `crypto` (HMAC-SHA256), TypeScript, Jest + `@swc/jest`.

## Global Constraints

- Repo: `/Users/dlucca/Projects/novapatch/novabackend`. Branch: `feat/mercadopago-unified-gateway` (already checked out — do NOT branch again; do NOT merge).
- The store is LIVE on Openpay in `main`; this branch must stay unmerged until the full migration is tested. Openpay code stays untouched.
- Tests: unit `TEST_TYPE=unit npx jest <path>`; module `TEST_TYPE=integration:modules npx jest <path>`. Unit specs `*.unit.spec.ts` under `src/**/__tests__/`.
- Node16 moduleResolution: DYNAMIC `await import()` of relative paths needs `.js`; STATIC relative imports are extensionless.
- MP webhook signature manifest (verbatim, per MP docs): `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` — omit any segment whose value is absent. HMAC-SHA256 hex with the account's webhook secret; compare (timing-safe) to the `v1` value in the `x-signature` header (`ts=<ts>,v1=<hash>`).
- Credentials/secret are per-country (each MP account is national). The configured MP notification URL carries `?cc=mx`; the route resolves `MP_WEBHOOK_SECRET_<CC>` and `mpCredentialsFor(cc)`. Default `cc` = `mx`.
- Reuses from Plan 1 (already on this branch): `mpCredentialsFor`, `countryFromCurrency` in `src/lib/mp-payment.ts`; `MercadoPagoClient.getPayment` in `src/modules/mercadopago-payment/mercadopago-client.ts`.
- Fulfillment triggers on the custom `order.payment_captured` event (see `src/subscribers/envia-fulfillment.ts:68`), which already guards against duplicate events — re-emitting is safe.

---

### Task 1: Signature verification helper (`mp-webhook.ts`)

**Files:**
- Create: `src/lib/mp-webhook.ts`
- Test: `src/__tests__/lib/mp-webhook.unit.spec.ts`

**Interfaces:**
- Produces:
  - `parseSignatureHeader(header: string): { ts: string; v1: string } | null` — parses `"ts=...,v1=..."`; returns null if malformed.
  - `buildManifest(parts: { dataId?: string; requestId?: string; ts?: string }): string` — joins present segments as `id:<dataId>;request-id:<requestId>;ts:<ts>;`, omitting absent ones; `dataId` is lowercased.
  - `verifyMpSignature(args: { xSignature?: string; xRequestId?: string; dataId?: string; secret: string }): boolean` — parses the header, builds the manifest, HMAC-SHA256-hex with `secret`, timing-safe-compares to `v1`. Returns false on any missing/invalid input.

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/lib/mp-webhook.unit.spec.ts
import { createHmac } from "crypto"
import { parseSignatureHeader, buildManifest, verifyMpSignature } from "../../lib/mp-webhook"

const SECRET = "test-webhook-secret"
const DATA_ID = "123456"
const REQUEST_ID = "bb56a2f1-6aae-46ac-982e-9dcd3581d08e"
const TS = "1742505638683"

function sign(manifest: string, secret = SECRET): string {
  return createHmac("sha256", secret).update(manifest).digest("hex")
}

describe("parseSignatureHeader", () => {
  it("parses ts and v1", () => {
    expect(parseSignatureHeader(`ts=${TS},v1=abc123`)).toEqual({ ts: TS, v1: "abc123" })
  })
  it("tolerates spacing and reordering", () => {
    expect(parseSignatureHeader(`v1=abc123, ts=${TS}`)).toEqual({ ts: TS, v1: "abc123" })
  })
  it("returns null when malformed", () => {
    expect(parseSignatureHeader("garbage")).toBeNull()
    expect(parseSignatureHeader("")).toBeNull()
  })
})

describe("buildManifest", () => {
  it("joins all present segments in order", () => {
    expect(buildManifest({ dataId: DATA_ID, requestId: REQUEST_ID, ts: TS }))
      .toBe(`id:${DATA_ID};request-id:${REQUEST_ID};ts:${TS};`)
  })
  it("omits absent segments", () => {
    expect(buildManifest({ dataId: DATA_ID, ts: TS })).toBe(`id:${DATA_ID};ts:${TS};`)
  })
  it("lowercases the data id", () => {
    expect(buildManifest({ dataId: "AbC" })).toBe("id:abc;")
  })
})

describe("verifyMpSignature", () => {
  const manifest = `id:${DATA_ID};request-id:${REQUEST_ID};ts:${TS};`

  it("accepts a correct signature", () => {
    const v1 = sign(manifest)
    expect(verifyMpSignature({
      xSignature: `ts=${TS},v1=${v1}`, xRequestId: REQUEST_ID, dataId: DATA_ID, secret: SECRET,
    })).toBe(true)
  })
  it("rejects a wrong secret", () => {
    const v1 = sign(manifest, "other-secret")
    expect(verifyMpSignature({
      xSignature: `ts=${TS},v1=${v1}`, xRequestId: REQUEST_ID, dataId: DATA_ID, secret: SECRET,
    })).toBe(false)
  })
  it("rejects a tampered data id", () => {
    const v1 = sign(manifest)
    expect(verifyMpSignature({
      xSignature: `ts=${TS},v1=${v1}`, xRequestId: REQUEST_ID, dataId: "999999", secret: SECRET,
    })).toBe(false)
  })
  it("returns false when the header is missing or malformed", () => {
    expect(verifyMpSignature({ xRequestId: REQUEST_ID, dataId: DATA_ID, secret: SECRET })).toBe(false)
    expect(verifyMpSignature({ xSignature: "nope", xRequestId: REQUEST_ID, dataId: DATA_ID, secret: SECRET })).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-webhook.unit.spec.ts`
Expected: FAIL — `Cannot find module '../../lib/mp-webhook'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/mp-webhook.ts
import { createHmac, timingSafeEqual } from "crypto"

export function parseSignatureHeader(header: string): { ts: string; v1: string } | null {
  if (!header) return null
  const parts: Record<string, string> = {}
  for (const segment of header.split(",")) {
    const [k, v] = segment.split("=").map((s) => s.trim())
    if (k && v) parts[k] = v
  }
  if (!parts.ts || !parts.v1) return null
  return { ts: parts.ts, v1: parts.v1 }
}

export function buildManifest(parts: { dataId?: string; requestId?: string; ts?: string }): string {
  let manifest = ""
  if (parts.dataId) manifest += `id:${parts.dataId.toLowerCase()};`
  if (parts.requestId) manifest += `request-id:${parts.requestId};`
  if (parts.ts) manifest += `ts:${parts.ts};`
  return manifest
}

export function verifyMpSignature(args: {
  xSignature?: string
  xRequestId?: string
  dataId?: string
  secret: string
}): boolean {
  if (!args.xSignature || !args.secret) return false
  const parsed = parseSignatureHeader(args.xSignature)
  if (!parsed) return false

  const manifest = buildManifest({ dataId: args.dataId, requestId: args.xRequestId, ts: parsed.ts })
  const expected = createHmac("sha256", args.secret).update(manifest).digest("hex")

  const a = Buffer.from(expected, "hex")
  const b = Buffer.from(parsed.v1, "hex")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-webhook.unit.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mp-webhook.ts src/__tests__/lib/mp-webhook.unit.spec.ts
git commit -m "feat(webhooks): MercadoPago HMAC signature verification helper"
```

---

### Task 2: Webhook order-action decision + payment external_reference

**Files:**
- Modify: `src/lib/mp-payment.ts` (add `decideWebhookOrderAction`)
- Modify: `src/modules/mercadopago-payment/mercadopago-client.ts` (add `external_reference?` to `MPPayment`)
- Test: `src/__tests__/lib/mp-payment.unit.spec.ts`

**Interfaces:**
- Consumes: `MPPayment` (extended).
- Produces: `decideWebhookOrderAction(args: { paymentStatus: string; cartCompleted: boolean }): "complete" | "already_done" | "ignore"`.
  - `approved`/`authorized` + not completed → `"complete"`
  - `approved`/`authorized` + already completed → `"already_done"`
  - any other status → `"ignore"`

- [ ] **Step 1: Write the failing test** (append to the existing mp-payment spec)

```ts
import { decideWebhookOrderAction } from "../../lib/mp-payment"

describe("decideWebhookOrderAction", () => {
  it("completes an approved payment whose cart is not yet completed", () => {
    expect(decideWebhookOrderAction({ paymentStatus: "approved", cartCompleted: false })).toBe("complete")
  })
  it("treats an approved payment on an already-completed cart as done", () => {
    expect(decideWebhookOrderAction({ paymentStatus: "authorized", cartCompleted: true })).toBe("already_done")
  })
  it("ignores non-approved statuses", () => {
    expect(decideWebhookOrderAction({ paymentStatus: "pending", cartCompleted: false })).toBe("ignore")
    expect(decideWebhookOrderAction({ paymentStatus: "rejected", cartCompleted: false })).toBe("ignore")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-payment.unit.spec.ts`
Expected: FAIL — `decideWebhookOrderAction` is not exported.

- [ ] **Step 3: Write minimal implementation**

Append to `src/lib/mp-payment.ts`:

```ts
export function decideWebhookOrderAction(args: {
  paymentStatus: string
  cartCompleted: boolean
}): "complete" | "already_done" | "ignore" {
  const approved = args.paymentStatus === "approved" || args.paymentStatus === "authorized"
  if (!approved) return "ignore"
  return args.cartCompleted ? "already_done" : "complete"
}
```

Add `external_reference?: string` to the `MPPayment` type in `src/modules/mercadopago-payment/mercadopago-client.ts`:

```ts
export type MPPayment = {
  id: number
  status: "approved" | "pending" | "rejected" | "cancelled" | "refunded" | "charged_back" | "in_process" | "authorized"
  status_detail: string
  transaction_amount: number
  currency_id: string
  external_reference?: string
  three_ds_info?: { external_resource_url?: string; creq?: string }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-payment.unit.spec.ts`
Expected: PASS (existing mp-payment tests stay green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/mp-payment.ts src/modules/mercadopago-payment/mercadopago-client.ts src/__tests__/lib/mp-payment.unit.spec.ts
git commit -m "feat(webhooks): decide webhook order action; expose payment external_reference"
```

---

### Task 3: Webhook route `POST /webhooks/mercadopago`

**Files:**
- Create: `src/api/webhooks/mercadopago/route.ts`

**Interfaces:**
- Consumes: `verifyMpSignature` (Task 1); `decideWebhookOrderAction`, `mpCredentialsFor` (Tasks 1-2 / Plan 1); `MercadoPagoClient.getPayment` (Plan 1); `completeCartWorkflow`.

- [ ] **Step 1: Create the route**

```ts
// src/api/webhooks/mercadopago/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MercadoPagoClient } from "../../../modules/mercadopago-payment/mercadopago-client"
import { mpCredentialsFor, decideWebhookOrderAction } from "../../../lib/mp-payment"
import { verifyMpSignature } from "../../../lib/mp-webhook"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve("logger")
  const body = (req.body ?? {}) as Record<string, any>
  const query = req.query ?? {}

  // Country from the configured notification URL (?cc=mx). Default mx.
  const cc = (typeof query.cc === "string" ? query.cc : "mx").toLowerCase()

  // MP payment id: query `data.id` on GET-style pings, or body.data.id on POST.
  const dataId =
    (typeof query["data.id"] === "string" ? (query["data.id"] as string) : undefined) ??
    (body?.data?.id != null ? String(body.data.id) : undefined)

  const type = (body?.type as string | undefined) ?? (query.type as string | undefined)

  // Acknowledge non-payment notifications (merchant_order, plan, etc.) without work.
  if (type && type !== "payment") {
    res.status(200).json({ received: true, ignored: type })
    return
  }
  if (!dataId) {
    logger.warn(`[MP Webhook] Missing data.id — cc=${cc} type=${type ?? "?"}`)
    res.status(400).json({ message: "data.id is required" })
    return
  }

  // ── Verify signature ──────────────────────────────────────────────────────
  const secret = process.env[`MP_WEBHOOK_SECRET_${cc.toUpperCase()}`] ?? ""
  if (!secret) {
    logger.error(`[MP Webhook] Missing MP_WEBHOOK_SECRET_${cc.toUpperCase()}`)
    res.status(500).json({ message: "Webhook secret not configured" })
    return
  }
  const ok = verifyMpSignature({
    xSignature: req.headers["x-signature"] as string | undefined,
    xRequestId: req.headers["x-request-id"] as string | undefined,
    dataId,
    secret,
  })
  if (!ok) {
    logger.warn(`[MP Webhook] Invalid signature — cc=${cc} data.id=${dataId}`)
    res.status(401).json({ message: "Invalid signature" })
    return
  }

  try {
    // ── Fetch the payment with the country's credentials ─────────────────────
    const { accessToken, sandbox } = mpCredentialsFor(cc)
    const mp = new MercadoPagoClient({ accessToken, sandbox })
    const payment = await mp.getPayment(dataId)
    const cartId = payment.external_reference
    logger.info(`[MP Webhook] payment_id=${payment.id} status=${payment.status} cart=${cartId ?? "?"}`)

    if (!cartId) {
      // Nothing to reconcile (e.g. a subscription charge without a cart ref).
      res.status(200).json({ received: true, note: "no external_reference" })
      return
    }

    // ── Locate the cart ──────────────────────────────────────────────────────
    const queryService = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    let cart: any = null
    try {
      const { data: carts } = await queryService.graph({
        entity: "cart",
        filters: { id: cartId },
        fields: ["id", "completed_at"],
      })
      cart = carts?.[0] ?? null
    } catch { cart = null }

    if (!cart) {
      logger.warn(`[MP Webhook] Cart ${cartId} not found for payment ${payment.id}`)
      res.status(200).json({ received: true, note: "cart not found" })
      return
    }

    const action = decideWebhookOrderAction({
      paymentStatus: payment.status,
      cartCompleted: !!cart.completed_at,
    })
    logger.info(`[MP Webhook] action=${action} cart=${cartId} completed_at=${cart.completed_at ?? "null"}`)

    if (action === "complete") {
      // The customer's charge was approved but /complete or /complete-3ds never
      // finished (e.g. they closed the tab after the 3DS challenge). Finish the
      // order server-side and fire fulfillment.
      const { result } = await completeCartWorkflow(req.scope).run({ input: { id: cartId } })
      const orderId = (result as any)?.order?.id ?? (result as any)?.id
      if (orderId) {
        const eventBus = req.scope.resolve(Modules.EVENT_BUS)
        await eventBus.emit([{ name: "order.payment_captured", data: { id: orderId } }])
        logger.info(`[MP Webhook] Completed cart ${cartId} → order ${orderId}, emitted payment_captured`)
      }
    }
    // action === "already_done": /complete already created the order and emitted
    // the event; nothing to do. action === "ignore": non-approved status.

    res.status(200).json({ received: true, action })
  } catch (err: unknown) {
    // Return 200 so MP doesn't hammer retries on our transient errors; we log
    // for follow-up. (A 5xx makes MP retry with backoff — acceptable too, but
    // completeCartWorkflow is idempotent-guarded by completed_at above.)
    logger.error(`[MP Webhook] Error: ${err instanceof Error ? err.stack ?? err.message : JSON.stringify(err)}`)
    res.status(200).json({ received: true, error: true })
  }
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no new errors in `src/api/webhooks/mercadopago/route.ts` (pre-existing errors elsewhere are fine).

- [ ] **Step 3: Manual smoke check (documented, not automated)**

Route handlers aren't unit-tested in this repo (same as Plan 1). Verify manually once `MP_WEBHOOK_SECRET_MX` is set, using a signature built with the helper. Example (fill a real approved sandbox payment id + its cartId as external_reference):

```bash
# ts and manifest must match; compute v1 = HMAC_SHA256(secret, "id:<PID>;request-id:<RID>;ts:<TS>;")
curl -sS -X POST "http://localhost:9000/webhooks/mercadopago?cc=mx" \
  -H "content-type: application/json" \
  -H "x-request-id: <RID>" \
  -H "x-signature: ts=<TS>,v1=<V1>" \
  -d '{"type":"payment","data":{"id":"<PID>"}}'
# Expect 200 {"received":true,"action":"complete"|"already_done"|"ignore"}; a bad v1 → 401.
```

- [ ] **Step 4: Commit**

```bash
git add src/api/webhooks/mercadopago/route.ts
git commit -m "feat(webhooks): reconcile MercadoPago payments via signed webhook"
```

---

### Task 4: Env template

**Files:**
- Modify: `.env.template`

- [ ] **Step 1: Document the webhook secret**

Append under the MercadoPago block added in Plan 1:

```
MP_WEBHOOK_SECRET_MX=
# Configure the MP MX notification URL as: https://<backend>/webhooks/mercadopago?cc=mx
```

- [ ] **Step 2: Commit**

```bash
git add .env.template
git commit -m "chore(webhooks): document MP_WEBHOOK_SECRET_MX and notification URL"
```

---

## Post-implementation verification (sandbox — closes the Plan 1 release gate)

With `MP_ACCESS_TOKEN_MX` + `MP_WEBHOOK_SECRET_MX` (sandbox) set and the notification URL registered in the MP MX dashboard as `.../webhooks/mercadopago?cc=mx`:

1. Run a card checkout that triggers a **3DS challenge**; complete the challenge but **close the tab before returning**. Confirm the webhook fires, `completeCartWorkflow` runs, the order is created, and fulfillment (`order.payment_captured`) triggers.
2. Complete a normal card checkout (returns to `/checkout/gracias`); confirm the later webhook logs `action=already_done` and does NOT double-complete.
3. Send a tampered `x-signature`; confirm `401` and no side effects.

## Self-Review (coverage)

- **HMAC signature verification** → Task 1 (pure, unit-tested with real HMAC).
- **Idempotent reconcile decision** → Task 2 (`decideWebhookOrderAction`, unit-tested; `already_done` prevents double completion; `completed_at` guard + envia subscriber's duplicate guard).
- **Per-country secret/credentials** → Task 3 (`?cc=` → `MP_WEBHOOK_SECRET_<CC>` + `mpCredentialsFor`).
- **3DS-bounce gate closer** → Task 3 `"complete"` branch.
- **Env** → Task 4.
- **Out of scope (later plans):** OXXO/SPEI offline methods + pending-order lifecycle (Plan 2b, with the Brick); refunds/chargebacks via webhook; the pre-existing idempotency-key `Date.now()` fix.
