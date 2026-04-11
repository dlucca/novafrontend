# OXXO y SPEI en Checkout — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar OXXO y SPEI como métodos de pago en el checkout de Novapatch, con cargos vía Openpay REST API, modal de confirmación y email via Resend.

**Architecture:** Los cargos OXXO/SPEI se crean en API routes de Next.js (server-side) usando la private key de Openpay. La correlación webhook→cart se logra pasando `order_id: cart_id` al cargo. Medusa solo crea la orden cuando llega el webhook de confirmación de pago.

**Tech Stack:** Next.js 15.2 App Router, TypeScript strict, Openpay REST API v1, Resend, Tailwind CSS v4, Framer Motion.

**Nota sobre tests:** No hay framework de tests configurado. Cada tarea incluye pasos de verificación manual en el browser o con `curl`.

---

## Mapa de archivos

| Acción | Archivo |
|---|---|
| Crear | `apps/storefront/lib/openpay-server.ts` |
| Crear | `apps/storefront/app/api/openpay/oxxo/route.ts` |
| Crear | `apps/storefront/app/api/openpay/spei/route.ts` |
| Crear | `apps/storefront/app/api/openpay/webhook/route.ts` |
| Crear | `apps/storefront/components/PaymentMethodSelector.tsx` |
| Crear | `apps/storefront/components/PendingPaymentModal.tsx` |
| Modificar | `apps/storefront/app/[locale]/checkout/page.tsx` |

---

## Task 1: lib/openpay-server.ts — Cliente REST server-side de Openpay

**Files:**
- Crear: `apps/storefront/lib/openpay-server.ts`

Este módulo es el único que toca la private key de Openpay. Nunca se importa desde componentes client-side.

- [ ] **Step 1: Crear el archivo**

```typescript
// apps/storefront/lib/openpay-server.ts

const MERCHANT_ID = process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID ?? "";
const PRIVATE_KEY = process.env.OPENPAY_PRIVATE_KEY ?? "";
const SANDBOX     = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";

const BASE_URL = SANDBOX
  ? `https://sandbox-api.openpay.mx/v1/${MERCHANT_ID}`
  : `https://api.openpay.mx/v1/${MERCHANT_ID}`;

// HTTP Basic Auth: base64(private_key + ":")
function authHeader(): string {
  const creds = Buffer.from(`${PRIVATE_KEY}:`).toString("base64");
  return `Basic ${creds}`;
}

async function openpayPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.description ?? data?.error_code ?? "Error Openpay";
    throw new Error(String(msg));
  }

  return data as T;
}

async function openpayGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: authHeader() },
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.description ?? "Error Openpay";
    throw new Error(String(msg));
  }

  return data as T;
}

// ─── Tipos de respuesta ───────────────────────────────────────────────────────

export type OpenpayOxxoResult = {
  id: string;
  reference: string;
  due_date: string;        // ISO 8601, ej: "2026-04-14T23:59:59-06:00"
};

export type OpenpaySpeiResult = {
  id: string;
  clabe: string;           // 18 dígitos
  bank: string;            // ej: "STP"
  beneficiary: string;     // nombre del beneficiario registrado en Openpay
};

export type OpenpayCharge = {
  id: string;
  status: string;          // "in_progress" | "completed" | "failed" | "cancelled"
  amount: number;
  order_id: string;
  method: string;          // "store" | "bank_account"
};

// ─── Funciones públicas ───────────────────────────────────────────────────────

type ChargeCustomer = { name: string; email: string };

/**
 * Crea un cargo OXXO (método "store").
 * Devuelve la referencia numérica que el cliente presenta en caja.
 */
export async function createOxxoCharge(params: {
  amount: number;
  order_id: string;
  customer: ChargeCustomer;
  description: string;
}): Promise<OpenpayOxxoResult> {
  const raw = await openpayPost<{
    id: string;
    payment_method: { reference: string; due_date: string };
  }>("/charges", {
    method: "store",
    amount: params.amount,
    currency: "MXN",
    description: params.description,
    order_id: params.order_id,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
    },
  });

  return {
    id: raw.id,
    reference: raw.payment_method.reference,
    due_date: raw.payment_method.due_date,
  };
}

/**
 * Crea un cargo SPEI (método "bank_account").
 * Devuelve la CLABE interbancaria, banco y beneficiario.
 */
