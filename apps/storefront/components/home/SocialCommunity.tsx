"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageItem = {
  type: "image";
  imageUrl: string;
  name: string;
  productName: string;
  productColor: string;
};

type CardItem = {
  type: "card";
  rating: number;
  text: string;
  name: string;
  productSlug: string;
  productName: string;
  productColor: string;
};

type CommunityItem = ImageItem | CardItem;

const COMMUNITY_ITEMS: CommunityItem[] = [
  {
    type: "image",
    imageUrl: "/socialproof/Social_1.webp",
    name: "Renata C.",
    productName: "Woman",
    productColor: "#C693C4",
  },
  {
    type: "card",
    rating: 5,
    text: "Esto es lo más padre que he probado. Odio tomar tabletas, pero ya voy a mitad de mis 30 y quiero cuidar mi salud, así que esto me quedó perfecto: viene en forma de un parche chiquito, como una calcomanía, y tiene un montón de vitaminas.",
    name: "María Paula B.",
    productSlug: "glow",
    productName: "Glow",
    productColor: "#F25C54",
  },
  {
    type: "image",
    imageUrl: "/socialproof/Social_2.webp",
    name: "Debanhi G.",
    productName: "Energy",
    productColor: "#83B5F4",
  },
  {
    type: "card",
    rating: 5,
    text: "Estoy genuinamente sorprendida. Como alguien que siempre anda buscando soluciones de bienestar prácticas para el día a día, este producto se volvió parte de mi rutina sin esfuerzo. Lo práctico de estos parches lo cambia todo.",
    name: "Carla V.",
    productSlug: "energy",
    productName: "Energy",
    productColor: "#83B5F4",
  },
  {
    type: "image",
    imageUrl: "/socialproof/Social_3.webp",
    name: "Gilda C.",
    productName: "Glow",
    productColor: "#F25C54",
  },
  {
    type: "card",
    rating: 5,
    text: "Es un concepto buenísimo y por fin siento que puedo construir una rutina diaria de vitaminas con esto. Ya había probado de todo, desde pastilleros hasta ponerme un recordatorio diario, y aun así nunca lograba tomarlas todos los días de forma constante.",
    name: "Alondra A.",
    productSlug: "zen",
    productName: "Zen",
    productColor: "#4E82BC",
  },
  {
    type: "image",
    imageUrl: "/socialproof/Social_4.webp",
    name: "Galia P.",
    productName: "Shield",
    productColor: "#FFA849",
  },
  {
    type: "card",
    rating: 5,
    text: "Regalo de Novapatch para mi review honesta. El adhesivo es lo bastante fuerte para aguantar todo el día sin despegarse, pero no tanto como para que duela al quitarlo. El diseño es chiquito y bonito, y ya me han hecho cumplidos por él.",
    name: "Fátima B.",
    productSlug: "sleep",
    productName: "Sleep",
    productColor: "#1EB1BC",
  },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="#0F0F0F" width="11" height="11">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function SocialCommunity() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  // Triple render list for smooth infinite scroll loop
  const items = [...COMMUNITY_ITEMS, ...COMMUNITY_ITEMS, ...COMMUNITY_ITEMS];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setTimeout(() => {
        el.scrollLeft = el.scrollWidth / 3;
      }, 150);
    }
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const widthThird = el.scrollWidth / 3;

    if (scrollLeft < widthThird - 200) {
      el.scrollLeft = scrollLeft + widthThird;
    } else if (scrollLeft > widthThird * 2 + 200) {
      el.scrollLeft = scrollLeft - widthThird;
    }
  };

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const step = 270; // Card width + gap
      const offset = direction === "left" ? -step : step;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        scroll("right");
      }
    }, 6500);

    return () => clearInterval(timer);
  }, [scroll]);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E6E1D8] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-left"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
            comunidad novapatch.
          </h2>
        </motion.div>
      </div>

      {/* Carousel Track with Floating Controls */}
      <div
        className="relative w-full group/carousel"
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
      >
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-[#E6E1D8] bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer opacity-90 group-hover/carousel:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-[#E6E1D8] bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0F0F0F] hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer opacity-90 group-hover/carousel:opacity-100"
          aria-label="Siguiente"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none py-3 px-6 sm:px-12 select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[220px] sm:w-[250px] h-[310px] sm:h-[340px] snap-start"
            >
              {item.type === "image" ? (
                /* Photo Card Stage + Brand Kit Caption Bar */
                <div className="flex flex-col h-full bg-white border border-[#E6E1D8] rounded-xl overflow-hidden shadow-2xs group/card hover:border-[#0F0F0F]/30 transition-colors">
                  <div className="relative flex-1 bg-[#FAF8F5] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Caption Bar */}
                  <div className="p-3 border-t border-[#E6E1D8] bg-white flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-sans font-semibold text-xs text-[#0F0F0F] truncate">
                        {item.name}
                      </span>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-sans font-normal text-[#A8A29A] flex items-center">
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                        style={{ backgroundColor: item.productColor }}
                      />
                      {item.productName}
                    </span>
                  </div>
                </div>
              ) : (
                /* Text Review Stage + Brand Kit Caption Bar */
                <div className="flex flex-col h-full bg-white border border-[#E6E1D8] rounded-xl overflow-hidden shadow-2xs group/card hover:border-[#0F0F0F]/30 transition-colors">
                  <div className="flex-1 bg-[#FAF8F5] p-4 sm:p-5 flex items-center justify-center text-center">
                    <p className="font-serif italic text-xs sm:text-sm text-[#0F0F0F] leading-relaxed line-clamp-8">
                      "{item.text}"
                    </p>
                  </div>
                  {/* Caption Bar */}
                  <div className="p-3 border-t border-[#E6E1D8] bg-white flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-sans font-semibold text-xs text-[#0F0F0F] truncate">
                        {item.name}
                      </span>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(item.rating)].map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-sans font-normal text-[#A8A29A] flex items-center">
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                        style={{ backgroundColor: item.productColor }}
                      />
                      {item.productName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
