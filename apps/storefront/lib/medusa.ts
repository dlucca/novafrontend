/**
 * lib/medusa.ts — Cliente REST completo para Medusa V2
 *
 * Cubre las 7 secciones del mapa de integración:
 *   1. Catálogo y Visualización (público)
 *   2. Gestión del Carrito (público / autenticado)
 *   3. Flujo de Checkout y Pagos
 *   4. Cliente — Sync Clerk → Medusa (protegido por Clerk JWT)
 *   5. Portal de Suscripciones (protegido por Clerk JWT)
 *   6. Historial de Órdenes (protegido por Clerk JWT)
 *   7. Gestión de Tarjetas (protegido por Clerk JWT)
 *
 * Uso:
 *   import { medusa } from "@/lib/medusa";
 *   const products = await medusa.catalog.getProducts({ region_id: "reg_MX" });
 *   const cart    = await medusa.cart.create("reg_MX");
 */

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

// ─── Error tipado ─────────────────────────────────────────────────────────────

export class MedusaError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "MedusaError";
  }
}

// ─── Tipos de dominio ─────────────────────────────────────────────────────────

export type MedusaProduct = {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  variants: MedusaVariant[];
  images: { url: string }[];
  thumbnail: string | null;
};

export type MedusaVariant = {
  id: string;
  title: string;
  prices: { amount: number; currency_code: string }[];
  calculated_price?: { calculated_amount: number } | null;
  metadata?: {
    is_subscription?: boolean;
    interval_days?: number | null;
    discount_percentage?: number | null;
  } | null;
};

export type MedusaCart = {
  id: string;
  region_id: string;
  currency_code?: string;
  items: MedusaLineItem[];
  total: number;
  subtotal: number;
  discount_total?: number;
  promotions?: Array<{
    id: string;
    code: string;
    application_method?: {
      type: string;
      value: number;
      target_type?: "order" | "items" | "shipping_methods" | string;
    };
  }>;
  payment_sessions?: { provider_id: string; status: string }[];
  shipping_methods?: Array<{ id: string; amount: number; name?: string }>;
  shipping_total?: number;
};

export type CompleteCartPayload =
  | { openpay_token_id: string; email?: string; device_session_id?: string }
  | { mp_card_token: string; email?: string };

export type MedusaShippingOption = {
  id: string;
  name: string;
  amount: number;
  price_type: "flat" | "calculated";
  provider_id: string;
};

export type MedusaLineItem = {
  id: string;
  variant_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  thumbnail?: string | null;
  metadata?: Record<string, unknown>;
};

export type MedusaOrder = {
  id: string;
  display_id: number;
  status: string;
  total: number;
  created_at: string;
  items: MedusaLineItem[];
};

export type CompleteCartResult =
  | { type: "order"; data: MedusaOrder }
  | { type: "redirect"; redirect_url: string };

export type MedusaSubscription = {
  id: string;
  status: "active" | "paused" | "cancelled" | "past_due" | "delayed_out_of_stock";
  interval_days: 30 | 60 | 90;
  next_delivery_at: string;
  product_title: string;
  variant_id: string;
  unit_price: number;
  quantity: number;
  created_at: string;
};

export type MedusaPaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
};

// ─── Fetch helper ─────────────────────────────────────────────────────────────

// Paths where retrying a failed POST could have side effects (double charge, etc.)
const NO_RETRY_PATHS = ["/complete", "/payment-sessions"];

// Sin esto, un backend que acepta la conexión pero nunca responde cuelga el
// fetch para siempre. En un Server Component (await getProducts) eso cuelga el
// SSR entero y la página nunca emite respuesta (timeout del monitor → exit 28).
// Con timeout, el fetch aborta → getProducts cae al fallback → la página renderiza.
const DEFAULT_TIMEOUT_MS = 5000;

