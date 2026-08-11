/**
 * lib/mercadopago.ts — Wrapper para el SDK de MercadoPago v2 (frontend)
 *
 * El SDK se carga dinámicamente desde sdk.mercadopago.com/js/v2 solo cuando
 * el carrito es de la región AR (currency_code === "ars").
 *
 * Credenciales en .env.local:
 *   NEXT_PUBLIC_MP_PUBLIC_KEY = APP_USR-...
 *
 * Flujo:
 *   1. loadMercadoPago() — carga el script y devuelve la instancia
 *   2. tokenizeCardMP(cardData) → mp_card_token (ej: "abc123...")
 *   3. mp_card_token se envía a Medusa: POST /store/carts/:id/complete
 */

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale?: string }
    ) => MPInstance;
  }
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

type MPInstance = {
  createCardToken(data: MPCardData): Promise<MPTokenResponse>;
};

export type MPCardData = {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string; // "MM"
  cardExpirationYear: string;  // "YY"
  securityCode: string;
  identificationType?: string;
  identificationNumber?: string;
};

type MPTokenResponse = {
  id: string;
  public_key: string;
  card_id: string | null;
  luhn_validation: boolean;
  status: string;
  date_used: string | null;
  card_number_length: number;
  date_created: string;
  first_six_digits: string;
  last_four_digits: string;
  security_code_length: number;
  expiration_month: number;
  expiration_year: number;
  date_last_updated: string;
  date_due: string;
  live_mode: boolean;
  cardholder: { identification: { number: string; type: string }; name: string };
};

// ─── Estado de instancia (módulo-level cache) ─────────────────────────────────

let mpInstance: MPInstance | null = null;
let scriptLoading: Promise<void> | null = null;

// ─── Carga dinámica del script ────────────────────────────────────────────────

function loadScript(): Promise<void> {
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("SSR: MercadoPago SDK solo disponible en el browser"));
      return;
    }

    if (window.MercadoPago) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("No se pudo cargar el SDK de MercadoPago"));
    document.head.appendChild(script);
  });

  return scriptLoading;
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * Carga el SDK y devuelve la instancia inicializada.
 * Cachea la instancia — llamadas posteriores son instantáneas.
 */
export async function loadMercadoPago(country = "mx"): Promise<MPInstance> {
  if (mpInstance) return mpInstance;
  await loadScript();

  // Next.js only inlines statically-referenced NEXT_PUBLIC_* vars; a computed
  // key resolves to undefined in the browser, so reference each one statically.
  const keyByCountry: Record<string, string | undefined> = {
    mx: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY_MX,
    ar: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY_AR,
  };
  const cc = country.toLowerCase();
  const publicKey = keyByCountry[cc] ?? process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error(`[MercadoPago] Falta NEXT_PUBLIC_MP_PUBLIC_KEY_${cc.toUpperCase()} en .env.local`);
  }
  if (!window.MercadoPago) {
    throw new Error("[MercadoPago] window.MercadoPago no disponible tras cargar el script");
  }
  const locale = country === "ar" ? "es-AR" : "es-MX";
  mpInstance = new window.MercadoPago(publicKey, { locale });
  return mpInstance;
}

/**
 * Tokeniza la tarjeta con el SDK de MercadoPago.
 * Los datos van directo a los servidores de MP (PCI-DSS).
 * Devuelve el mp_card_token que se envía a Medusa.
 */
export async function tokenizeCardMP(cardData: MPCardData, country = "mx"): Promise<string> {
  const mp = await loadMercadoPago(country);

  try {
    const response = await mp.createCardToken(cardData);
    return response.id;
  } catch (err) {
    console.error("[MercadoPago] Error tokenizando tarjeta:", err);
    throw new Error(translateMPError(err));
  }
}

/**
 * Parsea los datos del formulario al formato que espera MP.
 */
export function parseCardFormMP(
  number: string,
  name: string,
  expiry: string,
  cvv: string,
  dni?: string
): MPCardData {
  const [month = "", year = ""] = expiry.split("/");
  const base: MPCardData = {
    cardNumber: number.replace(/\s/g, ""),
    cardholderName: name.trim(),
    cardExpirationMonth: month.trim(),
    cardExpirationYear: year.trim(),
    securityCode: cvv.trim(),
  };
  const digits = (dni ?? "").replace(/\D/g, "");
  if (digits) {
    base.identificationType = "DNI";
    base.identificationNumber = digits;
  }
  return base;
}

// ─── Traducción de errores ────────────────────────────────────────────────────

function translateMPError(err: unknown): string {
  const cause = (err as { cause?: { message?: string } })?.cause?.message ?? "";
  const message = err instanceof Error ? err.message : String(err);

  if (cause.includes("205") || message.includes("205"))
    return "Ingresá el número de tarjeta.";
  if (cause.includes("208") || message.includes("208"))
    return "Ingresá el mes de vencimiento.";
  if (cause.includes("209") || message.includes("209"))
    return "Ingresá el año de vencimiento.";
  if (cause.includes("212") || message.includes("212"))
    return "Ingresá tu tipo de documento.";
  if (cause.includes("214") || message.includes("214"))
    return "Ingresá tu número de documento.";
  if (cause.includes("220") || message.includes("220"))
    return "Ingresá tu banco emisor.";
  if (cause.includes("221") || message.includes("221"))
    return "Ingresá el nombre del titular tal como aparece en la tarjeta.";
  if (cause.includes("224") || message.includes("224"))
    return "Ingresá el código de seguridad.";
  if (cause.includes("E301") || message.includes("E301"))
    return "Número de tarjeta inválido.";
  if (cause.includes("E302") || message.includes("E302"))
    return "Código de seguridad inválido.";
  if (cause.includes("316") || message.includes("316"))
    return "Ingresá un nombre válido.";
  if (cause.includes("322") || message.includes("322"))
    return "Tipo de documento inválido.";
  if (cause.includes("323") || message.includes("323"))
    return "Número de documento inválido.";
  if (cause.includes("324") || message.includes("324"))
    return "Número de documento inválido.";
  if (cause.includes("325") || message.includes("325"))
    return "La fecha de vencimiento es inválida.";
  if (cause.includes("326") || message.includes("326"))
    return "La fecha de vencimiento es inválida.";

  return "Error al procesar la tarjeta. Intentá con otra.";
}
