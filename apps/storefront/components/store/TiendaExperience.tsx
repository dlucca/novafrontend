"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Product } from "@/lib/commerce";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";

// ─── UI metadata por producto ───────────────────────────────────────────────

const META: Record<string, {
  color: string;
  bg: string;
  taglineColor: string;
  quote: string;
  tags: string[];
  popular?: boolean;
}> = {
  shield: {
    color: "#A07000",
    bg: "#FAF6E9",
    taglineColor: "#A07000",
    quote: '"Tu rutina de cuidado empieza hoy, no cuando algo pasa."',
    tags: ["Cuidado preventivo", "Uso diario"],
  },
  glow: {
    color: "#C94030",
    bg: "#FAF0EE",
    taglineColor: "#C94030",
    quote: '"La piel también refleja cómo te cuidas."',
    tags: ["Bienestar desde adentro", "Constancia"],
  },
  sleep: {
    color: "#138A75",
    bg: "#EBF7F5",
    taglineColor: "#138A75",
    quote: '"Porque descansar también es cuidarse."',
    tags: ["Descanso nocturno", "Sin somníferos"],
  },
  energy: {
    color: "#2B7CC1",
    bg: "#EBF4FB",
    taglineColor: "#2B7CC1",
    quote: '"Tu día no para. Tu energía tampoco."',
    tags: ["Energía sostenida", "Sin picos ni caídas"],
    popular: true,
  },
  zen: {
    color: "#3A6FA8",
    bg: "#EBF0F9",
    taglineColor: "#3A6FA8",
    quote: '"El equilibrio que no se ve, pero se siente."',
    tags: ["Calma funcional", "Días intensos"],
  },
  woman: {
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#8A3EBE",
    quote: '"Escucharte también es una forma de cuidarte."',
    tags: ["Bienestar femenino", "Ritmos naturales"],
  },
};

// ─── Frecuencias de suscripción (del PRD) ───────────────────────────────────

const FRECUENCIAS = [
  { days: 30 as const, label: "Mensual",    discount: 0.20, badge: "20% OFF" },
  { days: 60 as const, label: "Bimestral",  discount: 0.15, badge: "15% OFF" },
  { days: 90 as const, label: "Trimestral", discount: 0.10, badge: "10% OFF" },
];

type Freq = 30 | 60 | 90;
type Mode = "once" | "sub";

// ─── Helpers ────────────────────────────────────────────────────────────────

function discountedPrice(base: number, freq: Freq): number {
  const { discount } = FRECUENCIAS.find((f) => f.days === freq)!;
  return Math.round(base * (1 - discount));
}

// ─── Componentes internos ────────────────────────────────────────────────────

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-black/[0.07]">
      <button
        onClick={() => onChange("once")}
        className="px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200"
        style={{
          background: mode === "once" ? "var(--color-ocean)" : "transparent",
          color: mode === "once" ? "#fff" : "#6B7280",
        }}
      >
        Compra única
      </button>
      <button
        onClick={() => onChange("sub")}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200"
        style={{
          background: mode === "sub" ? "var(--color-coral)" : "transparent",
          color: mode === "sub" ? "#fff" : "#6B7280",
        }}
      >
        Suscripción
        {mode === "once" && (
          <span className="text-[10px] font-black bg-coral text-white px-2 py-0.5 rounded-full">
            hasta 20% OFF
          </span>
        )}
      </button>
    </div>
  );
}

