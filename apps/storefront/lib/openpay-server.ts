import "server-only";

const MERCHANT_ID = process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID ?? "";
const PRIVATE_KEY = process.env.OPENPAY_PRIVATE_KEY ?? "";
const SANDBOX     = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";

if (!PRIVATE_KEY) {
  throw new Error(
    "[openpay-server] OPENPAY_PRIVATE_KEY is not set. Add it to .env.local (server-only, never NEXT_PUBLIC_)."
  );
}
if (!MERCHANT_ID) {
  throw new Error(
    "[openpay-server] NEXT_PUBLIC_OPENPAY_MERCHANT_ID is not set."
  );
}

const BASE_URL = SANDBOX
  ? `https://sandbox-api.openpay.mx/v1/${MERCHANT_ID}`
  : `https://api.openpay.mx/v1/${MERCHANT_ID}`;

// HTTP Basic Auth: base64(private_key + ":")
function authHeader(): string {
  const creds = Buffer.from(`${PRIVATE_KEY}:`).toString("base64");
  return `Basic ${creds}`;
}

// ─── Error Handling ───────────────────────────────────────────────────────────

export class OpenpayApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errorCode?: string | number
  ) {
    super(message);
    this.name = "OpenpayApiError";
  }
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
    throw new OpenpayApiError(String(msg), res.status, data?.error_code);
  }

  return data as T;
}

async function openpayGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: authHeader() },
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.description ?? data?.error_code ?? "Error Openpay";
    throw new OpenpayApiError(String(msg), res.status, data?.error_code);
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

export type OpenpayChargeStatus = "in_progress" | "completed" | "failed" | "cancelled";

export type OpenpayCharge = {
  id: string;
  status: OpenpayChargeStatus;
  amount: number;
  order_id: string;
  method: string;
};

export type ChargeCustomer = { name: string; email: string };

// ─── Funciones públicas ───────────────────────────────────────────────────────

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
    status: OpenpayChargeStatus;
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
