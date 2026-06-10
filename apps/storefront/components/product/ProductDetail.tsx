"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
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

function Gallery({ images, title, bg }: { images: string[]; title: string; bg: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[24px]"
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
              className="object-contain p-6"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className="relative h-16 w-16 overflow-hidden rounded-xl border-2 transition"
              style={{
                background: bg,
                borderColor: i === active ? "var(--color-navy)" : "transparent",
              }}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
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
}: {
  options: PurchaseOption[];
  selected: PurchaseOption;
  onSelect: (o: PurchaseOption) => void;
  currency: string;
  color: string;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[#0D1B35]">¿Cómo querés recibirlo?</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((o) => {
          const isActive = o.tier === selected.tier;
          return (
            <button
              key={o.tier}
              onClick={() => onSelect(o)}
              className="rounded-2xl border-2 px-3 py-3 text-left transition"
              style={{
                borderColor: isActive ? color : "#E5E7EB",
                background: isActive ? "#fff" : "#FAFAFA",
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

function FaqAccordion({ faq }: { faq: PdpMeta["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {faq.map((item, i) => (
        <div key={item.q} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm font-bold text-[#0D1B35]">{item.q}</span>
            <span
              className="ml-4 text-xl leading-none text-[#0D1B35] transition-transform"
              style={{ transform: open === i ? "rotate(45deg)" : "none" }}
            >
              +
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
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

  const meta: ProductMeta | undefined = PRODUCT_META[product.slug];
  const pdp: PdpMeta | undefined = PDP_META[product.slug];
  const color = meta?.color ?? "var(--color-coral)";
  const bg = meta?.bg ?? "#FFFFFF";

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
    selected.freq === null ? "Agregar al carrito" : `Suscribirme (${selected.freq} días)`;

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* ── Hero: galería + info ── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pt-28 pb-16 lg:grid-cols-2">
        <Gallery images={product.images} title={product.title} bg={bg} />

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
            />
          </div>

          <button
            onClick={() => handleAdd(selected)}
            className="mt-6 w-full rounded-full py-4 text-base font-bold text-white transition hover:opacity-90"
            style={{ background: color }}
          >
            {ctaLabel}
          </button>
        </div>
      </section>

      {/* ── Perks de suscripción ── */}
      <section className="border-y border-[#E8E2D8] bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3">
          {SUBSCRIPTION_PERKS.map((perk) => (
            <div key={perk.title}>
              <p className="text-sm font-bold" style={{ color }}>
                {perk.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#425066]">{perk.description}</p>
            </div>
          ))}
        </div>
      </section>

      {pdp && (
        <>
          {/* ── ¿Cómo te acompaña? ── */}
          <motion.section {...sectionReveal} className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-center text-3xl font-black text-[#0D1B35]">
              ¿Cómo te acompaña?
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pdp.accompaniment.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <p className="text-sm font-medium text-[#0D1B35]">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Cómo funciona ── */}
          <motion.section {...sectionReveal} className="bg-white py-16">
            <div className="mx-auto max-w-2xl px-6 text-center">
              <h2 className="text-3xl font-black text-[#0D1B35]">Cómo funciona</h2>
              <p className="mt-6 text-sm leading-7 text-[#425066]">{HOW_IT_WORKS_INTRO}</p>
              <p className="mt-4 text-sm leading-7 text-[#425066]">{pdp.howItWorks}</p>
            </div>
          </motion.section>

          {/* ── Ingredientes clave ── */}
          <motion.section {...sectionReveal} className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-center text-3xl font-black text-[#0D1B35]">
              Ingredientes clave
            </h2>
            <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {pdp.ingredientDetails.map((ing) => (
                <div key={ing.name} className="flex gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <div>
                    <p className="text-sm font-bold text-[#0D1B35]">{ing.name}</p>
                    <p className="mt-0.5 text-xs leading-5 text-[#425066]">
                      {ing.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Modo de uso ── */}
          <motion.section {...sectionReveal} className="bg-white py-16">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-center text-3xl font-black text-[#0D1B35]">Modo de uso</h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {pdp.usageSteps.map((step, i) => (
                  <div key={step} className="text-center">
                    <span
                      className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border-2 text-sm font-extrabold"
                      style={{ borderColor: color, color }}
                    >
                      {i + 1}
                    </span>
                    <p className="mt-4 text-xs leading-6 text-[#425066]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── FAQ ── */}
          <motion.section {...sectionReveal} className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-center text-3xl font-black text-[#0D1B35]">
              Preguntas frecuentes
            </h2>
            <div className="mt-8">
              <FaqAccordion faq={pdp.faq} />
            </div>
          </motion.section>
        </>
      )}

      {/* ── CTA final ── */}
      <motion.section {...sectionReveal} className="px-6 pb-24 pt-4 text-center">
        <h2 className="text-3xl font-black text-[#0D1B35]">¿Listo para probar?</h2>
        <button
          onClick={() => handleAdd(selected)}
          className="mt-6 rounded-full px-10 py-4 text-base font-bold text-white transition hover:opacity-90"
          style={{ background: color }}
        >
          Agregar {product.title} al carrito
        </button>
      </motion.section>
    </main>
  );
}
