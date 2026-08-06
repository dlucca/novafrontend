"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Tag, Loader2, CheckCircle2 } from "lucide-react";
import { useCart, type AppliedCoupon } from "@/contexts/CartContext";
import { cartTotals, itemDisplayPrice, FREQ_LABELS, type CartItem } from "@/lib/cart";
import { useState, useCallback, useEffect } from "react";
import { medusa } from "@/lib/medusa";
import { useMarket } from "@/lib/useMarket";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING } from "@/lib/free-shipping";

// ─── Types ────────────────────────────────────────────────────────────────────

type CouponStatus = "idle" | "loading";

interface ToastState {
  message: string;
  visible: boolean;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: ToastState) {
  // Persistent aria-live container stays in the DOM so ATs reliably catch
  // the announcement even when the visual element mounts/unmounts.
  return (
    <>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {visible ? message : ""}
      </div>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2.5 bg-navy-light text-white text-[13px] font-semibold px-4 py-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.22)] max-w-[340px] w-max"
          >
            <span className="text-coral flex-shrink-0">✕</span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Coupon Input ─────────────────────────────────────────────────────────────

interface CouponInputProps {
  onApply: (code: string) => void;
  onRemove: (code: string) => void;
  status: CouponStatus;
  applied: AppliedCoupon[];
}

function CouponInput({ onApply, onRemove, status, applied }: CouponInputProps) {
  const [code, setCode] = useState("");

  function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) return;
    onApply(trimmed);
    setCode("");
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Applied coupon chips */}
      <AnimatePresence initial={false}>
        {applied.map((c) => (
          <motion.div
            key={c.code}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-[12px] font-black text-green-600 tracking-wide">{c.code}</p>
                <p className="text-[10px] text-green-400 font-medium">
                  {c.label}
                  {c.deferred || c.kind === "shipping" ? " · se aplica al pagar" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(c.code)}
              className="w-6 h-6 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors duration-150"
              aria-label={`Quitar cupón ${c.code}`}
            >
              <X size={11} className="text-green-600" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Input — always available so the user can stack multiple codes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Tag
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder={applied.length > 0 ? "Agregar otro código" : "Código de descuento"}
            disabled={status === "loading"}
            className="w-full pl-8 pr-3 py-2.5 text-[13px] font-semibold text-navy-light placeholder:text-slate-300 placeholder:font-normal bg-white border-2 border-gray-200 focus:border-coral focus:outline-none rounded-xl transition-colors duration-150 disabled:opacity-50 uppercase tracking-wide"
            maxLength={64}
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code.trim() || status === "loading"}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-navy-light hover:bg-navy disabled:bg-gray-200 disabled:text-gray-400 text-white text-[12px] font-black rounded-xl transition-all duration-150 min-w-[80px]"
        >
          {status === "loading" ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            "Aplicar"
          )}
        </button>
      </motion.div>
    </div>
  );
}

