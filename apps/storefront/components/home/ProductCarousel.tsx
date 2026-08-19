"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Link } from "@/lib/i18n-navigation";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/commerce";

export type ProductMeta = {
  type: "product";
  slug: string;
  name: string;
  desc: string;
  ingredients: string;
  color: string;
  image: string;
  hoverImgSrc: string;
  price: number;
};

export type BannerMeta = {
  type: "banner";
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
  image: string;
};

export type CarouselItem = ProductMeta | BannerMeta;

const DEFAULT_ITEMS: CarouselItem[] = [
  // 1 & 2: Energy + Sleep
  {
    type: "product",
    slug: "energy",
    name: "Energy",
    desc: "Enfoque & Vitalidad",
    ingredients: "Té Verde + Ginseng + L-Carnitina + Vit B",
    color: "#83B5F4",
    image: "/products/Energy_45.webp",
    hoverImgSrc: "/products/Energy_1.webp",
    price: 750,
  },
  {
    type: "product",
    slug: "sleep",
    name: "Sleep",
    desc: "Descanso Profundo",
    ingredients: "Triptófano + Bisglicinato de Magnesio + Glicina",
    color: "#1EB1BC",
    image: "/products/Sleep_45.webp",
    hoverImgSrc: "/products/Sleep_1.webp",
    price: 750,
  },
  // 3: Editorial Banner 1 ("crea tu propio ritual.")
  {
    type: "banner",
    id: "banner-ritual",
    title: "crea tu propio ritual.",
    subtitle: "Descubre los kits y parches que mejor se adaptan a tu día a día.",
    ctaText: "ir a tienda",
    href: "/tienda",
    image: "/productusers/Banner_product_carrusel_1.webp",
  },
  // 4 & 5: Zen + Shield
  {
    type: "product",
    slug: "zen",
    name: "Zen",
    desc: "Calma Funcional",
    ingredients: "Triptófano + Taurato de Magnesio + Taurina + Manzanilla",
    color: "#4E82BC",
    image: "/products/Zen_45.webp",
    hoverImgSrc: "/products/Zen_1.webp",
    price: 750,
  },
  {
    type: "product",
    slug: "shield",
    name: "Shield",
    desc: "Defensas & Inmunidad",
    ingredients: "Vitamina C + Zinc + Vitamina D3 + Vitamina E",
    color: "#FFA849",
    image: "/products/Shield_45.webp",
    hoverImgSrc: "/products/Shield_1.webp",
    price: 750,
  },
  // 6: Editorial Banner 2 ("bienestar en automático.")
  {
    type: "banner",
    id: "banner-auto",
    title: "bienestar en automático.",
    subtitle: "Recibe tu dosis mensual sin preocupaciones. Pausa o cancela con un solo clic.",
    ctaText: "conocer suscripciones",
    href: "/suscripciones",
    image: "/productusers/Banner_product_carrusel_2.webp",
  },
  // 7 & 8: Glow + Woman
  {
    type: "product",
    slug: "glow",
    name: "Glow",
    desc: "Luminosidad & Piel",
    ingredients: "Colágeno Hidrolizado + Ácido Hialurónico + Biotina",
    color: "#F25C54",
    image: "/products/Glow_45.webp",
    hoverImgSrc: "/products/Glow_1.webp",
    price: 750,
  },
  {
    type: "product",
    slug: "woman",
    name: "Woman",
    desc: "Equilibrio Femenino",
    ingredients: "Extracto de Soya + Magnesio + Hierro + Vit B6",
    color: "#C693C4",
    image: "/products/Woman_45.webp",
    hoverImgSrc: "/products/Woman_1.webp",
    price: 750,
  },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="#0F0F0F" width="12" height="12">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function CleanProductCard({ item, locale, currency }: { item: ProductMeta; locale: string; currency: string }) {
  const [reviewsCount, setReviewsCount] = useState<number>(36);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?slug=${item.slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setReviewsCount(data.length);
        }
      } catch {
        // Fallback quiet handle
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [item.slug]);

  return (
    <div className="flex flex-col bg-white border border-[#E6E1D8] rounded-xl overflow-hidden h-full group hover:border-[#0F0F0F]/30 transition-colors duration-300">
      <div className="relative aspect-[4/5] w-full bg-[#FAF8F5] p-0 overflow-hidden flex items-center justify-center rounded-t-xl">
        <Link
          href={`/tienda/${item.slug}`}
          aria-label={`Ver ${item.name}`}
          className="absolute inset-0 z-10"
        />

        <div className="relative w-full h-full transition-opacity duration-300 group-hover:opacity-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 85vw, 30vw"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center p-0">
          <Image
            src={item.hoverImgSrc}
            alt={`${item.name} en uso`}
            fill
            sizes="(max-width: 768px) 85vw, 30vw"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="p-4 sm:p-5 border-t border-[#E6E1D8] bg-white flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <span className="text-[11px] font-sans font-medium text-[#3A3A37]">
              5.0 ({reviewsCount})
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-sans font-semibold text-[#0F0F0F] tracking-tight flex items-center">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <Link href={`/tienda/${item.slug}`} className="hover:opacity-75 transition-opacity">
                {item.name}
              </Link>
            </h3>
            <span className="text-sm font-sans font-medium text-[#0F0F0F]">
              {formatPrice(item.price, currency)}
            </span>
          </div>
        </div>

        <p className="text-xs font-sans text-[#A8A29A] font-normal leading-normal mt-1">
          {item.ingredients}
        </p>
      </div>
    </div>
  );
}

function EditorialBannerCard({ item, locale }: { item: BannerMeta; locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-end h-full rounded-xl overflow-hidden min-h-[360px] sm:min-h-[420px] border border-[#E6E1D8] shadow-2xs"
    >
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 85vw, 30vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/90 via-[#0F0F0F]/45 to-transparent z-[1]" />

      <div className="relative z-[2] flex flex-col justify-end h-full p-6 sm:p-8 text-white">
        <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white leading-tight mb-2 lowercase">
          {item.title}
        </h3>
        <p className="text-stone-300 text-xs font-sans mb-6 font-normal leading-relaxed">
          {item.subtitle}
        </p>
        <Link
          href={item.href}
          className="w-full py-3 px-5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-center bg-[#FAF8F5] text-[#0F0F0F] hover:bg-white transition-all shadow-xs"
        >
          {item.ctaText}
        </Link>
      </div>
    </div>
  );
}

export default function ProductCarousel({
  products: catalog,
  currency = "MXN",
}: {
  products?: Product[];
  basePrice?: number;
  currency?: string;
}) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Dynamically resolve prices from Medusa catalog when available
  const carouselItems = DEFAULT_ITEMS.map((item) => {
    if (item.type === "product") {
      const nameCap = item.slug.charAt(0).toUpperCase() + item.slug.slice(1);
      const realProduct = catalog?.find((p) => p.slug === item.slug);
      return {
        ...item,
        image: `/products/${nameCap}_45.webp`,
        hoverImgSrc: `/products/${nameCap}_1.webp`,
        price: realProduct?.price ?? item.price,
      };
    }
    return item;
  });

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability, { passive: true });

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E6E1D8]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        {/* Carousel Wrapper with Mid-Height Floating Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={scrollLeft}
                aria-label="Anterior"
                className="absolute -left-3 sm:-left-5 top-[45%] -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-[#E6E1D8] bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right Arrow Button */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={scrollRight}
                aria-label="Siguiente"
                className="absolute -right-3 sm:-right-5 top-[45%] -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-[#E6E1D8] bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronRight size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 pt-2 -mx-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {carouselItems.map((item) => (
              <div
                key={item.type === "product" ? item.slug : item.id}
                className="snap-start flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                {item.type === "product" ? (
                  <CleanProductCard item={item} locale={locale} currency={currency} />
                ) : (
                  <EditorialBannerCard item={item} locale={locale} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
