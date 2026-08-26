
export const BUNDLE_CONSTITUENTS_MAP: Record<string, Array<{ slug: string; title: string; image: string; price: number; color: string; bg: string }>> = {
  "pack-trio-vitalidad": [
    { slug: "energy", title: "Energy", image: "/products/Energy_thumb.webp", price: 750, color: "#2B7CC1", bg: "#EBF4FB" },
    { slug: "sleep", title: "Sleep", image: "/products/Sleep_thumb.webp", price: 750, color: "#138A75", bg: "#EBF7F5" },
    { slug: "zen", title: "Zen", image: "/products/Zen_thumb.webp", price: 750, color: "#3A6FA8", bg: "#EBF0F9" },
  ],
  "pack-dia-noche": [
    { slug: "energy", title: "Energy", image: "/products/Energy_thumb.webp", price: 750, color: "#2B7CC1", bg: "#EBF4FB" },
    { slug: "sleep", title: "Sleep", image: "/products/Sleep_thumb.webp", price: 750, color: "#138A75", bg: "#EBF7F5" },
  ],
  "pack-calma-sueno": [
    { slug: "zen", title: "Zen", image: "/products/Zen_thumb.webp", price: 750, color: "#3A6FA8", bg: "#EBF0F9" },
    { slug: "sleep", title: "Sleep", image: "/products/Sleep_thumb.webp", price: 750, color: "#138A75", bg: "#EBF7F5" },
  ],
  "pack-glow-balance": [
    { slug: "glow", title: "Glow", image: "/products/Glow_thumb.webp", price: 750, color: "#C94030", bg: "#FAF0EE" },
    { slug: "woman", title: "Woman", image: "/products/Woman_thumb.webp", price: 750, color: "#8A3EBE", bg: "#F3EBF9" },
  ],
};

export function normalizeCartItems(rawItems: CartItem[]): CartItem[] {
  const result: CartItem[] = [];
  for (const item of rawItems) {
    const constituents = BUNDLE_CONSTITUENTS_MAP[item.slug];
    if (constituents) {
      const qtyToAdd = item.quantity || 1;
      for (const sub of constituents) {
        const key = cartKey({ slug: sub.slug, mode: item.mode, freq: item.freq });
        const existingIdx = result.findIndex((r) => cartKey(r) === key);
        if (existingIdx >= 0) {
          result[existingIdx].quantity += qtyToAdd;
        } else {
          result.push({
            slug: sub.slug,
            title: sub.title,
            image: sub.image,
            price: sub.price,
            color: sub.color,
            bg: sub.bg,
            mode: item.mode,
            freq: item.freq,
            quantity: qtyToAdd,
          });
        }
      }
    } else {
      const key = cartKey(item);
      const existingIdx = result.findIndex((r) => cartKey(r) === key);
      if (existingIdx >= 0) {
        result[existingIdx].quantity += item.quantity;
      } else {
        result.push({ ...item });
      }
    }
  }
  return result;
}

export const CART_STORAGE_KEY = "novapatch_cart";
export const CART_UPDATED_EVENT = "cart:updated";

export type CartItem = {
  slug: string;
  title: string;
  image: string;
  price: number;       // precio regular MXN
  color: string;       // accent color del producto
  bg: string;          // bg color del producto
  mode: "once" | "sub";
  freq: 30 | 60 | 90;  // siempre presente; para "once" se ignora en el precio
  quantity: number;
  variantId?: string;  // Medusa variant ID (opcional hasta que el backend esté conectado)
};

export const FREQ_DISCOUNTS: Record<number, number> = { 30: 0.20, 60: 0.15, 90: 0.10 };
export const FREQ_LABELS: Record<number, string>    = { 30: "Mensual", 60: "Bimestral", 90: "Trimestral" };

