"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Product } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { PRODUCT_META, BUNDLE_ORIGINAL_PRICES } from "@/lib/product-meta";
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
  "pack-dia-noche": {
    color: "#005088",
    bg: "#EBF4FB",
    taglineColor: "#005088",
    quote: '"Energía para tu día. Descanso para tu noche."',
    tags: ["Ritual 24h", "15% OFF INCLUIDO"],
    popular: true,
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
  const meta = META[product.slug] ?? PRODUCT_META[product.slug];
  const { addToCart } = useCart();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  const [isHovered, setIsHovered] = useState(false);

  if (!meta) return null;

  const fallbackMeta = PRODUCT_META[product.slug];
  const isBundle = product.slug.startsWith("pack-");
  const hoverImage = !isBundle ? fallbackMeta?.hoverImgSrc : undefined;

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
      className="group bg-white rounded-[20px] sm:rounded-[28px] overflow-hidden border border-[#E8E2D8]/60 shadow-[0_4px_24px_rgba(13,27,53,0.03)] hover:shadow-[0_16px_48px_rgba(13,27,53,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Imagen Box */}
      <div
        className="relative flex items-center justify-center p-2 aspect-square overflow-hidden bg-white"
        onMouseEnter={() => { if (hoverImage) setIsHovered(true); }}
        onMouseLeave={() => { if (hoverImage) setIsHovered(false); }}
      >
        <div className="relative w-full h-full">
          {/* Base Image */}
          <Image
            src={product.image}
            alt={`Novapatch ${product.title}`}
            fill
            sizes="(max-width: 768px) 50vw, 350px"
            loading="lazy"
            className={`object-contain drop-shadow-md transition-all duration-500 ease-in-out ${
              hoverImage && isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          />
        </div>
        {/* Hover Image (Full bleed - absolute inset-0) */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`Detalles de Novapatch ${product.title}`}
            fill
            sizes="(max-width: 768px) 50vw, 350px"
            loading="lazy"
            className={`object-cover transition-all duration-500 ease-in-out absolute inset-0 w-full h-full z-10 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          />
        )}
      </div>

      {/* Cuerpo */}
      <div className="p-3.5 sm:p-6 flex flex-col gap-2.5 sm:gap-4 flex-1 justify-between">
        <div>
          {/* Valoración */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
            <div className="text-[#F59E0B] text-[10px] sm:text-xs font-bold tracking-tight">
              {"★".repeat(Math.round(rating))}
              {"☆".repeat(5 - Math.round(rating))}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#0D1B35]/60">
              {rating} ({count})
            </span>
          </div>

          <h3 className="text-base sm:text-2xl font-black tracking-tight text-[#0D1B35] leading-snug sm:leading-none">
            {product.title}
          </h3>

          <p className="mt-1.5 sm:mt-3 text-xs sm:text-[13px] leading-snug sm:leading-relaxed text-[#425066] font-medium line-clamp-2 sm:line-clamp-none">
            {product.description}
          </p>
        </div>

        {/* Precios + Botón */}
        <div className="pt-2.5 sm:pt-4 border-t border-[#E8E2D8]/50">
          <div className="flex justify-between items-center mb-2.5 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-extrabold text-[#0D1B35]/60 uppercase tracking-wider">Precio</span>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              {BUNDLE_ORIGINAL_PRICES[product.slug] && (
                <span className="text-[10px] sm:text-xs font-bold text-stone-400 line-through">
                  {formatPrice(BUNDLE_ORIGINAL_PRICES[product.slug], currency)}
                </span>
              )}
              <span className="text-base sm:text-xl font-black text-[#0D1B35]">{formatPrice(product.price, currency)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              className="relative z-10 px-2 py-2 sm:px-3 sm:py-3 rounded-full text-white font-bold text-[11px] sm:text-xs text-center shadow-[0_4px_16px_rgba(0,80,136,0.3)] transition-all duration-200 hover:-translate-y-0.5 bg-ocean hover:bg-ocean-dark active:scale-[0.97] cursor-pointer"
            >
              Comprar ahora
            </button>

            <div
              className="relative z-10 px-2 py-2 sm:px-3 sm:py-3 rounded-full font-bold text-[11px] sm:text-xs text-center border border-[#E7E1D6] text-[#0D1B35] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F0ECE1] active:scale-[0.97] flex items-center justify-center gap-1 cursor-pointer"
            >
              Ver detalles
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

function InspirationBannerCard({
  imgSrc,
  eyebrow,
  title,
  text,
  textPosition = "bottom",
}: {
  imgSrc: string;
  eyebrow: string;
  title: string;
  text: string;
  textPosition?: "top" | "bottom";
}) {
  const isTop = textPosition === "top";

  return (
    <div
      className={`relative rounded-[20px] sm:rounded-[28px] overflow-hidden min-h-[260px] sm:min-h-[420px] w-full flex flex-col p-4 sm:p-8 border border-[#E8E2D8]/60 shadow-[0_4px_24px_rgba(13,27,53,0.03)] h-full ${
        isTop ? "justify-start" : "justify-end"
      }`}
    >
      <Image
        src={imgSrc}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 350px"
        className="object-cover object-center"
      />
      <div
        className={`absolute inset-0 ${
          isTop
            ? "bg-gradient-to-b from-[#0D1B35]/90 via-[#0D1B35]/50 to-black/10"
            : "bg-gradient-to-t from-[#0D1B35]/90 via-[#0D1B35]/50 to-black/10"
        }`}
      />
      <div className="relative z-10 text-white">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#5BA8D5] bg-[#5BA8D5]/20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#5BA8D5]/30 inline-block mb-2 sm:mb-3">
          {eyebrow}
        </span>
        <h3 className="text-base sm:text-2xl font-black tracking-tight leading-tight text-white mb-1.5 sm:mb-2">
          {title}
        </h3>
        <p className="text-xs text-stone-200 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
          {text}
        </p>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

const BUNDLE_COMPONENT_SLUGS: Record<string, string[]> = {
  "pack-dia-noche": ["energy", "sleep"],
  "pack-calma-sueno": ["zen", "sleep"],
  "pack-glow-balance": ["glow", "woman"],
  "pack-trio-vitalidad": ["energy", "sleep", "zen"],
};

export default function TiendaExperience({
  products,
  currency = "MXN",
}: {
  products: Product[];
  currency?: string;
}) {
  const [reviewsSummary, setReviewsSummary] = useState<
    Record<string, { average: number; count: number }>
  >({});

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

          Object.entries(BUNDLE_COMPONENT_SLUGS).forEach(([bSlug, cSlugs]) => {
            if (!summary[bSlug] || summary[bSlug].count === 0) {
              const combinedRatings: number[] = [];
              cSlugs.forEach((c) => {
                if (groups[c]) combinedRatings.push(...groups[c]);
              });
              if (combinedRatings.length > 0) {
                summary[bSlug] = {
                  average: Number((combinedRatings.reduce((a, b) => a + b, 0) / combinedRatings.length).toFixed(1)),
                  count: combinedRatings.length,
                };
              }
            }
          });

          setReviewsSummary(summary);
        }
      } catch (e) {
        console.error("Error loading reviews summary for shop page:", e);
      }
    }
    loadReviews();
  }, []);

  const row1Products = products.slice(0, 3);
  const row2Products = products.slice(3, 6);
  const remainingProducts = products.slice(6);

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

      {/* ── Grid de productos (2 columnas en móvil) ── */}
      <section className="px-3 sm:px-4 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Fila 1: 3 productos + 1 Banner a la Derecha */}
          {row1Products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex"
            >
              <ProductCard
                product={product}
                ratingSummary={reviewsSummary[product.slug]}
                currency={currency}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            <InspirationBannerCard
              imgSrc="/productusers/Banner_tienda_1.webp"
              eyebrow="RITUAL NOCTURNO"
              title="DORMIR MEJOR EMPIEZA BAJANDO EL RITMO"
              text="Un gesto simple antes de acostarte para acompañar la transición al descanso y despertar renovado de verdad."
              textPosition="top"
            />
          </motion.div>

          {/* Fila 2: 1 Banner a la Izquierda + 3 productos */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            <InspirationBannerCard
              imgSrc="/productusers/Banner_tienda_2.webp"
              eyebrow="LO SIMPLE SE SOSTIENE"
              title="TU RITUAL DE CADA DÍA"
              text="Cuidarte no debería sentirse como una obligación más. Combina tus parches favoritos y suma un hábito simple que sí mantenés."
            />
          </motion.div>

          {row2Products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 4) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex"
            >
              <ProductCard
                product={product}
                ratingSummary={reviewsSummary[product.slug]}
                currency={currency}
              />
            </motion.div>
          ))}

          {/* Filas siguientes: Bundles y resto de productos */}
          {remainingProducts.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 7) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