export async function createSpeiCharge(params: {
  amount: number;
  order_id: string;
  customer: ChargeCustomer;
  description: string;
}): Promise<OpenpaySpeiResult> {
  const raw = await openpayPost<{
    id: string;
    payment_method: { clabe: string; bank: string; name: string };
  }>("/charges", {
    method: "bank_account",
    amount: params.amount,
    currency: "MXN",
    description: params.description,
    order_id: params.order_id,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
    },
  });

  return {
    id: raw.id,
    clabe: raw.payment_method.clabe,
    bank: raw.payment_method.bank,
    beneficiary: raw.payment_method.name,
  };
}

/**
 * Obtiene el estado de un cargo de Openpay.
 * Usado por el webhook para verificar autenticidad antes de completar el cart.
 */
export async function getCharge(charge_id: string): Promise<OpenpayCharge> {
  const raw = await openpayGet<{
    id: string;
    status: string;
    amount: number;
    order_id: string;
    method: string;
  }>(`/charges/${charge_id}`);

  return {
    id: raw.id,
    status: raw.status,
    amount: raw.amount,
    order_id: raw.order_id,
    method: raw.method,
  };
}
```

- [ ] **Step 2: Verificar que TypeScript no reporta errores**

```bash
cd apps/storefront && pnpm run build 2>&1 | grep "openpay-server"
```

Esperado: sin errores referentes a `openpay-server.ts`.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/lib/openpay-server.ts
git commit -m "feat(payments): add server-side Openpay REST client for OXXO/SPEI"
```

---

## Task 2: API Route — POST /api/openpay/oxxo

**Files:**
- Crear: `apps/storefront/app/api/openpay/oxxo/route.ts`

- [ ] **Step 1: Crear el archivo**

```typescript
// apps/storefront/app/api/openpay/oxxo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createOxxoCharge } from "@/lib/openpay-server";

const resend = new Resend(process.env.RESEND_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart_id, amount, customer } = body as {
      cart_id: string;
      amount: number;
      customer: { name: string; email: string };
    };

    if (!cart_id || !amount || !customer?.name || !customer?.email) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    // 1. Crear cargo OXXO en Openpay
    const charge = await createOxxoCharge({
      amount,
      order_id: cart_id,
      customer,
      description: "Pedido Novapatch",
    });

    // 2. Enviar email con la referencia
    await resend.emails.send({
      from: "Novapatch <hola@novapatch.care>",
      to: customer.email,
      subject: "Tu referencia OXXO — Novapatch",
      html: buildOxxoEmail({
        name: customer.name,
        reference: charge.reference,
        amount,
        due_date: charge.due_date,
      }),
    });

    // 3. Devolver datos al frontend
    return NextResponse.json({
      reference: charge.reference,
      due_date: charge.due_date,
      charge_id: charge.id,
    });
  } catch (err) {
    console.error("[oxxo] Error:", err);
    const msg = err instanceof Error ? err.message : "Error al generar referencia OXXO.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function fmtMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);
}

function buildOxxoEmail(params: {
  name: string;
  reference: string;
  amount: number;
  due_date: string;
}): string {
  const { name, reference, amount, due_date } = params;
  // Formatear fecha límite
  const deadline = new Date(due_date).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B35;">
      <div style="background: #0D1B35; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <img src="https://novapatch.care/logos/logowht.webp" alt="Novapatch" height="32" style="display:block;" />
      </div>
      <div style="background: #FAF7F2; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
        <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #0D1B35;">Tu referencia OXXO está lista</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #6B7280; line-height: 1.6;">
          Hola <strong style="color: #0D1B35;">${name}</strong>, tienes hasta el <strong style="color: #0D1B35;">${deadline}</strong> para pagar en cualquier tienda OXXO.
        </p>

        <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 16px;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">Referencia OXXO</p>
          <p style="margin: 0; font-size: 28px; font-weight: 900; color: #0D1B35; letter-spacing: 0.14em;">${reference}</p>
        </div>

        <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #9CA3AF;">Monto a pagar</span>
          <span style="font-size: 18px; font-weight: 800; color: #E8503A;">${fmtMXN(amount)}</span>
        </div>

        <div style="margin-bottom: 24px;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">¿Cómo pagar?</p>
          <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
            <div style="padding: 12px 16px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #0D1B35;">
              <strong style="color: #E8503A;">1.</strong> Ve a cualquier tienda OXXO en México
            </div>
            <div style="padding: 12px 16px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #0D1B35;">
              <strong style="color: #E8503A;">2.</strong> Dile al cajero "pago de servicio" y da la referencia
            </div>
            <div style="padding: 12px 16px; font-size: 13px; color: #0D1B35;">
              <strong style="color: #E8503A;">3.</strong> Guarda tu ticket — te confirmaremos el pedido por email
            </div>
          </div>
        </div>

        <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
          ¿Dudas? Escríbenos a <a href="mailto:hola@novapatch.care" style="color: #E8503A; text-decoration: none;">hola@novapatch.care</a>
        </p>
      </div>
    </div>
  `;
}
```

- [ ] **Step 2: Verificar compilación**

```bash
cd apps/storefront && pnpm run build 2>&1 | grep -E "oxxo|error"
```

Esperado: sin errores.

- [ ] **Step 3: Test manual con curl (sandbox)**

Con el servidor corriendo (`pnpm run dev`):

```bash
curl -X POST http://localhost:3000/api/openpay/oxxo \
  -H "Content-Type: application/json" \
  -d '{
    "cart_id": "test_cart_123",
    "amount": 100,
    "customer": { "name": "Test User", "email": "tu@email.com" }
  }'
