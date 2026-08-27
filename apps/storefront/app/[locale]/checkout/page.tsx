"use client";


// NOTE: Bundle items are already fully normalized into individual product items
// (energy, sleep, zen, glow, woman) by normalizeCartItems() in lib/cart.ts before
// they reach this component. No expansion is needed here.

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import posthog from "posthog-js";
import { trackMeta, stashPurchaseForRedirect } from "@/lib/meta";
import { useCart, type AppliedCoupon } from "@/contexts/CartContext";
import { medusa } from "@/lib/medusa";
import { formatPrice } from "@/lib/format";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";
import { tokenizeCard, parseCardForm, getDeviceSessionId } from "@/lib/openpay";
import { tokenizeCardMP, parseCardFormMP } from "@/lib/mercadopago";
import { useCopomex } from "@/hooks/useCopomex";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { FREE_SHIPPING } from "@/lib/free-shipping";
import { getCartThumbnail } from "@/lib/product-meta";
import {
  CartItem,
  FREQ_LABELS,
  FREQ_DISCOUNTS,
  itemDisplayPrice,
  cartTotals,
  getSmartUpsell,
  clearCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/cart";
import {
  ChevronLeft,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  User,
  Repeat,
  LogIn,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Loader2,
  ChevronDown,
  XCircle,
  Plus,
  Minus,
  Trash2,
  Tag,
  X,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(n: number, region: string = "mxn") {
  return formatPrice(n, region.toUpperCase());
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function OrderItem({ item, region }: { item: CartItem; region: string }) {
  const price = itemDisplayPrice(item);
  const isSub = item.mode === "sub";

  return (
    <div className="flex items-start gap-3 py-3.5">
      {/* image chip */}
      <Link
        href={`/tienda/${item.slug}`}
        className="relative shrink-0 w-14 h-14 block group/item mt-0.5"
      >
        <div
          className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center border border-[#E6E1D8] bg-white group-hover/item:border-[#0F0F0F] transition-colors"
        >
          <Image
            src={getCartThumbnail(item.slug, item.image)}
            alt={item.title}
            fill
            className="object-cover group-hover/item:scale-105 transition-transform"
          />
        </div>
      </Link>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <Link
            href={`/tienda/${item.slug}`}
            className="text-[14px] font-sans font-semibold text-[#0F0F0F] leading-tight truncate hover:underline block"
          >
            {item.title}
          </Link>
          <button
            type="button"
            onClick={() => removeFromCart(item.slug, item.mode, item.freq)}
            className="text-[#A8A29A] hover:text-[#0F0F0F] p-1 transition-colors cursor-pointer shrink-0"
            title="Eliminar del carrito"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {isSub ? (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 bg-[#0F0F0F] text-white"
          >
            <Repeat size={9} />
            {FREQ_LABELS[item.freq]}
          </span>
        ) : (
          <span className="block text-[11px] font-sans text-[#A8A29A] mt-0.5">Compra única</span>
        )}

        {/* quantity controls + price row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E6E1D8] rounded-full p-0.5">
            <button
              type="button"
              onClick={() => updateQuantity(item.slug, item.mode, item.freq, -1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all duration-150 cursor-pointer"
              title="Disminuir cantidad"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center font-mono text-xs font-bold text-[#0F0F0F]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.slug, item.mode, item.freq, 1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all duration-150 cursor-pointer"
              title="Aumentar cantidad"
            >
              <Plus size={12} />
            </button>
          </div>

          <p className="text-[14px] font-mono font-bold text-[#0F0F0F]">
            {fmt(price * item.quantity, region)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Auth Gate ───────────────────────────────────────────────────────────────

function AuthGate() {
  const { openSignIn } = useClerk();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-[#E6E1D8] bg-white p-8 text-center shadow-2xs"
    >
      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E6E1D8] text-[#0F0F0F]"
      >
        <Lock size={24} />
      </div>

      <h3 className="text-xl font-display font-semibold text-[#0F0F0F] mb-2 tracking-[-0.035em] lowercase">
        crea tu cuenta para suscribirte
      </h3>
      <p className="font-sans text-sm text-[#3A3A37] leading-relaxed mb-6 max-w-[340px] mx-auto">
        Tu carrito incluye productos en modo suscripción. Necesitamos una
        cuenta para gestionar tus envíos recurrentes y descuentos.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() =>
            openSignIn({
              forceRedirectUrl: "/checkout",
            })
          }
          className="w-full py-3.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer"
        >
          Crear cuenta / Iniciar sesión
        </button>

        <Link
          href="/tienda"
          className="text-xs font-sans text-[#A8A29A] hover:text-[#0F0F0F] transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>

      {/* perks */}
      <div className="mt-7 grid grid-cols-3 gap-3 text-center">
        {[
          { icon: <ShieldCheck className="w-5 h-5 mx-auto text-[#0F0F0F]" />, label: "Datos seguros" },
          { icon: <Truck className="w-5 h-5 mx-auto text-[#0F0F0F]" />, label: "Envíos gestionados" },
          { icon: <XCircle className="w-5 h-5 mx-auto text-[#0F0F0F]" />, label: "Cancela cuando quieras" },
        ].map((p) => (
          <div
            key={p.label}
            className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E6E1D8]"
          >
            <div className="mb-1">{p.icon}</div>
            <p className="text-[10px] font-sans font-semibold text-[#3A3A37] leading-tight">
              {p.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
  autoComplete,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
        {label}
        {required && <span className="text-[#0F0F0F] ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] ${
          error ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] font-sans text-[#0F0F0F] flex items-center gap-1"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  step,
}: {
  icon: React.ReactNode;
  title: string;
  step: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold text-white bg-[#0F0F0F] shrink-0"
      >
        {step}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#0F0F0F]">{icon}</span>
        <h2 className="text-lg font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">
          {title}
        </h2>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

async function applyDiscountCode(code: string): Promise<AppliedCoupon> {
  const upperCode = code.toUpperCase();
  const cartId = medusa.cart.getStoredId();
  if (cartId) {
    try {
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
    } catch (apiErr) {
      // If Medusa call failed (network error, etc.) fall through to throw below
      console.warn("[Checkout] applyDiscountCode Medusa error:", apiErr);
    }
  }

  // If we reach here it means either:
  // a) There is no cart yet (cartId is null), or
  // b) The Medusa API call succeeded but the promotion was not found on the cart
  // Either way the code is not valid — never silently grant a discount.
  throw new Error("El código de descuento no es válido o ha expirado");
}

export default function CheckoutPage() {
    const { items, openCart, coupons, applyCoupon, removeCoupon, addToCart } = useCart();

  // ── Coupon state & handlers ──────────────────────────────────────
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = async (codeToApply: string) => {
    const trimmed = codeToApply.trim().toUpperCase();
    if (!trimmed) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const coupon = await applyDiscountCode(trimmed);
      applyCoupon(coupon);
      setCouponCodeInput("");
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : "Error al aplicar el cupón");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = (codeToRemove: string) => {
    removeCoupon(codeToRemove);
    const cartId = medusa.cart.getStoredId();
    if (cartId) {
      medusa.cart.removePromotion(cartId, codeToRemove).catch(() => {});
    }
  };
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const router = useRouter();

  const params = useParams();
  const localeParam = typeof params?.locale === "string" ? params.locale : "";
  const market = MARKETS[localeParam as Locale] ?? MARKETS.mx;
  const REGION_ID = market.medusaRegionId || process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || "reg_mx";
  const [cartRegion, setCartRegion] = useState<string>(
    localeParam === "ar" ? "ars" : "mxn"
  );

  const hasSubscriptions = items.some((i) => i.mode === "sub");
  const isSignedIn = !!user;
  const needsAuth = hasSubscriptions && !isSignedIn;

  // ── Preload state (must be declared before totals calculations) ───
  const [medusaSubtotal, setMedusaSubtotal] = useState<number | null>(null);

  const totals = cartTotals(items);
  const orderCoupons = coupons.filter((c) => c.kind === "order");
  const shippingCoupon = coupons.find((c) => c.kind === "shipping") ?? null;
  const totalOrderPct = orderCoupons.reduce((sum, c) => sum + c.discountPct, 0);

  const basePrice = medusaSubtotal !== null ? Math.max(0, medusaSubtotal - totals.bundleDiscount) : totals.total;
  const couponDiscount = Math.round(basePrice * (Math.min(totalOrderPct, 100) / 100));
  const effectiveCouponDiscount = couponDiscount;
  const finalTotal = Math.max(0, basePrice - couponDiscount);

  // ── form state ──────────────────────────────────────────────
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({
    street: "",
    colonia: "",
    city: "",
    state: "",
    zip: "",
    interior: "",
    instructions: "",
  });
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    dni: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Limpia el error de un campo en cuanto el usuario empieza a escribir
  const clearErr = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<number>(0); // 0=idle, 1-4=processing
  // Total confirmed by Medusa after shipping is applied — authoritative for what gets charged
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);
  // Real shipping cost returned by Medusa after applying the shipping method
  const [shippingCost, setShippingCost] = useState<number>(0);

  // ── Pre-carga: carrito + catálogo + customer sync al montar ───
  const [preloadedCartId, setPreloadedCartId] = useState<string | null>(null);
  const [variantIdMap, setVariantIdMap] = useState<Record<string, string>>({});
  const [preloadedCustomerId, setPreloadedCustomerId] = useState<string | undefined>();
  const preloadStarted = useRef(false);
  const itemsPreloaded = useRef(false);
  const couponAppliedInPreload = useRef(false);
  // Incrementing this triggers a fresh preload whenever items or coupons change.
  const [preloadVersion, setPreloadVersion] = useState(0);

  // ── Dirección Argentina ────────────────────────────────────
  const [addressAR, setAddressAR] = useState({
    street: "",
    depto: "",
    city: "",
    province: "",
    zip: "",
  });

  // ── COPOMEX (CP → colonias/estado/ciudad) ──────────────────
  const { state: copomex, lookup: lookupCp, reset: resetCopomex } = useCopomex();

  // ── Shipping preview (zone-based, MX) ──────────────────────
  // Shown while the user types the address. Superseded by `shippingCost`
  // once Medusa returns the applied shipping method amount at submit.
  // CDMX + Estado de México → $90, rest of MX → $145, unknown → 0 (hide row).
  const CDMX_EDOMEX_STATES = new Set([
    "cdmx",
    "ciudad de mexico",
    "distrito federal",
    "df",
    "mexico city",
    "estado de mexico",
    "mexico",
    "edo. mex.",
    "edomex",
    "edo de mexico",
  ]);
  const resolvedStateForPreview =
    cartRegion === "ars"
      ? addressAR.province
      : (copomex.status === "success" ? copomex.data.estado : "") || address.state;
  const normalizedStateForPreview = (resolvedStateForPreview ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  const shippingPreview =
    cartRegion === "ars"
      ? 0
      : normalizedStateForPreview === ""
        ? 0
        : CDMX_EDOMEX_STATES.has(normalizedStateForPreview)
          ? 90
          : 145;
  const displayShippingCost = FREE_SHIPPING
    ? 0
    : shippingCost > 0
      ? shippingCost
      : shippingPreview;

  // ── Google Places (street autocomplete) ────────────────────
  const streetInputRef = useRef<HTMLInputElement>(null);
  const placesCountry = cartRegion === "ars" ? "ar" : "mx";
  const { ready: placesReady } = useGooglePlaces(
    streetInputRef,
    (parts) => {
      if (cartRegion === "ars") {
        setAddressAR((a) => ({
          ...a,
          ...(parts.street ? { street: parts.street } : {}),
          ...(parts.city ? { city: parts.city } : {}),
          ...(parts.state ? { province: parts.state } : {}),
          ...(parts.zip ? { zip: parts.zip } : {}),
        }));
        return;
      }
      setAddress((a) => ({
        ...a,
        // street: si Places lo devuelve lo usamos; si no, mantener lo que el usuario escribió
        ...(parts.street ? { street: parts.street } : {}),
        ...(parts.colonia ? { colonia: parts.colonia } : {}),
        ...(parts.city    ? { city: parts.city }    : {}),
        ...(parts.state   ? { state: parts.state }  : {}),
        ...(parts.zip     ? { zip: parts.zip }      : {}),
      }));
      // Si Places nos dio un CP, lanzar COPOMEX también
      if (parts.zip?.length === 5) lookupCp(parts.zip);
    },
    placesCountry
  );

  // Limpiar errores de ciudad/estado/CP cuando COPOMEX resuelve con éxito
  useEffect(() => {
    if (copomex.status === "success") {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.zip;
        delete next.city;
        delete next.state;
        return next;
      });
    }
  }, [copomex.status]);

  // Pre-fill from Clerk user if available
  useEffect(() => {
    if (user) {
      setContact((c) => ({
        ...c,
        name: c.name || user.fullName || "",
        email: c.email || user.primaryEmailAddress?.emailAddress || "",
        phone: c.phone || user.primaryPhoneNumber?.phoneNumber || "",
      }));
    }
  }, [user]);

  // Redirect if cart is empty (after load)
  useEffect(() => {
    if (isLoaded && items.length === 0 && !orderCompleted.current) {
      router.replace("/tienda");
    }
  }, [isLoaded, items.length, router]);

  // ── Analytics: checkout_started ──────────────────────────────
  const checkoutTracked = useRef(false);
  const addPaymentInfoTracked = useRef(false);
  // Set right before navigating to the confirmation page so the empty-cart
  // guard below doesn't bounce us to /tienda after clearCart().
  const orderCompleted = useRef(false);
  useEffect(() => {
    if (!isLoaded || items.length === 0 || checkoutTracked.current) return;
    checkoutTracked.current = true;
    const numItems = items.reduce((sum, i) => sum + i.quantity, 0);
    posthog.capture("checkout_started", {
      cart_total: finalTotal, // pre-shipping estimate at fire time; real total confirmed at order_completed
      item_count: numItems,
    });
    trackMeta(
      "InitiateCheckout",
      {
        currency: market.currency,
        value: finalTotal,
        content_ids: items.map((i) => i.variantId ?? i.slug),
        contents: items.map((i) => ({
          id: i.variantId ?? i.slug,
          quantity: i.quantity,
          item_price: i.price,
        })),
        num_items: numItems,
      },
      {
        email: user?.primaryEmailAddress?.emailAddress,
        externalId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
    );
  }, [isLoaded, items, finalTotal, market.currency, user]);

  // When cart items OR coupons change (e.g. edited via CartDrawer or checkout coupon input),
  // discard the pre-loaded Medusa cart and schedule a fresh preload.
  const prevCartStateKey = useRef(
    JSON.stringify({
      items: items.map((i) => ({ id: i.slug, qty: i.quantity, mode: i.mode, freq: i.freq })),
      coupons: coupons.map((c) => c.code),
    })
  );
  useEffect(() => {
    const currentKey = JSON.stringify({
      items: items.map((i) => ({ id: i.slug, qty: i.quantity, mode: i.mode, freq: i.freq })),
      coupons: coupons.map((c) => c.code),
    });
    if (prevCartStateKey.current !== currentKey) {
      prevCartStateKey.current = currentKey;
      // Reset all preload refs first
      preloadStarted.current = false;
      itemsPreloaded.current = false;
      couponAppliedInPreload.current = false;
      setPreloadedCartId(null);
      setMedusaSubtotal(null);
      // Increment version to re-trigger the preload effect
      setPreloadVersion((v) => v + 1);
    }
  }, [items, coupons]);

  // ── Pre-carga: ejecutar en paralelo al montar la página ──────
  useEffect(() => {
    if (!isLoaded || items.length === 0 || preloadStarted.current) return;
    preloadStarted.current = true;

    // Snapshot coupons at effect-fire time — effect runs once
    const capturedCoupons = coupons;

    const preload = async () => {
      console.time("[Checkout] preload");

      // 1. Customer sync (si logueado) — en paralelo con catálogo
      const customerPromise = (async () => {
        if (!user) return undefined;
        try {
          const token = await getToken();
          if (token) {
            const mc = await medusa.customer.sync(token);
            return mc.id;
          }
        } catch { /* no bloquear */ }
        return undefined;
      })();

      // 2. Catálogo de productos → variant ID map — en paralelo
      const catalogPromise = (async () => {
        try {
          const products = await medusa.catalog.getProducts({ region_id: REGION_ID });
          const map: Record<string, string> = {};
          for (const p of products) {
            for (const v of p.variants ?? []) {
              const t = v.title.toLowerCase();
              if (t.includes("once"))           map[`${p.handle}-once`] = v.id;
              else if (t.includes("bimonthly")) map[`${p.handle}-60`]  = v.id;
              else if (t.includes("monthly"))   map[`${p.handle}-30`]  = v.id;
              else if (t.includes("quarterly")) map[`${p.handle}-90`]  = v.id;
            }
          }
          return map;
        } catch { return {}; }
      })();

      // Esperar customer + catálogo en paralelo, luego crear carrito con customer_id
      const [customerId, vMap] = await Promise.all([customerPromise, catalogPromise]);
      setVariantIdMap(vMap);
      setPreloadedCustomerId(customerId);

      // 3. Crear carrito + agregar items (secuencial por locking de Medusa)
      try {
        const cart = await medusa.cart.create(REGION_ID, customerId);
        const cartId = cart.id;
        setPreloadedCartId(cartId);
        const region = (cart.currency_code ?? "mxn").toLowerCase();
        setCartRegion(region);

        // 4. Pre-agregar items al carrito mientras el usuario llena el formulario
        // items is already normalized into individual products by lib/cart.ts normalizeCartItems()
        for (const item of items) {
          const mapKey = item.mode === "sub" ? `${item.slug}-${item.freq}` : `${item.slug}-once`;
          const variantId = item.variantId ?? vMap[mapKey];
          if (!variantId) continue;
          if (item.mode === "sub") {
            const discountPct = Math.round((FREQ_DISCOUNTS[item.freq] ?? 0) * 100);
            await medusa.cart.addSubscriptionItem(cartId, variantId, item.freq, discountPct, item.quantity);
          } else {
            await medusa.cart.addOnceItem(cartId, variantId, item.quantity);
          }
        }
        itemsPreloaded.current = true;

        // Apply non-deferred coupons during preload so createPaymentSession
        // sees the discounted total. Deferred coupons (typically shipping
        // promos) can't apply until a shipping_method is on the cart — we
        // retry those after addShippingMethod in the submit step.
        const eagerCoupons = capturedCoupons.filter((c) => !c.deferred);
        if (eagerCoupons.length > 0) {
          let latestCart: typeof cart | null = null;
          let allApplied = true;
          for (const c of eagerCoupons) {
            try {
              const updatedCart = await medusa.cart.applyPromotion(cartId, c.code);
              const ok = updatedCart.promotions?.some(
                (p) => p.code.toUpperCase() === c.code.toUpperCase()
              );
              if (ok) latestCart = updatedCart;
              else allApplied = false;
            } catch {
              allApplied = false;
            }
          }
          if (latestCart && typeof latestCart.subtotal === "number") setMedusaSubtotal(latestCart.subtotal);
          // Mark preload as done if all eager coupons succeeded. Deferred
          // coupons are handled separately after shipping is applied.
          couponAppliedInPreload.current = allApplied;
        }
      } catch { /* se creará en handleSubmit como fallback */ }

      console.timeEnd("[Checkout] preload");
    };

    preload();
  // preloadVersion changes whenever items or coupons change; isLoaded and user
  // gate the very first run and re-run if auth state changes.
  }, [isLoaded, preloadVersion, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#005088] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }


  // ── validation ───────────────────────────────────────────────
  function validate() {
    const e: Record<string, string> = {};

    if (!contact.name.trim()) e.name = "Requerido";
    if (!contact.email.trim() || !/\S+@\S+\.\S+/.test(contact.email))
      e.email = "Email inválido";
    if (!contact.phone.trim()) e.phone = "Requerido";

    if (cartRegion === "ars") {
      if (!addressAR.street.trim()) e.street = "Requerido";
      if (!addressAR.city.trim()) e.city = "Requerido";
      if (!addressAR.province.trim()) e.province = "Requerido";
      if (!addressAR.zip.trim() || addressAR.zip.trim().length < 4) e.zip = "CP inválido";
    } else {
      const resolvedCity =
        copomex.status === "success" ? copomex.data.municipio || address.city : address.city;
      const resolvedState =
        copomex.status === "success" ? copomex.data.estado || address.state : address.state;
      if (!address.street.trim()) e.street = "Requerido";
      if (!address.colonia.trim()) e.colonia = "Requerido";
      if (!resolvedCity.trim()) e.city = "Requerido";
      if (!resolvedState.trim()) e.state = "Requerido";
      if (!address.zip.trim() || !/^\d{5}$/.test(address.zip)) e.zip = "5 dígitos";
    }

    if (!card.number.replace(/\s/g, "") || card.number.replace(/\s/g, "").length < 15)
      e.cardNumber = "Número inválido";
    if (!card.name.trim()) e.cardName = "Requerido";
    if (!card.expiry.trim() || !/^\d{2}\/\d{2}$/.test(card.expiry))
      e.expiry = "MM/AA";
    if (!card.cvv.trim() || card.cvv.length < 3) e.cvv = "Requerido";
    if (cartRegion === "ars") {
      const digits = card.dni.replace(/\D/g, "");
      if (!digits || digits.length < 7 || digits.length > 8) e.dni = "DNI inválido";
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);
    // Will be set to Medusa's authoritative cart total once shipping is applied
    let chargedTotal = finalTotal + shippingCost;

    // Extracción de datos de dirección para optimizar Event Match Quality (EMQ)
    const cityVal = cartRegion === "ars" ? addressAR.city : (copomex.status === "success" ? copomex.data.municipio || address.city : address.city);
    const stateVal = cartRegion === "ars" ? addressAR.province : (copomex.status === "success" ? copomex.data.estado || address.state : address.state);
    const zipVal = cartRegion === "ars" ? addressAR.zip : address.zip;
    const countryVal = cartRegion === "ars" ? "ar" : (cartRegion === "br" ? "br" : "mx");

    // Meta AddPaymentInfo — el usuario completó datos válidos y confirmó el pago.
    // Una sola vez por sesión de checkout (no se re-dispara en reintentos).
    if (!addPaymentInfoTracked.current) {
      addPaymentInfoTracked.current = true;
      trackMeta(
        "AddPaymentInfo",
        {
          currency: market.currency,
          value: chargedTotal,
          content_ids: items.map((i) => i.variantId ?? i.slug),
          num_items: items.reduce((s, i) => s + i.quantity, 0),
        },
        {
          email: contact.email || user?.primaryEmailAddress?.emailAddress,
          phone: contact.phone,
          firstName: contact.name?.split(" ")[0],
          lastName: contact.name?.split(" ").slice(1).join(" "),
          externalId: user?.id,
          city: cityVal,
          state: stateVal,
          zip: zipVal,
          country: countryVal,
        },
      );
    }

    try {
      console.time("[Checkout] total");

      // ── Paso 1: Verificando tarjeta ──────────────────────────────────────
      setPaymentStep(1);

      let completePayload: import("@/lib/medusa").CompleteCartPayload;

      if (cartRegion === "ars") {
        // ── MercadoPago (AR) ──────────────────────────────────────────────
        try {
          const mp_card_token = await tokenizeCardMP(
            parseCardFormMP(card.number, card.name, card.expiry, card.cvv, card.dni)
          );
          completePayload = { mp_card_token, email: contact.email };
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Error en tarjeta";
          if (process.env.NODE_ENV === "development") {
            console.warn("[Checkout] MP en modo dev, usando token mock");
            completePayload = { mp_card_token: "tok_mp_dev_mock", email: contact.email };
          } else {
            setSubmitError(msg);
            setSubmitting(false);
            return;
          }
        }
      } else {
        // ── Openpay (MX) ──────────────────────────────────────────────────
        const device_session_id = getDeviceSessionId("checkout-form") ?? "dev_session";
        let openpay_token_id: string;
        try {
          openpay_token_id = await tokenizeCard(
            parseCardForm(card.number, card.name, card.expiry, card.cvv)
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Error en tarjeta";
          if (process.env.NODE_ENV === "development") {
            console.warn("[Checkout] Openpay en modo dev, usando token mock");
            openpay_token_id = "tok_dev_mock";
          } else {
            setSubmitError(msg);
            setSubmitting(false);
            return;
          }
        }
        completePayload = { openpay_token_id, email: contact.email, device_session_id };
      }

      // ── Paso 2: Usar carrito pre-cargado o crear uno nuevo (fallback) ─────
      let cart_id: string | null = null;
      try {
        cart_id = preloadedCartId;
        if (!cart_id) {
          const freshCart = await medusa.cart.create(REGION_ID, preloadedCustomerId);
          cart_id = freshCart.id;
        }

        // ── Paso 3: Agregar items (skip si ya se pre-cargaron) ──────────────
        if (!itemsPreloaded.current) {
          for (const item of items) {
            const mapKey = item.mode === "sub" ? `${item.slug}-${item.freq}` : `${item.slug}-once`;
            const variantId = item.variantId ?? variantIdMap[mapKey];
            if (!variantId) {
              console.warn("[Checkout] No variantId para:", item.slug, item.mode, item.freq);
              continue;
            }
            if (item.mode === "sub") {
              const discountPct = Math.round((FREQ_DISCOUNTS[item.freq] ?? 0) * 100);
              await medusa.cart.addSubscriptionItem(cart_id!, variantId, item.freq, discountPct, item.quantity);
            } else {
              await medusa.cart.addOnceItem(cart_id!, variantId, item.quantity);
            }
          }
        }

        // ── Paso 2: Guardando dirección de envío ────────────────────────────
        setPaymentStep(2);

        let shippingAddressPayload: Parameters<typeof medusa.cart.update>[1];

        if (cartRegion === "ars") {
          shippingAddressPayload = {
            email: contact.email,
            shipping_address: {
              first_name: contact.name.split(" ")[0],
              last_name: contact.name.split(" ").slice(1).join(" ") || "",
              address_1: addressAR.street,
              address_2: addressAR.depto.trim() || undefined,
              city: addressAR.city,
              province: addressAR.province,
              postal_code: addressAR.zip,
              country_code: "ar",
              phone: contact.phone,
            },
          };
        } else {
          const resolvedCity =
            copomex.status === "success" ? copomex.data.municipio || address.city : address.city;
          const resolvedState =
            copomex.status === "success" ? copomex.data.estado || address.state : address.state;

          shippingAddressPayload = {
            email: contact.email,
            shipping_address: {
              first_name: contact.name.split(" ")[0],
              last_name: contact.name.split(" ").slice(1).join(" ") || "",
              address_1: address.interior.trim()
                ? `${address.street} Int ${address.interior.trim()}`
                : address.street,
              address_2: address.instructions.trim()
                ? `${address.colonia} | ${address.instructions.trim()}`
                : address.colonia,
              city: resolvedCity,
              province: resolvedState,
              postal_code: address.zip,
              country_code: "mx",
              phone: contact.phone,
            },
            metadata: {
              colonia: address.colonia.trim() || null,
              numero_interior: address.interior.trim() || null,
              indicaciones_entrega: address.instructions.trim() || null,
              bundle_discount: totals.bundleDiscount > 0 ? totals.bundleDiscount : null,
            },
          };
        }

        await medusa.cart.update(cart_id, shippingAddressPayload);

        // ── Paso 2b: Aplicar shipping method ───────────────────────────────
        const shippingOptions = await medusa.cart.getShippingOptions(cart_id!).catch(() => []);
        // Medusa returns multiple matching options when zones overlap
        // (Nacional covers all of MX, so it also matches CDMX addresses).
        // Pick the option whose amount equals our zone-based preview so the
        // user always pays the correct zone rate.
        const validOptions = shippingOptions.filter(
          (o: any) => typeof o?.amount === "number" && o?.id
        );
        const zonalOption =
          shippingPreview > 0
            ? validOptions.find((o: any) => o.amount === shippingPreview)
            : undefined;
        // Fallback: if no exact match (e.g. admin changed the price), take the
        // cheapest for CDMX carts and the most expensive for Nacional carts.
        const pickedOption =
          zonalOption ??
          (shippingPreview === 90
            ? [...validOptions].sort((a: any, b: any) => a.amount - b.amount)[0]
            : [...validOptions].sort((a: any, b: any) => b.amount - a.amount)[0]);
        if (pickedOption?.id) {
          let workingCart = await medusa.cart.addShippingMethod(cart_id!, pickedOption.id);
          const shippingCost = workingCart.shipping_methods?.[0]?.amount ?? workingCart.shipping_total ?? 0;
          setShippingCost(shippingCost);

          // ── Apply deferred coupons (typically shipping promos) ─────────────
          // These were rejected silently in the drawer because no shipping
          // method was on the cart. Now that shipping is applied, retry them.
          const deferredCoupons = coupons.filter((c) => c.deferred);
          for (const c of deferredCoupons) {
            try {
              workingCart = await medusa.cart.applyPromotion(cart_id!, c.code);
            } catch {
              setSubmitError(`El cupón ${c.code} no es válido. Quítalo y vuelve a intentar.`);
              setSubmitting(false);
              setPaymentStep(0);
              return;
            }
            const ok = workingCart.promotions?.some(
              (p) => p.code.toUpperCase() === c.code.toUpperCase()
            );
            if (!ok) {
              setSubmitError(`El cupón ${c.code} no pudo aplicarse al envío. Verifica el código e intenta de nuevo.`);
              setSubmitting(false);
              setPaymentStep(0);
              return;
            }
          }

          const cartSubtotal1 = workingCart.subtotal ?? workingCart.total;
          // Prefer bundle_discount from Medusa cart metadata (authoritative) over local state.
          // The metadata is written in the cart.update() call above (bundle_discount field).
          const authorBundleDiscount =
            typeof (workingCart as any).metadata?.bundle_discount === "number"
              ? (workingCart as any).metadata.bundle_discount
              : totals.bundleDiscount;
          chargedTotal = Math.max(0, (cartSubtotal1 - authorBundleDiscount) - couponDiscount);
          setConfirmedTotal(chargedTotal);

          // ── Verify eager coupons (applied during preload) are still on cart ──
          if (couponAppliedInPreload.current) {
            const eagerCoupons = coupons.filter((c) => !c.deferred);
            const missing = eagerCoupons.find(
              (c) =>
                !workingCart.promotions?.some(
                  (p) => p.code.toUpperCase() === c.code.toUpperCase()
                )
            );
            if (missing) {
              setSubmitError(`El cupón ${missing.code} ya no es válido. Intenta con otro código.`);
              setSubmitting(false);
              setPaymentStep(0);
              return;
            }
          }
        }

        // ── Paso 2c: Aplicar cupones de descuento si existen ──────────────────
        // Skip if already applied during preload (verified above); otherwise apply each and verify.
        // Deferred coupons were already handled in the shipping block above, so only retry eager ones here.
        if (coupons.length > 0 && !couponAppliedInPreload.current) {
          const eagerCoupons = coupons.filter((c) => !c.deferred);
          for (const c of eagerCoupons) {
            const updatedCart = await medusa.cart.applyPromotion(cart_id!, c.code);
            const promotionApplied = updatedCart.promotions?.some(
              (p) => p.code.toUpperCase() === c.code.toUpperCase()
            );
            if (!promotionApplied) {
              setSubmitError(`El cupón ${c.code} no pudo aplicarse. Verifica el código e intenta de nuevo.`);
              setSubmitting(false);
              setPaymentStep(0);
              return;
            }
            // Capture latest cart total as the authoritative amount
            const cartSubtotal2 = updatedCart.subtotal ?? updatedCart.total;
            const authorBundleDiscount2 =
              typeof (updatedCart as any).metadata?.bundle_discount === "number"
                ? (updatedCart as any).metadata.bundle_discount
                : totals.bundleDiscount;
            chargedTotal = Math.max(0, (cartSubtotal2 - authorBundleDiscount2) - couponDiscount);
            setConfirmedTotal(chargedTotal);
          }
        }

        // ── Paso 3: Preparando pago ─────────────────────────────────────────
        setPaymentStep(3);
        await medusa.checkout.createPaymentSession(cart_id);

        // ── Paso 4: Procesando cobro ────────────────────────────────────────
        setPaymentStep(4);
        const result = await medusa.checkout.completeCart(cart_id, completePayload);

        // ── 3DS: el banco exige autenticación adicional ──────────────────────
        if (result.type === "redirect") {
          // Mostrar paso 5 para evitar el flash de vuelta al formulario mientras el
          // browser carga la página de Openpay
          setPaymentStep(5);
          // Guardar cart_id para que la página de retorno pueda recuperar el contexto
          sessionStorage.setItem("novapatch_3ds_cart_id", cart_id);
          sessionStorage.setItem("novapatch_3ds_total", String(chargedTotal));
          sessionStorage.setItem("novapatch_3ds_items", String(items.reduce((sum, i) => sum + i.quantity, 0)));

          // Stash del Purchase (y Subscribe) para dispararlo al volver del 3DS,
          // ya que este flujo hace redirect antes de llegar al bloque de éxito.
          const redirectNumItems = items.reduce((sum, i) => sum + i.quantity, 0);
          const redirectIdentity = {
            email: contact.email || user?.primaryEmailAddress?.emailAddress,
            phone: contact.phone,
            firstName: contact.name?.split(" ")[0],
            lastName: contact.name?.split(" ").slice(1).join(" "),
            externalId: user?.id,
            city: cityVal,
            state: stateVal,
            zip: zipVal,
            country: countryVal,
          };
          const redirectSubItems = items.filter((i) => i.mode === "sub");
          stashPurchaseForRedirect({
            eventId: cart_id,
            identity: redirectIdentity,
            purchase: {
              currency: market.currency,
              value: chargedTotal,
              content_ids: items.map((i) => i.variantId ?? i.slug),
              contents: items.map((i) => ({
                id: i.variantId ?? i.slug,
                quantity: i.quantity,
                item_price: i.price,
              })),
              num_items: redirectNumItems,
            },
            subscribe: redirectSubItems.length
              ? {
                  currency: market.currency,
                  value: redirectSubItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
                  content_ids: redirectSubItems.map((i) => i.variantId ?? i.slug),
                  contents: redirectSubItems.map((i) => ({
                    id: i.variantId ?? i.slug,
                    quantity: i.quantity,
                    item_price: i.price,
                  })),
                  num_items: redirectSubItems.reduce((s, i) => s + i.quantity, 0),
                }
              : undefined,
            address: {
              country_code: cartRegion === "ars" ? "ar" : "mx",
              province: stateVal,
            },
          });
          // Esperar 2 frames para que React renderice el overlay antes de navegar
          await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          window.location.href = result.redirect_url;
          return; // el flujo continúa en /checkout/3ds-return
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Checkout] Backend Medusa no disponible, completando en modo demo");
        } else {
          const msg = err instanceof Error ? err.message : "Error al procesar el pago";
          setSubmitError(msg);
          setSubmitting(false);
          setPaymentStep(0);
          // Invalidar carrito pre-cargado para que el siguiente intento cree uno nuevo
          setPreloadedCartId(null);
          preloadStarted.current = false;
          itemsPreloaded.current = false;
          couponAppliedInPreload.current = false;
          return;
        }
      }

      console.timeEnd("[Checkout] total");

      // ── Éxito (cobro directo sin 3DS) ─────────────────────────────────────────
      const purchaseNumItems = items.reduce((sum, i) => sum + i.quantity, 0);
      posthog.capture("order_completed", {
        cart_total: chargedTotal,
        item_count: purchaseNumItems,
      });
      const purchaseIdentity = {
        email: contact.email || user?.primaryEmailAddress?.emailAddress,
        phone: contact.phone,
        firstName: contact.name?.split(" ")[0],
        lastName: contact.name?.split(" ").slice(1).join(" "),
        externalId: user?.id,
        city: cityVal,
        state: stateVal,
        zip: zipVal,
        country: countryVal,
      };
      const subItems = hasSubscriptions ? items.filter((i) => i.mode === "sub") : [];
      const successProvince =
        cartRegion === "ars"
          ? addressAR.province
          : copomex.status === "success"
            ? copomex.data.estado || address.state
            : address.state;
      // Stash Purchase (+ Subscribe) and hand off to the dedicated confirmation
      // page, which fires them on mount. Firing there — on a real URL with a
      // guaranteed page load and dwell — is what makes Purchase reliably reach
      // GA4/Meta, unlike an in-place state swap with no pageview. The 3DS branch
      // above already stashes the same way before its redirect.
      stashPurchaseForRedirect({
        eventId: cart_id || undefined,
        identity: purchaseIdentity,
        purchase: {
          currency: market.currency,
          value: chargedTotal,
          content_ids: items.map((i) => i.variantId ?? i.slug),
          contents: items.map((i) => ({
            id: i.variantId ?? i.slug,
            quantity: i.quantity,
            item_price: i.price,
          })),
          num_items: purchaseNumItems,
        },
        subscribe: subItems.length
          ? {
              currency: market.currency,
              value: subItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
              content_ids: subItems.map((i) => i.variantId ?? i.slug),
              contents: subItems.map((i) => ({
                id: i.variantId ?? i.slug,
                quantity: i.quantity,
                item_price: i.price,
              })),
              num_items: subItems.reduce((s, i) => s + i.quantity, 0),
            }
          : undefined,
        address: {
          country_code: cartRegion === "ars" ? "ar" : "mx",
          province: successProvince,
        },
      });
      clearCart();
      orderCompleted.current = true;
      router.replace(`/${localeParam || "mx"}/checkout/gracias`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // ── card number formatting ───────────────────────────────────
  function formatCardNumber(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Overlay 3DS: tapa la pantalla mientras el browser navega a Openpay ── */}
      {paymentStep === 5 && (
        <div className="fixed inset-0 z-[9999] bg-[#FAF8F5] flex flex-col items-center justify-center gap-4">
          <span className="h-10 w-10 border-4 border-[#0F0F0F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[15px] font-sans font-semibold text-[#0F0F0F]">Redirigiendo a tu banco…</p>
          <p className="text-[13px] font-sans text-[#A8A29A]">No cierres esta página</p>
        </div>
      )}

      {/* ── Minimal Header ── */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#E6E1D8]">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10 h-[64px] flex items-center justify-between">
          <Link
            href="/tienda"
            className="flex items-center gap-1.5 text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] hover:text-[#3A3A37] transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span className="sm:hidden">Tienda</span>
            <span className="hidden sm:inline">Volver a la tienda</span>
          </Link>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-sans font-bold text-[22px] tracking-[-0.035em] text-[#0F0F0F] hover:opacity-85 transition-opacity lowercase"
          >
            novapatch
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-sans text-[#A8A29A]">
            <Lock size={12} className="text-[#0F0F0F]" />
            Pago seguro
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* ── LEFT: Form ── */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase mb-8">
              finalizar compra
            </h1>

            {/* AUTH GATE */}
            {needsAuth && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-7"
              >
                <AuthGate />
              </motion.div>
            )}

            {/* Subscription notice for signed-in users */}
            {hasSubscriptions && isSignedIn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 bg-white border border-[#E6E1D8] shadow-2xs"
              >
                <CheckCircle2 size={18} className="text-[#0F0F0F] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-sans font-semibold text-[#0F0F0F]">
                    Sesión activa — {user.fullName || user.primaryEmailAddress?.emailAddress}
                  </p>
                  <p className="text-xs font-sans text-[#3A3A37] mt-0.5">
                    Tus suscripciones quedarán vinculadas a esta cuenta.
                  </p>
                </div>
              </motion.div>
            )}

            {/* FORM — visible always for contact/address, gated for payment */}
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">

              {/* ── 1. Contacto ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-xl p-6 border border-[#E6E1D8] shadow-2xs"
              >
                <SectionHeader
                  step={1}
                  icon={<User size={16} />}
                  title="información de contacto"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field
                      id="name"
                      label="Nombre completo"
                      placeholder="María García López"
                      value={contact.name}
                      onChange={(v) => { setContact((c) => ({ ...c, name: v })); clearErr("name"); }}
                      required
                      error={errors.name}
                      autoComplete="name"
                    />
                  </div>
                  <Field
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    placeholder="maria@ejemplo.com"
                    value={contact.email}
                    onChange={(v) => { setContact((c) => ({ ...c, email: v })); clearErr("email"); }}
                    required
                    error={errors.email}
                    autoComplete="email"
                  />
                  <Field
                    id="phone"
                    label="Teléfono"
                    type="tel"
                    placeholder="+52 55 0000 0000"
                    value={contact.phone}
                    onChange={(v) => { setContact((c) => ({ ...c, phone: v })); clearErr("phone"); }}
                    required
                    error={errors.phone}
                    autoComplete="tel"
                  />
                </div>

                {/* guest note */}
                {!hasSubscriptions && !isSignedIn && (
                  <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8]">
                    <LogIn size={14} className="text-[#A8A29A] mt-0.5 shrink-0" />
                    <p className="text-xs font-sans text-[#3A3A37] leading-relaxed">
                      Comprando como invitado.{" "}
                      <button
                        type="button"
                        onClick={() => openSignIn({ forceRedirectUrl: "/checkout" })}
                        className="font-semibold text-[#0F0F0F] hover:underline"
                      >
                        Iniciar sesión
                      </button>{" "}
                      para guardar tu historial de pedidos.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* ── 2. Envío ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 border border-[#E6E1D8] shadow-2xs"
              >
                <SectionHeader
                  step={2}
                  icon={<Truck size={16} />}
                  title="dirección de envío"
                />

                {/* ── Formulario Argentina ── */}
                {cartRegion === "ars" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Calle + número con Google Places */}
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="ar-street" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                        Calle y número<span className="text-[#0F0F0F] ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <input
                          ref={streetInputRef}
                          id="ar-street"
                          type="text"
                          placeholder="Av. Corrientes 1234"
                          value={addressAR.street}
                          onChange={(e) => { setAddressAR((a) => ({ ...a, street: e.target.value })); clearErr("street"); }}
                          autoComplete="new-password"
                          className={`w-full px-4 py-3 pr-10 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] ${
                            errors.street ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"
                          }`}
                        />
                        <MapPin size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: placesReady ? "#0F0F0F" : "#A8A29A" }} />
                      </div>
                      {placesReady && (
                        <p className="text-[10px] text-[#A8A29A] flex items-center gap-1 font-sans">
                          <span className="text-[#0F0F0F] font-bold">G</span>
                          Autocompletado con Google
                        </p>
                      )}
                      <AnimatePresence>
                        {errors.street && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[11px] text-[#0F0F0F] flex items-center gap-1 font-sans">
                            <AlertCircle size={11} />{errors.street}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Depto — opcional */}
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="ar-depto" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                        Depto / Piso <span className="text-[#A8A29A] font-normal normal-case">(opcional)</span>
                      </label>
                      <input
                        id="ar-depto"
                        type="text"
                        placeholder="Ej. 4to B"
                        value={addressAR.depto}
                        onChange={(e) => setAddressAR((a) => ({ ...a, depto: e.target.value.slice(0, 20) }))}
                        autoComplete="address-line2"
                        className="w-full px-4 py-3 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border border-[#E6E1D8] bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F]"
                      />
                    </div>

                    {/* CP */}
                    <Field
                      id="ar-zip"
                      label="Código postal"
                      placeholder="C1425"
                      value={addressAR.zip}
                      onChange={(v) => { setAddressAR((a) => ({ ...a, zip: v.toUpperCase().slice(0, 8) })); clearErr("zip"); }}
                      required
                      error={errors.zip}
                      autoComplete="postal-code"
                    />

                    {/* Ciudad/Localidad */}
                    <Field
                      id="ar-city"
                      label="Ciudad / Localidad"
                      placeholder="Buenos Aires"
                      value={addressAR.city}
                      onChange={(v) => { setAddressAR((a) => ({ ...a, city: v })); clearErr("city"); }}
                      required
                      error={errors.city}
                      autoComplete="address-level2"
                    />

                    {/* Provincia */}
                    <div className="sm:col-span-2">
                      <Field
                        id="ar-province"
                        label="Provincia"
                        placeholder="Buenos Aires"
                        value={addressAR.province}
                        onChange={(v) => { setAddressAR((a) => ({ ...a, province: v })); clearErr("province"); }}
                        required
                        error={errors.province}
                        autoComplete="address-level1"
                      />
                    </div>
                  </div>
                )}

                {/* ── Formulario México (default) ── */}
                {cartRegion !== "ars" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Calle — con Google Places Autocomplete */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="street" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                      Calle y número<span className="text-[#0F0F0F] ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={streetInputRef}
                        id="street"
                        type="text"
                        placeholder="Av. Insurgentes Sur 1234 Int. 5"
                        value={address.street}
                        onChange={(e) => { setAddress((a) => ({ ...a, street: e.target.value })); clearErr("street"); }}
                        autoComplete="new-password"
                        className={`w-full px-4 py-3 pr-10 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] ${
                          errors.street ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"
                        }`}
                      />
                      <MapPin
                        size={15}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: placesReady ? "#0F0F0F" : "#A8A29A" }}
                      />
                    </div>
                    {placesReady && (
                      <p className="text-[10px] text-[#A8A29A] flex items-center gap-1 font-sans">
                        <span className="text-[#0F0F0F] font-bold">G</span>
                        Autocompletado con Google
                      </p>
                    )}
                    <AnimatePresence>
                      {errors.street && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[11px] font-sans text-[#0F0F0F] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />{errors.street}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Número interior — opcional */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="interior" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                      Número interior <span className="text-[#A8A29A] font-normal normal-case">(opcional)</span>
                    </label>
                    <input
                      id="interior"
                      type="text"
                      placeholder="Ej. 4B, Depto 3"
                      value={address.interior}
                      onChange={(e) => setAddress((a) => ({ ...a, interior: e.target.value.slice(0, 20) }))}
                      autoComplete="address-line3"
                      className="w-full px-4 py-3 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border border-[#E6E1D8] bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F]"
                    />
                  </div>

                  {/* Indicaciones de entrega — opcional */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="instructions" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                      Indicaciones de entrega <span className="text-[#A8A29A] font-normal normal-case">(opcional)</span>
                    </label>
                    <textarea
                      id="instructions"
                      placeholder="Ej. Edificio azul, no llamar por teléfono"
                      value={address.instructions}
                      onChange={(e) => setAddress((a) => ({ ...a, instructions: e.target.value.slice(0, 200) }))}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border border-[#E6E1D8] bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] resize-none"
                    />
                    <p className="text-[10px] font-mono text-[#A8A29A] text-right">{address.instructions.length}/200</p>
                  </div>

                  {/* CP — dispara COPOMEX */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="zip" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                      Código postal<span className="text-[#0F0F0F] ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="zip"
                        type="text"
                        inputMode="numeric"
                        placeholder="11560"
                        value={address.zip}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 5);
                          setAddress((a) => ({ ...a, zip: v }));
                          clearErr("zip");
                          if (v.length === 5) {
                            lookupCp(v);
                            clearErr("city");
                            clearErr("state");
                          } else {
                            resetCopomex();
                            setAddress((a) => ({ ...a, colonia: "", city: "", state: "" }));
                          }
                        }}
                        autoComplete="postal-code"
                        className={`w-full px-4 py-3 pr-10 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] ${
                          errors.zip ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"
                        }`}
                      />
                      {/* status icon */}
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {copomex.status === "loading" && (
                          <Loader2 size={14} className="animate-spin text-[#0F0F0F]" />
                        )}
                        {copomex.status === "success" && (
                          <CheckCircle2 size={14} className="text-[#0F0F0F]" />
                        )}
                        {copomex.status === "error" && !address.colonia.trim() && (
                          <AlertCircle size={14} className="text-[#0F0F0F]" />
                        )}
                        {copomex.status === "error" && address.colonia.trim() && (
                          <CheckCircle2 size={14} className="text-[#0F0F0F]" />
                        )}
                      </span>
                    </div>
                    <AnimatePresence>
                      {copomex.status === "success" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] text-[#0F0F0F] font-sans font-semibold"
                        >
                          ✓ {copomex.data.municipio}, {copomex.data.estado}
                        </motion.p>
                      )}
                      {copomex.status === "error" && !address.colonia.trim() && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[11px] font-sans text-[#0F0F0F] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />CP no encontrado — completá colonia manualmente
                        </motion.p>
                      )}
                      {errors.zip && copomex.status !== "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[11px] font-sans text-[#0F0F0F] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />{errors.zip}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Colonia — select cuando COPOMEX OK, text input si no */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="colonia" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                      Colonia<span className="text-[#0F0F0F] ml-0.5">*</span>
                    </label>
                    {copomex.status === "success" && copomex.data.colonias.length > 0 ? (
                      <div className="relative">
                        <select
                          id="colonia"
                          value={address.colonia}
                          onChange={(e) => { setAddress((a) => ({ ...a, colonia: e.target.value })); clearErr("colonia"); }}
                          className={`w-full px-4 py-3 pr-9 rounded-xl text-sm font-sans text-[#0F0F0F] border bg-[#FAF8F5] appearance-none transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] cursor-pointer ${
                            errors.colonia ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"
                          }`}
                        >
                          <option value="">Selecciona tu colonia</option>
                          {copomex.data.colonias.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#A8A29A]"
                        />
                      </div>
                    ) : (
                      <input
                        id="colonia"
                        type="text"
                        placeholder={copomex.status === "loading" ? "Buscando colonias…" : "Ingresa tu colonia"}
                        value={address.colonia}
                        onChange={(e) => { setAddress((a) => ({ ...a, colonia: e.target.value })); clearErr("colonia"); }}
                        autoComplete="address-line2"
                        disabled={copomex.status === "loading"}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] border bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] disabled:opacity-60 disabled:cursor-wait ${
                          errors.colonia ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"
                        }`}
                      />
                    )}
                    <AnimatePresence>
                      {errors.colonia && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[11px] font-sans text-[#0F0F0F] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />{errors.colonia}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Ciudad — auto-filled desde COPOMEX */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                      Municipio / Alcaldía<span className="text-[#0F0F0F] ml-0.5">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Miguel Hidalgo"
                      value={copomex.status === "success" ? (copomex.data.municipio || address.city) : address.city}
                      onChange={(e) => { setAddress((a) => ({ ...a, city: e.target.value })); clearErr("city"); }}
                      autoComplete="address-level2"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-sans border bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] ${
                        copomex.status === "success" ? "text-[#0F0F0F] font-semibold" : "text-[#0F0F0F] placeholder-[#A8A29A]"
                      } ${errors.city ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"}`}
                    />
                  </div>

                  {/* Estado — auto-filled desde COPOMEX */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F]">
                      Estado<span className="text-[#0F0F0F] ml-0.5">*</span>
                    </label>
                    <input
                      id="state"
                      type="text"
                      placeholder="Ciudad de México"
                      value={copomex.status === "success" ? (copomex.data.estado || address.state) : address.state}
                      onChange={(e) => { setAddress((a) => ({ ...a, state: e.target.value })); clearErr("state"); }}
                      autoComplete="address-level1"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-sans border bg-[#FAF8F5] transition-all duration-200 outline-none focus:bg-white focus:border-[#0F0F0F] ${
                        copomex.status === "success" ? "text-[#0F0F0F] font-semibold" : "text-[#0F0F0F] placeholder-[#A8A29A]"
                      } ${errors.state ? "border-[#0F0F0F] ring-1 ring-[#0F0F0F]" : "border-[#E6E1D8]"}`}
                    />
                  </div>

                </div>
                )}
              </motion.div>

              {/* ── 3. Pago ── */}
              {!needsAuth && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-xl p-6 border border-[#E6E1D8] shadow-2xs"
                >
                  <SectionHeader
                    step={3}
                    icon={<CreditCard size={16} />}
                    title="datos de pago"
                  />

                  {/* card brand logos */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {["VISA", "MASTERCARD", "AMEX"].map((b) => (
                      <span
                        key={b}
                        className="px-2.5 py-1 rounded-md border border-[#E6E1D8] text-[10px] font-mono font-bold text-[#3A3A37] bg-[#FAF8F5]"
                      >
                        {b}
                      </span>
                    ))}
                    <img src="/logos/bbva_logo.png" alt="BBVA" className="h-4 w-auto object-contain inline-block ml-1" />
                    <span className="text-xs font-sans text-[#A8A29A] ml-1">
                      {cartRegion === "ars" ? "Vía MercadoPago" : "Vía Openpay"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field
                        id="cardNumber"
                        label="Número de tarjeta"
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={(v) => { setCard((c) => ({ ...c, number: formatCardNumber(v) })); clearErr("cardNumber"); }}
                        required
                        error={errors.cardNumber}
                        autoComplete="cc-number"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Field
                        id="cardName"
                        label="Nombre en la tarjeta"
                        placeholder="MARIA GARCIA"
                        value={card.name}
                        onChange={(v) => { setCard((c) => ({ ...c, name: v.toUpperCase() })); clearErr("cardName"); }}
                        required
                        error={errors.cardName}
                        autoComplete="cc-name"
                      />
                    </div>
                    <Field
                      id="expiry"
                      label="Vencimiento"
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={(v) => { setCard((c) => ({ ...c, expiry: formatExpiry(v) })); clearErr("expiry"); }}
                      required
                      error={errors.expiry}
                      autoComplete="cc-exp"
                    />
                    <Field
                      id="cvv"
                      label="CVV"
                      placeholder="123"
                      value={card.cvv}
                      onChange={(v) => { setCard((c) => ({ ...c, cvv: v.replace(/\D/g, "").slice(0, 4) })); clearErr("cvv"); }}
                      required
                      error={errors.cvv}
                      autoComplete="cc-csc"
                    />
                    {cartRegion === "ars" && (
                      <div className="sm:col-span-2">
                        <Field
                          id="dni"
                          label="DNI del titular"
                          placeholder="12345678"
                          value={card.dni}
                          onChange={(v) => { setCard((c) => ({ ...c, dni: v.replace(/\D/g, "").slice(0, 8) })); clearErr("dni"); }}
                          required
                          error={errors.dni}
                          autoComplete="off"
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment provider security badge */}
                  <div className="mt-5 flex items-center gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8]">
                    <ShieldCheck size={16} className="text-[#0F0F0F] shrink-0" />
                    <p className="text-xs font-sans text-[#3A3A37] leading-relaxed">
                      Tus datos están protegidos con encriptación SSL de 256 bits.
                      El procesamiento es a través de{" "}
                      <span className="font-semibold text-[#0F0F0F]">
                        {cartRegion === "ars" ? "MercadoPago" : "Openpay"}
                      </span>.
                    </p>
                  </div>

                  {/* Submit error */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-white border border-[#0F0F0F]"
                      >
                        <AlertCircle size={15} className="text-[#0F0F0F] mt-0.5 shrink-0" />
                        <p className="text-xs font-sans font-medium text-[#0F0F0F] leading-relaxed">{submitError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full py-4 rounded-full text-[16px] font-black text-white transition-all duration-200 active:scale-[0.97] hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: "#22c55e" }}
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando…
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Pagar {fmt(confirmedTotal ?? (finalTotal + displayShippingCost), cartRegion)}
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Gate blocker message when auth needed */}
              {needsAuth && (
                <p className="text-center text-xs font-sans text-[#A8A29A] pb-4">
                  Inicia sesión para continuar con el pago.
                </p>
              )}
            </form>
          </div>

          {/* ── RIGHT: Order Summary (sticky) ── */}
          <div className="lg:sticky lg:top-[88px]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-[#E6E1D8] shadow-2xs overflow-hidden"
            >
              {/* header */}
              <div className="px-6 py-4 border-b border-[#E6E1D8]">
                <h2 className="text-lg font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">
                  resumen del pedido
                </h2>
                <p className="text-xs font-sans text-[#A8A29A] mt-0.5">
                  {items.reduce((s, i) => s + i.quantity, 0)} artículo(s)
                </p>
              </div>

              {/* items */}
              <div className="px-6 divide-y divide-[#E6E1D8]">
                {items.map((item) => (
                  <OrderItem key={`${item.slug}__${item.mode}__${item.freq}`} item={item} region={cartRegion} />
                ))}
              </div>

              {/* Upsell / Cross-sell Inteligente de Bundle */}
              {(() => {
                const upsell = getSmartUpsell(items);
                if (!upsell) return null;
                const { candidate } = upsell;

                return (
                  <div className="px-6 py-4 border-t border-[#E6E1D8] bg-[#FAF8F5]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">
                        {upsell.title}
                      </p>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0F0F0F] text-white">
                        {upsell.badge}
                      </span>
                    </div>
                    <div className="bg-white border border-[#E6E1D8] rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                      <Link
                        href={`/tienda/${candidate.slug}`}
                        className="flex items-center gap-3 min-w-0 group/upsell"
                      >
                        <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-lg border border-[#E6E1D8] bg-[#FAF8F5] p-1 group-hover/upsell:border-[#0F0F0F] transition-colors">
                          <Image src={getCartThumbnail(candidate.slug, candidate.image)} alt={candidate.name} fill className="object-contain group-hover/upsell:scale-105 transition-transform" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-sans font-semibold text-[#0F0F0F] truncate group-hover/upsell:underline">{candidate.name}</p>
                          <p className="text-[11px] font-sans text-[#3A3A37] leading-tight line-clamp-2 mt-0.5">{upsell.subtitle}</p>
                          <p className="text-[11px] font-mono font-bold text-[#0F0F0F] mt-1">
                            {fmt(candidate.price, cartRegion)}
                          </p>
                        </div>
                      </Link>
                      <button
                        type="button"
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
                        className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all duration-200 cursor-pointer"
                      >
                        + agregar
                      </button>
                    </div>
                  </div>
                );
              })()}

                            {/* ── Cupón de descuento ── */}
              <div className="px-6 py-4 border-t border-[#E6E1D8] bg-white space-y-2.5">
                <AnimatePresence initial={false}>
                  {coupons.map((c) => (
                    <motion.div
                      key={c.code}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                        <div>
                          <p className="text-[12px] font-black text-green-600 tracking-wide">{c.code}</p>
                          <p className="text-[10px] text-green-700 font-medium">{c.label}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoupon(c.code)}
                        className="w-6 h-6 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                        title={`Quitar cupón ${c.code}`}
                      >
                        <X size={11} className="text-green-700" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29A] pointer-events-none"
                    />
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => {
                        setCouponCodeInput(e.target.value.toUpperCase());
                        if (couponError) setCouponError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCoupon(couponCodeInput);
                        }
                      }}
                      placeholder={coupons.length > 0 ? "Agregar otro código" : "Código de descuento"}
                      disabled={couponLoading}
                      className="w-full pl-8 pr-3 py-2 text-[12px] font-sans font-medium text-[#0F0F0F] placeholder:text-[#A8A29A] bg-[#FAF8F5] border border-[#E6E1D8] focus:bg-white focus:border-[#0F0F0F] focus:outline-none rounded-xl transition-colors uppercase tracking-wider disabled:opacity-50"
                      maxLength={64}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(couponCodeInput)}
                    disabled={!couponCodeInput.trim() || couponLoading}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-[#0F0F0F] hover:bg-[#3A3A37] disabled:bg-[#FAF8F5] disabled:text-[#A8A29A] text-white border border-[#0F0F0F] disabled:border-[#E6E1D8] text-[11px] font-sans font-medium uppercase tracking-[0.12em] rounded-full transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {couponLoading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] font-sans text-red-600 flex items-center gap-1">
                    <AlertCircle size={11} />
                    {couponError}
                  </p>
                )}
              </div>

              {/* totals */}
              <div className="px-6 py-5 bg-[#FAF8F5] space-y-2">

                {/* Subtotal bruto */}
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#3A3A37]">Subtotal</span>
                  <span className="font-mono font-semibold text-[#0F0F0F]">{fmt(totals.subtotal, cartRegion)}</span>
                </div>

                {/* Descuento suscripción */}
                {totals.savings > 0 && (
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-[#3A3A37] flex items-center gap-1.5">
                      <span className="inline-flex text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#E6E1D8] text-[#3A3A37]">
                        SUB
                      </span>
                      Descuento suscripción
                    </span>
                    <span className="font-mono font-bold text-[#0F0F0F]">−{fmt(totals.savings, cartRegion)}</span>
                  </div>
                )}

                {/* Descuento bundle */}
                {totals.bundleDiscount > 0 && totals.bundleName && (
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-[#3A3A37] flex items-center gap-1.5">
                      <span className="inline-flex text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#0F0F0F] text-white">
                        BUNDLE
                      </span>
                      {totals.bundleName}
                    </span>
                    <span className="font-mono font-bold text-[#0F0F0F]">−{fmt(totals.bundleDiscount, cartRegion)}</span>
                  </div>
                )}

                {/* Cupón(es) */}
                {coupons.length > 0 && effectiveCouponDiscount > 0 && (
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-[#3A3A37] flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#0F0F0F] text-white">
                        {coupons.length > 1 ? "CUPONES" : "CUPÓN"}
                      </span>
                      {coupons.map((c) => c.code).join(" · ")}
                    </span>
                    <span className="font-mono font-bold text-[#0F0F0F]">−{fmt(effectiveCouponDiscount, cartRegion)}</span>
                  </div>
                )}
                {shippingCoupon && (
                  <div className="flex justify-between text-xs font-sans text-[#0F0F0F]">
                    <span>Envío gratis ({shippingCoupon.code})</span>
                    <span className="font-mono font-bold">aplicado</span>
                  </div>
                )}

                {/* Envío */}
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#3A3A37]">Envío</span>
                  <span className={FREE_SHIPPING || shippingCoupon ? "font-mono font-bold text-[#0F0F0F]" : "text-[#A8A29A]"}>
                    {FREE_SHIPPING ? "GRATIS" : shippingCoupon ? "GRATIS" : "Calculado al pagar"}
                  </span>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-[#E6E1D8] flex justify-between items-baseline">
                  <span className="text-base font-display font-semibold text-[#0F0F0F] lowercase">total</span>
                  <p className="text-xl font-mono font-bold text-[#0F0F0F]">{fmt(confirmedTotal ?? finalTotal, cartRegion)}</p>
                </div>
              </div>


              {/* trust badges */}
              <div className="px-6 py-4 border-t border-[#E6E1D8]">
                <div className="flex items-center justify-center gap-6">
                  {[
                    { icon: <Truck size={14} />, label: "Envío rápido" },
                    { icon: <ShieldCheck size={14} />, label: "Compra segura" },
                    { icon: <Repeat size={14} />, label: "Cancela fácil" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="flex flex-col items-center gap-1 text-[#3A3A37]"
                    >
                      {b.icon}
                      <span className="text-[10px] font-sans font-medium text-center leading-tight">
                        {b.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
