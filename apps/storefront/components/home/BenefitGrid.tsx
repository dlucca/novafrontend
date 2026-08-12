"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/commerce";

const SUB_DISCOUNT = 0.2;

const PRODUCT_UI = [
  {
    name: "Energy",
    slug: "energy",
    benefit: "⚡ Foco & Energía Sostenida",
    tagline: "Rendimiento limpio sin el temblor ni bajón del café.",
    ingredients: ["Vitamina C", "L-Carnitina", "Extracto de Té Verde", "Ginseng", "Vitamina B12"],
    color: "#2B7CC1",
    bg: "#EBF4FB",
    imgSrc: "/products/Energy_thumb.webp",
  },
  {
    name: "Sleep",
    slug: "sleep",
    benefit: "😴 Sueño Profundo & Descanso",
    tagline: "Baja las revoluciones de tu mente antes de acostarte.",
    ingredients: ["Triptófano", "Magnesio", "Inositol", "Glicina", "Manzanilla"],
    color: "#138A75",
    bg: "#EBF7F5",
    imgSrc: "/products/Sleep_thumb.webp",
  },
  {
    name: "Glow",
    slug: "glow",
    benefit: "✨ Luminosidad & Piel Renovada",
    tagline: "Nutrición transdérmica profunda para potenciar tu brillo.",
    ingredients: ["Vitamina C", "Ácido Hialurónico", "Colágeno Hidrolizado", "Biotina"],
    color: "#C94030",
    bg: "#FAF0EE",
    imgSrc: "/products/Glow_thumb.webp",
  },
  {
    name: "Shield",
    slug: "shield",
    benefit: "🛡️ Defensas & Fuerza Inmune",
    tagline: "Fortalece tu sistema inmune de forma natural y constante.",
    ingredients: ["Vitamina C", "Zinc", "Vitamina D3", "Echinácea"],
    color: "#A07000",
    bg: "#FAF6E9",
    imgSrc: "/products/Shield_thumb.webp",
  },
  {
    name: "Zen",
    slug: "zen",
    benefit: "🧘 Calma Mental & Enfoque",
    tagline: "Estabilidad emocional y claridad para seguir con tu rutina.",
    ingredients: ["Triptófano", "Magnesio", "Taurina", "Extracto de Valeriana"],
    color: "#3A6FA8",
    bg: "#EBF0F9",
    imgSrc: "/products/Zen_thumb.webp",
  },
  {
    name: "Woman",
    slug: "woman",
    benefit: "🌸 Equilibrio & Ritmos Femeninos",
    tagline: "Acompaña y suaviza las fases de tu ciclo de manera gentil.",
    ingredients: ["Extracto de Soya", "Vitamina B6", "Magnesio", "Hierro", "Ácido Fólico"],
    color: "#8A3EBE",
    bg: "#F3EBF9",
    imgSrc: "/products/Woman_thumb.webp",
  },
];

type CardProduct = (typeof PRODUCT_UI)[number] & {
  image: string;
  price: number;
  variantId?: string;
};

function ProductCard({
  product: p,
  index,
  onAdd,
  currency,
}: {
  product: CardProduct;
  index: number;
  onAdd: () => void;
  currency: string;
}) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  const subPrice = Math.round(p.price * (1 - SUB_DISCOUNT));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
      }}
    >
      <div
        style={{ backgroundColor: p.bg }}
        className="group relative flex flex-col rounded-3xl p-6 md:p-8 border border-[#FAF7F2] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_32px_rgba(13,27,53,0.05)] h-full"
      >
        {/* Enlace general a la PDP */}
        <Link
          href={`/${locale}/tienda/${p.slug}`}
          aria-label={`Ver ${p.name}`}
          className="absolute inset-0 z-[1]"
        />

        {/* Badge superior */}
        <div className="flex justify-between items-start mb-6">
          <span
            style={{ color: p.color, borderColor: `${p.color}40` }}
            className="text-[10px] font-extrabold uppercase tracking-[0.15em] border px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm"
          >
            {p.name}
          </span>
          <span className="text-[11px] text-stone-400 font-medium">
            30 parches
          </span>
        </div>

        {/* Imagen del parche */}
        <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="176px"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.08]"
          />
        </div>

        {/* Título de beneficio */}
        <h3 className="text-xl md:text-2xl font-extrabold text-[#0D1B35] leading-tight tracking-tight mb-2">
          {p.benefit}
        </h3>

        {/* Subtítulo descriptivo */}
        <p className="text-stone-500 text-[14px] leading-relaxed mb-6">
          {p.tagline}
        </p>

        {/* Ingredientes clave */}
        <div className="mt-auto pt-4 border-t border-stone-200/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
            INGREDIENTES CLAVE
          </span>
          <p className="text-stone-600 text-xs leading-relaxed">
            {p.ingredients.join(" · ")}
          </p>
        </div>

        {/* Precio e Interacción */}
        <div className="mt-6 pt-5 border-t border-stone-200/40 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#0D1B35]">
                {formatPrice(p.price, currency)}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block -mt-0.5">
              Desde {formatPrice(subPrice, currency)} / susc.
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAdd();
            }}
            style={{
              "--hover-color": p.color,
              borderColor: p.color,
              color: p.color,
            } as React.CSSProperties}
            className="relative z-[2] px-5 py-2.5 rounded-full border-2 text-xs font-extrabold tracking-wider uppercase transition-all duration-300 bg-white hover:bg-[var(--hover-color)] hover:text-white hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Agregar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BenefitGrid({
  products: catalog,
  basePrice = 750,
  currency = "MXN",
}: {
  products?: Product[];
  basePrice?: number;
  currency?: string;
}) {
  const { addToCart } = useCart();

  const cards: CardProduct[] = PRODUCT_UI.map((ui) => {
    const fromCatalog = catalog?.find((c) => c.slug === ui.slug);
    return {
      ...ui,
      image: fromCatalog?.image ?? ui.imgSrc,
      price: fromCatalog?.price ?? basePrice,
      variantId: fromCatalog?.variantId,
    };
  });

  const handleAdd = (p: CardProduct) => {
    addToCart({
      slug: p.slug,
      title: p.name,
      image: p.image,
      price: p.price,
      color: p.color,
      bg: p.bg,
      mode: "once",
      freq: 30,
      variantId: p.variantId,
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.15em] text-[#1a4b8c] uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
            ELIGE TU SOLUCIÓN
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0D1B35] mt-4 tracking-tight">
            Nuestros Parches
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto mt-3 text-base md:text-lg">
            Soporte transdérmico limpio, diseñado para absorber ingredientes naturales directamente a través de la piel.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((p, idx) => (
            <ProductCard
              key={p.slug}
              product={p}
              index={idx}
              onAdd={() => handleAdd(p)}
              currency={currency}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
