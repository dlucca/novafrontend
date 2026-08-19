"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Link } from "@/lib/i18n-navigation";
import type { Product } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { PRODUCT_META, BUNDLE_ORIGINAL_PRICES } from "@/lib/product-meta";
import { useCart } from "@/contexts/CartContext";

// ─── UI metadata por producto ───────────────────────────────────────────────

const META: Record<string, {
  color: string;
  bg: string;
  quote: string;
  ingredients: string;
}> = {
  energy: {
    color: "#83B5F4",
    bg: "#FAF8F5",
    quote: "Tu día no para. Tu energía tampoco.",
    ingredients: "Té Verde + Ginseng + L-Carnitina + Vit B",
  },
  sleep: {
    color: "#1EB1BC",
    bg: "#FAF8F5",
    quote: "Porque descansar también es cuidarse.",
    ingredients: "Triptófano + Bisglicinato de Magnesio + Glicina",
  },
  zen: {
    color: "#4E82BC",
    bg: "#FAF8F5",
    quote: "El equilibrio que no se ve, pero se siente.",
    ingredients: "Triptófano + Taurato de Magnesio + Taurina + Manzanilla",
  },
  shield: {
    color: "#FFA849",
    bg: "#FAF8F5",
    quote: "Tu rutina de cuidado empieza hoy.",
    ingredients: "Vitamina C + Zinc + Vitamina D3 + Vitamina E",
  },
  glow: {
    color: "#F25C54",
    bg: "#FAF8F5",
    quote: "La piel también refleja cómo te cuidas.",
    ingredients: "Colágeno Hidrolizado + Ácido Hialurónico + Biotina",
  },
  woman: {
    color: "#C693C4",
    bg: "#FAF8F5",
    quote: "Escucharte también es una forma de cuidarte.",
    ingredients: "Extracto de Soya + Magnesio + Hierro + Vit B6",
  },
  "pack-dia-noche": {
    color: "#83B5F4",
    bg: "#FAF8F5",
    quote: "Energía para tu día. Descanso para tu noche.",
    ingredients: "Dúo completo 24h · 15% OFF",
  },
  "pack-calma-sueno": {
    color: "#3A6FA8",
    bg: "#FAF8F5",
    quote: "Desconecta la mente de día, descansa profundo de noche.",
    ingredients: "Dúo calma & descanso · 15% OFF",
  },
  "pack-glow-balance": {
    color: "#8A3EBE",
    bg: "#FAF8F5",
    quote: "Piel radiante y equilibrio biológico a tu ritmo.",
    ingredients: "Dúo belleza & equilibrio · 15% OFF",
  },
  "pack-trio-vitalidad": {
    color: "#138A75",
    bg: "#FAF8F5",
    quote: "Energía matutina, calma diurna y descanso nocturno.",
    ingredients: "Trío vitalidad 360° · 20% OFF",
  },
};