```

Esperado: `{ "reference": "XXXX...", "due_date": "...", "charge_id": "..." }` y email en el correo especificado.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/app/api/openpay/oxxo/route.ts
git commit -m "feat(payments): add POST /api/openpay/oxxo — creates OXXO charge and sends email"
```

---

## Task 3: API Route — POST /api/openpay/spei

**Files:**
- Crear: `apps/storefront/app/api/openpay/spei/route.ts`

- [ ] **Step 1: Crear el archivo**

```typescript
// apps/storefront/app/api/openpay/spei/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSpeiCharge } from "@/lib/openpay-server";

const resend = new Resend(process.env.RESEND_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart_id, amount, customer } = body as {
      cart_id: string;
      amount: number;
      customer: { name: string; email: string };
    };

    if (!cart_id || !amount || !customer?.name || !customer?.email) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    // 1. Crear cargo SPEI en Openpay
    const charge = await createSpeiCharge({
      amount,
      order_id: cart_id,
      customer,
      description: "Pedido Novapatch",
    });

    // 2. Enviar email con la CLABE
    await resend.emails.send({
      from: "Novapatch <hola@novapatch.care>",
      to: customer.email,
      subject: "Datos para tu transferencia SPEI — Novapatch",
      html: buildSpeiEmail({
        name: customer.name,
        clabe: charge.clabe,
        bank: charge.bank,
        beneficiary: charge.beneficiary,
        amount,
      }),
    });

    // 3. Devolver datos al frontend
    return NextResponse.json({
      clabe: charge.clabe,
      bank: charge.bank,
      beneficiary: charge.beneficiary,
      charge_id: charge.id,
    });
  } catch (err) {
    console.error("[spei] Error:", err);
    const msg = err instanceof Error ? err.message : "Error al generar CLABE SPEI.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function fmtMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);
}

function buildSpeiEmail(params: {
  name: string;
  clabe: string;
  bank: string;
  beneficiary: string;
  amount: number;
}): string {
  const { name, clabe, bank, beneficiary, amount } = params;
  // Formatear CLABE con espacios cada 4 dígitos para legibilidad
  const clabeFormatted = clabe.replace(/(\d{4})/g, "$1 ").trim();

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B35;">
      <div style="background: #0D1B35; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <img src="https://novapatch.care/logos/logowht.webp" alt="Novapatch" height="32" style="display:block;" />
      </div>
      <div style="background: #FAF7F2; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
        <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #0D1B35;">Datos para tu transferencia SPEI</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #6B7280; line-height: 1.6;">
          Hola <strong style="color: #0D1B35;">${name}</strong>, realiza la transferencia con los siguientes datos. Tu pedido se confirma al recibir el pago.
        </p>

        <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; padding: 20px; margin-bottom: 16px;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">CLABE interbancaria</p>
          <p style="margin: 0 0 16px; font-size: 22px; font-weight: 900; color: #0D1B35; letter-spacing: 0.08em;">${clabeFormatted}</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #9CA3AF; font-weight: 600; width: 120px;">Banco</td>
              <td style="padding: 6px 0; color: #0D1B35; font-weight: 700;">${bank}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9CA3AF; font-weight: 600;">Beneficiario</td>
              <td style="padding: 6px 0; color: #0D1B35; font-weight: 700;">${beneficiary}</td>
            </tr>
          </table>
        </div>

        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 10px; padding: 14px 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #92400E;">Monto exacto a transferir</p>
          <p style="margin: 0 0 6px; font-size: 22px; font-weight: 900; color: #92400E;">${fmtMXN(amount)}</p>
          <p style="margin: 0; font-size: 12px; color: #92400E;">⚠️ Transfiere el monto exacto o el pago no se acreditará automáticamente.</p>
        </div>

        <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
          ¿Dudas? Escríbenos a <a href="mailto:hola@novapatch.care" style="color: #E8503A; text-decoration: none;">hola@novapatch.care</a>
        </p>
      </div>
    </div>
  `;
}
```

- [ ] **Step 2: Test manual con curl (sandbox)**

```bash
curl -X POST http://localhost:3000/api/openpay/spei \
  -H "Content-Type: application/json" \
  -d '{
    "cart_id": "test_cart_456",
    "amount": 100,
    "customer": { "name": "Test User", "email": "tu@email.com" }
  }'
