// Meta Pixel + CAPI dual tracking with event_id dedup.
// Fires fbq() in the browser AND POSTs to /api/meta/track (server → Graph API).
// Both legs share the same event_id so Meta deduplicates.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = "988662053738645";

export type UserIdentity = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  externalId?: string | null;
};

type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Subscribe"
  | "Lead";

export type MetaCustomData = {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_name?: string;
  content_type?: "product" | "product_group";
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  num_items?: number;
  [key: string]: unknown;
};

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function makeEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function trackMeta(
  event: MetaEventName,
  customData: MetaCustomData = {},
  identity: UserIdentity = {},
  eventIdOverride?: string,
): void {
  if (typeof window === "undefined") return;

  const event_id = eventIdOverride ?? makeEventId();

  // 1) Browser Pixel
  try {
    window.fbq?.("track", event, customData, { eventID: event_id });
  } catch (err) {
    console.warn("[meta] fbq failed", err);
  }

  // 2) Server CAPI — best effort, never throw to the UI
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc");

  const body = {
    event_name: event,
    event_id,
    event_source_url: window.location.href,
    user_data: {
      em: identity.email ?? undefined,
      ph: identity.phone ?? undefined,
      fn: identity.firstName ?? undefined,
      ln: identity.lastName ?? undefined,
      external_id: identity.externalId ?? undefined,
      fbp,
      fbc,
    },
    custom_data: customData,
  };

  // keepalive lets the request survive page unload (important for Purchase)
  fetch("/api/meta/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch((err) => console.warn("[meta] CAPI fetch failed", err));
}

// ── Purchase across a 3DS redirect ──────────────────────────────────────────
// When the bank requires 3D Secure, the checkout page redirects away before it
// can fire Purchase, and the return page lacks the cart context to rebuild it.
// So we stash the fully-formed Purchase (and Subscribe, if any) here right
// before redirecting, then flush it on the return page. The event_id is
// preserved so both legs dedupe with any future Medusa-side Purchase.

const STASH_KEY = "novapatch_meta_purchase";

type StashedPurchase = {
  eventId?: string;
  identity: UserIdentity;
  purchase: MetaCustomData;
  subscribe?: MetaCustomData;
};

export function stashPurchaseForRedirect(data: StashedPurchase): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STASH_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("[meta] failed to stash purchase", err);
  }
}

// Fires the stashed Purchase/Subscribe once, then clears it so a page refresh
// can't double-count. Safe to call unconditionally on the 3DS return page.
export function flushStashedPurchase(): void {
  if (typeof window === "undefined") return;
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(STASH_KEY);
    if (!raw) return;
    window.sessionStorage.removeItem(STASH_KEY);
  } catch {
    return;
  }

  let data: StashedPurchase;
  try {
    data = JSON.parse(raw) as StashedPurchase;
  } catch {
    return;
  }

  trackMeta("Purchase", data.purchase, data.identity, data.eventId);
  if (data.subscribe) {
    trackMeta("Subscribe", data.subscribe, data.identity);
  }
}
