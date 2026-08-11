# MercadoPago Payment Brick (card-first) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the storefront's custom card form with MercadoPago's **Payment Brick** (card + debit, installments, native validation) and render results with the **Status Screen Brick**, while reshaping the backend `/complete` route to accept the Brick's `formData` — keeping the card 3DS + webhook flow from Plans 1-2 intact.

**Architecture:** The Brick lives in a self-contained client component (`components/checkout/PaymentBrick.tsx`) that the checkout page mounts in place of the card inputs, so the 1900-line checkout file barely changes. On submit, the Brick hands us `formData`; the frontend posts it to `/complete`; the backend builds the MP `/v1/payments` body from it via a pure, unit-tested helper and reuses Plan 1's charge + 3DS-redirect + Plan 2 webhook. Results (approved / 3DS / rejected) render via the Status Screen Brick on the confirmation page.

**Tech Stack:** `@mercadopago/sdk-react` (new dep), MercadoPago Bricks (Payment + Status Screen), Next.js 15 / React 19 client components, Medusa v2 backend, Jest (backend only).

## Global Constraints

- Frontend repo: `/Users/dlucca/Projects/novapatch/novafrontend/apps/storefront`. Backend repo: `/Users/dlucca/Projects/novapatch/novabackend`. Both on branch `feat/mercadopago-unified-gateway` (do NOT branch/merge; store is LIVE on Openpay in `main`).
- Frontend has **no unit-test framework** (jest/vitest); only Playwright e2e (`pnpm run test:e2e`). Frontend tasks verify via `pnpm run lint` + `npx tsc --noEmit` + documented manual/browser checks (full manual runs are DEFERRED to the isolated test environment — see spec's cutover; do not run against production).
- Backend HAS jest — backend pure helpers use real RED→GREEN unit tests (`TEST_TYPE=unit npx jest <path>`). Node16: dynamic relative imports need `.js`; static are extensionless.
- **Card-first scope:** the Brick enables `creditCard` + `debitCard` only. OXXO (`oxxo`) and SPEI (`clabe`) are confirmed available on the MX account but their offline completion + voucher rendering is **Plan 2b** (their MP response shape must be verified against the isolated sandbox first). Do NOT enable ticket/bankTransfer in the Brick here.
- Backward compatibility: `/complete` keeps accepting Plan 1's `{ mp_card_token }` payload AND the new Brick `{ payment: <formData> }` payload, so the branch never has a broken half-state.
- Brick `amount` MUST be Medusa's confirmed total (post shipping/coupons), never the frontend estimate.
- Theme: Novapatch palette (coral `#E8503A`, navy `#005088`) via the Brick's `customization.visual`.
- Public key per country: `NEXT_PUBLIC_MP_PUBLIC_KEY_MX` / `_AR` (from Plan 1). Locale `es-MX` / `es-AR`.

---

### Task 1 (backend): `buildMpCardPaymentBody` — map Brick formData → MP payment body

**Files:**
- Create: `src/lib/mp-brick.ts`
- Test: `src/__tests__/lib/mp-brick.unit.spec.ts`

**Interfaces:**
- Produces:
  - `type BrickCardFormData = { token: string; payment_method_id: string; issuer_id?: string; installments?: number; payer?: { email?: string; identification?: { type: string; number: string } } }`
  - `buildMpCardPaymentBody(args: { formData: BrickCardFormData; amount: number; description: string; externalReference: string; payerEmail: string }): Record<string, unknown>` — returns the `/v1/payments` body: `token`, `transaction_amount`, `description`, `installments` (default 1), `payment_method_id`, `issuer_id` (only if present), `external_reference`, `payer` (email + identification if present). Never includes `three_d_secure_mode` (the route adds that).

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/lib/mp-brick.unit.spec.ts
import { buildMpCardPaymentBody } from "../../lib/mp-brick"

describe("buildMpCardPaymentBody", () => {
  const base = {
    amount: 499, description: "Novapatch order - cart_1",
    externalReference: "cart_1", payerEmail: "a@test.com",
  }

  it("maps a full Brick card formData to the payments body", () => {
    const body = buildMpCardPaymentBody({
      ...base,
      formData: {
        token: "tok_abc", payment_method_id: "visa", issuer_id: "310",
        installments: 3, payer: { email: "a@test.com" },
      },
    })
    expect(body).toMatchObject({
      token: "tok_abc",
      transaction_amount: 499,
      description: "Novapatch order - cart_1",
      installments: 3,
      payment_method_id: "visa",
      issuer_id: "310",
      external_reference: "cart_1",
      payer: { email: "a@test.com" },
    })
  })

  it("defaults installments to 1 and omits issuer_id when absent", () => {
    const body = buildMpCardPaymentBody({
      ...base,
      formData: { token: "tok_x", payment_method_id: "master" },
    })
    expect(body.installments).toBe(1)
    expect("issuer_id" in body).toBe(false)
    expect(body.payer).toEqual({ email: "a@test.com" })
  })

  it("passes through payer identification when present", () => {
    const body = buildMpCardPaymentBody({
      ...base,
      formData: {
        token: "tok_y", payment_method_id: "visa",
        payer: { email: "a@test.com", identification: { type: "RFC", number: "XAXX010101000" } },
      },
    }) as any
    expect(body.payer.identification).toEqual({ type: "RFC", number: "XAXX010101000" })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-brick.unit.spec.ts`
Expected: FAIL — `Cannot find module '../../lib/mp-brick'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/mp-brick.ts
export type BrickCardFormData = {
  token: string
  payment_method_id: string
  issuer_id?: string
  installments?: number
  payer?: { email?: string; identification?: { type: string; number: string } }
}

export function buildMpCardPaymentBody(args: {
  formData: BrickCardFormData
  amount: number
  description: string
  externalReference: string
  payerEmail: string
}): Record<string, unknown> {
  const { formData, amount, description, externalReference, payerEmail } = args
  const payer: Record<string, unknown> = { email: formData.payer?.email ?? payerEmail }
  if (formData.payer?.identification) payer.identification = formData.payer.identification

  const body: Record<string, unknown> = {
    token: formData.token,
    transaction_amount: amount,
    description,
    installments: formData.installments ?? 1,
    payment_method_id: formData.payment_method_id,
    external_reference: externalReference,
    payer,
  }
  if (formData.issuer_id) body.issuer_id = formData.issuer_id
  return body
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=unit npx jest src/__tests__/lib/mp-brick.unit.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mp-brick.ts src/__tests__/lib/mp-brick.unit.spec.ts
git commit -m "feat(brick): map MercadoPago Payment Brick card formData to payments body"
```

---

### Task 2 (backend): `MercadoPagoClient.chargeWithBody` + `/complete` accepts Brick payload

**Files:**
- Modify: `src/modules/mercadopago-payment/mercadopago-client.ts` (add `chargeWithBody`)
- Modify: `src/api/store/carts/[id]/complete/route.ts` (`completeMercadoPago`)
- Test: `src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts`

**Interfaces:**
- Consumes: `buildMpCardPaymentBody` (Task 1); `mp3dsMode`, `interpretMpPayment` (Plan 1).
- Produces: `MercadoPagoClient.chargeWithBody(body: Record<string, unknown>, threeDSMode?: "optional"|"mandatory"|"not_specified"): Promise<MPPayment>` — POSTs `/v1/payments` with the given body (plus `three_d_secure_mode` when not `not_specified`) and an `X-Idempotency-Key`; throws on `rejected`.

- [ ] **Step 1: Write the failing test** (append to the MP client spec)

```ts
  describe("chargeWithBody", () => {
    it("posts the given body and adds three_d_secure_mode when set", async () => {
      mockFetch.mockReturnValue(ok({ id: 7, status: "approved", status_detail: "accredited" }))
      await client.chargeWithBody(
        { token: "t", transaction_amount: 100, payment_method_id: "visa", external_reference: "cart_9" },
        "optional"
      )
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.payment_method_id).toBe("visa")
      expect(body.three_d_secure_mode).toBe("optional")
      expect(mockFetch.mock.calls[0][1].headers["X-Idempotency-Key"]).toBeTruthy()
    })
    it("throws on rejected", async () => {
      mockFetch.mockReturnValue(ok({ id: 8, status: "rejected", status_detail: "cc_rejected_bad_filled_security_code" }))
      await expect(client.chargeWithBody({ token: "t", transaction_amount: 100 })).rejects.toThrow("cc_rejected_bad_filled_security_code")
    })
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `TEST_TYPE=integration:modules npx jest src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts`
Expected: FAIL — `chargeWithBody` is not a function.

- [ ] **Step 3: Implement `chargeWithBody`**

Add to `MercadoPagoClient`:

```ts
  async chargeWithBody(
    body: Record<string, unknown>,
    threeDSMode?: "optional" | "mandatory" | "not_specified"
  ): Promise<MPPayment> {
    const ref = (body.external_reference as string | undefined) ?? "charge"
    const idempotencyKey = `${ref}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const payment = await this.request<MPPayment>(
      "POST",
      "/v1/payments",
      {
        ...body,
        ...(threeDSMode && threeDSMode !== "not_specified" ? { three_d_secure_mode: threeDSMode } : {}),
      },
      { "X-Idempotency-Key": idempotencyKey }
    )
    if (payment.status === "rejected") throw new Error(payment.status_detail)
    return payment
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `TEST_TYPE=integration:modules npx jest src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts`
Expected: PASS (existing charge/getPayment tests stay green).

- [ ] **Step 5: Accept the Brick payload in `completeMercadoPago`**

In `src/api/store/carts/[id]/complete/route.ts`, in `completeMercadoPago`, replace the early guard + charge so it handles BOTH payloads. Change the current block that reads `const mpCardToken = body.mp_card_token ...; if (!mpCardToken) { 400 }` and the `mp.charge({...})` call to:

```ts
  const mpCardToken = body.mp_card_token as string | undefined
  const brickPayment = body.payment as import("../../../../../lib/mp-brick").BrickCardFormData | undefined
  if (!mpCardToken && !brickPayment?.token) {
    res.status(400).json({ message: "mp_card_token or payment.token is required" })
    return
  }

  const { countryFromCurrency, mpCredentialsFor, mp3dsMode, interpretMpPayment } =
    await import("../../../../../lib/mp-payment.js")
  const country = countryFromCurrency(currencyCode)
  const { accessToken, sandbox } = mpCredentialsFor(country)
  const mp = new MercadoPagoClient({ accessToken, sandbox })
```

(Keep the existing get-or-create MP customer steps.) Then replace the `mp.charge(...)` call with a branch:

```ts
  const chargeCurrency = (session.currency_code ?? cart.payment_collection?.currency_code ?? "MXN").toUpperCase()
  let payment
  if (brickPayment?.token) {
    const { buildMpCardPaymentBody } = await import("../../../../../lib/mp-brick.js")
    const paymentBody = buildMpCardPaymentBody({
      formData: brickPayment,
      amount: paymentAmount,
      description: `Novapatch order - ${cartId}`,
      externalReference: cartId,
      payerEmail: email,
    })
    payment = await mp.chargeWithBody({ ...paymentBody, payer: { ...(paymentBody.payer as object), type: "customer", id: mpCustomerId } }, mp3dsMode(country))
  } else {
    payment = await mp.charge({
      token: mpCardToken!, amount: paymentAmount, currencyCode: chargeCurrency,
      description: `Novapatch order - ${cartId}`, mpCustomerId, externalReference: cartId,
      threeDSMode: mp3dsMode(country),
    })
  }
  logger.info(`[CompleteCart/MP] payment_id=${payment.id} status=${payment.status} detail=${payment.status_detail}`)
```

The rest of the function (the `interpretMpPayment` outcome branch, session persistence, listCards, complete) is unchanged.

- [ ] **Step 6: Verify build compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no new errors in `complete/route.ts` or `mercadopago-client.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/modules/mercadopago-payment/mercadopago-client.ts "src/api/store/carts/[id]/complete/route.ts" src/modules/mercadopago-payment/__tests__/mercadopago-client.unit.spec.ts
git commit -m "feat(checkout): accept Payment Brick card payload in complete route"
```

---

### Task 3 (frontend): add `@mercadopago/sdk-react` + provider init

**Files:**
- Modify: `apps/storefront/package.json` (add dep)
- Create: `apps/storefront/lib/mp-brick-init.ts`

**Interfaces:**
- Produces: `mpPublicKeyFor(country: string): string` (reads `NEXT_PUBLIC_MP_PUBLIC_KEY_<CC>`, throws if missing) and `mpLocaleFor(country): "es-MX" | "es-AR"`.

- [ ] **Step 1: Add the dependency**

Run (from `apps/storefront`): `pnpm add @mercadopago/sdk-react`
Expected: dependency added to `package.json` + lockfile updated.

- [ ] **Step 2: Create the init helper**

```ts
// apps/storefront/lib/mp-brick-init.ts
export function mpPublicKeyFor(country: string): string {
  const cc = country.toUpperCase()
  const key =
    (process.env as Record<string, string | undefined>)[`NEXT_PUBLIC_MP_PUBLIC_KEY_${cc}`] ??
    process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
  if (!key) throw new Error(`[MP Brick] Falta NEXT_PUBLIC_MP_PUBLIC_KEY_${cc}`)
  return key
}

export function mpLocaleFor(country: string): "es-MX" | "es-AR" {
  return country === "ar" ? "es-AR" : "es-MX"
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml lib/mp-brick-init.ts
git commit -m "chore(brick): add MercadoPago React SDK and per-country init helper"
```

---

### Task 4 (frontend): `PaymentBrick` component

**Files:**
- Create: `apps/storefront/components/checkout/PaymentBrick.tsx`

**Interfaces:**
- Consumes: `mpPublicKeyFor`, `mpLocaleFor` (Task 3); `@mercadopago/sdk-react` `initMercadoPago`, `Payment`.
- Produces: default export React component
  `PaymentBrick({ amount, payerEmail, country, onSubmitPayment, onError }: { amount: number; payerEmail: string; country: string; onSubmitPayment: (formData: unknown) => Promise<void>; onError?: (e: unknown) => void })`.
  Renders the Payment Brick (card + debit only), themed to Novapatch, and calls `onSubmitPayment(formData)` from the Brick's `onSubmit`.

- [ ] **Step 1: Create the component**

```tsx
// apps/storefront/components/checkout/PaymentBrick.tsx
"use client";

import { useEffect, useRef } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { mpPublicKeyFor, mpLocaleFor } from "@/lib/mp-brick-init";

export default function PaymentBrick({
  amount,
  payerEmail,
  country,
  onSubmitPayment,
  onError,
}: {
  amount: number;
  payerEmail: string;
  country: string;
  onSubmitPayment: (formData: unknown) => Promise<void>;
  onError?: (e: unknown) => void;
}) {
  const inited = useRef(false);
  if (!inited.current) {
    initMercadoPago(mpPublicKeyFor(country), { locale: mpLocaleFor(country) });
    inited.current = true;
  }

  return (
    <Payment
      initialization={{ amount, payer: { email: payerEmail } }}
      customization={{
        paymentMethods: { creditCard: "all", debitCard: "all" },
        visual: {
          style: { theme: "default", customVariables: { baseColor: "#005088" } },
        },
      }}
      onSubmit={async ({ formData }) => {
        await onSubmitPayment(formData);
      }}
      onError={(err) => onError?.(err)}
    />
  );
}
```

- [ ] **Step 2: Verify it compiles + lints**

Run: `npx tsc --noEmit && pnpm run lint`
Expected: no new errors in `PaymentBrick.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/checkout/PaymentBrick.tsx
git commit -m "feat(brick): themed MercadoPago Payment Brick component (card/debit)"
```

---

### Task 5 (frontend): mount the Brick in checkout, drive submission from it

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx`

**Interfaces:**
- Consumes: `PaymentBrick` (Task 4). The backend `/complete` now accepts `{ payment: formData, email }` (Task 2).

- [ ] **Step 1: Replace the card inputs section with the Brick**

In the "Datos de pago" section (the block around the `CreditCard` `SectionHeader` and the card `Field`s / raw card inputs, lines ~1608-1710), replace the four card inputs (number/name/expiry/cvv and the AR DNI field) with the Brick, mounted only once contact + a confirmed amount are available:

```tsx
{/* ── 3. Pago (MercadoPago Brick) ── */}
<motion.div
  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
  className="bg-white rounded-2xl p-6 border border-[#005088]/8 shadow-[0_2px_16px_rgba(0,80,136,0.05)]"
>
  <SectionHeader step={3} icon={<CreditCard size={16} />} title="Datos de pago" />
  {finalTotal > 0 && contact.email ? (
    <PaymentBrick
      amount={confirmedTotal ?? finalTotal}
      payerEmail={contact.email}
      country={cartRegion === "ars" ? "ar" : "mx"}
      onSubmitPayment={handleBrickSubmit}
      onError={(e) => setSubmitError(e instanceof Error ? e.message : "Error en el formulario de pago")}
    />
  ) : (
    <p className="text-[13px] text-[#6B7280]">Completá tu correo y dirección para ver las opciones de pago.</p>
  )}
</motion.div>
```

Add the import at the top: `import PaymentBrick from "@/components/checkout/PaymentBrick";`

- [ ] **Step 2: Add `handleBrickSubmit` and route completion through the existing flow**

The Brick's `onSubmit` replaces the card-tokenization portion of `handleSubmit`. Extract the post-tokenization logic (cart create → address → shipping → payment session → completeCart → 3DS/redirect/success) into a function `finalizeOrder(completePayload)` and call it from `handleBrickSubmit`:

```tsx
async function handleBrickSubmit(formData: unknown) {
  const errs = validate();               // still validate contact/address
  // card fields are no longer part of `errs`; ensure validate() no longer requires card.* (see Step 3)
  if (Object.keys(errs).length) { setErrors(errs); throw new Error("Revisá los datos de envío"); }
  setSubmitError(null); setSubmitting(true);
  try {
    await finalizeOrder({ payment: formData, email: contact.email });
  } finally {
    setSubmitting(false);
  }
}
```

Where `finalizeOrder(completePayload)` is the existing body of `handleSubmit` from "Paso 2: Usar carrito pre-cargado…" through the success/redirect handling, with `completePayload` passed in instead of being built from `tokenizeCardMP`/`tokenizeCard`. Keep every existing step (preloaded cart, address payload, shipping method + zone pick, deferred/eager coupons, `createPaymentSession`, `completeCart`, the `result.type === "redirect"` 3DS branch, the success stash + `/gracias` redirect) exactly as-is.

- [ ] **Step 3: Drop card-field validation and dead tokenization**

In `validate()`, remove the `card.number` / `card.name` / `card.expiry` / `card.cvv` / AR `dni` checks (the Brick validates the instrument itself). Remove the now-unused `card` state, `tokenizeCardMP`/`parseCardFormMP`/`tokenizeCard`/`parseCardForm`/`getDeviceSessionId` imports and calls, and the `formatCardNumber`/`formatExpiry` helpers. Leave contact/address validation untouched.

- [ ] **Step 4: Verify compiles + lints**

Run: `npx tsc --noEmit && pnpm run lint`
Expected: no new errors; no unused-import warnings for the removed card helpers.

- [ ] **Step 5: Manual verification (DEFERRED to the isolated test env — do NOT run against production)**

Documented for the isolated environment: load `/mx/checkout`, confirm the Brick renders card + debit, themed; submit a test card → order completes; submit the 3DS-challenge test card → redirect → `/checkout/3ds-return` → order completes; submit a declined test card → Brick/`submitError` shows the message. (Card sandbox test numbers from MP's "Tarjetas de prueba".)

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/checkout/page.tsx"
git commit -m "feat(checkout): drive checkout submission from the MercadoPago Payment Brick"
```

---

### Task 6 (frontend): Status Screen Brick on the confirmation page

**Files:**
- Create: `apps/storefront/components/checkout/PaymentStatusBrick.tsx`
- Modify: `apps/storefront/app/[locale]/checkout/gracias/page.tsx` (render it when a payment id is present)

**Interfaces:**
- Consumes: `mpPublicKeyFor`, `mpLocaleFor`; `@mercadopago/sdk-react` `StatusScreen`.
- Produces: `PaymentStatusBrick({ paymentId, country }: { paymentId: string; country: string })`.

- [ ] **Step 1: Create the Status Screen component**

```tsx
// apps/storefront/components/checkout/PaymentStatusBrick.tsx
"use client";

import { useRef } from "react";
import { initMercadoPago, StatusScreen } from "@mercadopago/sdk-react";
import { mpPublicKeyFor, mpLocaleFor } from "@/lib/mp-brick-init";

export default function PaymentStatusBrick({ paymentId, country }: { paymentId: string; country: string }) {
  const inited = useRef(false);
  if (!inited.current) {
    initMercadoPago(mpPublicKeyFor(country), { locale: mpLocaleFor(country) });
    inited.current = true;
  }
  return <StatusScreen initialization={{ paymentId }} />;
}
```

- [ ] **Step 2: Render it on the gracias page when a payment id is present**

The 3DS/success flow stashes `mp_payment_id` in `sessionStorage` (the checkout already stashes 3DS context there; extend the stash to include the payment id if not already, keyed `novapatch_mp_payment_id`). On `gracias`, read it and, when present, render the Status Screen above the existing confirmation content:

```tsx
// inside gracias/page.tsx (client component), near the top of the render:
const mpPaymentId = typeof window !== "undefined" ? sessionStorage.getItem("novapatch_mp_payment_id") : null;
const locale = /* existing locale param */;
{mpPaymentId && (
  <div className="max-w-md mx-auto mb-8">
    <PaymentStatusBrick paymentId={mpPaymentId} country={locale === "ar" ? "ar" : "mx"} />
  </div>
)}
```

Add `import PaymentStatusBrick from "@/components/checkout/PaymentStatusBrick";`. (If `gracias/page.tsx` is a server component, wrap the Status Screen usage in a small `"use client"` child; check the file's directive first and follow whichever it already uses.)

- [ ] **Step 3: Persist the payment id for the status screen**

In `checkout/page.tsx`, where the order completes (both the direct-success branch and the 3DS stash), also write `sessionStorage.setItem("novapatch_mp_payment_id", String(<payment id from the complete result or session>))`. The `/complete` result includes the order; the payment id is on the payment session (`mp_payment_id`). If the id isn't readily available client-side, skip persisting it (the Status Screen is enhancement-only) and note that the gracias page falls back to its existing confirmation UI when no id is present.

- [ ] **Step 4: Verify compiles + lints**

Run: `npx tsc --noEmit && pnpm run lint`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add components/checkout/PaymentStatusBrick.tsx "app/[locale]/checkout/gracias/page.tsx" "app/[locale]/checkout/page.tsx"
git commit -m "feat(brick): render MercadoPago Status Screen on the confirmation page"
```

---

## Verification summary

- **Backend (automated):** Task 1 + Task 2 unit tests green; `tsc --noEmit` clean on the touched route/client.
- **Frontend (automated):** `tsc --noEmit` + `pnpm run lint` clean after each task.
- **End-to-end (DEFERRED to isolated env):** Brick renders + card checkout + 3DS challenge + declined card, per Task 5 Step 5 and Task 6. Requires the isolated staging/local-DB environment and MP sandbox test cards — NOT to be run against the production database.

## Self-Review (coverage)

- **Brick replaces the card form** → Tasks 4-5.
- **Backend accepts Brick formData** (with `mp_card_token` back-compat) → Tasks 1-2.
- **3DS + webhook reused unchanged** → Task 5 keeps Plan 1's redirect branch and Plan 2's webhook.
- **Per-country key/locale** → Task 3.
- **Status/voucher rendering via MP** → Task 6.
- **Out of scope (Plan 2b, needs isolated-env shape verification):** enabling OXXO (`oxxo`) / SPEI (`clabe`) in the Brick + their pending-order completion + `authorizePayment` status-awareness (pending→AUTHORIZED, webhook captures). Confirmed method ids: `oxxo` (ticket), `clabe` (bank_transfer).
