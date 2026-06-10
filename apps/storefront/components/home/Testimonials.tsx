"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Carlos M.",
    product: "Energy",
    dot: "#83B5F4",
    img: "/socialproof/testimonial_2_1x.webp",
    text: "Lo pongo en la mañana y siento que llego al final del día sin ese bajón de siempre. Ya no dependo del tercer café.",
  },
  {
    name: "Sofía R.",
    product: "Sleep",
    dot: "#1EB1BC",
    img: "/socialproof/testimonial_1_1x.webp",
    text: "Me ayuda a desconectar antes de dormir. Llego a la cama más tranquila y eso lo cambia todo.",
  },
  {
    name: "Diego T.",
    product: "Zen",
    dot: "#4E82BC",
    img: "/socialproof/testimonial_5_1x.webp",
    text: "Días de reuniones seguidas y lo noto. No es que el estrés desaparezca, pero lo manejo diferente.",
  },
  {
    name: "Valentina G.",
    product: "Glow",
    dot: "#F25C54",
    img: "/socialproof/testimonial_3_1x.webp",
    text: "Llevo dos meses y mi piel se ve diferente. Más uniforme, más luminosa. La gente me pregunta qué estoy haciendo.",
  },
  {
    name: "Andrés P.",
    product: "Shield",
    dot: "#FFA849",
    img: "/socialproof/testimonial_9_1x.webp",
    text: "Entreno fuerte y necesito que mi cuerpo responda bien. Desde que lo uso me enfermo mucho menos. Simple así.",
  },
  {
    name: "Mariana L.",
    product: "Woman",
    dot: "#C693C4",
    img: "/socialproof/testimonial_8_1x.webp",
    text: "Sentía que mis ciclos me manejaban a mí. Ahora lo vivo diferente — más estable, con menos altibajos emocionales.",
  },
];

const PAGE_SIZE = 3;

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true" style={{ color: "var(--color-teal)" }}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const Stars = () => (
  <div role="img" aria-label="Calificación: 5 de 5 estrellas" className="flex gap-0.5 mb-3.5">
    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
  </div>
);

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);
  const visible = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const shouldReduceMotion = useReducedMotion();

  const go = (dir: number) => {
    setPage((p) => (p + dir + totalPages) % totalPages);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  }, [go]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ background: "var(--color-teal-pale)" }}>
      {/* Wave top */}
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "60px", transform: "scaleY(-1)", background: "white", marginBottom: "-1px" }}
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--color-teal-pale)" />
      </svg>

      <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-12 relative" style={{ background: "var(--color-teal-pale)" }}>
        {/* Header — social proof number instead of standard label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px] mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-1 mb-3" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <svg key={i} viewBox="0 0 20 20" fill="currentColor" width="24" height="24" style={{ color: "var(--color-teal)" }}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h2
            className="font-black text-ocean tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px,3vw,40px)" }}
          >
            Lo que nos cuentan nuestros Novapatchers
          </h2>
          <p className="text-[15px] text-ocean/60 mt-2">
            4.8 de 5 estrellas en promedio
          </p>
        </motion.div>

        {/* Cards */}
        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Testimonios de clientes"
          aria-live="polite"
          tabIndex={0}
          className="max-w-[1100px] mx-auto relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50 focus-visible:ring-offset-4 rounded-2xl"
          onKeyDown={handleKeyDown}
        >
          {/* Screen-reader page announcement */}
          <div aria-live="assertive" aria-atomic="true" className="sr-only">
            Página {page + 1} de {totalPages}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, x: -40 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {visible.map((t) => (
                <div
                  key={t.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Testimonio de ${t.name}`}
                  className="bg-white rounded-[32px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.07)] flex flex-col"
                >
                  <Stars />
                  <p className="text-[15px] text-gray-900 leading-[1.7] flex-1 mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={t.img}
                        alt={`Foto de ${t.name}`}
                        width={48}
                        height={48}
                        loading="lazy"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-gray-900">{t.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                          style={{ background: t.dot }}
                        />
                        <span className="text-[12px] text-gray-500">Novapatch {t.product}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div className="flex justify-center items-center gap-4 mt-9">
          <button
            onClick={() => go(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-black/[0.08] text-gray-900 cursor-pointer border-none"
            aria-label="Anterior"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="flex items-center justify-center w-11 h-11 border-none cursor-pointer bg-transparent"
                aria-label={`Página ${i + 1}`}
                aria-current={i === page ? "true" : undefined}
              >
                <span
                  className={`rounded-full block transition-all duration-300 h-2 ${i === page ? "w-5 bg-teal" : "w-2 bg-black/20"}`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => go(1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-black/[0.08] text-gray-900 cursor-pointer border-none"
            aria-label="Siguiente"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Wave bottom */}
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "60px", background: "var(--color-teal-pale)", marginTop: "-1px" }}
      >
        <path d="M0,20 C480,60 960,0 1440,20 L1440,60 L0,60 Z" fill="white" />
      </svg>
    </div>
  );
}
