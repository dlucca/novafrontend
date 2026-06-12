/**
 * lib/commerce.ts — Capa de abstracción del catálogo de productos
 *
 * Intenta obtener productos desde Medusa (/store/products).
 * Si el backend no está disponible (dev sin backend), usa los datos
 * hardcodeados como fallback para que el frontend funcione de forma autónoma.
 */

import { medusa } from "@/lib/medusa";
import { PRODUCT_META, PRODUCT_ORDER } from "@/lib/product-meta";

export type Product = {
  id: string;
  slug: string;          // handle de Medusa o slug local
  title: string;
  description: string;
  price: number;         // MXN, precio regular (sin descuento)
  image: string;
  variantId?: string;    // ID de la variante default en Medusa (para cart)
};

// ─── Datos de fallback (mientras no hay backend) ──────────────────────────────
// Usar descripciones reales de product-meta.ts

const FALLBACK_PRODUCTS: Product[] = PRODUCT_ORDER.map((slug) => {
  const meta = PRODUCT_META[slug];
  return {
    id: slug,
    slug,
    title: meta.name,
    description: meta.description,
    price: 750,
    image: meta.imgSrc,
    variantId: undefined, // se asigna cuando Medusa esté disponible
  };
});

// ─── Mapeo Medusa → Product local ─────────────────────────────────────────────

function medusaToProduct(p: Awaited<ReturnType<typeof medusa.catalog.getProducts>>[0], currencyCode = "mxn"): Product {
  const slug = p.handle ?? p.id;
  const meta = PRODUCT_META[slug];
  // Prefer the "once" variant (non-subscription retail price) over the first one
  const onceVariant = p.variants?.find(
    (v) => (v as any)?.metadata?.is_subscription === false
  );
  const variant = onceVariant ?? p.variants?.[0];
  const calculatedAmount = (variant as any)?.calculated_price?.calculated_amount;
  const fallbackPrice = variant?.prices?.find((pr) => pr.currency_code === currencyCode);
  // Medusa in this project stores amounts as whole currency units for all
  // markets — not minor units. Display them as-is without dividing.
  const rawAmount = calculatedAmount ?? fallbackPrice?.amount;

  return {
    id: p.id,
    slug,
    title: p.title,
    description: meta?.description ?? p.description ?? "",
    price: rawAmount ? Math.round(rawAmount) : 750,
    image: p.thumbnail ?? meta?.imgSrc ?? `/products/${slug}_thumb.webp`,
    variantId: variant?.id,
  };
}

// ─── Exports principales ───────────────────────────────────────────────────────

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ?? "";

/**
 * Obtiene el catálogo de productos.
 * Intenta Medusa primero; si falla, usa fallback hardcodeado.
 */
export async function getProducts(regionId?: string, currencyCode?: string): Promise<Product[]> {
  const resolvedRegionId = regionId || REGION_ID;
  try {
    const medusaProducts = await medusa.catalog.getProducts(
      resolvedRegionId ? { region_id: resolvedRegionId } : undefined
    );

    if (medusaProducts.length === 0) return FALLBACK_PRODUCTS;

    const currency = (currencyCode ?? "mxn").toLowerCase();
    // Reordenar según PRODUCT_ORDER cuando sea posible
    const mapped = medusaProducts.map((p) => medusaToProduct(p, currency));
    const ordered = PRODUCT_ORDER
      .map((slug) => mapped.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p));

    // Agregar productos de Medusa que no estén en PRODUCT_ORDER
    const rest = mapped.filter((p) => !PRODUCT_ORDER.includes(p.slug));
    return [...ordered, ...rest];
  } catch {
    // Backend no disponible — continuar con datos locales
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Alias para compatibilidad con TiendaExperience que llama getOrderedProducts().
 */
export async function getOrderedProducts(): Promise<Product[]> {
  return getProducts();
}

// ─── Detalle de producto (PDP) ────────────────────────────────────────────────

export type PurchaseTier = "once" | "monthly" | "bimonthly" | "quarterly";

export type PurchaseOption = {
  tier: PurchaseTier;
  label: string;          // "Compra única" | "Mensual" | ...
  freq: 30 | 60 | 90 | null; // null = compra única
  price: number;          // precio final del tier (con descuento)
  discountPct: number;    // 0 | 20 | 15 | 10
  variantId?: string;     // variante Medusa del tier
};

export type ProductDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  basePrice: number;      // precio regular (compra única)
  images: string[];       // galería; [0] es la principal
  options: PurchaseOption[];
};