async function medusaFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const url = `${MEDUSA_URL}${path}`;
  const method = (options.method ?? "GET").toUpperCase();
  const isGet = method === "GET";
  const isSensitive = !isGet && NO_RETRY_PATHS.some((p) => path.endsWith(p));
  const MAX_RETRIES = isSensitive ? 0 : 2;
  const BASE_DELAY_MS = 300;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> ?? {}) },
  };

  let lastError: Error = new Error(`[medusa] ${method} ${path} failed`);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise<void>((r) => setTimeout(r, BASE_DELAY_MS * 2 ** (attempt - 1)));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { ...fetchOptions, signal: controller.signal });

      if (!res.ok) {
        let message = `Medusa HTTP ${res.status}`;
        try {
          const body = await res.json();
          message = body?.message ?? body?.error ?? message;
        } catch { /* empty */ }
        console.error(`[medusa] ${method} ${path} → ${res.status}: ${message}`);

        const err = new MedusaError(message, res.status);
        // Retry 5xx on GET only; 4xx are permanent — never retry
        if (isGet && res.status >= 500 && attempt < MAX_RETRIES) {
          lastError = err;
          continue;
        }
        throw err;
      }

      return res.json() as Promise<T>;
    } catch (err) {
      if (err instanceof MedusaError) throw err; // already logged above

      // Network error — request never reached server, safe to retry all methods
      const networkErr = err instanceof Error ? err : new Error(String(err));
      const isTimeout = networkErr.name === "AbortError";
      console.warn(
        `[medusa] ${method} ${path} → ${isTimeout ? `timeout after ${timeoutMs}ms` : "network error"} (attempt ${attempt + 1}/${MAX_RETRIES + 1})`
      );
      lastError = isTimeout
        ? new Error(`[medusa] ${method} ${path} timed out after ${timeoutMs}ms`)
        : networkErr;
      // Backend colgado: reintentar solo apila latencia y arriesga colgar el SSR.
      // Fallamos rápido para que el caller (getProducts) caiga al fallback.
      if (isTimeout) break;
      // Falls through to next iteration; throws lastError after exhausting retries
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError;
}

// ─── 1. Catálogo y Visualización ─────────────────────────────────────────────

const catalog = {
  /**
   * GET /store/products?region_id=...
   * Carga la tienda inicial con precios en MXN.
   */
  async getProducts(
    params?: { region_id?: string },
    timeoutMs?: number
  ): Promise<MedusaProduct[]> {
    const search = new URLSearchParams();
    if (params?.region_id) search.set("region_id", params.region_id);
    // Sin esto, la selección de la variante "once" por metadata nunca matchea
    // y el precio mostrado dependería del orden de las variantes.
    search.set("fields", "+variants.metadata");
    const data = await medusaFetch<{ products: MedusaProduct[] }>(
      `/store/products?${search.toString()}`,
      {},
      null,
      timeoutMs
    );
    return data.products;
  },

  /**
   * GET /store/variants/:id
   * Obtiene detalles de una variante (cross-sell, cambio de variante).
   */
  async getVariant(id: string): Promise<MedusaVariant> {
    const data = await medusaFetch<{ variant: MedusaVariant }>(
      `/store/variants/${id}`
    );
    return data.variant;
  },

  /**
   * GET /store/products?handle=...&fields=+variants.metadata
   * Producto individual para la PDP — incluye metadata de variantes
   * (is_subscription / interval_days) para mapear los tiers de suscripción.
   */
  async getProductByHandle(
    handle: string,
    region_id?: string
  ): Promise<MedusaProduct | null> {
    const params = new URLSearchParams({ handle });
    if (region_id) params.set("region_id", region_id);
    params.set("fields", "+variants.metadata");
    const data = await medusaFetch<{ products: MedusaProduct[] }>(
      `/store/products?${params.toString()}`
    );
    return data.products[0] ?? null;
  },
};

// ─── 2. Gestión del Carrito ───────────────────────────────────────────────────

