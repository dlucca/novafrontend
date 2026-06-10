"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";

const SUB_DISCOUNT = 0.2;

const products = [
  {
    name: "Energy",
    slug: "energy",
    tagline: "Energía celular sostenida",
    taglineColor: "#1A5C9A",
    ingredients: ["Vitamina C", "L-Carnitina", "Extracto de Té Verde", "Extracto de Ginseng", "Vitamina B2", "Ácido Fólico", "Vitamina E"],
    tags: ["Energía sostenida", "Sin picos ni caídas"],
    color: "#2B7CC1",
    bg: "#EBF4FB",
    popular: false,
    imgSrc: "/products/Energy_thumb.webp",
  },
  {
    name: "Sleep",
    slug: "sleep",
    tagline: "Sueño profundo y reparador",
    taglineColor: "#0F6B5C",
    ingredients: ["Triptófano", "Magnesio", "Inositol", "Vitamina B6", "Glicina"],
    tags: ["Descanso nocturno", "Sin somníferos"],
    color: "#138A75",
    bg: "#EBF7F5",
    popular: false,
    imgSrc: "/products/Sleep_thumb.webp",
  },
  {
    name: "Glow",
    slug: "glow",
    tagline: "Belleza y juventud para una piel visiblemente renovada",
    taglineColor: "#B83525",
    ingredients: ["Vitamina C", "Ácido Hialurónico", "Colágeno Hidrolizado", "Biotina", "Vitamina B3", "Extracto de Centella Asiática", "Vitamina E"],
    tags: ["Bienestar desde adentro", "Constancia"],
    color: "#C94030",
    bg: "#FAF0EE",
    popular: true,
    imgSrc: "/products/Glow_thumb.webp",
  },
  {
    name: "Shield",
    slug: "shield",
    tagline: "Fortaleza inmune natural",
    taglineColor: "#8C6000",
    ingredients: ["Vitamina C", "Zinc", "Vitamina D3", "Vitamina E", "Niacinamida"],
    tags: ["Cuidado preventivo", "Uso diario"],
    color: "#A07000",
    bg: "#FAF6E9",
    popular: false,
    imgSrc: "/products/Shield_thumb.webp",
  },
  {
    name: "Zen",
    slug: "zen",
    tagline: "Calma mental diaria",
    taglineColor: "#2A5490",
    ingredients: ["Triptófano", "Magnesio", "Taurina", "Extracto de Manzanilla", "Vitamina B6"],
    tags: ["Calma funcional", "Días intensos"],
    color: "#3A6FA8",
    bg: "#EBF0F9",
    popular: false,
    imgSrc: "/products/Zen_thumb.webp",
  },
  {
    name: "Woman",
    slug: "woman",
    tagline: "Bienestar hormonal femenino",
    taglineColor: "#6B3080",
    ingredients: ["Extracto de Soya", "Vitamina B6", "Magnesio", "Ácido Fólico", "Hierro"],
    tags: ["Bienestar femenino", "Ritmos naturales"],
    color: "#8A3EBE",
    bg: "#F3EBF9",
    popular: false,
    imgSrc: "/products/Woman_thumb.webp",
  },
];

/* ── Hero card — featured product (Glow) ──────────────────────────────── */