```

Esperado: `{ "clabe": "...", "bank": "STP", "beneficiary": "...", "charge_id": "..." }` y email en el correo especificado.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/app/api/openpay/spei/route.ts
git commit -m "feat(payments): add POST /api/openpay/spei — creates SPEI charge and sends email"
```

---

## Task 4: API Route — POST /api/openpay/webhook

**Files:**
- Crear: `apps/storefront/app/api/openpay/webhook/route.ts`

- [ ] **Step 1: Crear el archivo**

```typescript
// apps/storefront/app/api/openpay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCharge } from "@/lib/openpay-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ignorar eventos que no sean charge.succeeded
    if (body?.type !== "charge.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const transaction = body?.transaction as {
      id?: string;
      order_id?: string;
      status?: string;
    } | undefined;

    const charge_id = transaction?.id;
    const cart_id   = transaction?.order_id;

    if (!charge_id || !cart_id) {
      console.warn("[webhook] Payload incompleto:", body);
      return NextResponse.json({ ok: true });
    }

    // Verificar autenticidad: consultar el cargo directamente a Openpay
    const charge = await getCharge(charge_id);

    if (charge.status !== "completed") {
      console.warn("[webhook] Cargo no completado:", charge_id, charge.status);
      return NextResponse.json({ ok: true });
    }

    if (charge.order_id !== cart_id) {
      console.warn("[webhook] order_id mismatch:", charge.order_id, "!=", cart_id);
      return NextResponse.json({ ok: true });
    }

    // Completar cart en Medusa (server-side fetch — no usar lib/medusa.ts que usa localStorage)
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
    const medusaKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

    const medusaRes = await fetch(`${medusaUrl}/store/carts/${cart_id}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": medusaKey,
      },
      body: JSON.stringify({}),
    });

    if (!medusaRes.ok) {
      const errBody = await medusaRes.json().catch(() => ({}));
      // Si el cart ya fue completado (idempotencia), loguear pero no fallar
      if (medusaRes.status === 404 || medusaRes.status === 422) {
        console.warn("[webhook] Cart ya completado o no encontrado:", cart_id, errBody);
        return NextResponse.json({ ok: true });
      }
      console.error("[webhook] Medusa completeCart error:", medusaRes.status, errBody);
      // Devolver 500 para que Openpay reintente el webhook
      return NextResponse.json({ error: "Error completando cart" }, { status: 500 });
    }

    console.log("[webhook] Cart completado exitosamente:", cart_id);
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[webhook] Error inesperado:", err);
    // Devolver 200 para evitar reintentos infinitos en errores de parseo
    return NextResponse.json({ ok: true });
  }
}
```

- [ ] **Step 2: Verificar compilación**

```bash
cd apps/storefront && pnpm run build 2>&1 | grep -E "webhook|error"
```

Esperado: sin errores.

- [ ] **Step 3: Configurar webhook en el dashboard de Openpay**

En el dashboard de Openpay (sandbox: `https://sandbox-dashboard.openpay.mx`):
- Ir a **Configuración → Webhooks**
- Agregar URL: `https://tu-dominio.vercel.app/api/openpay/webhook`
- Evento a suscribir: `charge.succeeded`

Para testing local, usar **ngrok** o similar para exponer `localhost:3000`.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/app/api/openpay/webhook/route.ts
git commit -m "feat(payments): add POST /api/openpay/webhook — completes Medusa cart on Openpay confirmation"
```

---

## Task 5: Componente PaymentMethodSelector

**Files:**
- Crear: `apps/storefront/components/PaymentMethodSelector.tsx`

- [ ] **Step 1: Crear el componente**

```typescript
// apps/storefront/components/PaymentMethodSelector.tsx
"use client";

type PaymentMethod = "card" | "oxxo" | "spei";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  hasSubscriptionItems: boolean;
}