const cart = {
  /**
   * POST /store/carts
   * Inicia un nuevo carrito vacío con region_id.
   * En Medusa V2 el cliente se vincula automáticamente via Bearer token — no se pasa customer_id.
   * Guarda el cart_id en localStorage para persistencia.
   */
  async create(region_id: string, customer_id?: string): Promise<MedusaCart> {
    void customer_id; // ignorado — Medusa V2 vincula el cliente via auth token
    const data = await medusaFetch<{ cart: MedusaCart }>("/store/carts", {
      method: "POST",
      body: JSON.stringify({ region_id }),
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("novapatch_medusa_cart_id", data.cart.id);
    }
    return data.cart;
  },

  /**
   * Obtiene el cart_id persistido (o null si no hay uno).
   */
  getStoredId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("novapatch_medusa_cart_id");
  },

  /**
   * GET /store/carts/:id
   * Trae el carrito por ID. Usado por el flujo de recuperación de carrito
   * (email enviado a las 11 h de abandono — el link aterriza en
   * /[locale]/cart-recovery, que llama a este método para verificar que
   * el carrito sigue activo antes de redirigir al checkout).
   */
  async retrieve(cart_id: string): Promise<MedusaCart & { completed_at?: string | null }> {
    const data = await medusaFetch<{ cart: MedusaCart & { completed_at?: string | null } }>(
      `/store/carts/${encodeURIComponent(cart_id)}`
    );
    return data.cart;
  },

  /**
   * Garantiza que existe un carrito en Medusa, creándolo si hace falta.
   * El customer_id es ignorado — la asociación ocurre via Bearer token automáticamente.
   */
  async ensure(region_id: string, customer_id?: string): Promise<string> {
    const existing = cart.getStoredId();
    if (existing) return existing;
    const newCart = await cart.create(region_id, customer_id);
    return newCart.id;
  },

  /**
   * POST /store/carts/:id/line-items — Compra Única
   * Payload: { variant_id, quantity }
   */
  async addOnceItem(
    cart_id: string,
    variant_id: string,
    quantity = 1
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/line-items`,
      {
        method: "POST",
        body: JSON.stringify({ variant_id, quantity }),
      }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id/line-items — Suscripción
   * Inyecta metadata: { is_subscription, interval_days, discount_percentage }
   */
  async addSubscriptionItem(
    cart_id: string,
    variant_id: string,
    interval_days: 30 | 60 | 90,
    discount_percentage: number,
    quantity = 1
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/line-items`,
      {
        method: "POST",
        body: JSON.stringify({
          variant_id,
          quantity,
          metadata: {
            is_subscription: true,
            interval_days,
            discount_percentage,
          },
        }),
      }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id — Actualizar email y dirección de envío
   */
  async update(
    cart_id: string,
    fields: {
      email?: string;
      shipping_address?: {
        first_name?: string;
        last_name?: string;
        address_1?: string;
        address_2?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        country_code?: string;
        phone?: string;
      };
      metadata?: Record<string, unknown>;
    }
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}`,
      { method: "POST", body: JSON.stringify(fields) }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id/promotions
   * Aplica un código de descuento al carrito.
   * Devuelve el carrito actualizado con promotions[].application_method.value.
   */
  async applyPromotion(cart_id: string, code: string): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/promotions`,
      {
        method: "POST",
        body: JSON.stringify({ promo_codes: [code.toUpperCase()] }),
      }
    );
    return data.cart;
  },

  /**
   * DELETE /store/carts/:id/promotions
   * Quita un código de descuento del carrito.
   */
  async removePromotion(cart_id: string, code: string): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/promotions`,
      {
        method: "DELETE",
        body: JSON.stringify({ promo_codes: [code.toUpperCase()] }),
      }
    );
    return data.cart;
  },

  /**
   * GET /store/shipping-options?cart_id=:id
   * Devuelve las opciones de envío disponibles para el carrito.
   */
  async getShippingOptions(cart_id: string): Promise<MedusaShippingOption[]> {
    const data = await medusaFetch<{ shipping_options: MedusaShippingOption[] }>(
      `/store/shipping-options?cart_id=${encodeURIComponent(cart_id)}`
    );
    return data.shipping_options ?? [];
  },

  /**
   * POST /store/carts/:id/shipping-methods
   * Aplica una shipping option al carrito.
   */
  async addShippingMethod(
    cart_id: string,
    shipping_option_id: string
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/shipping-methods`,
      {
        method: "POST",
        body: JSON.stringify({ option_id: shipping_option_id }),
      }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id/line-items/:line_id
   * Actualiza la cantidad de un ítem existente.
   */
  async updateItem(
    cart_id: string,
    line_id: string,
    quantity: number
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/line-items/${line_id}`,
      {
        method: "POST",
        body: JSON.stringify({ quantity }),
      }
    );
    return data.cart;
  },
};

// ─── 3. Checkout y Pagos ──────────────────────────────────────────────────────

const checkout = {
  /**
   * POST /store/carts/:id/payment-sessions
   * Registra la sesión de pago con Openpay como proveedor.
   */
  async createPaymentSession(cart_id: string): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/payment-sessions`,
      { method: "POST" }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id/complete
   * Procesa el pago y crea la orden.
   * Acepta payload de Openpay (MX) o MercadoPago (AR).
   */
  async completeCart(
    cart_id: string,
    payload: CompleteCartPayload
  ): Promise<CompleteCartResult> {
    const data = await medusaFetch<CompleteCartResult>(
      `/store/carts/${cart_id}/complete`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    if (data.type === "order") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("novapatch_medusa_cart_id");
      }
    }
    return data;
  },

  /**
   * POST /store/carts/:id/complete-3ds
   * Verifica el cobro en Openpay después del redirect 3DS y completa la orden.
   */
  async complete3DS(
    cart_id: string,
    openpay_transaction_id: string
  ): Promise<Record<string, unknown>> {
    return medusaFetch<Record<string, unknown>>(
      `/store/carts/${cart_id}/complete-3ds`,
      {
        method: "POST",
        body: JSON.stringify({ openpay_transaction_id }),
      }
    );
  },
};

