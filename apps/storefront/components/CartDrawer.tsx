"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Tag, Loader2, CheckCircle2 } from "lucide-react";
import { useCart, type AppliedCoupon } from "@/contexts/CartContext";
import { cartTotals, itemDisplayPrice, getSmartUpsell, FREQ_LABELS, type CartItem } from "@/lib/cart";
import { useState, useCallback, useEffect } from "react";
import { medusa } from "@/lib/medusa";
import { useMarket } from "@/lib/useMarket";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING } from "@/lib/free-shipping";
import { getCartThumbnail } from "@/lib/product-meta";

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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2.5 bg-[#0F0F0F] text-white text-[13px] font-sans font-medium px-4 py-3 rounded-full shadow-lg max-w-[340px] w-max border border-[#E6E1D8]/20"
          >
            <span className="text-white flex-shrink-0">✕</span>
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
            className="w-full pl-8 pr-3 py-2.5 text-[12px] font-sans font-medium text-[#0F0F0F] placeholder:text-[#A8A29A] placeholder:font-normal bg-white border border-[#E6E1D8] focus:border-[#0F0F0F] focus:outline-none rounded-xl transition-colors duration-150 disabled:opacity-50 uppercase tracking-wider"
            maxLength={64}
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code.trim() || status === "loading"}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] disabled:bg-[#FAF8F5] disabled:text-[#A8A29A] text-white border border-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] rounded-full transition-all duration-150 min-w-[80px]"
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
  const { updateQty, removeItem, closeCart } = useCart();
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
      className="flex gap-3 items-start py-4 border-b border-[#E6E1D8] last:border-0"
    >
      {/* Imagen */}
      <Link
        href={`/tienda/${item.slug}`}
        onClick={closeCart}
        className="relative w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#E6E1D8] bg-white group/item hover:border-[#0F0F0F] transition-colors"
      >
        <Image src={getCartThumbnail(item.slug, item.image)} alt={item.title} fill className="object-cover group-hover/item:scale-105 transition-transform" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/tienda/${item.slug}`}
              onClick={closeCart}
              className="text-[14px] font-sans font-semibold text-[#0F0F0F] leading-tight hover:underline inline-block"
            >
              {item.title}
            </Link>
            {isSub ? (
              <span
                className="block mt-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0F0F0F] text-white w-fit"
              >
                SUB · {FREQ_LABELS[item.freq]}
              </span>
            ) : (
              <span className="block text-[11px] font-sans text-[#A8A29A]">Compra única</span>
            )}
          </div>
          <button
            onClick={() => removeItem(item.slug, item.mode, item.freq)}
            className="text-[#A8A29A] hover:text-[#0F0F0F] transition-colors duration-150 flex-shrink-0 mt-0.5 cursor-pointer"
            aria-label="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Precio + qty */}
        <div className="flex items-center justify-between mt-3">
          <div
            role="group"
            aria-label={`Cantidad de ${item.title}`}
            className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E6E1D8] rounded-full p-0.5"
          >
            <button
              onClick={() => updateQty(item.slug, item.mode, item.freq, -1)}
              aria-label={`Disminuir cantidad de ${item.title}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all duration-150 text-[13px] font-bold cursor-pointer"
            >
              <span aria-hidden="true">−</span>
            </button>
            <span
              aria-label={`${item.quantity} en el carrito`}
              className="w-5 text-center text-[12px] font-mono font-bold text-[#0F0F0F]"
            >
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.slug, item.mode, item.freq, +1)}
              aria-label={`Aumentar cantidad de ${item.title}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all duration-150 text-[13px] font-bold cursor-pointer"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <div className="text-right">
            <p className="text-[14px] font-mono font-bold text-[#0F0F0F]">
              {formatPrice(displayPrice * item.quantity, market.currency)}
            </p>
            {isSub && item.quantity === 1 && (
              <p className="text-[10px] font-mono text-[#A8A29A] line-through">{formatPrice(item.price, market.currency)}</p>
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
      <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-[#0F0F0F]">
        <ShoppingBag size={24} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-base font-display font-semibold text-[#0F0F0F] lowercase">tu carrito está vacío</p>
        <p className="text-xs font-sans text-[#3A3A37] mt-1 leading-relaxed max-w-xs">
          Agrega un parche y empieza tu rutina.
        </p>
      </div>
      <Link
        href="/tienda"
        onClick={onClose}
        className="mt-2 inline-flex items-center gap-2 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-6 py-3 rounded-full transition-all duration-200"
      >
        Ver productos
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
  const { items, isOpen, closeCart, coupons, applyCoupon, removeCoupon, addToCart } = useCart();
  const market = useMarket();
  const { savings, bundleDiscount, bundleName, total } = cartTotals(items);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const hasSubs = items.some((i) => i.mode === "sub");

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
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E1D8]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={18} className="text-[#0F0F0F]" />
                  <h2 id="cart-heading" className="text-lg font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase">
                    tu carrito
                    {count > 0 && (
                      <span className="ml-1.5 font-mono text-xs font-medium text-[#A8A29A]">({count})</span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] hover:bg-[#0F0F0F] hover:text-white flex items-center justify-center transition-colors duration-150 cursor-pointer"
                  aria-label="Cerrar carrito"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6">
                {items.length === 0 ? (
                  <EmptyCart onClose={closeCart} />
                ) : (
                  <motion.div layout className="py-2">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartItemRow key={`${item.slug}-${item.mode}-${item.freq}`} item={item} />
                      ))}
                    </AnimatePresence>

                    {/* Upsell / Cross-sell Inteligente de Bundle */}
                    {(() => {
                      const upsell = getSmartUpsell(items);
                      if (!upsell) return null;
                      const { candidate } = upsell;

                      return (
                        <div className="mt-4 pt-4 border-t border-[#E6E1D8]">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">
                              {upsell.title}
                            </p>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0F0F0F] text-white">
                              {upsell.badge}
                            </span>
                          </div>
                          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                            <Link
                              href={`/tienda/${candidate.slug}`}
                              onClick={closeCart}
                              className="flex items-center gap-3 min-w-0 group/upsell"
                            >
                              <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg border border-[#E6E1D8] bg-white p-1 group-hover/upsell:border-[#0F0F0F] transition-colors">
                                <Image src={getCartThumbnail(candidate.slug, candidate.image)} alt={candidate.name} fill className="object-contain group-hover/upsell:scale-105 transition-transform" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-sans font-semibold text-[#0F0F0F] truncate group-hover/upsell:underline">{candidate.name}</p>
                                <p className="text-[11px] font-sans text-[#3A3A37] leading-tight line-clamp-2 mt-0.5">{upsell.subtitle}</p>
                                <p className="text-[11px] font-mono font-bold text-[#0F0F0F] mt-1">
                                  {formatPrice(candidate.price, market.currency)}
                                </p>
                              </div>
                            </Link>
                            <button
                              onClick={() =>
                                addToCart({
                                  slug: candidate.slug,
                                  title: candidate.name,
                                  price: candidate.price,
                                  image: candidate.image,
                                  color: candidate.color,
                                  bg: candidate.bg,
                                  mode: "once",
                                  freq: 30,
                                  quantity: 1,
                                })
                              }
                              className="shrink-0 px-3.5 py-2 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all duration-200 cursor-pointer"
                            >
                              + agregar
                            </button>
                          </div>
                        </div>
                      );
                    })()}
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
                    className="border-t border-[#E6E1D8] px-6 py-5 flex flex-col gap-3.5 bg-[#FAF8F5]"
                  >
                    {/* Descuento por Bundle Automático */}
                    {bundleDiscount > 0 && bundleName && (
                      <div className="flex items-center justify-between bg-white border border-[#E6E1D8] rounded-xl px-4 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-[#0F0F0F] shrink-0">
                            BUNDLE
                          </span>
                          <p className="text-[12px] font-sans font-medium text-[#0F0F0F] truncate">
                            {bundleName}
                          </p>
                        </div>
                        <p className="text-[13px] font-mono font-bold text-[#0F0F0F] shrink-0">−{formatPrice(bundleDiscount, market.currency)}</p>
                      </div>
                    )}
                    {/* Ahorro suscripción */}
                    {hasSubs && savings > 0 && (
                      <div className="flex items-center justify-between bg-white border border-[#E6E1D8] rounded-xl px-4 py-2.5">
                        <p className="text-[12px] font-sans font-medium text-[#0F0F0F]">
                          Ahorro con suscripción
                        </p>
                        <p className="text-[13px] font-mono font-bold text-[#0F0F0F]">−{formatPrice(savings, market.currency)}</p>
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
                    <div className="flex flex-col gap-2 pt-2 border-t border-[#E6E1D8]">
                      <div className="flex justify-between text-xs font-sans text-[#3A3A37]">
                        <span>Subtotal</span>
                        <span className="font-mono font-semibold text-[#0F0F0F]">{formatPrice(total, market.currency)}</span>
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
                              <div className="flex justify-between text-xs font-sans py-0.5">
                                <span className="text-[#0F0F0F] font-medium flex items-center gap-1">
                                  <Tag size={11} />
                                  {c.code}
                                </span>
                                <span className="font-mono font-bold text-[#0F0F0F]">−{formatPrice(amount, market.currency)}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      <div className="flex justify-between text-xs font-sans text-[#A8A29A]">
                        <span>Envío</span>
                        <span className={FREE_SHIPPING || shippingCoupon ? "text-[#0F0F0F] font-semibold" : ""}>
                          {FREE_SHIPPING ? "GRATIS" : shippingCoupon ? "Gratis al pagar" : "Calculado al pagar"}
                        </span>
                      </div>

                      <div className="flex justify-between text-base font-sans font-bold text-[#0F0F0F] pt-2 border-t border-[#E6E1D8]">
                        <span>Total</span>
                        <motion.span
                          key={finalTotal}
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="font-mono font-bold text-[#0F0F0F]"
                        >
                          {formatPrice(finalTotal, market.currency)}
                        </motion.span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-2 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[12px] font-sans font-medium uppercase tracking-[0.12em] py-3.5 rounded-full transition-all duration-200 shadow-2xs"
                    >
                      Ir a pagar
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {["🔒 Pago seguro", "Visa", "Mastercard", "AMEX", "BBVA"].map((b) => (
                        <span key={b} className="text-[10px] text-[#3A3A37] font-sans font-medium bg-white border border-[#E6E1D8] px-2.5 py-0.5 rounded-full">
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
