// Meta Pixel + CAPI dual tracking with event_id dedup.
// Fires fbq() in the browser AND POSTs to /api/meta/track (server → Graph API).
// Both legs share the same event_id so Meta deduplicates.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = "988662053738645";

type UserIdentity = {
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