// ─── Item de carrito ──────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCart();
  const market = useMarket();
  const displayPrice = itemDisplayPrice(item);
  const isSub = item.mode === "sub";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22 }}
      className="flex gap-3 items-start py-4 border-b border-black/[0.06] last:border-0"
    >
      {/* Imagen */}
      <div
        className="relative w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: item.bg }}
      >
        <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-bold text-navy-light leading-tight">{item.title}</p>
            {isSub ? (
              <span
                className="inline-block mt-0.5 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                style={{ background: item.color }}
              >
                SUB · {FREQ_LABELS[item.freq]}
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">Compra única</span>
            )}
          </div>
          <button
            onClick={() => removeItem(item.slug, item.mode, item.freq)}
            className="text-slate-300 hover:text-coral transition-colors duration-150 flex-shrink-0 mt-0.5"
            aria-label="Eliminar"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Precio + qty */}
        <div className="flex items-center justify-between mt-2">
          <div
            role="group"
            aria-label={`Cantidad de ${item.title}`}
            className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5"
          >
            <button
              onClick={() => updateQty(item.slug, item.mode, item.freq, -1)}
              aria-label={`Disminuir cantidad de ${item.title}`}
              className="w-6 h-6 rounded-md flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-150 text-[13px] font-bold"
            >
              <span aria-hidden="true">−</span>
            </button>
            <span
              aria-label={`${item.quantity} en el carrito`}
              className="w-5 text-center text-[13px] font-bold text-navy-light"
            >
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.slug, item.mode, item.freq, +1)}
              aria-label={`Aumentar cantidad de ${item.title}`}
              className="w-6 h-6 rounded-md flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-150 text-[13px] font-bold"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <div className="text-right">
            <p className="text-[15px] font-black text-navy-light">
              {formatPrice(displayPrice * item.quantity, market.currency)}
            </p>
            {isSub && item.quantity === 1 && (
              <p className="text-[10px] text-gray-400 line-through">{formatPrice(item.price, market.currency)}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Estado vacío ─────────────────────────────────────────────────────────────

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center">
        <ShoppingBag size={28} className="text-coral" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[15px] font-bold text-navy-light">Tu carrito está vacío</p>
        <p className="text-[13px] text-gray-400 mt-1 leading-relaxed">
          Agrega un parche y empieza tu rutina.
        </p>
      </div>
      <Link
        href="/tienda"
        onClick={onClose}
        className="mt-2 inline-flex items-center gap-2 bg-coral text-white font-bold text-[14px] px-6 py-3 rounded-full hover:bg-coral-dark transition-colors duration-200"
      >
        Ver productos
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// ─── Coupon logic ─────────────────────────────────────────────────────────────

async function applyDiscountCode(code: string): Promise<AppliedCoupon> {
  const upperCode = code.toUpperCase();
  const cartId = medusa.cart.getStoredId();
  if (!cartId) {
    throw new Error("Agregá productos al carrito primero");
  }

  // POST /store/carts/:id/promotions — same endpoint the smoke test uses.
  // Medusa accumulates promo codes on the cart; we read the resulting
  // promotions[] to confirm acceptance.
  //
  // Three possible outcomes:
  //   1. Error / non-2xx → applyPromotion throws → genuinely invalid code.
  //   2. 200 + code present in cart.promotions → applied immediately
  //      (order-target promo, conditions met).
  //   3. 200 + code NOT in cart.promotions → Medusa accepted the code as
  //      valid but couldn't apply it yet (typical case: shipping-target promo
  //      before a shipping_method is set). We mark it as "deferred" and
  //      checkout retries it after applying the shipping method.
  const cart = await medusa.cart.applyPromotion(cartId, upperCode);
  const applied = cart.promotions?.find(
    (p) => p.code?.toUpperCase() === upperCode
  );

  if (applied) {
    const targetType = applied.application_method?.target_type;
    const kind: "order" | "shipping" =
      targetType === "shipping_methods" ? "shipping" : "order";
    const discountPct = applied.application_method?.value ?? 0;
    return {
      code: upperCode,
      discountPct,
      kind,
      label:
        kind === "shipping"
          ? "Envío gratis"
          : `${discountPct}% de descuento`,
    };
  }

  // Outcome 3 — assume shipping-target promo waiting for shipping_method.
  // We can't know the discount value yet (Medusa didn't return application_method),
  // so we just defer.
  return {
    code: upperCode,
    discountPct: 0,
    kind: "shipping",
    label: "Envío gratis",
    deferred: true,
  };
}

// ─── Drawer principal ─────────────────────────────────────────────────────────

export default function CartDrawer() {
  const { items, isOpen, closeCart, coupons, applyCoupon, removeCoupon } = useCart();
  const market = useMarket();
  const { savings, total } = cartTotals(items);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const hasSubs = items.some((i) => i.mode === "sub");

  // Shipping is calculated at checkout once the address is known (zone-based).
  // Showing a placeholder price here would be misleading, so we hide the line.

  // Coupon UI state (loading flag — applied/idle derived from context)
  const [couponLoading, setCouponLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const couponStatus: CouponStatus = couponLoading ? "loading" : "idle";

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  }, []);

  const handleApply = useCallback(async (code: string) => {
    setCouponLoading(true);
    try {
      const coupon = await applyDiscountCode(code);
      applyCoupon(coupon);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al aplicar el cupón");
    } finally {
      setCouponLoading(false);
    }
  }, [applyCoupon, showToast]);

  const handleRemove = useCallback((code: string) => {
    const cartId = medusa.cart.getStoredId();
    if (cartId) {
      medusa.cart.removePromotion(cartId, code).catch(() => {});
    }
    removeCoupon(code);
  }, [removeCoupon]);

  // Totales con descuento.
  // We only apply order-kind discounts to the visible total here; shipping
  // discounts kick in at checkout once Medusa knows the shipping method.
  const orderCoupons = coupons.filter((c) => c.kind === "order");
  const shippingCoupon = coupons.find((c) => c.kind === "shipping") ?? null;
  const totalOrderPct = orderCoupons.reduce((sum, c) => sum + c.discountPct, 0);
  const discountAmount = Math.round(total * (Math.min(totalOrderPct, 100) / 100));
  const finalTotal = total - discountAmount;

  return (
    <>
      <Toast {...toast} />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
              onClick={closeCart}
            />

            {/* Panel */}
            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-heading"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] bg-white shadow-[-8px_0_48px_rgba(0,0,0,0.12)] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-coral" />
                  <h2 id="cart-heading" className="text-[16px] font-black text-ocean">
                    Tu carrito
                    {count > 0 && (
                      <span className="ml-1.5 text-[12px] font-bold text-gray-400">({count})</span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-150"
                  aria-label="Cerrar carrito"
                >
                  <X size={15} className="text-gray-700" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5">
                {items.length === 0 ? (
                  <EmptyCart onClose={closeCart} />
                ) : (
                  <motion.div layout className="py-2">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartItemRow key={`${item.slug}-${item.mode}-${item.freq}`} item={item} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="border-t border-black/[0.06] px-5 py-5 flex flex-col gap-3 bg-surface"
                  >
                    {/* Ahorro suscripción */}
                    {hasSubs && savings > 0 && (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                        <p className="text-[12px] font-semibold text-green-600">
                          🎉 Ahorro con suscripción
                        </p>
                        <p className="text-[13px] font-black text-green-600">−{formatPrice(savings, market.currency)}</p>
                      </div>
                    )}

                    {/* ── Cupón ── */}
                    <div className="flex flex-col gap-2">
                      <CouponInput
                        onApply={handleApply}
                        onRemove={handleRemove}
                        status={couponStatus}
                        applied={coupons}
                      />
                    </div>

                    {/* Totales */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-semibold text-navy-light">{formatPrice(total, market.currency)}</span>
                      </div>

                      {/* Línea(s) de descuento de orden */}
                      <AnimatePresence>
                        {orderCoupons.map((c) => {
                          const amount = Math.round(total * (c.discountPct / 100));
                          if (amount <= 0) return null;
                          return (
                            <motion.div
                              key={`discount-line-${c.code}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="flex justify-between text-[13px] py-0.5">
                                <span className="text-green-600 font-semibold flex items-center gap-1">
                                  <Tag size={11} />
                                  {c.code}
                                </span>
                                <span className="font-bold text-green-600">−{formatPrice(amount, market.currency)}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      <div className="flex justify-between text-[12px] text-gray-500">
                        <span>Envío</span>
                        <span className={FREE_SHIPPING || shippingCoupon ? "text-green-600 font-semibold" : ""}>
                          {FREE_SHIPPING ? "GRATIS" : shippingCoupon ? "Gratis al pagar" : "Calculado al pagar"}
                        </span>
                      </div>

                      <div className="flex justify-between text-[16px] font-black text-ocean pt-1 border-t border-black/[0.06]">
                        <span>Total</span>
                        <motion.span
                          key={finalTotal}
                          initial={{ scale: 1.08, color: "var(--color-teal)" }}
                          animate={{ scale: 1, color: "var(--color-ocean)" }}
                          transition={{ duration: 0.3 }}
                        >
                          {formatPrice(finalTotal, market.currency)}
                        </motion.span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-bold text-[15px] py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,80,58,0.35)] shadow-[0_4px_12px_rgba(232,80,58,0.2)]"
                    >
                      Ir a pagar
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {["🔒 Pago seguro", "Visa", "MC"].map((b) => (
                        <span key={b} className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                          {b}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