function FrequencyPicker({
  selected,
  color,
  bg,
  taglineColor,
  onChange,
}: {
  selected: Freq;
  color: string;
  bg: string;
  taglineColor: string;
  onChange: (f: Freq) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {FRECUENCIAS.map((f) => {
        const isActive = selected === f.days;
        return (
          <button
            key={f.days}
            onClick={() => onChange(f.days)}
            className="rounded-2xl border-2 px-3 py-3 text-center transition-all"
            style={{
              borderColor: isActive ? color : "#E7E1D6",
              background: isActive ? `color-mix(in srgb, ${bg} 45%, #fff)` : "#FCFAF6",
              color: isActive ? taglineColor : "#6B7280",
            }}
          >
            <span className="block text-xs font-semibold">{f.label}</span>
            <span className="block text-[12px] font-black mt-0.5">
              {f.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProductCard({
  product,
  mode,
  freq,
  onFreqChange,
  currency = "MXN",
}: {
  product: Product;
  mode: Mode;
  freq: Freq;
  onFreqChange: (f: Freq) => void;
  currency?: string;
}) {
  const meta = META[product.slug];
  const { addToCart } = useCart();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  if (!meta) return null;

  const displayPrice =
    mode === "sub" ? discountedPrice(product.price, freq) : product.price;
  const freqBadge = FRECUENCIAS.find((f) => f.days === freq)!.badge;

  function handleAddToCart() {
    addToCart({
      slug: product.slug,
      title: product.title,
      image: product.image,
      price: product.price,
      color: meta.color,
      bg: meta.bg,
      mode,
      freq,
    });
  }

  return (
    <div
      data-testid="product-card"
      className="bg-white rounded-[22px] overflow-hidden border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >

      {/* Imagen */}
      <div
        className="relative flex items-center justify-center py-6 px-4"
        style={{ background: meta.bg }}
      >
        {meta.popular && (
          <span className="absolute top-3 right-3 bg-coral text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
            Más popular
          </span>
        )}
        <AnimatePresence>
          {mode === "sub" && (
            <motion.span
              key="discount-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
              style={{ background: meta.color }}
            >
              {freqBadge}
            </motion.span>
          )}
        </AnimatePresence>
        <Link href={`/${locale}/tienda/${product.slug}`} className="relative block w-[246px] h-[246px]">
          <Image
            src={product.image}
            alt={`Novapatch ${product.title}`}
            fill
            sizes="246px"
            loading="lazy"
            className="object-contain drop-shadow-md"
          />
        </Link>
      </div>

            {/* Cuerpo */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-[42px] font-black tracking-tight leading-none" 
              style={{ color: meta.color }}>
            <Link href={`/${locale}/tienda/${product.slug}`}>{product.title}</Link>
          </h3>
          <p className="text-[13px] leading-snug mt-3 text-[#0e1b34]">
            {product.description}
          </p>
        </div>

        <p className="text-[14px] text-[#0e1b34] italic leading-relaxed">
          {meta.quote}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-[13px] font-bold px-2.5 py-1 rounded-full border-[1.2px]"
              style={{ borderColor: meta.color, color: meta.color }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Selector de frecuencia (solo en modo suscripción) */}
        <AnimatePresence>
          {mode === "sub" && (
            <motion.div
              key="freq-picker"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-[12px] font-bold text-[#0e1b34] mb-2 mt-1">
                ¿Cómo quieres recibirlo?
              </p>
              <FrequencyPicker
                selected={freq}
                color={meta.color}
                bg={meta.bg}
                taglineColor={meta.taglineColor}
                onChange={onFreqChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Precio + CTA */}
        <div className="mt-auto pt-3 border-t border-black/[0.05]">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[26px] font-black tracking-tight text-[#0e1b34]">
              {formatPrice(displayPrice, currency)}
            </span>
            <AnimatePresence>
              {mode === "sub" && (
                <motion.span
                  key="original-price"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  className="text-[14px] text-[#C0C0C0] line-through"
                >
                  {formatPrice(product.price, currency)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleAddToCart}
            className="relative z-[2] mt-3 w-full inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-[15px] justify-center transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] shadow-[0_4px_16px_rgba(0,80,136,0.3)] bg-ocean hover:bg-ocean-dark"
          >
            {mode === "sub" ? "Suscribirse" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function TiendaExperience({ products, currency = "MXN" }: { products: Product[], currency?: string }) {
  const [mode, setMode] = useState<Mode>("once");
  const [freqs, setFreqs] = useState<Record<string, Freq>>({});

  function getFreq(slug: string): Freq {
    return freqs[slug] ?? 30;
  }

  function setFreq(slug: string, f: Freq) {
    setFreqs((prev) => ({ ...prev, [slug]: f }));
  }

  return (
    <main className="min-h-screen" style={{ background: "#F8F3EC" }}>

      {/* ── Hero ── */}
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-[11px] font-bold uppercase tracking-[0.22em] text-coral mb-3"
        >
          Tienda Novapatch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.07 }}
          className="font-black text-ocean tracking-tight mb-3"
          style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
        >
          Elige el parche que necesita tu cuerpo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.13 }}
          className="text-[#5A6475] text-base leading-relaxed mb-8 max-w-md mx-auto"
        >
          Seis fórmulas. Un solo formato: pega, olvida y deja que trabaje.
        </motion.p>

        {/* Toggle Una vez / Suscripción */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.19 }}
        >
          <ModeToggle mode={mode} onChange={setMode} />
        </motion.div>

        <AnimatePresence>
          {mode === "sub" && (
            <motion.p
              key="sub-hint"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-[12px] text-[#9CA3AF] mt-3"
            >
              Elige la frecuencia por producto. Pausa o cancela cuando quieras.
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* ── Grid de productos ── */}
      <section className="px-4 pb-24 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.07,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`flex ${i === 0 ? "sm:col-span-2 md:col-span-1" : ""}`}
            >
              <ProductCard
                product={product}
                mode={mode}
                freq={getFreq(product.slug)}
                onFreqChange={(f) => setFreq(product.slug, f)}
                currency={currency}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Banda de beneficios suscripción ── */}
      <AnimatePresence>
        {mode === "sub" && (
          <motion.section
            key="benefits-band"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="border-t border-black/[0.06] py-10 px-6"
            style={{ background: "#fff" }}
          >
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: (
                    <svg width="24" height="24" fill="none" stroke="var(--color-coral)" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Sin interrupciones",
                  desc: "Tu parche llega antes de que se te acabe.",
                },
                {
                  icon: (
                    <svg width="24" height="24" fill="none" stroke="var(--color-coral)" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Precio de suscriptor",
                  desc: "Siempre más bajo que la compra individual.",
                },
                {
                  icon: (
                    <svg width="24" height="24" fill="none" stroke="var(--color-coral)" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Tú controlas",
                  desc: "Pausa, cambia o cancela sin llamadas ni penalizaciones.",
                },
              ].map((b) => (
                <div key={b.title} className="flex flex-col items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#FFF0ED] flex items-center justify-center">
                    {b.icon}
                  </div>
                  <p className="text-[14px] font-bold text-ocean">{b.title}</p>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