const TIER_DEFS: { tier: PurchaseTier; label: string; freq: 30 | 60 | 90 | null; discountPct: number }[] = [
  { tier: "once", label: "Compra única", freq: null, discountPct: 0 },
  { tier: "monthly", label: "Mensual", freq: 30, discountPct: 20 },
  { tier: "bimonthly", label: "Bimestral", freq: 60, discountPct: 15 },
  { tier: "quarterly", label: "Trimestral", freq: 90, discountPct: 10 },
];

function fallbackDetail(slug: string): ProductDetail | null {
  const meta = PRODUCT_META[slug];
  if (!meta) return null;
  const basePrice = 750;
  return {
    id: slug,
    slug,
    title: meta.name,
    description: meta.description,
    basePrice,
    images: [meta.imgSrc],
    options: TIER_DEFS.map((t) => ({
      tier: t.tier,
      label: t.label,
      freq: t.freq,
      price: Math.round(basePrice * (1 - t.discountPct / 100)),
      discountPct: t.discountPct,
      variantId: undefined,
    })),
  };
}

/**
 * Detalle de producto para la PDP. Intenta Medusa (por handle, con metadata
 * de variantes para mapear tiers); si falla, usa fallback local.
 * Devuelve null si el handle no existe en ningún lado.
 */
export async function getProductDetail(
  handle: string,
  regionId?: string,
  currencyCode?: string
): Promise<ProductDetail | null> {
  const resolvedRegionId = regionId || REGION_ID;
  const currency = (currencyCode ?? "mxn").toLowerCase();
  try {
    const p = await medusa.catalog.getProductByHandle(
      handle,
      resolvedRegionId || undefined
    );
    if (!p) return fallbackDetail(handle);

    const meta = PRODUCT_META[handle];

    const variantPrice = (v: (typeof p.variants)[number] | undefined): number | undefined => {
      if (!v) return undefined;
      const calculated = v.calculated_price?.calculated_amount;
      const listed = v.prices?.find((pr) => pr.currency_code === currency)?.amount;
      const raw = calculated ?? listed;
      return raw !== undefined && raw !== null ? Math.round(raw) : undefined;
    };

    const onceVariant = p.variants?.find((v) => v.metadata?.is_subscription === false);
    const basePrice = variantPrice(onceVariant) ?? 750;

    const options: PurchaseOption[] = TIER_DEFS.map((t) => {
      const variant =
        t.freq === null
          ? onceVariant
          : p.variants?.find((v) => v.metadata?.interval_days === t.freq);
      return {
        tier: t.tier,
        label: t.label,
        freq: t.freq,
        price: variantPrice(variant) ?? Math.round(basePrice * (1 - t.discountPct / 100)),
        discountPct: t.discountPct,
        variantId: variant?.id,
      };
    });

    const images = (p.images ?? []).map((i) => i.url).filter(Boolean);

    return {
      id: p.id,
      slug: handle,
      title: p.title,
      description: meta?.description ?? p.description ?? "",
      basePrice,
      images: images.length > 0 ? images : [p.thumbnail ?? meta?.imgSrc ?? `/products/${handle}_thumb.webp`],
      options,
    };
  } catch {
    return fallbackDetail(handle);
  }
}

export type SubscriptionPlanTier = {
  label: string;
  freq: 30 | 60 | 90;
  discountPct: number;
  price: number;
  best: boolean;
};

/**
 * Precios de referencia para la página de suscripciones — misma lógica que la PDP.
 * Usa variantes de Medusa cuando están disponibles; si no, calcula desde basePrice.
 */
export async function getSubscriptionPlanTiers(
  regionId?: string,
  currencyCode?: string,
  productHandle = PRODUCT_ORDER[0]
): Promise<SubscriptionPlanTier[]> {
  const detail = await getProductDetail(productHandle, regionId, currencyCode);
  const options =
    detail?.options ??
    TIER_DEFS.map((t) => ({
      tier: t.tier,
      label: t.label,
      freq: t.freq,
      price: Math.round(750 * (1 - t.discountPct / 100)),
      discountPct: t.discountPct,
      variantId: undefined,
    }));

  return options
    .filter((o): o is PurchaseOption & { freq: 30 | 60 | 90 } => o.freq !== null)
    .map((o) => ({
      label: o.label,
      freq: o.freq,
      discountPct: o.discountPct,
      price: o.price,
      best: o.tier === "monthly",
    }));
}