// ─── 4. Cliente — Sync Clerk → Medusa (requiere Clerk JWT) ──────────────────

export type MedusaCustomer = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
};

const customer = {
  /**
   * GET /store/me/customer
   * Busca o crea el cliente Medusa usando el email del JWT de Clerk.
   * Llamar después del login cuando el carrito tiene suscripciones.
   * Devuelve el customer_id para pasarlo a cart.ensure().
   */
  async sync(token: string): Promise<MedusaCustomer> {
    const data = await medusaFetch<{ customer: MedusaCustomer }>(
      "/store/me/customer",
      {},
      token
    );
    return data.customer;
  },
};

// ─── 5. Portal de Suscripciones (requiere Clerk JWT) ─────────────────────────

const subscriptions = {
  /**
   * GET /store/me/subscriptions
   * Lista las suscripciones activas, pausadas y canceladas del usuario.
   */
  async list(token: string): Promise<MedusaSubscription[]> {
    const data = await medusaFetch<{ subscriptions: MedusaSubscription[] }>(
      "/store/me/subscriptions",
      {},
      token
    );
    return data.subscriptions;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/pause
   */
  async pause(sub_id: string, token: string): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/pause`,
      { method: "POST" },
      token
    );
    return data.subscription;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/resume
   */
  async resume(sub_id: string, token: string): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/resume`,
      { method: "POST" },
      token
    );
    return data.subscription;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/cancel
   */
  async cancel(sub_id: string, token: string): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/cancel`,
      { method: "POST" },
      token
    );
    return data.subscription;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/frequency
   * Cambia la frecuencia de entrega (ej. de 30 a 60 días).
   */
  async updateFrequency(
    sub_id: string,
    interval_days: 30 | 60 | 90,
    token: string
  ): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/frequency`,
      {
        method: "POST",
        body: JSON.stringify({ interval_days }),
      },
      token
    );
    return data.subscription;
  },
};

// ─── 6. Historial de Órdenes (requiere Clerk JWT) ─────────────────────────────

const orders = {
  /**
   * GET /store/orders
   * Lista las órdenes del cliente autenticado.
   * Medusa V2 filtra automáticamente por el customer del JWT.
   */
  async list(token: string): Promise<MedusaOrder[]> {
    const data = await medusaFetch<{ orders: MedusaOrder[] }>(
      "/store/me/orders",
      {},
      token
    );
    return data.orders;
  },
};

// ─── 7. Gestión de Tarjetas (requiere Clerk JWT) ──────────────────────────────

const paymentMethods = {
  /**
   * GET /store/me/payment-methods
   * Lista las tarjetas guardadas (Medusa consulta a Openpay).
   */
  async list(token: string): Promise<MedusaPaymentMethod[]> {
    const data = await medusaFetch<{ payment_methods: MedusaPaymentMethod[] }>(
      "/store/me/payment-methods",
      {},
      token
    );
    return data.payment_methods;
  },

  /**
   * POST /store/me/payment-methods/default
   * Agrega o reemplaza la tarjeta principal.
   * El token_id fue generado por el SDK de Openpay en el frontend.
   */
  async setDefault(
    openpay_token_id: string,
    token: string
  ): Promise<MedusaPaymentMethod> {
    const data = await medusaFetch<{ payment_method: MedusaPaymentMethod }>(
      "/store/me/payment-methods/default",
      {
        method: "POST",
        body: JSON.stringify({ openpay_token_id }),
      },
      token
    );
    return data.payment_method;
  },
};

// ─── Export unificado ─────────────────────────────────────────────────────────

export const medusa = {
  catalog,
  cart,
  checkout,
  customer,
  subscriptions,
  orders,
  paymentMethods,
};
