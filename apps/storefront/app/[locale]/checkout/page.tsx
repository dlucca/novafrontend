"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import posthog from "posthog-js";
import { useCart } from "@/contexts/CartContext";
import { medusa } from "@/lib/medusa";
import { tokenizeCard, parseCardForm, getDeviceSessionId } from "@/lib/openpay";
import { tokenizeCardMP, parseCardFormMP } from "@/lib/mercadopago";
import { useCopomex } from "@/hooks/useCopomex";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import {
  CartItem,
  FREQ_LABELS,
  FREQ_DISCOUNTS,
  itemDisplayPrice,
  cartTotals,
  clearCart,
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
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(n: number, region: "mxn" | "ars" = "mxn") {
  const isAR = region === "ars";
  return new Intl.NumberFormat(isAR ? "es-AR" : "es-MX", {
    style: "currency",
    currency: isAR ? "ARS" : "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function OrderItem({ item, region }: { item: CartItem; region: "mxn" | "ars" }) {
  const price = itemDisplayPrice(item);
  const isSub = item.mode === "sub";

  return (
    <div className="flex items-center gap-3 py-3">
      {/* image chip — outer div is relative so badge escapes overflow-hidden */}
      <div className="relative flex-shrink-0 w-14 h-14">
        <div
          className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
          style={{ background: item.bg }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain p-1"
          />
        </div>
        <span
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white shadow-sm"
          style={{ background: item.color }}
        >
          {item.quantity}
        </span>
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-[#005088] leading-tight truncate">
          {item.title}
        </p>
        {isSub ? (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
            style={{ background: `${item.color}18`, color: item.color }}
          >
            <Repeat size={9} />
            {FREQ_LABELS[item.freq]}
          </span>
        ) : (
          <span className="text-[11px] text-[#6B7280]">Compra única</span>
        )}
      </div>

      {/* price — always original so it matches the subtotal line */}
      <div className="text-right flex-shrink-0">
        <p className="text-[14px] font-black text-[#005088]">
          {fmt(item.price * item.quantity, region)}
        </p>
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
      className="rounded-2xl border border-[#005088]/12 bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,80,136,0.08)]"
    >
      <div
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "#EBF4FB" }}
      >
        <Lock size={28} className="text-[#005088]" />
      </div>

      <h3 className="text-[20px] font-black text-[#005088] mb-2 tracking-[-0.02em]">
        Crea tu cuenta para suscribirte
      </h3>
      <p className="text-[14px] text-[#6B7280] leading-[1.6] mb-6 max-w-[320px] mx-auto">
        Tu carrito incluye productos en modo suscripción. Necesitamos una
        cuenta para gestionar tus envíos recurrentes y descuentos.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() =>
            openSignIn({
              forceRedirectUrl: "/checkout",
              appearance: {
                variables: { colorPrimary: "#E8503A" },
              },
            })
          }
          className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200 active:scale-[0.97] hover:brightness-95"
          style={{ background: "#E8503A" }}
        >
          Crear cuenta / Iniciar sesión
        </button>

        <Link
          href="/tienda"
          className="text-[13px] text-[#6B7280] hover:text-[#005088] transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>

      {/* perks */}
      <div className="mt-7 grid grid-cols-3 gap-3 text-center">
        {[
          { icon: <ShieldCheck className="w-6 h-6 mx-auto text-[#005088]" />, label: "Datos seguros" },
          { icon: <Truck className="w-6 h-6 mx-auto text-[#005088]" />, label: "Envíos gestionados" },
          { icon: <XCircle className="w-6 h-6 mx-auto text-[#005088]" />, label: "Cancela cuando quieras" },
        ].map((p) => (
          <div
            key={p.label}
            className="rounded-xl p-3"
            style={{ background: "#F9FAFB" }}
          >
            <div className="mb-1">{p.icon}</div>
            <p className="text-[10px] font-semibold text-[#6B7280] leading-tight">
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
      <label htmlFor={id} className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
        {label}
        {required && <span className="text-[#E8503A] ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] ${
          error ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-[#E8503A] flex items-center gap-1"
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
        className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-black text-white flex-shrink-0"
        style={{ background: "#005088" }}
      >
        {step}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#005088]">{icon}</span>
        <h2 className="text-[17px] font-black text-[#005088] tracking-[-0.01em]">
          {title}
        </h2>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-6 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <CheckCircle2 size={72} className="mx-auto mb-6" style={{ color: "#E8503A" }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-[32px] font-black text-[#005088] tracking-[-0.03em] mb-3">
          ¡Pedido realizado!
        </h1>
        <p className="text-[16px] text-[#6B7280] leading-[1.6] max-w-[360px] mb-8">
          Recibirás un correo de confirmación con los detalles de tu envío.
          Tu parche está en camino.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
          style={{ background: "#E8503A" }}
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, openCart, coupon } = useCart();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const router = useRouter();

  const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ?? "reg_mx";

  const params = useParams();
  const localeParam = typeof params?.locale === "string" ? params.locale : "";
  const [cartRegion, setCartRegion] = useState<"mxn" | "ars">(
    localeParam === "ar" ? "ars" : "mxn"
  );

  const hasSubscriptions = items.some((i) => i.mode === "sub");
  const isSignedIn = !!user;
  const needsAuth = hasSubscriptions && !isSignedIn;

  // ── Preload state (must be declared before totals calculations) ───
  const [medusaCartTotal, setMedusaCartTotal] = useState<number | null>(null);

  const totals = cartTotals(items);
  const couponDiscount = coupon ? Math.round(totals.total * (coupon.discountPct / 100)) : 0;
  // effectiveCouponDiscount: Medusa-confirmed discount once preload resolves; falls back to frontend estimate
  const effectiveCouponDiscount =
    medusaCartTotal !== null ? Math.max(0, totals.total - medusaCartTotal) : couponDiscount;
  const finalTotal = medusaCartTotal ?? (totals.total - couponDiscount);

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
  const [success, setSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<number>(0); // 0=idle, 1-4=processing
  // Total confirmed by Medusa after shipping is applied — authoritative for what gets charged
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);

  // ── Pre-carga: carrito + catálogo + customer sync al montar ───
  const [preloadedCartId, setPreloadedCartId] = useState<string | null>(null);
  const [variantIdMap, setVariantIdMap] = useState<Record<string, string>>({});
  const [preloadedCustomerId, setPreloadedCustomerId] = useState<string | undefined>();
  const preloadStarted = useRef(false);
  const itemsPreloaded = useRef(false);
  const couponAppliedInPreload = useRef(false);

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


  // ── Google Places (street autocomplete) ────────────────────
  const streetInputRef = useRef<HTMLInputElement>(null);
  const { ready: placesReady } = useGooglePlaces(streetInputRef, (parts) => {
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
  });

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
    if (isLoaded && items.length === 0 && !success) {
      router.replace("/tienda");
    }
  }, [isLoaded, items.length, success, router]);

  // ── Analytics: checkout_started ──────────────────────────────
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!isLoaded || items.length === 0 || checkoutTracked.current) return;
    checkoutTracked.current = true;
    posthog.capture("checkout_started", {
      cart_total: finalTotal + 85, // frontend estimate at fire time; preload may update finalTotal later
      item_count: items.reduce((sum, i) => sum + i.quantity, 0),
    });
  }, [isLoaded, items, finalTotal]);

  // ── Pre-carga: ejecutar en paralelo al montar la página ──────
  useEffect(() => {
    if (!isLoaded || items.length === 0 || preloadStarted.current) return;
    preloadStarted.current = true;

    // Snapshot coupon at effect-fire time — effect runs once
    const capturedCoupon = coupon;

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
        const region = (cart.currency_code ?? "mxn").toLowerCase() === "ars" ? "ars" : "mxn";
        setCartRegion(region);

        // 4. Pre-agregar items al carrito mientras el usuario llena el formulario
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

        // Apply coupon if present — so createPaymentSession sees the discounted total
        if (capturedCoupon?.code) {
          try {
            const updatedCart = await medusa.cart.applyPromotion(cartId, capturedCoupon.code);
            const promotionApplied = updatedCart.promotions?.some(
              (p) => p.code.toUpperCase() === capturedCoupon.code.toUpperCase()
            );
            if (promotionApplied) {
              setMedusaCartTotal(updatedCart.total);
              couponAppliedInPreload.current = true;
            }
          } catch {
            // Failed during preload — will retry on submit
          }
        }
      } catch { /* se creará en handleSubmit como fallback */ }

      console.timeEnd("[Checkout] preload");
    };

    preload();
  }, [isLoaded, items.length, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#005088] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) return <SuccessScreen />;

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
    let chargedTotal = finalTotal + 85;

    try {
      console.time("[Checkout] total");

      // ── Paso 1: Verificando tarjeta ──────────────────────────────────────
      setPaymentStep(1);

      let completePayload: import("@/lib/medusa").CompleteCartPayload;

      if (cartRegion === "ars") {
        // ── MercadoPago (AR) ──────────────────────────────────────────────
        try {
          const mp_card_token = await tokenizeCardMP(
            parseCardFormMP(card.number, card.name, card.expiry, card.cvv)
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
            },
          };
        }

        await medusa.cart.update(cart_id, shippingAddressPayload);

        // ── Paso 2b: Aplicar shipping method ───────────────────────────────
        const shippingOptions = await medusa.cart.getShippingOptions(cart_id!).catch(() => []);
        if (shippingOptions[0]?.id) {
          const shippedCart = await medusa.cart.addShippingMethod(cart_id!, shippingOptions[0].id);
          chargedTotal = shippedCart.total;
          setConfirmedTotal(shippedCart.total);

          // Coupon was applied during preload — verify it's still on the cart.
          // Uses data already in shippedCart: zero extra API calls.
          if (couponAppliedInPreload.current && coupon?.code) {
            const stillApplied = shippedCart.promotions?.some(
              (p) => p.code.toUpperCase() === coupon.code.toUpperCase()
            );
            if (!stillApplied) {
              setSubmitError("Tu cupón de descuento ya no es válido. Intenta con otro código.");
              setSubmitting(false);
              setPaymentStep(0);
              return;
            }
          }
        }

        // ── Paso 2c: Aplicar cupón de descuento si existe ──────────────────
        // Skip if already applied during preload (verified above); otherwise apply now and verify.
        if (coupon?.code && !couponAppliedInPreload.current) {
          const updatedCart = await medusa.cart.applyPromotion(cart_id!, coupon.code);
          const promotionApplied = updatedCart.promotions?.some(
            (p) => p.code.toUpperCase() === coupon.code.toUpperCase()
          );
          if (!promotionApplied) {
            setSubmitError("El cupón no pudo aplicarse. Verifica el código e intenta de nuevo.");
            setSubmitting(false);
            setPaymentStep(0);
            return;
          }
          // Coupon updated the cart total — capture it as the new authoritative amount
          chargedTotal = updatedCart.total;
          setConfirmedTotal(updatedCart.total);
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
      posthog.capture("order_completed", {
        cart_total: chargedTotal,
        item_count: items.reduce((sum, i) => sum + i.quantity, 0),
      });
      clearCart();
      setSuccess(true);
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
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* ── Overlay 3DS: tapa la pantalla mientras el browser navega a Openpay ── */}
      {paymentStep === 5 && (
        <div className="fixed inset-0 z-[9999] bg-[#FAF7F2] flex flex-col items-center justify-center gap-4">
          <span className="h-10 w-10 border-4 border-[#005088] border-t-transparent rounded-full animate-spin" />
          <p className="text-[16px] font-semibold text-[#005088]">Redirigiendo a tu banco…</p>
          <p className="text-[13px] text-[#9CA3AF]">No cierres esta página</p>
        </div>
      )}

      {/* ── Minimal Header ── */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#005088]/8">
        <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-between">
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#005088] hover:text-[#003d6b] transition-colors"
          >
            <ChevronLeft size={16} />
            Editar carrito
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/logos/logocolor.webp"
              alt="NovaPatch"
              width={140}
              height={40}
              className="h-[36px] w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280]">
            <Lock size={12} className="text-[#3CBFAB]" />
            Pago seguro
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* ── LEFT: Form ── */}
          <div>
            <h1 className="text-[26px] font-black text-[#005088] tracking-[-0.02em] mb-7">
              Finalizar compra
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
                className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 bg-[#EBF4FB] border border-[#005088]/12"
              >
                <CheckCircle2 size={18} className="text-[#005088] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-bold text-[#005088]">
                    Sesión activa — {user.fullName || user.primaryEmailAddress?.emailAddress}
                  </p>
                  <p className="text-[12px] text-[#5A7A9A] mt-0.5">
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
                className="bg-white rounded-2xl p-6 border border-[#005088]/8 shadow-[0_2px_16px_rgba(0,80,136,0.05)]"
              >
                <SectionHeader
                  step={1}
                  icon={<User size={16} />}
                  title="Información de contacto"
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
                  <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <LogIn size={14} className="text-[#6B7280] mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-[#6B7280] leading-[1.5]">
                      Comprando como invitado.{" "}
                      <button
                        type="button"
                        onClick={() => openSignIn({ forceRedirectUrl: "/checkout" })}
                        className="font-semibold text-[#005088] hover:underline"
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
                className="bg-white rounded-2xl p-6 border border-[#005088]/8 shadow-[0_2px_16px_rgba(0,80,136,0.05)]"
              >
                <SectionHeader
                  step={2}
                  icon={<Truck size={16} />}
                  title="Dirección de envío"
                />

                {/* ── Formulario Argentina ── */}
                {cartRegion === "ars" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Calle + número con Google Places */}
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="ar-street" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                        Calle y número<span className="text-[#E8503A] ml-0.5">*</span>
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
                          className={`w-full px-4 py-3 pr-10 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] ${
                            errors.street ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"
                          }`}
                        />
                        <MapPin size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: placesReady ? "#005088" : "#D1D5DB" }} />
                      </div>
                      {placesReady && (
                        <p className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                          <span className="text-[#4285F4] font-bold">G</span>
                          Autocompletado con Google
                        </p>
                      )}
                      <AnimatePresence>
                        {errors.street && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[11px] text-[#E8503A] flex items-center gap-1">
                            <AlertCircle size={11} />{errors.street}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Depto — opcional */}
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="ar-depto" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                        Depto / Piso <span className="text-[#9CA3AF] font-normal normal-case">(opcional)</span>
                      </label>
                      <input
                        id="ar-depto"
                        type="text"
                        placeholder="Ej. 4to B"
                        value={addressAR.depto}
                        onChange={(e) => setAddressAR((a) => ({ ...a, depto: e.target.value.slice(0, 20) }))}
                        autoComplete="address-line2"
                        className="w-full px-4 py-3 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border border-[#E5E7EB] bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088]"
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
                    <label htmlFor="street" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Calle y número<span className="text-[#E8503A] ml-0.5">*</span>
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
                        className={`w-full px-4 py-3 pr-10 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] ${
                          errors.street ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"
                        }`}
                      />
                      <MapPin
                        size={15}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: placesReady ? "#005088" : "#D1D5DB" }}
                      />
                    </div>
                    {placesReady && (
                      <p className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                        <span className="text-[#4285F4] font-bold">G</span>
                        Autocompletado con Google
                      </p>
                    )}
                    <AnimatePresence>
                      {errors.street && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[11px] text-[#E8503A] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />{errors.street}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Número interior — opcional */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="interior" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Número interior <span className="text-[#9CA3AF] font-normal normal-case">(opcional)</span>
                    </label>
                    <input
                      id="interior"
                      type="text"
                      placeholder="Ej. 4B, Depto 3"
                      value={address.interior}
                      onChange={(e) => setAddress((a) => ({ ...a, interior: e.target.value.slice(0, 20) }))}
                      autoComplete="address-line3"
                      className="w-full px-4 py-3 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border border-[#E5E7EB] bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088]"
                    />
                  </div>

                  {/* Indicaciones de entrega — opcional */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="instructions" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Indicaciones de entrega <span className="text-[#9CA3AF] font-normal normal-case">(opcional)</span>
                    </label>
                    <textarea
                      id="instructions"
                      placeholder="Ej. Edificio azul, no llamar por teléfono"
                      value={address.instructions}
                      onChange={(e) => setAddress((a) => ({ ...a, instructions: e.target.value.slice(0, 200) }))}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border border-[#E5E7EB] bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] resize-none"
                    />
                    <p className="text-[10px] text-[#9CA3AF] text-right">{address.instructions.length}/200</p>
                  </div>

                  {/* CP — dispara COPOMEX */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="zip" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Código postal<span className="text-[#E8503A] ml-0.5">*</span>
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
                            // Cuando COPOMEX responda con éxito, ciudad/estado quedarán válidos
                            clearErr("city");
                            clearErr("state");
                          } else {
                            resetCopomex();
                            setAddress((a) => ({ ...a, colonia: "", city: "", state: "" }));
                          }
                        }}
                        autoComplete="postal-code"
                        className={`w-full px-4 py-3 pr-10 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] ${
                          errors.zip ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"
                        }`}
                      />
                      {/* status icon */}
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {copomex.status === "loading" && (
                          <Loader2 size={14} className="animate-spin text-[#005088]" />
                        )}
                        {copomex.status === "success" && (
                          <CheckCircle2 size={14} className="text-[#3CBFAB]" />
                        )}
                        {copomex.status === "error" && (
                          <AlertCircle size={14} className="text-[#E8503A]" />
                        )}
                      </span>
                    </div>
                    <AnimatePresence>
                      {copomex.status === "success" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] text-[#3CBFAB] font-semibold"
                        >
                          ✓ {copomex.data.municipio}, {copomex.data.estado}
                        </motion.p>
                      )}
                      {copomex.status === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[11px] text-[#E8503A] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />CP no encontrado
                        </motion.p>
                      )}
                      {errors.zip && copomex.status !== "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[11px] text-[#E8503A] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />{errors.zip}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Colonia — select cuando COPOMEX OK, text input si no */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="colonia" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Colonia<span className="text-[#E8503A] ml-0.5">*</span>
                    </label>
                    {copomex.status === "success" && copomex.data.colonias.length > 0 ? (
                      <div className="relative">
                        <select
                          id="colonia"
                          value={address.colonia}
                          onChange={(e) => { setAddress((a) => ({ ...a, colonia: e.target.value })); clearErr("colonia"); }}
                          className={`w-full px-4 py-3 pr-9 rounded-xl text-[14px] text-[#005088] border bg-white appearance-none transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] cursor-pointer ${
                            errors.colonia ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"
                          }`}
                        >
                          <option value="">Selecciona tu colonia</option>
                          {copomex.data.colonias.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]"
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
                        className={`w-full px-4 py-3 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] disabled:opacity-60 disabled:cursor-wait ${
                          errors.colonia ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"
                        }`}
                      />
                    )}
                    <AnimatePresence>
                      {errors.colonia && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[11px] text-[#E8503A] flex items-center gap-1"
                        >
                          <AlertCircle size={11} />{errors.colonia}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Ciudad — auto-filled desde COPOMEX */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Municipio / Alcaldía<span className="text-[#E8503A] ml-0.5">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Miguel Hidalgo"
                      value={copomex.status === "success" ? (copomex.data.municipio || address.city) : address.city}
                      onChange={(e) => { setAddress((a) => ({ ...a, city: e.target.value })); clearErr("city"); }}
                      autoComplete="address-level2"
                      className={`w-full px-4 py-3 rounded-xl text-[14px] border bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] ${
                        copomex.status === "success" ? "text-[#005088] font-semibold" : "text-[#005088] placeholder-[#9CA3AF]"
                      } ${errors.city ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"}`}
                    />
                  </div>

                  {/* Estado — auto-filled desde COPOMEX */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Estado<span className="text-[#E8503A] ml-0.5">*</span>
                    </label>
                    <input
                      id="state"
                      type="text"
                      placeholder="Ciudad de México"
                      value={copomex.status === "success" ? (copomex.data.estado || address.state) : address.state}
                      onChange={(e) => { setAddress((a) => ({ ...a, state: e.target.value })); clearErr("state"); }}
                      autoComplete="address-level1"
                      className={`w-full px-4 py-3 rounded-xl text-[14px] border bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] ${
                        copomex.status === "success" ? "text-[#005088] font-semibold" : "text-[#005088] placeholder-[#9CA3AF]"
                      } ${errors.state ? "border-[#E8503A] ring-2 ring-[#E8503A]/20" : "border-[#E5E7EB]"}`}
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
                  className="bg-white rounded-2xl p-6 border border-[#005088]/8 shadow-[0_2px_16px_rgba(0,80,136,0.05)]"
                >
                  <SectionHeader
                    step={3}
                    icon={<CreditCard size={16} />}
                    title="Datos de pago"
                  />

                  {/* card brand logos */}
                  <div className="flex items-center gap-2 mb-5">
                    {["VISA", "MC", "AMEX"].map((b) => (
                      <span
                        key={b}
                        className="px-2.5 py-1 rounded-md border border-[#E5E7EB] text-[10px] font-black text-[#6B7280] bg-[#F9FAFB]"
                      >
                        {b}
                      </span>
                    ))}
                    <span className="text-[11px] text-[#9CA3AF] ml-1">
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
                  </div>

                  {/* Payment provider security badge */}
                  <div className="mt-5 flex items-center gap-2 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <ShieldCheck size={16} className="text-[#3CBFAB] flex-shrink-0" />
                    <p className="text-[11px] text-[#6B7280] leading-[1.5]">
                      Tus datos están protegidos con encriptación SSL de 256 bits.
                      El procesamiento es a través de{" "}
                      <span className="font-bold text-[#005088]">
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
                        className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]"
                      >
                        <AlertCircle size={15} className="text-[#E8503A] mt-0.5 flex-shrink-0" />
                        <p className="text-[12px] text-[#B91C1C] leading-[1.5]">{submitError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit + Progress Stepper */}
                  {submitting && paymentStep > 0 ? (
                    <div className="mt-6 space-y-3">
                      {[
                        { step: 1, label: "Verificando tarjeta" },
                        { step: 2, label: "Guardando dirección" },
                        { step: 3, label: "Preparando pago" },
                        { step: 4, label: "Procesando cobro" },
                      ].map(({ step, label }) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${
                            paymentStep > step
                              ? "bg-green-500 text-white"
                              : paymentStep === step
                              ? "bg-[#005088] text-white"
                              : "bg-[#E5E7EB] text-[#9CA3AF]"
                          }`}>
                            {paymentStep > step ? (
                              <CheckCircle2 size={16} />
                            ) : paymentStep === step ? (
                              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              step
                            )}
                          </div>
                          <span className={`text-[14px] font-medium transition-colors duration-300 ${
                            paymentStep > step
                              ? "text-green-600"
                              : paymentStep === step
                              ? "text-[#005088] font-bold"
                              : "text-[#9CA3AF]"
                          }`}>
                            {label}
                          </span>
                        </div>
                      ))}
                      <p className="text-center text-[12px] text-[#9CA3AF] pt-2">
                        No cierres esta página...
                      </p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-6 w-full py-4 rounded-xl text-[16px] font-black text-white transition-all duration-200 active:scale-[0.97] hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: "#E8503A" }}
                    >
                      <Lock size={16} />
                      Pagar {fmt(confirmedTotal ?? (finalTotal + 85), cartRegion)}
                    </button>
                  )}
                </motion.div>
              )}

              {/* Gate blocker message when auth needed */}
              {needsAuth && (
                <p className="text-center text-[13px] text-[#9CA3AF] pb-4">
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
              className="bg-white rounded-2xl border border-[#005088]/8 shadow-[0_4px_24px_rgba(0,80,136,0.08)] overflow-hidden"
            >
              {/* header */}
              <div className="px-6 py-4 border-b border-[#005088]/8">
                <h2 className="text-[15px] font-black text-[#005088] tracking-[-0.01em]">
                  Resumen del pedido
                </h2>
                <p className="text-[12px] text-[#6B7280] mt-0.5">
                  {items.reduce((s, i) => s + i.quantity, 0)} artículo(s)
                </p>
              </div>

              {/* items */}
              <div className="px-6 divide-y divide-[#F3F4F6]">
                {items.map((item) => (
                  <OrderItem key={`${item.slug}__${item.mode}__${item.freq}`} item={item} region={cartRegion} />
                ))}
              </div>

              {/* totals */}
              <div className="px-6 py-5 bg-[#F9FAFB] space-y-2.5">
                <div className="flex justify-between text-[13px] text-[#6B7280]">
                  <span>Subtotal</span>
                  <span>{fmt(totals.subtotal, cartRegion)}</span>
                </div>

                {totals.savings > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#E8503A" }}
                      >
                        AHORRO
                      </span>
                      Descuento suscripción
                    </span>
                    <span className="font-bold" style={{ color: "#E8503A" }}>
                      −{fmt(totals.savings, cartRegion)}
                    </span>
                  </div>
                )}

                {coupon && effectiveCouponDiscount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#16A34A" }}
                      >
                        CUPÓN
                      </span>
                      {coupon.code}
                    </span>
                    <span className="font-bold text-[#16A34A]">
                      −{fmt(effectiveCouponDiscount, cartRegion)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[13px] text-[#6B7280]">
                  <span>Envío</span>
                  <span className="font-semibold text-[#005088]">{fmt(85, cartRegion)}</span>
                </div>

                <div className="pt-2.5 border-t border-[#E5E7EB] flex justify-between">
                  <span className="text-[15px] font-black text-[#005088]">Total</span>
                  <div className="text-right">
                    <p className="text-[18px] font-black text-[#005088]">{fmt(confirmedTotal ?? (finalTotal + 85))}</p>
                    {(totals.savings > 0 || effectiveCouponDiscount > 0) && (
                      <p className="text-[11px] text-[#6B7280]">
                        antes {fmt(totals.subtotal + 85, cartRegion)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* trust badges */}
              <div className="px-6 py-4 border-t border-[#005088]/8">
                <div className="flex items-center justify-center gap-6">
                  {[
                    { icon: <Truck size={14} />, label: "Envío rápido" },
                    { icon: <ShieldCheck size={14} />, label: "Compra segura" },
                    { icon: <Repeat size={14} />, label: "Cancela fácil" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="flex flex-col items-center gap-1 text-[#6B7280]"
                    >
                      {b.icon}
                      <span className="text-[10px] font-semibold text-center leading-tight">
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