function StarIcon({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" fill="#0F0F0F" width={size} height={size} className="shrink-0 inline-block">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// ─── Rhode Skin Style Product Card ──────────────────────────────────────────

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
  const [added, setAdded] = useState(false);

  if (!meta) return null;

  const fallbackMeta = PRODUCT_META[product.slug];
  const isBundle = product.slug.startsWith("pack-");
  const hoverImage = !isBundle ? fallbackMeta?.hoverImgSrc : undefined;
  const ingredientsList = meta.ingredients ?? fallbackMeta?.ingredients ?? "";

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
      bg: "#FAF8F5",
      mode: "once",
      freq: 30,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#E6E1D8] shadow-2xs hover:border-[#AEAEAF] hover:shadow-md transition-all duration-300 h-full">
      {/* ── Image Container Stage (Aspect ratio 4/5) ── */}
      <Link
        href={`/tienda/${product.slug}`}
        className="relative aspect-[4/5] w-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-0"
      >
        {/* Base Image */}
        <Image
          src={fallbackMeta?.imgSrc ?? product.image}
          alt={`Novapatch ${product.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className={`object-cover w-full h-full transition-all duration-500 ease-in-out ${
            hoverImage ? "group-hover:opacity-0 group-hover:scale-95" : "group-hover:scale-105"
          }`}
        />

        {/* Hover Image (Full bleed reveal on hover) */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`Detalles de Novapatch ${product.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
          />
        )}

        {/* Direct Link Overlay */}
        <span className="sr-only">Ver {product.title}</span>
      </Link>

      {/* ── Card Footer Area (Default Info vs Hover Actions) ── */}
      <div className="p-3.5 sm:p-5 border-t border-[#E6E1D8] bg-white relative min-h-[140px] flex flex-col justify-between overflow-hidden text-left">
        
        {/* DEFAULT VIEW: Visible when NOT hovered, smoothly fades out & slides slightly up on hover */}
        <div className="flex flex-col justify-between h-full transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-2 group-hover:pointer-events-none">
          <div>
            {/* Rating Stars + Count */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex gap-0.5 items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={11} />
                ))}
              </div>
              <span className="text-[11px] font-mono font-medium text-[#3A3A37]">
                {rating} ({count})
              </span>
            </div>

            {/* Title + Color Accent Dot + Price */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1.5">
              <h3 className="text-sm sm:text-base font-sans font-semibold tracking-tight text-[#0F0F0F] flex items-center leading-snug min-w-0">
                <span
                  className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mr-1.5 sm:mr-2 shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="truncate sm:whitespace-normal">{product.title}</span>
              </h3>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                {BUNDLE_ORIGINAL_PRICES[product.slug] && (
                  <span className="text-[11px] sm:text-xs font-mono font-medium text-stone-400 line-through">
                    {formatPrice(BUNDLE_ORIGINAL_PRICES[product.slug], currency)}
                  </span>
                )}
                <span className="text-sm sm:text-base font-mono font-bold text-[#0F0F0F]">
                  {formatPrice(product.price, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Key Ingredients */}
          <p className="text-xs font-sans text-[#3A3A37] font-normal leading-relaxed line-clamp-1 mt-1">
            {ingredientsList}
          </p>

          {/* Mobile CTA Button */}
          <div className="mt-2.5 sm:hidden">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-3 rounded-full bg-white text-[#0F0F0F] border border-[#0F0F0F] font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-center active:scale-95 active:bg-[#0F0F0F] active:text-white transition-all shadow-2xs cursor-pointer"
            >
              {added ? "¡Añadido!" : "Comprar ahora"}
            </button>
          </div>
        </div>

        {/* HOVER VIEW: Fades in & slides up smoothly from the bottom on hover */}
        <div className="absolute inset-0 p-5 bg-white flex items-center justify-center transition-all duration-300 ease-out opacity-0 translate-y-6 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 px-3 rounded-full text-white font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-center bg-[#0F0F0F] border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              Comprar ahora
            </button>

            <Link
              href={`/tienda/${product.slug}`}
              className="w-full py-3 px-3 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-center bg-white text-[#0F0F0F] border border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            >
              Ver detalles
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Inspiration Banner Card Component ───────────────────────────────────────

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Rhode Skin Scroll Effect matching Home banners (WomanBanner & HeroSection)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden min-h-[360px] sm:min-h-[420px] w-full flex flex-col p-4 sm:p-8 border border-[#E6E1D8] shadow-2xs hover:border-[#AEAEAF] hover:shadow-md transition-all duration-300 h-full text-left ${
        isTop ? "justify-start" : "justify-end"
      }`}
    >
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div
        className={`absolute inset-0 z-[1] ${
          isTop
            ? "bg-gradient-to-b from-[#0F0F0F]/90 via-[#0F0F0F]/50 to-transparent"
            : "bg-gradient-to-t from-[#0F0F0F]/90 via-[#0F0F0F]/50 to-transparent"
        }`}
      />
      <div className="relative z-10 text-white">
        <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#0F0F0F] bg-white/90 px-3 py-1 rounded-full border border-white/40 inline-block mb-3 backdrop-blur-xs">
          {eyebrow}
        </span>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold tracking-[-0.03em] leading-tight text-white mb-2 lowercase">
          {title}
        </h3>
        <p className="text-xs sm:text-sm font-sans font-normal text-stone-200 leading-relaxed line-clamp-3 sm:line-clamp-none">
          {text}
        </p>
      </div>
    </div>
  );
}

// ─── Componente Principal TiendaExperience ───────────────────────────────────

const BUNDLE_COMPONENT_SLUGS: Record<string, string[]> = {
  "pack-dia-noche": ["energy", "sleep"],
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
  const heroRef = useRef<HTMLDivElement>(null);

  // Rhode Skin Scroll Effect on Hero Banner Image matching WomanBanner
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroImageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

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

  const row1Products = products.slice(0, 2);
  const row2Products = products.slice(2, 4);
  const remainingProducts = products.slice(4);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* ── Tienda Hero Stage (Medio Alto, Rhode Skin Scroll Effect) ── */}
      <section className="pt-24 pb-8 px-4 sm:px-8 max-w-[1400px] mx-auto">
        <div
          ref={heroRef}
          className="relative w-full min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0F0F0F] shadow-[0_8px_30px_rgba(15,15,15,0.05)] border border-[#E6E1D8] flex flex-col justify-end p-6 sm:p-10 lg:p-12 text-left"
        >
          {/* Background Image with Scroll-Driven Scale */}
          <motion.div style={{ scale: heroImageScale }} className="absolute inset-0">
            <Image
              src="/productusers/banner_shop.webp"
              alt="Novapatch Tienda"
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Gradient Overlay for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-[1]" />

          {/* Hero Content Over Image */}
          <div className="relative z-10 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-semibold text-white tracking-[-0.035em] leading-tight lowercase text-3xl sm:text-4xl lg:text-5xl mb-3"
            >
              elige el parche que necesita tu cuerpo.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans font-normal text-sm sm:text-base text-white/90 max-w-lg leading-relaxed"
            >
              Seis fórmulas. Un solo formato: pega, olvida y deja que trabaje.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Grid de Productos de 3 Columnas con Banners Intercalados ── */}
      <section className="px-4 sm:px-10 pb-24 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          
          {/* Fila 1: 2 productos + 1 Banner a la Derecha */}
          {row1Products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
            >
              <ProductCard
                product={product}
                ratingSummary={reviewsSummary[product.slug]}
                currency={currency}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-1 flex flex-col h-full"
          >
            <InspirationBannerCard
              imgSrc="/productusers/Banner_tienda_1.webp"
              eyebrow="NOVAPATCH GLOW"
              title="NUTRICIÓN QUE SE NOTA EN TU PIEL."
              text="Biotina, colágeno y antioxidantes esenciales liberados de forma continua para acompañar tu piel en su mejor versión cada día."
              textPosition="bottom"
            />
          </motion.div>

          {/* Fila 2: 1 Banner a la Izquierda + 2 productos */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-1 flex flex-col h-full"
          >
            <InspirationBannerCard
              imgSrc="/productusers/Banner_tienda_2.webp"
              eyebrow="NOVAPATCH ENERGY"
              title="ENERGÍA CONSTANTE SIN BAJONES."
              text="Té verde, ginseng y vitaminas esenciales liberados de forma gradual. Cero azúcar, cero picos y toda la vitalidad que necesitás."
              textPosition="bottom"
            />
          </motion.div>

          {row2Products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 2) * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
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
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 4) * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
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
