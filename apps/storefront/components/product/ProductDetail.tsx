"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/contexts/CartContext";
import { trackMeta } from "@/lib/meta";
import { formatPrice } from "@/lib/format";
import type { ProductDetail as ProductDetailData, PurchaseOption } from "@/lib/commerce";
import {
  PRODUCT_META,
  PDP_META,
  SUBSCRIPTION_PERKS,
  HOW_IT_WORKS_INTRO,
  type ProductMeta,
  type PdpMeta,
} from "@/lib/product-meta";

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function Gallery({
  images,
  title,
  bg,
  accent,
}: {
  images: string[];
  title: string;
  bg: string;
  accent: string;
}) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);
  return (
    <div>
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px]"
        style={{ background: bg }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={images[active]}
              alt={`${title} — imagen ${active + 1}`}
              fill
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-3 sm:p-1"
            />
          </motion.div>
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 z-[1] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0D1B35] shadow-[0_2px_10px_rgba(13,27,53,0.12)] transition hover:bg-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 z-[1] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0D1B35] shadow-[0_2px_10px_rgba(13,27,53,0.12)] transition hover:bg-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>
            {/* Miniaturas - Aspect 4/5 + object-cover */}
      {images.length > 1 && (
        <div
          className="mt-4 grid gap-3 justify-center md:justify-start"
          style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
        >
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/5] w-full max-w-[110px] overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                i === active 
                  ? 'border-black scale-105 shadow-md' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              style={{
                background: bg,
              }}
            >
              <Image 
                src={src} 
                alt={`${title} vista ${i + 1}`}
                fill 
                sizes="120px"
                className="object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TierSelector({
  options,
  selected,
  onSelect,
  currency,
  color,
  bg,
}: {
  options: PurchaseOption[];
  selected: PurchaseOption;
  onSelect: (o: PurchaseOption) => void;
  currency: string;
  color: string;
  bg: string;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[#0D1B35]">¿Cómo quieres recibirlo?</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((o) => {
          const isActive = o.tier === selected.tier;
          return (
            <button
              key={o.tier}
              onClick={() => onSelect(o)}
              aria-pressed={isActive}
              className="rounded-2xl border-2 px-3 py-3 text-left transition"
              style={{
                // Neutros cálidos (cream) en reposo; el tier activo toma un velo del tint del producto
                borderColor: isActive ? color : "#E7E1D6",
                background: isActive ? `color-mix(in srgb, ${bg} 45%, #fff)` : "#FCFAF6",
                boxShadow: isActive ? "0 4px 16px rgba(13,27,53,0.08)" : "none",
              }}
            >
              <span className="block text-xs font-semibold text-[#0D1B35]">{o.label}</span>
              <span className="mt-1 block text-lg font-extrabold text-[#0D1B35]">
                {formatPrice(o.price, currency)}
              </span>
              {o.discountPct > 0 && (
                <span className="mt-0.5 block text-[11px] font-bold" style={{ color }}>
                  {o.discountPct}% OFF
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
      style={{ color }}
    >
      {children}
    </p>
  );
}

function FaqAccordion({ faq, accent }: { faq: PdpMeta["faq"]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faq.map((item, i) => (
        <div key={item.q} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`faq-panel-${i}`}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm font-bold text-[#0D1B35]">{item.q}</span>
            <span
              className="ml-4 text-xl leading-none transition-transform"
              style={{
                transform: open === i ? "rotate(45deg)" : "none",
                color: open === i ? accent : "rgba(13,27,53,0.45)",
              }}
            >
              +
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`faq-panel-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="px-6 pb-5 text-sm leading-6 text-[#425066]">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetail({
  product,
  currency,
}: {
  product: ProductDetailData;
  currency: string;
}) {
  const { addToCart } = useCart();
  const { user, isLoaded } = useUser();

  // Meta ViewContent — se dispara una vez al abrir la PDP, esperando a que
  // Clerk resuelva para adjuntar identidad (mejor match quality en CAPI).
  const viewTracked = useRef(false);
  useEffect(() => {
    if (!isLoaded || viewTracked.current) return;
    viewTracked.current = true;
    const defaultOption =
      product.options.find((o) => o.tier === "monthly") ?? product.options[0];
    trackMeta(
      "ViewContent",
      {
        currency,
        value: product.basePrice,
        content_ids: [defaultOption?.variantId ?? product.slug],
        content_name: product.title,
        content_type: "product",
      },
      { email: user?.primaryEmailAddress?.emailAddress, externalId: user?.id },
    );
  }, [isLoaded, user, product, currency]);

  const meta: ProductMeta | undefined = PRODUCT_META[product.slug];
  const pdp: PdpMeta | undefined = PDP_META[product.slug];
  const color = meta?.color ?? "var(--color-coral)";
  const bg = meta?.bg ?? "#FFFFFF";
  // Shade del producto para texto/acentos sobre fondos claros (mejor contraste que el base)
  const accent = meta?.taglineColor ?? color;
  // La galería muestra solo las primeras 5 imágenes (01-05). Las secciones
  // inferiores usan imágenes propias
  const galleryImages = product.images.slice(0, 5);
  const lifestyleA = meta?.howItWorksImage;         // Imagen seccion Como funciona
  const lifestyleB = "/productusers/FAQ_image.webp";                   // Imagen FIJA para FAQ

  // Default: Mensual (igual que el mockup)
  const [selected, setSelected] = useState<PurchaseOption>(
    product.options.find((o) => o.tier === "monthly") ?? product.options[0]
  );

  const handleAdd = (option: PurchaseOption) => {
    addToCart({
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.basePrice,
      color,
      bg,
      mode: option.freq === null ? "once" : "sub",
      freq: option.freq ?? 30,
      variantId: option.variantId,
    });
  };

  const ctaLabel =
    selected.freq === null ? "Agregar al carrito" : `Suscribirme · cada ${selected.freq} días`;

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* ── Hero: galería + info ── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pt-28 pb-16 lg:grid-cols-2">
        <Gallery images={galleryImages} title={product.title} bg={bg} accent={accent} />

        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-black" style={{ color }}>
            {product.title}
          </h1>
          {pdp && (
            <p className="mt-1 text-lg font-semibold text-[#0D1B35]">{pdp.tagline}</p>
          )}
          <p className="mt-4 max-w-md text-sm leading-6 text-[#425066]">
            {product.description}
          </p>

          {meta && meta.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: color, color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <TierSelector
              options={product.options}
              selected={selected}
              onSelect={setSelected}
              currency={currency}
              color={color}
              bg={bg}
            />
          </div>

          <button
            onClick={() => handleAdd(selected)}
            className="mt-6 w-full rounded-full py-4 text-base font-bold text-white transition hover:opacity-90"
            style={{ background: color }}
          >
            {ctaLabel}
          </button>
          {selected.discountPct > 0 && (
            <p className="mt-3 text-center text-xs font-bold text-[#1E7D4F]">
              Ahorras {formatPrice(product.basePrice - selected.price, currency)} en cada entrega
            </p>
          )}
          <p className={`text-center text-xs text-[#0D1B35]/55 ${selected.discountPct > 0 ? "mt-1" : "mt-3"}`}>
            Pausa, cambia o cancela cuando quieras · Sin penalizaciones
          </p>
        </div>
      </section>

      {/* ── Perks de suscripción — solo si hay un tier de suscripción elegido ── */}
      <AnimatePresence initial={false}>
        {selected.freq !== null && (
          <motion.section
            key="subscription-perks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
            className="overflow-hidden border-y border-[#E8E2D8]"
            style={{ background: `color-mix(in srgb, ${bg} 30%, #fff)` }}
          >
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3"
            >
              {SUBSCRIPTION_PERKS.map((perk) => (
                <div key={perk.title}>
                  <p className="text-sm font-bold" style={{ color }}>
                    {perk.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#425066]">{perk.description}</p>
                </div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {pdp && (
        <>
          {/* ── ¿Cómo te acompaña? — heading lateral + lista con divisores ── */}
          <motion.section {...sectionReveal} className="mx-auto max-w-6xl px-6 pt-24 pb-20">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Eyebrow color={accent}>{product.title} · todos los días</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                  ¿Cómo te acompaña?
                </h2>
                {meta?.quote && (
                  <p className="mt-5 max-w-xs text-lg font-medium italic leading-snug" style={{ color: accent }}>
                    {meta.quote}
                  </p>
                )}
              </div>
              <div className="lg:col-span-7">
                {pdp.accompaniment.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-baseline gap-5 border-b py-5 first:pt-1"
                    style={{ borderColor: `color-mix(in srgb, ${accent} 22%, transparent)` }}
                  >
                    <span className="text-xs font-black tabular-nums" style={{ color: accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[17px] font-semibold leading-snug text-[#0D1B35]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── Cómo funciona — foto lifestyle a la DERECHA + texto ── */}
          <motion.section {...sectionReveal} className="bg-white py-20">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-12">
              
              {/* Texto a la izquierda */}
              <div className={lifestyleA ? "lg:col-span-7" : "lg:col-span-8"}>
                <Eyebrow color={accent}>La ciencia del parche</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                  Cómo funciona
                </h2>
                <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#425066]">
                  {HOW_IT_WORKS_INTRO}
                </p>
                <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#425066]">
                  {pdp.howItWorks}
                </p>
              </div>

              {/* Imagen a la derecha */}
              {lifestyleA && (
                <div className="lg:col-span-5">
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-[24px]"
                    style={{ background: bg }}
                  >
                    <Image
                      src={lifestyleA}
                      alt={`${product.title} en uso`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* ── Ingredientes clave — banda tint del producto ── */}
          <motion.section {...sectionReveal} style={{ background: bg }} className="py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow color={accent}>Fórmula {product.title}</Eyebrow>
                  <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                    Ingredientes clave
                  </h2>
                </div>
                <p className="text-sm font-semibold" style={{ color: accent }}>
                  {pdp.ingredientDetails.length} activos seleccionados
                </p>
              </div>
              <div className="mt-10 grid gap-x-12 sm:grid-cols-2">
                {pdp.ingredientDetails.map((ing) => (
                  <div key={ing.name} className="border-t border-[#0D1B35]/10 py-4">
                    <p className="text-[15px] font-bold text-[#0D1B35]">{ing.name}</p>
                    <p className="mt-1 text-[13px] leading-5 text-[#0D1B35]/65">
                      {ing.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── Modo de uso — numerales grandes ── */}
          <motion.section {...sectionReveal} className="bg-white py-20">
            <div className="mx-auto max-w-6xl px-6">
              <Eyebrow color={accent}>Un gesto simple</Eyebrow>
              <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                Modo de uso
              </h2>
              <div className="mt-12 grid gap-10 sm:grid-cols-3">
                {pdp.usageSteps.map((step, i) => (
                  <div key={step} className="border-t-2 pt-5" style={{ borderColor: accent }}>
                    <span
                      className="block text-[clamp(40px,4vw,56px)] font-black leading-none"
                      style={{ color: accent }}
                    >
                      {i + 1}
                    </span>
                    <p className="mt-4 text-sm leading-6 text-[#425066]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

                    {/* ── FAQ — heading lateral + accordion ── */}
          <motion.section {...sectionReveal} className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Eyebrow color={accent}>Antes de empezar</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                  Preguntas frecuentes
                </h2>
              </div>
              <div className="lg:col-span-8">
                <FaqAccordion faq={pdp.faq} accent={accent} />
              </div>
            </div>
          </motion.section>
        </>
      )}

      {/* ── CTA final — banda tint asimétrica ── */}
      <motion.section {...sectionReveal} className="px-6 pb-24">
        <div
          className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[28px] px-10 py-12 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: bg }}
        >
          <div>
            <h2 className="text-[clamp(24px,2.5vw,32px)] font-black leading-tight text-[#0D1B35]">
              ¿Listo para probar {product.title}?
            </h2>
            <p className="mt-1 text-sm text-[#0D1B35]/65">
              Pausa, cambia o cancela cuando quieras.
            </p>
          </div>
          <button
            onClick={() => handleAdd(selected)}
            className="shrink-0 rounded-full px-10 py-4 text-base font-bold text-white transition hover:opacity-90"
            style={{ background: color }}
          >
            {ctaLabel}
          </button>
        </div>
      </motion.section>
    </main>
  );
}
