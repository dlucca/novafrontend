"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/i18n-navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = (delay = 0, yOffset = 22) => ({
  initial: { opacity: 0, y: yOffset },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
});

const carouselImages = [
  { src: "/productusers/us1.webp", alt: "El equipo de Novapatch — Imagen 1" },
  { src: "/productusers/us2.webp", alt: "El equipo de Novapatch — Imagen 2" },
  { src: "/productusers/us3.webp", alt: "El equipo de Novapatch — Imagen 3" },
];

export default function NosotrosPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="pt-32 pb-20 px-4 sm:px-8 relative overflow-hidden bg-[#FAF8F5]">
          <div className="max-w-[1400px] mx-auto relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left: text */}
              <div className="text-left">
                <motion.h1
                  {...fade(0.1)}
                  className="font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight text-4xl sm:text-5xl lg:text-6xl lowercase mb-6"
                >
                  creemos que cuidarse no debería ser complicado.
                </motion.h1>

                <motion.p
                  {...fade(0.2)}
                  className="font-sans font-normal text-base sm:text-lg text-[#3A3A37] leading-relaxed max-w-md"
                >
                  Comenzó con una frustración, no con una fórmula.
                </motion.p>
              </div>

              {/* Right: image carousel */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] w-full border border-[#E6E1D8] shadow-2xs bg-[#0F0F0F]">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={carouselImages[currentIndex].src}
                        alt={carouselImages[currentIndex].alt}
                        fill
                        className="object-cover object-center"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 pointer-events-none z-10" />

                  {/* Overlaid Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 text-left">
                    <p className="font-sans font-medium text-[10px] uppercase tracking-[0.14em] text-white/80 mb-1">
                      La idea era clara
                    </p>
                    <p className="font-sans font-semibold text-base sm:text-lg text-white">
                      Que cuidarse sea algo que sí se pueda sostener.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── 01 — EL PROBLEMA ─────────────────────────────────────── */}
        <section className="py-20 px-6 sm:px-10 relative overflow-hidden bg-white border-t border-[#E6E1D8]">
          {/* Ghost number */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 font-mono font-bold text-[#0F0F0F]/5 text-[140px] sm:text-[220px] select-none pointer-events-none">
            01
          </div>

          <div className="max-w-[1240px] mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-12 items-start text-left">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-[#0F0F0F]">
                    01
                  </span>
                  <div className="h-px flex-1 bg-[#E6E1D8]" />
                </div>
                <p className="font-sans font-medium text-[11px] uppercase tracking-[0.14em] text-[#A8A29A]">
                  El problema<br />que vimos
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#0F0F0F] tracking-[-0.03em] lowercase mb-6"
                >
                  el problema no era la intención.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-4 font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed mb-8 max-w-2xl"
                >
                  <p>
                    La mayoría de las personas quiere cuidarse. Compra
                    suplementos, los toma unos días, se le olvida el frasco en
                    un cajón y los abandona. No por falta de voluntad, sino
                    porque el formato no acompaña la vida real.
                  </p>
                  <p>
                    Pastillas que requieren agua, horarios strictly, cápsulas
                    que pueden caer pesadas al estómago, rituales que se sienten
                    como obligaciones.
                  </p>
                </motion.div>

                {/* Pull quote */}
                <motion.div
                  {...fade(0.3)}
                  className="border-l-2 border-[#0F0F0F] pl-6 my-6"
                >
                  <p className="font-display font-semibold text-xl sm:text-2xl lg:text-3xl text-[#0F0F0F] tracking-[-0.03em] lowercase leading-snug">
                    lo complejo se abandona. siempre.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 — LA IDEA ─────────────────────────────────────────── */}
        <section className="py-20 px-6 relative overflow-hidden bg-[#FAF8F5] border-t border-[#E6E1D8]">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 font-mono font-bold text-[#0F0F0F]/5 text-[140px] sm:text-[220px] select-none pointer-events-none">
            02
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-12 items-start text-left">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-[#0F0F0F]">
                    02
                  </span>
                  <div className="h-px flex-1 bg-[#E6E1D8]" />
                </div>
                <p className="font-sans font-medium text-[11px] uppercase tracking-[0.14em] text-[#A8A29A]">
                  La idea que<br />cambió todo
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#0F0F0F] tracking-[-0.03em] lowercase mb-6"
                >
                  comenzó con una frustración, no con una fórmula.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-4 font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed mb-6 max-w-2xl"
                >
                  <p>
                    A Cristian le pasaba lo mismo que a casi todos. Empezaba
                    motivado y a las dos semanas el frasco terminaba olvidado.
                    Junto con Esteban, su amigo y socio de toda la vida,
                    empezaron a darle vueltas a una pregunta:
                  </p>
                  <p className="font-sans font-semibold text-base sm:text-lg text-[#0F0F0F] my-2">
                    ¿Y si cuidarse no dependiera de acordarse?
                  </p>
                  <p>
                    Su hijo Ramiro se sumó con el empuje de quien saca las ideas
                    adelante, y Maia —esposa de Esteban— le dio forma visual y
                    sensibilidad al proyecto. Entre los cuatro convirtieron esa
                    duda en algo concreto: un parche.
                  </p>
                </motion.div>

                <motion.p
                  {...fade(0.25)}
                  className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl text-[#0F0F0F] tracking-[-0.035em] lowercase my-6"
                >
                  un gesto. todo el día.
                </motion.p>

                <motion.div
                  {...fade(0.3)}
                  className="flex flex-col gap-4 font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed mb-8 max-w-2xl"
                >
                  <p>
                    La absorción a través de la piel no es nueva, pero la
                    aplicamos al bienestar cotidiano. Formulamos cada parche
                    desde cero para este formato, sin pasar por el sistema
                    digestivo, sin interferencias.
                  </p>
                </motion.div>

                {/* Pull quote */}
                <motion.div
                  {...fade(0.35)}
                  className="border-l-2 border-[#0F0F0F] pl-6 my-6"
                >
                  <p className="font-display font-semibold text-xl sm:text-2xl lg:text-3xl text-[#0F0F0F] tracking-[-0.03em] lowercase leading-snug">
                    bienestar que se integra a tu día. no que lo interrumpe.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 — LO QUE NOS GUÍA ─────────────────────────────────── */}
        <section className="py-20 px-6 relative overflow-hidden bg-white border-t border-[#E6E1D8]">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 font-mono font-bold text-[#0F0F0F]/5 text-[140px] sm:text-[220px] select-none pointer-events-none">
            03
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-12 items-start text-left">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-[#0F0F0F]">
                    03
                  </span>
                  <div className="h-px flex-1 bg-[#E6E1D8]" />
                </div>
                <p className="font-sans font-medium text-[11px] uppercase tracking-[0.14em] text-[#A8A29A]">
                  Lo que<br />nos guía
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#0F0F0F] tracking-[-0.03em] lowercase mb-6"
                >
                  constancia por sobre impacto.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-4 font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed mb-8 max-w-2xl"
                >
                  <p>
                    En bienestar, el producto que se usa todos los días siempre
                    gana al producto perfecto que se abandona a la semana.
                  </p>
                  <p>
                    Por eso todo lo que hacemos apunta a eliminar la fricción:
                    hacer que cuidarse sea tan fácil que no haya excusa para no
                    hacerlo. Un solo gesto, integrado a lo que ya hacés, sin
                    rituales complicados ni horarios estrictos.
                  </p>
                </motion.div>

                <motion.p
                  {...fade(0.3)}
                  className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#0F0F0F] tracking-[-0.035em] lowercase my-6"
                >
                  eso es novapatch.
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 — LO QUE NO SOMOS ─────────────────────────────────── */}
        <section className="py-20 px-6 relative overflow-hidden bg-[#FAF8F5] border-t border-[#E6E1D8]">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 font-mono font-bold text-[#0F0F0F]/5 text-[140px] sm:text-[220px] select-none pointer-events-none">
            04
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-12 items-start text-left">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-[#0F0F0F]">
                    04
                  </span>
                  <div className="h-px flex-1 bg-[#E6E1D8]" />
                </div>
                <p className="font-sans font-medium text-[11px] uppercase tracking-[0.14em] text-[#A8A29A]">
                  Lo que<br />no somos
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#0F0F0F] tracking-[-0.03em] lowercase mb-6"
                >
                  sin promesas que no podemos cumplir.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-4 font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed mb-8 max-w-2xl"
                >
                  <p>
                    No prometemos transformaciones radicales ni soluciones
                    mágicas. No usamos lenguaje clínico para parecer más serios
                    de lo que somos.
                  </p>
                  <p>
                    Somos una marca de bienestar que cree en la honestidad por
                    sobre la exageración, en la constancia por sobre el impacto
                    inmediato, y en acompañar — no en prometer.
                  </p>
                </motion.div>

                {/* If / then rows */}
                <div className="divide-y divide-[#E6E1D8] border-y border-[#E6E1D8] max-w-2xl">
                  {[
                    {
                      cond: "Si buscás resultados de un día para el otro,",
                      result: "no somos lo tuyo.",
                    },
                    {
                      cond: "Si buscás un hábito que sí puedas sostener,",
                      result: "bienvenido.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      {...fade(0.35 + i * 0.1)}
                      className="py-5"
                    >
                      <p className="font-display font-semibold text-lg sm:text-2xl text-[#0F0F0F] tracking-[-0.03em] lowercase">
                        {item.cond}{" "}
                        <span className="block sm:inline text-[#0F0F0F]">
                          {item.result}
                        </span>
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────── */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="rounded-xl p-8 sm:p-12 bg-white border border-[#E6E1D8] shadow-2xs text-center flex flex-col items-center gap-4 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase">
              seis parches. un solo hábito.
            </h2>
            <p className="font-sans font-normal text-sm sm:text-base text-[#3A3A37] max-w-md">
              Descubre la fórmula que mejor se adapta a tu ritmo diario.
            </p>
            <Link
              href="/tienda"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] px-8 py-4 text-[11px] font-sans font-medium uppercase tracking-[0.12em] transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              Conoce el portfolio
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
