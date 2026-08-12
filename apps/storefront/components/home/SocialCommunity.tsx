"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

const COMMUNITY_ITEMS = [
  {
    type: "video" as const,
    videoUrl: "/videos/Video1.mp4",
  },
  {
    type: "card" as const,
    rating: 5,
    text: "Probé el parche Energy para mi entrenamiento de la mañana y es una maravilla. Siento un foco mental increíble sin la taquicardia del pre-workout.",
    name: "Sofi Valenzuela",
    productSlug: "energy",
    productName: "Energy",
    productColor: "#83B5F4",
  },
  {
    type: "video" as const,
    videoUrl: "/videos/video2.mp4",
  },
  {
    type: "card" as const,
    rating: 5,
    text: "Me lo pongo una hora antes de dormir y es como un interruptor para apagar el estrés del día. Despierto súper fresca, nada de atontamiento al otro día.",
    name: "Mariana L.",
    productSlug: "sleep",
    productName: "Sleep",
    productColor: "#1EB1BC",
  },
  {
    type: "video" as const,
    videoUrl: "/videos/Video3.mp4",
  },
  {
    type: "card" as const,
    rating: 5,
    text: "Me ha ayudado muchísimo con el enfoque en el trabajo creativo. Siento que mi mente fluye súper rápido y sin distracciones.",
    name: "Paulina F.",
    productSlug: "zen",
    productName: "Zen",
    productColor: "#4E82BC",
  },
  {
    type: "video" as const,
    videoUrl: "/videos/video4.mp4",
  },
  {
    type: "card" as const,
    rating: 5,
    text: "Tengo insomnio recurrente por la presión del trabajo y Sleep me ayudó a regularizar mi descanso de corrido de forma súper natural.",
    name: "Diego Torres",
    productSlug: "sleep",
    productName: "Sleep",
    productColor: "#1EB1BC",
  },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-[#005088]">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function SocialCommunity() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";

  // Triple render list to support infinite scroll smoothly
  const items = [...COMMUNITY_ITEMS, ...COMMUNITY_ITEMS, ...COMMUNITY_ITEMS];

  // Set initial scroll position to the middle third on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const initScroll = () => {
        el.scrollLeft = el.scrollWidth / 3;
      };
      // Wait for styles and DOM rendering
      setTimeout(initScroll, 150);
    }
  }, []);

  // Listen to scrolls and silently jump to the middle third if reaching edges
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const widthThird = el.scrollWidth / 3;

    // Buffer region to switch relative sets
    if (scrollLeft < widthThird - 200) {
      el.scrollLeft = scrollLeft + widthThird;
    } else if (scrollLeft > widthThird * 2 + 200) {
      el.scrollLeft = scrollLeft - widthThird;
    }
  };

  const isPausedRef = useRef(false);

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const step = 234; // Card width (210px) + gap (24px)
      const offset = direction === "left" ? -step : step;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, []);

  // Auto-advance every 7 seconds in an infinite loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        scroll("right");
      }
    }, 7000);

    return () => clearInterval(timer);
  }, [scroll]);

  return (
    <section className="py-20 bg-stone-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="home-section-eyebrow text-center block">
            COMUNIDAD NOVAPATCH
          </p>
          <h2 className="home-section-title text-ocean text-center">
            Resultados Reales de Gente Real
          </h2>
        </motion.div>
      </div>

      {/* Container con botones Glassmorphism */}
      <div
        className="relative w-full overflow-visible group"
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
      >
        {/* Flecha Izquierda */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-black/5 bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Anterior"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0D1B35]">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Flecha Derecha */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-6 md:right-14 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-black/5 bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Siguiente"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0D1B35]">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Carrusel Desplazable con snaps al centro y padding lateral */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-[8vw] select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[180px] md:w-[210px] h-[300px] md:h-[350px] snap-center"
            >
              {item.type === "video" ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-stone-900 group/video">
                  <video
                    src={item.videoUrl}
                    className="w-full h-full object-cover rounded-2xl brightness-[0.82] group-hover/video:brightness-[0.95] transition-all duration-300"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  {/* Soft Gradient Overlay Filter */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B35]/40 via-black/10 to-transparent pointer-events-none rounded-2xl group-hover/video:opacity-50 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-white p-6 flex flex-col justify-center border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#1a4b8c]/5 rounded-full blur-xl" />

                  {/* Estrellas */}
                  <div className="flex gap-0.5 mb-3.5 justify-center">
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  {/* Testimonio */}
                  <p className="home-body mb-3 italic font-medium text-center">
                    "{item.text}"
                  </p>

                  {/* Nombre */}
                  <p className="text-[10px] font-black tracking-wider uppercase text-[#0D1B35] text-center">
                    {item.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