function HeroProductCard({
  product,
  onAdd,
  basePrice,
  currency,
}: {
  product: (typeof products)[0];
  onAdd: () => void;
  basePrice: number;
  currency: string;
}) {
  const subPrice = Math.round(basePrice * (1 - SUB_DISCOUNT));
  const p = product;
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="group relative grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[28px] overflow-hidden border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        style={{ background: p.bg }}
      >
        {/* Image */}
        <div className="relative flex items-center justify-center py-12 px-8 md:py-16 md:px-12">
          <Link href={`/${locale}/tienda/${p.slug}`} className="relative block w-[clamp(180px,22vw,288px)] h-[clamp(180px,22vw,288px)]">
            <Image
              src={p.imgSrc}
              alt={`NovaPatch ${p.name}`}
              fill
              sizes="(max-width: 640px) 180px, (max-width: 1280px) 22vw, 288px"
              className="object-contain group-hover:scale-[1.04] transition-transform duration-500"
            />
          </Link>
          <span
            className="absolute top-5 left-5 text-white text-[11px] font-extrabold uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-full"
            style={{ background: p.color }}
          >
            Más popular
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-16 bg-white">
          <p
            className="text-[28px] md:text-[36px] font-black tracking-[-0.02em] leading-tight"
            style={{ color: p.taglineColor }}
          >
            <Link href={`/${locale}/tienda/${p.slug}`}>{p.name}</Link>
          </p>
          <p
            className="text-[15px] font-semibold leading-[1.5] mt-1 opacity-80"
            style={{ color: p.taglineColor }}
          >
            {p.tagline}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400 mt-3">
            Pack de 30 parches
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {p.ingredients.map((ing) => (
              <li key={ing} className="text-[13px] text-gray-600 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full flex-shrink-0 inline-block" style={{ background: p.color }} />
                {ing}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 mt-5">
            {p.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold px-3 py-1 rounded-full border-[1.5px]"
                style={{ borderColor: p.color, color: p.color }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span
              className="text-[28px] font-black"
              style={{ color: p.taglineColor }}
            >
              {formatPrice(basePrice, currency)}
            </span>
            <span className="text-[13px] text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-lg">
              Desde {formatPrice(subPrice, currency)} con suscripción
            </span>
          </div>

          <button
            onClick={onAdd}
            className="mt-5 w-full md:w-auto md:px-10 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200 active:scale-[0.97] hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: p.color }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Standard product card ────────────────────────────────────────────── */

function ProductCard({
  product,
  index,
  onAdd,
  basePrice,
  currency,
}: {
  product: (typeof products)[0];
  index: number;
  onAdd: () => void;
  basePrice: number;
  currency: string;
}) {
  const subPrice = Math.round(basePrice * (1 - SUB_DISCOUNT));
  const p = product;
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <div className="group flex flex-col bg-white rounded-[20px] overflow-hidden border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-[5px] transition-all duration-300 h-full">
        {/* Image area */}
        <div
          className="relative flex items-center justify-center"
          style={{ background: p.bg, padding: "36px 24px" }}
        >
          <Link href={`/${locale}/tienda/${p.slug}`} className="relative block w-36 h-36">
            <Image
              src={p.imgSrc}
              alt={`NovaPatch ${p.name}`}
              fill
              sizes="144px"
              loading="lazy"
              className="object-contain group-hover:scale-[1.06] transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-2 flex-1">
          <div>
            <p
              className="text-[20px] font-black tracking-[-0.01em]"
              style={{ color: p.taglineColor }}
            >
              <Link href={`/${locale}/tienda/${p.slug}`}>{p.name}</Link>
            </p>
            <p
              className="text-[13px] font-semibold leading-[1.45] mt-0.5 opacity-75"
              style={{ color: p.taglineColor }}
            >
              {p.tagline}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1">
              Pack de 30 parches
            </p>
            <p className="text-[12px] text-gray-500 leading-[1.5]">
              {p.ingredients.join(" · ")}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold px-3 py-1 rounded-full border-[1.5px]"
                style={{ borderColor: p.color, color: p.color }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-auto pt-3 flex items-baseline gap-2">
            <span
              className="text-[22px] font-black"
              style={{ color: p.taglineColor }}
            >
              {formatPrice(basePrice, currency)}
            </span>
          </div>
          <p className="text-[11px] text-green-600 font-semibold -mt-1">
            Desde {formatPrice(subPrice, currency)}/caja con suscripción
          </p>

          <button
            onClick={onAdd}
            className="product-card-btn mt-2 w-full py-3 rounded-xl border-2 text-[14px] font-bold transition-all duration-200 active:scale-[0.97]"
            style={
              {
                "--btn-accent": p.color,
                borderColor: p.color,
              } as React.CSSProperties
            }
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main grid ────────────────────────────────────────────────────────── */

export default function ProductGrid({ basePrice = 750, currency = "MXN" }: { basePrice?: number; currency?: string }) {
  const { addToCart } = useCart();

  const heroProduct = products.find((p) => p.popular)!;
  const rest = products.filter((p) => !p.popular);

  const handleAdd = (p: (typeof products)[0]) => {
    addToCart({
      slug: p.slug,
      title: p.name,
      image: p.imgSrc,
      price: basePrice,
      color: p.color,
      bg: p.bg,
      mode: "once",
      freq: 30,
    });
  };

  return (
    <section id="productos" className="bg-gray-50 px-5 sm:px-8 md:px-12 pt-20 pb-16">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className="font-black text-ocean tracking-[-0.02em] mb-3"
            style={{ fontSize: "clamp(26px,3vw,38px)" }}
          >
            Elige el parche que tu cuerpo necesita
          </h2>
          <p className="text-[16px] text-gray-500 max-w-[480px] mx-auto leading-[1.6]">
            Seis fórmulas, seis objetivos. Un solo formato: pega, olvida y deja que trabaje.
          </p>
        </motion.div>

        {/* Featured product — Glow */}
        <HeroProductCard
          product={heroProduct}
          onAdd={() => handleAdd(heroProduct)}
          basePrice={basePrice}
          currency={currency}
        />

        {/* Remaining products */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {rest.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              index={i}
              onAdd={() => handleAdd(p)}
              basePrice={basePrice}
              currency={currency}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
