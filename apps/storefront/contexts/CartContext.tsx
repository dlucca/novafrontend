"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";
import { trackMeta } from "@/lib/meta";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";
import {
  getCart,
  addToCart as cartAdd,
  updateQuantity as cartUpdateQty,
  removeFromCart as cartRemove,
  clearCart as cartClear,
  CART_UPDATED_EVENT,
  type CartItem,
} from "@/lib/cart";

export type AppliedCoupon = {
  code: string;
  discountPct: number;
  label: string;
  /** "order" → applies to subtotal; "shipping" → applies to shipping at checkout */
  kind: "order" | "shipping";
  /**
   * true when Medusa accepted the request but didn't attach the promo to the
   * cart yet — typically a shipping promo applied before a shipping_method is
   * set. The code is retried at checkout after shipping is applied.
   */
  deferred?: boolean;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQty: (slug: string, mode: "once" | "sub", freq: 30 | 60 | 90, delta: number) => void;
  removeItem: (slug: string, mode: "once" | "sub", freq: 30 | 60 | 90) => void;
  coupons: AppliedCoupon[];
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: (code: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

const COUPON_STORAGE_KEY = "novapatch_coupon";
const CART_LOCALE_KEY = "novapatch_cart_locale";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState<AppliedCoupon[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Backward-compat: previously we stored a single coupon object.
      if (Array.isArray(parsed)) return parsed as AppliedCoupon[];
      if (parsed && typeof parsed === "object" && "code" in parsed) {
        return [{ ...(parsed as AppliedCoupon), kind: (parsed as AppliedCoupon).kind ?? "order" }];
      }
      return [];
    } catch {
      return [];
    }
  });

  const sync = useCallback(() => setItems(getCart()), []);

  useEffect(() => {
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  // Clear cart on locale change: cart items are priced in the market they were
  // added in; switching markets would show wrong currency labels.
  const params = useParams();
  const currentLocale = typeof params?.locale === "string" ? params.locale : "mx";
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(CART_LOCALE_KEY);
    if (stored && stored !== currentLocale) {
      cartClear();
      setCoupons([]);
      localStorage.removeItem(COUPON_STORAGE_KEY);
      sync();
    }
    localStorage.setItem(CART_LOCALE_KEY, currentLocale);
  }, [currentLocale, sync]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart: (item) => {
          cartAdd(item);
          setIsOpen(true);
          if (typeof window !== "undefined") {
            const qty = item.quantity ?? 1;
            posthog.capture("add_to_cart", {
              product_id: item.slug,
              variant_id: item.variantId ?? item.slug,
              quantity: qty,
              price: item.price,
              mode: item.mode,
              freq: item.freq,
            });
            const currency = MARKETS[currentLocale as Locale]?.currency ?? "MXN";
            trackMeta(
              "AddToCart",
              {
                currency,
                value: item.price * qty,
                content_ids: [item.variantId ?? item.slug],
                content_name: item.title,
                content_type: "product",
                contents: [{ id: item.variantId ?? item.slug, quantity: qty, item_price: item.price }],
                num_items: qty,
              },
              {
                email: user?.primaryEmailAddress?.emailAddress,
                phone: user?.primaryPhoneNumber?.phoneNumber ?? undefined,
                firstName: user?.firstName ?? undefined,
                lastName: user?.lastName ?? undefined,
                externalId: user?.id,
              }
            );
          }
        },
        updateQty: (slug, mode, freq, delta) => {
          cartUpdateQty(slug, mode, freq, delta);
          if (typeof window !== "undefined") {
            posthog.capture("cart_quantity_updated", {
              product_id: slug,
              mode,
              freq,
              delta,
            });
          }
        },
        removeItem: (slug, mode, freq) => {
          cartRemove(slug, mode, freq);
          if (typeof window !== "undefined") {
            posthog.capture("remove_from_cart", {
              product_id: slug,
              mode,
              freq,
            });
          }
        },
        coupons,
        applyCoupon: (c) => {
          setCoupons((prev) => {
            // Replace if same code already present (case-insensitive); otherwise append.
            const filtered = prev.filter((p) => p.code.toUpperCase() !== c.code.toUpperCase());
            const next = [...filtered, c];
            if (typeof window !== "undefined") {
              localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(next));
            }
            return next;
          });
        },
        removeCoupon: (code) => {
          setCoupons((prev) => {
            const next = prev.filter((p) => p.code.toUpperCase() !== code.toUpperCase());
            if (typeof window !== "undefined") {
              if (next.length === 0) localStorage.removeItem(COUPON_STORAGE_KEY);
              else localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(next));
            }
            return next;
          });
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
