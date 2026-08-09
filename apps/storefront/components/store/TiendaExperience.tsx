"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Product } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { PRODUCT_META } from "@/lib/product-meta";
import { useCart } from "@/contexts/CartContext";

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

// ─── Componentes internos ────────────────────────────────────────────────────

function ProductCard({
  product,
  ratingSummary,
  currency = "MXN",
}: {
  product: Product;
  ratingSummary?: { average: number; count: number };
  currency?: string;
}) {
  const meta = META[product.slug];
  const { addToCart } = useCart();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  const [isHovered, setIsHovered] = useState(false);

  if (!meta) return null;

  const fallbackMeta = PRODUCT_META[product.slug];
  const hoverImage = fallbackMeta?.howItWorksImage ?? product.image;

  const rating = ratingSummary?.average ?? 5.0;
  const count = ratingSummary?.count ?? 80;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      slug: product.slug,
      title: product.title,
      image: product.image,
      price: product.price,
      color: meta.color,
      bg: meta.bg,
      mode: "once",
      freq: 30,
    });
  }

  return (
    <Link
      href={`/${locale}/tienda/${product.slug}`}
      className="group bg-white rounded-[28px] overflow-hidden border border-[#E8E2D8]/60 shadow-[0_4px_24px_rgba(13,27,53,0.03)] hover:shadow-[0_16px_48px_rgba(13,27,53,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen Box */}
      <div
        className="relative flex items-center justify-center p-2 aspect-square overflow-hidden bg-white"
      >
        {meta.popular && (
          <span className="absolute top-4 right-4 bg-coral text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10">
            Más popular
          </span>
        )}

        <div className="relative w-full h-full">
          {/* Base Image */}
          <Image
            src={product.image}
            alt={`Novapatch ${product.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            loading="lazy"
            className={`object-contain drop-shadow-md transition-all duration-500 ease-in-out ${isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
          />
        </div>
        {/* Hover Image (Full bleed - absolute inset-0) */}
        <Image
          src={hoverImage}
          alt={`Detalles de Novapatch ${product.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          loading="lazy"
          className={`object-cover transition-all duration-500 ease-in-out absolute inset-0 w-full h-full z-10 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
        />
      </div>

      {/* Cuerpo */}
      <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
        <div>
          {/* Valoración */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="text-[#F59E0B] text-xs font-bold tracking-tight">
              {"★".repeat(Math.round(rating))}
              {"☆".repeat(5 - Math.round(rating))}
            </div>
            <span className="text-[11px] font-bold text-[#0D1B35]/60">
              {rating} ({count} {count === 1 ? "opinión" : "opiniones"})
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0D1B35] leading-none group-hover:text-coral transition-colors duration-300">
            {product.title}
          </h3>

          <p className="mt-3 text-[13px] leading-relaxed text-[#425066] font-medium">
            {product.description}
          </p>
        </div>

        {/* Precios + Botón */}
        <div className="pt-4 border-t border-[#E8E2D8]/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-extrabold text-[#0D1B35]/60 uppercase tracking-wider">Precio</span>
            <span className="text-xl font-black text-[#0D1B35]">{formatPrice(product.price, currency)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="relative z-10 px-4 py-3 rounded-full text-white font-bold text-xs text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm bg-coral hover:bg-coral-dark"
            >
              Comprar ahora
            </button>

            <div
              className="px-4 py-3 rounded-full font-bold text-xs text-center border transition-all duration-200 hover:bg-[#FAF7F2] flex items-center justify-center gap-1"
              style={{ borderColor: meta.color, color: meta.color }}
            >
              Más detalles
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function TiendaExperience({ products, currency = "MXN" }: { products: Product[], currency?: string }) {
  const [reviewsSummary, setReviewsSummary] = useState<Record<string, { average: number; count: number }>>({});

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const allReviews: { slug: string; rating: number }[] = await res.json();
          const groups: Record<string, number[]> = {};

          allReviews.forEach((r) => {
            if (!groups[r.slug]) groups[r.slug] = [];
            groups[r.slug].push(r.rating);
          });

          const summary: Record<string, { average: number; count: number }> = {};
          Object.keys(groups).forEach((slug) => {
            const ratings = groups[slug];
            const sum = ratings.reduce((a, b) => a + b, 0);
            summary[slug] = {
              average: Number((sum / ratings.length).toFixed(1)),
              count: ratings.length,
            };
          });

          setReviewsSummary(summary);
        }
      } catch (e) {
        console.error("Error loading reviews summary for shop page:", e);
      }
    }
    loadReviews();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "#F8F3EC" }}>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center">
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
          className="text-[#5A6475] text-base leading-relaxed max-w-md mx-auto"
        >
          Seis fórmulas. Un solo formato: pega, olvida y deja que trabaje.
        </motion.p>
      </section>

      {/* ── Grid de productos ── */}
      <section className="px-4 pb-24 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
              className="flex"
            >
              <ProductCard
                product={product}
                ratingSummary={reviewsSummary[product.slug]}
                currency={currency}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