// Clave única por línea de carrito (mismo producto puede entrar como once y como sub)
export function cartKey(item: Pick<CartItem, "slug" | "mode" | "freq">): string {
  return `${item.slug}__${item.mode}__${item.freq}`;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return normalizeCartItems(parsed);
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addToCart(incoming: Omit<CartItem, "quantity"> & { quantity?: number }): void {
  const rawItems = getCart();
  const constituents = BUNDLE_CONSTITUENTS_MAP[incoming.slug];
  const qty = incoming.quantity ?? 1;

  if (constituents) {
    for (const sub of constituents) {
      const itemToInsert = {
        slug: sub.slug,
        title: sub.title,
        image: sub.image,
        price: sub.price,
        color: sub.color,
        bg: sub.bg,
        mode: incoming.mode,
        freq: incoming.freq,
        quantity: qty,
      };
      const key = cartKey(itemToInsert);
      const idx = rawItems.findIndex((i) => cartKey(i) === key);
      if (idx >= 0) {
        rawItems[idx].quantity += qty;
      } else {
        rawItems.push(itemToInsert);
      }
    }
  } else {
    const key = cartKey(incoming);
    const idx = rawItems.findIndex((i) => cartKey(i) === key);
    if (idx >= 0) {
      rawItems[idx].quantity += qty;
    } else {
      rawItems.push({ ...incoming, quantity: qty });
    }
  }
  saveCart(normalizeCartItems(rawItems));
}

export function updateQuantity(
  slug: string,
  mode: "once" | "sub",
  freq: 30 | 60 | 90,
  delta: number,
): void {
  const items = getCart();
  const key = cartKey({ slug, mode, freq });
  const idx = items.findIndex((i) => cartKey(i) === key);
  if (idx < 0) return;
  items[idx].quantity = Math.max(0, items[idx].quantity + delta);
  if (items[idx].quantity === 0) items.splice(idx, 1);
  saveCart(items);
}

export function removeFromCart(slug: string, mode: "once" | "sub", freq: 30 | 60 | 90): void {
  const items = getCart().filter((i) => cartKey(i) !== cartKey({ slug, mode, freq }));
  saveCart(items);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartItemCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function itemDisplayPrice(item: Pick<CartItem, "price" | "mode" | "freq">): number {
  if (item.mode === "once") return item.price;
  return Math.round(item.price * (1 - FREQ_DISCOUNTS[item.freq]));
}

export function cartTotals(items: CartItem[]): {
  subtotal: number;
  savings: number;
  bundleDiscount: number;
  bundleName: string | null;
  total: number;
} {
  let subtotal = 0;
  let total = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
    total += itemDisplayPrice(item) * item.quantity;
  }

  // Automatic Multi-Bundle Detection (for once-purchase items)
  const qtyMap: Record<string, number> = {};
  for (const item of items) {
    if (item.mode === "once") {
      qtyMap[item.slug] = (qtyMap[item.slug] || 0) + item.quantity;
    }
  }

  let bundleDiscount = 0;
  const bundleLabels: string[] = [];

  // 1. Pack Trío Vitalidad (energy + sleep + zen) -> $450 OFF per trio
  const trioCount = Math.min(qtyMap["energy"] || 0, qtyMap["sleep"] || 0, qtyMap["zen"] || 0);
  if (trioCount > 0) {
    bundleDiscount += trioCount * 450;
    bundleLabels.push(trioCount > 1 ? `Pack Trío Vitalidad × ${trioCount} (20% OFF)` : `Pack Trío Vitalidad (20% OFF)`);
    qtyMap["energy"] -= trioCount;
    qtyMap["sleep"] -= trioCount;
    qtyMap["zen"] -= trioCount;
  }

  // 2. Pack Día & Noche (energy + sleep) -> $225 OFF per duo
  const diaNocheCount = Math.min(qtyMap["energy"] || 0, qtyMap["sleep"] || 0);
  if (diaNocheCount > 0) {
    bundleDiscount += diaNocheCount * 225;
    bundleLabels.push(diaNocheCount > 1 ? `Pack Día & Noche × ${diaNocheCount} (15% OFF)` : `Pack Día & Noche (15% OFF)`);
    qtyMap["energy"] -= diaNocheCount;
    qtyMap["sleep"] -= diaNocheCount;
  }

  // 3. Pack Calma & Sueño (zen + sleep) -> $225 OFF per duo
  const calmaSuenoCount = Math.min(qtyMap["zen"] || 0, qtyMap["sleep"] || 0);
  if (calmaSuenoCount > 0) {
    bundleDiscount += calmaSuenoCount * 225;
    bundleLabels.push(calmaSuenoCount > 1 ? `Pack Calma & Sueño × ${calmaSuenoCount} (15% OFF)` : `Pack Calma & Sueño (15% OFF)`);
    qtyMap["zen"] -= calmaSuenoCount;
    qtyMap["sleep"] -= calmaSuenoCount;
  }

  // 4. Pack Glow & Balance (glow + woman) -> $225 OFF per duo
  const glowBalanceCount = Math.min(qtyMap["glow"] || 0, qtyMap["woman"] || 0);
  if (glowBalanceCount > 0) {
    bundleDiscount += glowBalanceCount * 225;
    bundleLabels.push(glowBalanceCount > 1 ? `Pack Glow & Balance × ${glowBalanceCount} (15% OFF)` : `Pack Glow & Balance (15% OFF)`);
    qtyMap["glow"] -= glowBalanceCount;
    qtyMap["woman"] -= glowBalanceCount;
  }

  const bundleName = bundleLabels.length > 0 ? bundleLabels.join(" + ") : null;

  const subSavings = subtotal - total;
  const finalTotal = Math.max(0, total - bundleDiscount);

  return { subtotal, savings: subSavings, bundleDiscount, bundleName, total: finalTotal };
}

// ─── Smart Bundle Upsell Helper ────────────────────────────────────────────────

export type SmartUpsell = {
  badge: string;
  title: string;
  subtitle: string;
  candidate: {
    slug: string;
    name: string;
    tagline: string;
    price: number;
    image: string;
    color: string;
    bg: string;
  };
};

export function getSmartUpsell(items: CartItem[]): SmartUpsell | null {
  const qtyMap: Record<string, number> = {};
  for (const item of items) {
    qtyMap[item.slug] = (qtyMap[item.slug] || 0) + item.quantity;
  }

  const ALL_CANDIDATES: Record<string, SmartUpsell["candidate"]> = {
    sleep: { slug: "sleep", name: "Sleep", tagline: "Descanso nocturno reparador", price: 750, image: "/products/Sleep_thumb.webp", color: "#138A75", bg: "#EBF7F5" },
    energy: { slug: "energy", name: "Energy", tagline: "Energía celular sostenida", price: 750, image: "/products/Energy_thumb.webp", color: "#2B7CC1", bg: "#EBF4FB" },
    zen: { slug: "zen", name: "Zen", tagline: "Calma mental diaria", price: 750, image: "/products/Zen_thumb.webp", color: "#3A6FA8", bg: "#EBF0F9" },
    glow: { slug: "glow", name: "Glow", tagline: "Bienestar desde adentro", price: 750, image: "/products/Glow_thumb.webp", color: "#C94030", bg: "#FAF0EE" },
    woman: { slug: "woman", name: "Woman", tagline: "Equilibrio hormonal femenino", price: 750, image: "/products/Woman_thumb.webp", color: "#8A3EBE", bg: "#F3EBF9" },
    shield: { slug: "shield", name: "Shield", tagline: "Fortaleza inmune natural", price: 750, image: "/products/Shield_thumb.webp", color: "#A07000", bg: "#FAF6E9" },
  };

  const energyQty = qtyMap["energy"] || 0;
  const sleepQty = qtyMap["sleep"] || 0;
  const zenQty = qtyMap["zen"] || 0;
  const glowQty = qtyMap["glow"] || 0;
  const womanQty = qtyMap["woman"] || 0;

  // Case 1: Energy + Sleep present, but Zen is missing for any of them -> Upgrade to Trío Vitalidad
  if (energyQty > 0 && sleepQty > 0 && zenQty < Math.min(energyQty, sleepQty)) {
    return {
      badge: "20% OFF PACK TRÍO",
      title: "desbloquea el trío vitalidad",
      subtitle: "Agrega Zen y obtén 20% OFF en tu rutina completa (ahorras $450 MXN por trío).",
      candidate: ALL_CANDIDATES.zen,
    };
  }

  // Case 2: Unmatched Energy -> Complete Pack Día & Noche with Sleep
  if (energyQty > sleepQty) {
    const diff = energyQty - sleepQty;
    return {
      badge: "15% OFF PACK DÚO",
      title: diff > 1 ? `completa ${diff} packs día & noche` : "completa el pack día & noche",
      subtitle: "Agrega Sleep para armar tu dúo y obtén 15% OFF (ahorras $225 MXN por pack).",
      candidate: ALL_CANDIDATES.sleep,
    };
  }

  // Case 3: Unmatched Sleep -> Complete Pack Día & Noche with Energy
  if (sleepQty > energyQty && sleepQty > zenQty) {
    return {
      badge: "15% OFF PACK DÚO",
      title: "completa el pack día & noche",
      subtitle: "Agrega Energy para armar tu dúo y obtén 15% OFF (ahorras $225 MXN por pack).",
      candidate: ALL_CANDIDATES.energy,
    };
  }

  // Case 4: Unmatched Zen -> Complete Pack Calma & Sueño with Sleep
  if (zenQty > sleepQty) {
    return {
      badge: "15% OFF PACK DÚO",
      title: "completa el pack calma & sueño",
      subtitle: "Agrega Sleep para armar tu dúo de calma y obtén 15% OFF (ahorras $225 MXN por pack).",
      candidate: ALL_CANDIDATES.sleep,
    };
  }

  // Case 5: Unmatched Glow -> Complete Pack Glow & Balance with Woman
  if (glowQty > womanQty) {
    return {
      badge: "15% OFF PACK DÚO",
      title: "completa el pack glow & balance",
      subtitle: "Agrega Woman para acompañar tu ritmo y obtén 15% OFF (ahorras $225 MXN por pack).",
      candidate: ALL_CANDIDATES.woman,
    };
  }

  // Case 6: Unmatched Woman -> Complete Pack Glow & Balance with Glow
  if (womanQty > glowQty) {
    return {
      badge: "15% OFF PACK DÚO",
      title: "completa el pack glow & balance",
      subtitle: "Agrega Glow para nutrición interna y obtén 15% OFF (ahorras $225 MXN por pack).",
      candidate: ALL_CANDIDATES.glow,
    };
  }

  // Fallback: If all current items are balanced in bundles, offer the next unadded product
  const unadded = Object.values(ALL_CANDIDATES).filter((c) => (qtyMap[c.slug] || 0) === 0);
  if (unadded.length === 0) return null;

  return {
    badge: "RECOMENDACIÓN",
    title: "completa tu rutina",
    subtitle: "Acompaña tu día con nuestro parche complementario.",
    candidate: unadded[0],
  };
}
