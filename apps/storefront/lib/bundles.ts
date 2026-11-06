/**
 * lib/bundles.ts — Single source of truth for frontend-only bundle (pack) pricing.
 *
 * Bundles are NOT Medusa products. Their prices MUST be derived from the real,
 * region-aware price of their member single products (which DO come from Medusa
 * per region/currency), never hardcoded in a single currency. This keeps Mexico
 * (MXN) and Argentina (ARS) — and any future market — correct automatically.
 *
 * Discounts (dúo 15%, trío 20%) match the single-product subscription tiers.
 */

/** Which single-product slugs make up each bundle. */
export const BUNDLE_MEMBERS: Record<string, string[]> = {
  "pack-dia-noche": ["energy", "sleep"],
  "pack-calma-sueno": ["zen", "sleep"],
  "pack-glow-balance": ["glow", "woman"],
  "pack-trio-vitalidad": ["energy", "zen", "sleep"],
};

/** Permanent bundle discount as a fraction of the combined member price. */
export const BUNDLE_DISCOUNT_PCT: Record<string, number> = {
  "pack-dia-noche": 0.15,
  "pack-calma-sueno": 0.15,
  "pack-glow-balance": 0.15,
  "pack-trio-vitalidad": 0.2,
};

/** Offline/MXN fallback used only when a real region price is unavailable. */
export const DEFAULT_SINGLE_PRICE = 750;

export function isBundleSlug(slug: string): boolean {
  return slug in BUNDLE_MEMBERS;
}

export function bundleMemberCount(slug: string): number {
  return BUNDLE_MEMBERS[slug]?.length ?? 0;
}

/**
 * Pre-discount price of a bundle = sum of its members' region single prices.
 * `priceBySlug` holds region single prices; missing members fall back to
 * `fallbackSingle` (region single base, else the MXN default).
 */
export function bundleOriginalPrice(
  slug: string,
  priceBySlug: Record<string, number>,
  fallbackSingle: number = DEFAULT_SINGLE_PRICE
): number | null {
  const members = BUNDLE_MEMBERS[slug];
  if (!members) return null;
  return members.reduce((sum, m) => sum + (priceBySlug[m] ?? fallbackSingle), 0);
}

/** Discounted one-time price of a bundle, derived from member region prices. */
export function bundleOncePrice(
  slug: string,
  priceBySlug: Record<string, number>,
  fallbackSingle: number = DEFAULT_SINGLE_PRICE
): number | null {
  const original = bundleOriginalPrice(slug, priceBySlug, fallbackSingle);
  if (original === null) return null;
  return Math.round(original * (1 - (BUNDLE_DISCOUNT_PCT[slug] ?? 0)));
}

/**
 * Recovers the pre-discount (strikethrough) price from an already-discounted
 * one-time price. For UI surfaces that only hold the discounted number but know
 * the region is already baked into it. 1275 → 1500, 1800 → 2250, etc.
 */
export function bundleOriginalFromOnce(slug: string, onceDiscounted: number): number | null {
  const pct = BUNDLE_DISCOUNT_PCT[slug];
  if (pct == null) return null;
  return Math.round(onceDiscounted / (1 - pct));
}

/**
 * Subscription-tier price of a bundle: each member gets its own frequency
 * discount over the region single base. `freqDiscountPct` is a whole number
 * (20 | 15 | 10).
 */
export function bundleSubPrice(
  slug: string,
  singleBase: number,
  freqDiscountPct: number
): number | null {
  const count = bundleMemberCount(slug);
  if (count === 0) return null;
  return Math.round(count * singleBase * (1 - freqDiscountPct / 100));
}