export function PaymentMethodSelector({
  value,
  onChange,
  hasSubscriptionItems,
}: PaymentMethodSelectorProps) {
  const methods: { id: PaymentMethod; label: string; hint?: string; badge?: string[] }[] = [
    {
      id: "card",
      label: "Tarjeta de crédito / débito",
      badge: ["VISA", "MC", "AMEX"],
    },
    {
      id: "oxxo",
      label: "Efectivo en OXXO",
      hint: "Solo compras únicas",
    },
    {
      id: "spei",
      label: "Transferencia SPEI",
      hint: "Solo compras únicas",
    },
  ];

  return (
    <div className="flex flex-col gap-2 mb-5">
      {methods.map((m) => {
        const disabled = hasSubscriptionItems && m.id !== "card";
        const selected = value === m.id;

        return (
          <label
            key={m.id}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              disabled
                ? "opacity-50 cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB]"
                : selected
                ? "border-[#E8503A] bg-white shadow-sm"
                : "border-[#E5E7EB] bg-white hover:border-[#005088]/30"
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              value={m.id}
              checked={selected}
              disabled={disabled}
              onChange={() => !disabled && onChange(m.id)}
              className="accent-[#E8503A] w-4 h-4 flex-shrink-0"
            />
            <span className="font-semibold text-[14px] text-[#005088] flex-1">{m.label}</span>
            {m.badge && (
              <span className="flex items-center gap-1.5">
                {m.badge.map((b) => (
                  <span
                    key={b}
                    className="px-2 py-0.5 rounded-md border border-[#E5E7EB] text-[10px] font-black text-[#6B7280] bg-[#F9FAFB]"
                  >
                    {b}
                  </span>
                ))}
              </span>
            )}
            {m.hint && (
              <span className="text-[11px] text-[#9CA3AF] flex-shrink-0">{m.hint}</span>
            )}
          </label>
        );
      })}

      {hasSubscriptionItems && (
        <p className="text-[12px] text-[#92400E] bg-[#FEF3C7] border border-[#F59E0B] rounded-lg px-3 py-2.5 mt-1">
          ⚠️ Tu pedido incluye una suscripción. OXXO y SPEI solo están disponibles para compras únicas.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```bash
cd apps/storefront && pnpm run build 2>&1 | grep "PaymentMethodSelector"
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/components/PaymentMethodSelector.tsx
git commit -m "feat(checkout): add PaymentMethodSelector component — card/OXXO/SPEI with subscription guard"
```

---

## Task 6: Componente PendingPaymentModal

**Files:**
- Crear: `apps/storefront/components/PendingPaymentModal.tsx`

- [ ] **Step 1: Crear el componente**

```typescript
// apps/storefront/components/PendingPaymentModal.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function fmt(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);
}

// Formatea referencia OXXO en grupos de 4: "9282330080700003" → "9282 3300 8070 0003"
function fmtReference(ref: string): string {
  return ref.replace(/(\d{4})/g, "$1 ").trim();
}

// Formatea CLABE en grupos de 4: "646180000275643908" → "6461 8000 0275 6439 08"
function fmtClabe(clabe: string): string {
  return clabe.replace(/(\d{4})(?=\d)/g, "$1 ");
}

interface PendingPaymentModalProps {
  open: boolean;
  method: "oxxo" | "spei";
  // OXXO
  reference?: string;
  due_date?: string;
  // SPEI
  clabe?: string;
  bank?: string;
  beneficiary?: string;
  // Común
  amount: number;
  onClose: () => void;
}

export function PendingPaymentModal({
  open,
  method,
  reference,
  due_date,
  clabe,
  bank,
  beneficiary,
  amount,
  onClose,
}: PendingPaymentModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="pending-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,27,53,0.7)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            key="pending-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#9CA3AF] hover:text-[#0D1B35] hover:bg-[#F3F4F6] transition-colors z-10"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <div className="p-6 pt-10">
              {method === "oxxo" ? (
                <OxxoContent reference={reference!} amount={amount} due_date={due_date} />
              ) : (
                <SpeiContent clabe={clabe!} bank={bank!} beneficiary={beneficiary!} amount={amount} />
              )}

              <p className="text-[11px] text-[#9CA3AF] text-center mt-4">
                📧 También enviamos esta información a tu correo
              </p>

              <button
                onClick={onClose}
                className="mt-4 w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
                style={{ background: "#E8503A" }}
              >
                {method === "oxxo" ? "Entendido, iré a pagar" : "Entendido, haré la transferencia"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OxxoContent({
  reference,
  amount,
  due_date,
}: {
  reference: string;
  amount: number;
  due_date?: string;
}) {
  const deadline = due_date
    ? new Date(due_date).toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "72 horas";

  return (
    <>
      <div className="text-center mb-5">
        <div className="text-4xl mb-2">🏪</div>
        <h3 className="text-[18px] font-black text-[#0D1B35] mb-1">Paga en OXXO</h3>
        <p className="text-[13px] text-[#6B7280]">
          Tienes hasta el <strong className="text-[#0D1B35]">{deadline}</strong>
        </p>
      </div>

      <div className="bg-[#FAF7F2] rounded-xl p-4 text-center mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1.5">
          Referencia de pago
        </p>
        <p className="text-[26px] font-black text-[#0D1B35] tracking-widest leading-none">
          {fmtReference(reference)}
        </p>
      </div>

      <div className="bg-[#FEF3C7] rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#92400E]">Monto a pagar</span>
        <span className="text-[15px] font-black text-[#92400E]">{fmt(amount)}</span>
      </div>

      <div className="text-[12px] text-[#475569] space-y-1.5">
        <p className="font-semibold text-[#0D1B35] mb-2">¿Cómo pagar?</p>
        <p>1. Ve a cualquier tienda OXXO</p>
        <p>2. Dile al cajero "pago de servicio"</p>
        <p>3. Proporciona la referencia y conserva tu ticket</p>
      </div>
    </>
  );
}

function SpeiContent({
  clabe,
  bank,
  beneficiary,
  amount,
}: {
  clabe: string;
  bank: string;
  beneficiary: string;
  amount: number;
}) {
  return (
    <>
      <div className="text-center mb-5">
        <div className="text-4xl mb-2">🏦</div>
        <h3 className="text-[18px] font-black text-[#0D1B35] mb-1">Transfiere por SPEI</h3>
        <p className="text-[13px] text-[#6B7280]">Tu pedido se confirma al recibir la transferencia</p>
      </div>

      <div className="bg-[#FAF7F2] rounded-xl p-4 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1.5">
          CLABE interbancaria
        </p>
        <p className="text-[18px] font-black text-[#0D1B35] tracking-wider leading-none mb-3">
          {fmtClabe(clabe)}
        </p>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div>
            <span className="text-[#9CA3AF]">Banco</span>
            <p className="font-bold text-[#0D1B35]">{bank}</p>
          </div>
          <div>
            <span className="text-[#9CA3AF]">Beneficiario</span>
            <p className="font-bold text-[#0D1B35] truncate">{beneficiary}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-xl px-4 py-3 mb-4">
        <p className="text-[13px] font-semibold text-[#92400E]">Monto exacto</p>
        <p className="text-[18px] font-black text-[#92400E]">{fmt(amount)}</p>
        <p className="text-[11px] text-[#92400E] mt-1">
          ⚠️ Transfiere el monto exacto o el pago no se acreditará
        </p>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```bash
cd apps/storefront && pnpm run build 2>&1 | grep "PendingPaymentModal"
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/components/PendingPaymentModal.tsx
git commit -m "feat(checkout): add PendingPaymentModal — shows OXXO reference or SPEI CLABE after checkout"
```

---

## Task 7: Integrar en checkout/page.tsx

**Files:**
- Modificar: `apps/storefront/app/[locale]/checkout/page.tsx`

Este es el task más complejo — son 4 cambios puntuales en el archivo existente.

### 7a — Agregar imports y tipos

- [ ] **Step 1: Agregar imports al inicio del archivo** (después de los imports existentes de lucide-react, línea ~37)

```typescript
// Agregar después de los imports existentes de lucide-react:
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { PendingPaymentModal } from "@/components/PendingPaymentModal";
```

- [ ] **Step 2: Agregar tipos para el resultado pendiente** (antes de la función `CheckoutPage`, después de la función `fmt`)

```typescript
// Agregar después de la función fmt() (~línea 47):
type OxxoResult = { reference: string; due_date: string; charge_id: string };
type SpeiResult = { clabe: string; bank: string; beneficiary: string; charge_id: string };
type PendingPayment =
  | { method: "oxxo"; data: OxxoResult }
  | { method: "spei"; data: SpeiResult };
```

### 7b — Agregar estados nuevos

- [ ] **Step 3: Agregar estado `paymentMethod` y `pendingPayment`** (después de `const [paymentStep, setPaymentStep] = useState<number>(0);`, ~línea 354)

```typescript
// Agregar después de:  const [paymentStep, setPaymentStep] = useState<number>(0);
const [paymentMethod, setPaymentMethod] = useState<"card" | "oxxo" | "spei">("card");
const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
```

### 7c — Actualizar validate()

- [ ] **Step 4: Hacer los campos de tarjeta opcionales cuando el método no es "card"**

Localizar la función `validate()` (~línea 496). Dentro de ella, reemplazar las 4 validaciones de tarjeta:

```typescript
// ANTES (líneas ~514-519):
if (!card.number.replace(/\s/g, "") || card.number.replace(/\s/g, "").length < 15)
  e.cardNumber = "Número inválido";
if (!card.name.trim()) e.cardName = "Requerido";
if (!card.expiry.trim() || !/^\d{2}\/\d{2}$/.test(card.expiry))
  e.expiry = "MM/AA";
if (!card.cvv.trim() || card.cvv.length < 3) e.cvv = "Requerido";
```

```typescript
// DESPUÉS:
if (paymentMethod === "card") {
  if (!card.number.replace(/\s/g, "") || card.number.replace(/\s/g, "").length < 15)
    e.cardNumber = "Número inválido";
  if (!card.name.trim()) e.cardName = "Requerido";
  if (!card.expiry.trim() || !/^\d{2}\/\d{2}$/.test(card.expiry))
    e.expiry = "MM/AA";
  if (!card.cvv.trim() || card.cvv.length < 3) e.cvv = "Requerido";
}
```

### 7d — Actualizar handleSubmit()

- [ ] **Step 5: Reemplazar el bloque de tokenización** (Paso 1 del submit, ~líneas 537-556) para que solo ejecute si `paymentMethod === "card"`

```typescript
// ANTES (líneas ~537-556):
// ── Paso 1: Verificando tarjeta ──────────────────────────────────────
setPaymentStep(1);
const device_session_id = getDeviceSessionId("checkout-form") ?? "dev_session";

let openpay_token_id: string;
try {
  openpay_token_id = await tokenizeCard(
    parseCardForm(card.number, card.name, card.expiry, card.cvv)
  );
} catch (err) {
  const msg = err instanceof Error ? err.message : "Error en tarjeta";
  if (process.env.NODE_ENV === "development") {
    console.warn("[Checkout] Openpay en modo dev, usando token mock");
    openpay_token_id = "tok_dev_mock";
  } else {
    setSubmitError(msg);
    setSubmitting(false);
    return;
  }
}
```

```typescript
// DESPUÉS:
// ── Paso 1: Verificando tarjeta (solo si método es tarjeta) ──────────
let openpay_token_id: string = "";
let device_session_id: string = "dev_session";

if (paymentMethod === "card") {
  setPaymentStep(1);
  device_session_id = getDeviceSessionId("checkout-form") ?? "dev_session";
  try {
    openpay_token_id = await tokenizeCard(
      parseCardForm(card.number, card.name, card.expiry, card.cvv)
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en tarjeta";
    if (process.env.NODE_ENV === "development") {
      console.warn("[Checkout] Openpay en modo dev, usando token mock");
      openpay_token_id = "tok_dev_mock";
    } else {
      setSubmitError(msg);
      setSubmitting(false);
      return;
    }
  }
}
```

- [ ] **Step 6: Agregar el flujo OXXO/SPEI después del bloque de `completeCart`** (~línea 608-613)

Localizar el Paso 4 del submit (línea ~607-613):

```typescript
// ── Paso 4: Procesando cobro ────────────────────────────────────────
setPaymentStep(4);
await medusa.checkout.completeCart(cart_id, openpay_token_id, contact.email, device_session_id);
```

Reemplazar con:

```typescript
// ── Paso 4: Procesando cobro ────────────────────────────────────────
setPaymentStep(4);

if (paymentMethod === "card") {
  await medusa.checkout.completeCart(cart_id, openpay_token_id, contact.email, device_session_id);
} else if (paymentMethod === "oxxo") {
  const res = await fetch("/api/openpay/oxxo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart_id: cart_id!,
      amount: finalTotal,
      customer: { name: contact.name, email: contact.email },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Error al generar referencia OXXO");
  }
  const oxxoData: OxxoResult = await res.json();
  setPendingPayment({ method: "oxxo", data: oxxoData });
  setSubmitting(false);
  return; // No limpiar carrito aquí — el cart persiste hasta que webhook confirme
} else if (paymentMethod === "spei") {
  const res = await fetch("/api/openpay/spei", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart_id: cart_id!,
      amount: finalTotal,
      customer: { name: contact.name, email: contact.email },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Error al generar CLABE SPEI");
  }
  const speiData: SpeiResult = await res.json();
  setPendingPayment({ method: "spei", data: speiData });
  setSubmitting(false);
  return; // No limpiar carrito aquí — el cart persiste hasta que webhook confirme
}
```

### 7e — Actualizar la sección de pago en el JSX

- [ ] **Step 7: Reemplazar las card brand logos y agregar `PaymentMethodSelector`**

Localizar el bloque de card brand logos (~línea 1039-1050):

```typescript
// ANTES:
{/* card brand logos */}
<div className="flex items-center gap-2 mb-5">
  {["VISA", "MC", "AMEX"].map((b) => (
    <span
      key={b}
      className="px-2.5 py-1 rounded-md border border-[#E5E7EB] text-[10px] font-black text-[#6B7280] bg-[#F9FAFB]"
    >
      {b}
    </span>
  ))}
  <span className="text-[11px] text-[#9CA3AF] ml-1">Vía Openpay</span>
</div>
```

```typescript
// DESPUÉS:
<PaymentMethodSelector
  value={paymentMethod}
  onChange={setPaymentMethod}
  hasSubscriptionItems={hasSubscriptions}
/>
```

- [ ] **Step 8: Envolver los campos de tarjeta en condicional**

Localizar el `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">` que contiene los campos de tarjeta (~línea 1052) y envolverlo:

```typescript
// ANTES:
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* campos de tarjeta */}
</div>
```

```typescript
// DESPUÉS:
{paymentMethod === "card" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* campos de tarjeta — sin cambios internos */}
  </div>
)}
```

### 7f — Agregar el modal al JSX

- [ ] **Step 9: Agregar `<PendingPaymentModal>` antes del cierre del componente**

Localizar el cierre del return del componente (`</div>` final, antes de los últimos `}`). Agregar el modal justo antes del último `</div>` del `min-h-screen`:

```typescript
{/* Modal de pago pendiente — OXXO o SPEI */}
<PendingPaymentModal
  open={pendingPayment !== null}
  method={pendingPayment?.method ?? "oxxo"}
  reference={pendingPayment?.method === "oxxo" ? pendingPayment.data.reference : undefined}
  due_date={pendingPayment?.method === "oxxo" ? pendingPayment.data.due_date : undefined}
  clabe={pendingPayment?.method === "spei" ? pendingPayment.data.clabe : undefined}
  bank={pendingPayment?.method === "spei" ? pendingPayment.data.bank : undefined}
  beneficiary={pendingPayment?.method === "spei" ? pendingPayment.data.beneficiary : undefined}
  amount={finalTotal}
  onClose={() => {
    setPendingPayment(null);
    clearCart();
    router.push("/");
  }}
/>
```

- [ ] **Step 10: Verificar compilación completa**

```bash
cd apps/storefront && pnpm run build
```

Esperado: build exitoso sin errores de TypeScript.

- [ ] **Step 11: Verificar flujo en browser**

1. Correr `pnpm run dev`
2. Agregar un producto al carrito y ir al checkout
3. Verificar que el selector de métodos de pago aparece en la sección "Datos de pago"
4. Seleccionar OXXO → verificar que los campos de tarjeta desaparecen
5. Seleccionar SPEI → verificar que los campos de tarjeta desaparecen
6. Agregar un producto en modo suscripción y verificar que OXXO/SPEI se deshabilitan con el aviso

- [ ] **Step 12: Commit**

```bash
git add apps/storefront/app/[locale]/checkout/page.tsx
git commit -m "feat(checkout): integrate OXXO and SPEI payment methods with modal and Openpay API"
```

---

## Task 8: Configurar webhook en Openpay y verificar flujo end-to-end

**Files:** Ninguno (configuración externa + test)

- [ ] **Step 1: Exponer localhost con ngrok para testing**

```bash
ngrok http 3000
# Copiar la URL HTTPS que genera ngrok, ej: https://abc123.ngrok.io
```

- [ ] **Step 2: Registrar webhook en Openpay sandbox**

- Ir a `https://sandbox-dashboard.openpay.mx`
- Configuración → Webhooks → Agregar
- URL: `https://abc123.ngrok.io/api/openpay/webhook`
- Evento: `charge.succeeded`
- Guardar y verificar que Openpay muestra el webhook como activo

- [ ] **Step 3: Realizar pago de prueba con OXXO**

1. Ir al checkout en `http://localhost:3000`
2. Seleccionar OXXO como método de pago
3. Completar el formulario y hacer click en "Confirmar pedido"
4. Verificar que el modal aparece con la referencia OXXO
5. Verificar que llega el email con la referencia

- [ ] **Step 4: Simular confirmación de pago en Openpay sandbox**

En el dashboard de Openpay sandbox, ir al cargo creado y usar el botón "Simular pago" o cambiar su estado a `completed`. Verificar en los logs del servidor Next.js que:

```
[webhook] Cart completado exitosamente: cart_01JR...
```

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat(payments): OXXO and SPEI checkout complete — Openpay integration with webhook"
```
