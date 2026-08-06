// Meta Pixel + CAPI dual tracking with event_id dedup.
// Fires fbq() in the browser AND POSTs to /api/meta/track (server → Graph API).
// Both legs share the same event_id so Meta deduplicates.

import { PRODUCT_META } from "./product-meta";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const META_PIXEL_ID = "988662053738645";

export type UserIdentity = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  externalId?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
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
    if (identity && Object.keys(identity).length > 0) {
      window.fbq?.("set", "autoConfig", "false", META_PIXEL_ID);
      window.fbq?.("init", META_PIXEL_ID, {
        em: identity.email ?? undefined,
        ph: identity.phone ?? undefined,
        fn: identity.firstName ?? undefined,
        ln: identity.lastName ?? undefined,
        external_id: identity.externalId ?? undefined,
        ct: identity.city ?? undefined,
        st: identity.state ?? undefined,
        zp: identity.zip ?? undefined,
        country: identity.country ?? undefined,
      });
    }
    window.fbq?.("track", event, customData, { eventID: event_id });
  } catch (err) {
    console.warn("[meta] fbq failed", err);
  }

  // 1.5) Browser GA4 (gtag)
  try {
    const gtag = window.gtag || function (...args: any[]) {
      (window.dataLayer = window.dataLayer || []).push(args);
    };

    const ga4Events: Record<string, string> = {
      ViewContent: "view_item",
      AddToCart: "add_to_cart",
      InitiateCheckout: "begin_checkout",
      AddPaymentInfo: "add_payment_info",
      Purchase: "purchase",
    };

    const gaEvent = ga4Events[event];
    if (gaEvent) {
      let ga4Items: Array<{
        item_id: string;
        item_name: string;
        item_category?: string;
        price?: number;
        quantity?: number;
      }> = [];

      if (customData.contents && customData.contents.length > 0) {
        ga4Items = customData.contents.map((item) => {
          const slug = item.id.split("-")[0].toLowerCase();
          const meta = PRODUCT_META[slug];
          const name = meta ? `Novapatch ${meta.name}` : `Novapatch ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
          return {
            item_id: item.id,
            item_name: name,
            item_category: "Wellness",
            price: item.item_price ?? (customData.value ? customData.value / (item.quantity || 1) : 0),
            quantity: item.quantity,
          };
        });
      } else if (customData.content_ids && customData.content_ids.length > 0) {
        const avgPrice = (customData.value ?? 0) / (customData.num_items || customData.content_ids.length || 1);
        ga4Items = customData.content_ids.map((id) => {
          const slug = id.split("-")[0].toLowerCase();
          const meta = PRODUCT_META[slug];
          const name = customData.content_name || (meta ? `Novapatch ${meta.name}` : `Novapatch ${slug.charAt(0).toUpperCase() + slug.slice(1)}`);
          return {
            item_id: id,
            item_name: name,
            item_category: "Wellness",
            price: avgPrice,
            quantity: 1,
          };
        });
      }

      const gaParams: {
        currency: string;
        value?: number;
        items: typeof ga4Items;
        transaction_id?: string;
      } = {
        currency: customData.currency ?? "MXN",
        value: customData.value,
        items: ga4Items,
      };

      if (gaEvent === "purchase" && event_id) {
        gaParams.transaction_id = event_id;
      }

      gtag("event", gaEvent, gaParams);
    }
  } catch (err) {
    console.warn("[meta] GA4 tracking failed", err);
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
      ct: identity.city ?? undefined,
      st: identity.state ?? undefined,
      zp: identity.zip ?? undefined,
      country: identity.country ?? undefined,
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
  /** Shipping address kept so the confirmation page can show the delivery ETA. */
  address?: { country_code?: string | null; province?: string | null };
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
export function flushStashedPurchase(): StashedPurchase | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(STASH_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STASH_KEY);
  } catch {
    return null;
  }

  let data: StashedPurchase;
  try {
    data = JSON.parse(raw) as StashedPurchase;
  } catch {
    return null;
  }

  trackMeta("Purchase", data.purchase, data.identity, data.eventId);
  if (data.subscribe) {
    trackMeta("Subscribe", data.subscribe, data.identity);
  }
  return data;
}
