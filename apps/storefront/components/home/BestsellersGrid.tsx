"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/commerce";

const BESTSELLERS_META = [
  {
    slug: "sleep",
    name: "Sleep",
    desc: "Dormir mejor empieza bajando el ritmo.",
    color: "#1EB1BC",
    bg: "#EBF7F5",
    imgSrc: "/products/Sleep_thumb.webp",
    hoverImgSrc: "/products/Sleep_2.webp",
  },
  {
    name: "Energy",
    slug: "energy",
    desc: "No te acelera. Te acompaña.",
    color: "#83B5F4",
    bg: "#EBF4FB",
    imgSrc: "/products/Energy_thumb.webp",
    hoverImgSrc: "/products/Energy_2.webp",
  },
  {
    name: "Zen",
    slug: "zen",
    desc: "Calma para seguir, no para frenar.",
    color: "#4E82BC",
    bg: "#EBF0F9",
    imgSrc: "/products/Zen_thumb.webp",
    hoverImgSrc: "/products/Zen_2.webp",
  },
];

type CardProduct = (typeof BESTSELLERS_META)[number] & {
  image: string;
  price: number;
  variantId?: string;
};

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-[#005088]">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

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
  const [reviewsData, setReviewsData] = useState<{ rating: number; count: number }>({
    rating: 5.0,
    count: 0,
  });

  // Fetch real reviews data dynamically matching PDP values
  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?slug=${p.slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          const count = data.length;
          const avg = count
            ? Number((data.reduce((sum: number, r: any) => sum + r.rating, 0) / count).toFixed(1))
            : 5.0;
          setReviewsData({ rating: avg, count });
        }
      } catch {
        // Silent fallback for unhandled network errors or dev server reloads
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [p.slug]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col h-full bg-white"
    >
      {/* Contenedor de la imagen sin márgenes/padding (p-0) y con transición al hacer hover solo en la imagen */}
      <div className="relative aspect-square w-full rounded-2xl bg-[#F9F9F9] overflow-hidden border border-black/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-5 group/img">
        {/* Link principal a la PDP que cubre toda el área de la imagen */}
        <Link
          href={`/${locale}/tienda/${p.slug}`}
          aria-label={`Ver ${p.name}`}
          className="absolute inset-0 z-[3]"
        />

        {/* Imagen por defecto (se desvanece al hacer hover exclusivamente sobre la imagen) */}
        <div className="absolute inset-0 z-[1] transition-opacity duration-300 group-hover/img:opacity-0 flex items-center justify-center p-6">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-w-768px) 100vw, 33vw"
            className="object-contain transition-transform duration-500 group-hover/img:scale-105"
          />
        </div>

        {/* Imagen al hacer hover (se muestra al hacer hover exclusivamente sobre la imagen) */}
        <div className="absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover/img:opacity-100 flex items-center justify-center">
          <Image
            src={p.hoverImgSrc}
            alt={`${p.name} detalle`}
            fill
            sizes="(max-w-768px) 100vw, 33vw"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Info del producto */}
      <div className="flex flex-col flex-1 px-1">
        {/* Nombre / Título */}
        <h3 className="text-xl font-bold text-[#0D1B35] leading-tight mb-1">
          <Link href={`/${locale}/tienda/${p.slug}`} className="hover:text-[#1a4b8c] transition-colors relative z-[4]">
            {p.name}
          </Link>
        </h3>

        {/* Claim / Subtítulo */}
        <p className="home-body mb-2">
          {p.desc}
        </p>

        {/* Estrellas y Reviews reales */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <span className="home-caption mt-0.5">
            {reviewsData.rating} ({reviewsData.count} {reviewsData.count === 1 ? "opinión" : "opiniones"})
          </span>
        </div>

        {/* Precio */}
        <p className="text-base font-extrabold text-[#0D1B35] mb-5">
          {formatPrice(p.price, currency)}
        </p>

        {/* Botón de Agregar (Con el mismo comportamiento y estilo de ProductGrid: bg-ocean) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAdd();
          }}
          className="relative z-[4] w-full inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(0,80,136,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ocean-dark active:scale-[0.97] cursor-pointer mt-auto"
        >
          Agregar al carrito
        </button>
      </div>
    </motion.div>
  );
}

export default function BestsellersGrid({
  products: catalog,
  basePrice = 750,
  currency = "MXN",
}: {
  products?: Product[];
  basePrice?: number;
  currency?: string;
}) {
  const { addToCart } = useCart();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";

  // Mapeamos los 3 productos destacados
  const cards: CardProduct[] = BESTSELLERS_META.map((ui) => {
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
        <div className="mb-14">
          <p className="home-section-eyebrow">
            Cómo Empezar
          </p>
          <h2 className="home-section-title text-ocean">
            Nuestros Parches Más Vendidos
          </h2>

        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {cards.map((p, idx) => (
            <ProductCard
              key={p.slug}
              product={p}
              index={idx}
              onAdd={() => handleAdd(p)}
              currency={currency}
            />
          ))}

          {/* Columna 4: Arma tu Ritual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 3 * 0.05,
              duration: 0.5,
            }}
            className="relative flex flex-col justify-end h-full rounded-2xl overflow-hidden min-h-[420px] md:min-h-0 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)] group"
          >
            {/* Imagen de fondo */}
            <Image
              src="/productusers/build_your_ritual_banner.webp"
              alt="Selecciona tu propio ritual"
              fill
              sizes="(max-w-768px) 100vw, 25vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            {/* Degradado oscuro para asegurar legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B35]/95 via-[#0D1B35]/40 to-transparent z-[1]" />

            {/* Contenido sobrepuesto */}
            <div className="relative z-[2] flex flex-col justify-end h-full p-6 md:p-8 flex-1 mt-40">
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight mb-2 uppercase">
                Selecciona tu propio ritual
              </h3>
              <p className="text-stone-200 text-sm leading-relaxed mb-6 font-medium">
                Descubre los kits y parches que mejor se adaptan a tu día a día.
              </p>
              <Link
                href={`/${locale}/tienda`}
                className="w-full py-3.5 px-6 rounded-full text-xs font-extrabold uppercase text-center bg-white text-[#0D1B35] hover:bg-stone-50 active:scale-[0.98] transition-all tracking-wider shadow-md"
              >
                Explorar Rituales
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
