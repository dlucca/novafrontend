"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
      <main>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 relative overflow-hidden"
          style={{ background: "#FAF7F2" }}
        >
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left: text */}
              <div>
                <motion.p
                  {...fade(0)}
                  className="font-bold text-[11px] uppercase tracking-[0.22em] mb-8"
                  style={{ color: "#E8503A" }}
                >
                  Nosotros
                </motion.p>

                <motion.h1
                  {...fade(0.1)}
                  className="font-black leading-[1.05] mb-7 tracking-[-0.02em]"
                  style={{ fontSize: "clamp(30px, 3.8vw, 52px)", color: "#005088" }}
                >
                  Creemos que cuidarse no debería ser complicado.
                </motion.h1>

                <motion.div
                  {...fade(0.18)}
                  className="w-12 h-[3px] mb-7"
                  style={{ background: "linear-gradient(90deg, #E8503A, #5BA8D5)" }}
                />

                <motion.p
                  {...fade(0.24)}
                  className="font-light leading-relaxed"
                  style={{ fontSize: "clamp(15px, 1.2vw, 17px)", color: "rgba(13,27,53,0.6)" }}
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
                <div
                  className="relative rounded-[28px] overflow-hidden aspect-[4/3] w-full"
                  style={{ boxShadow: "0 24px 72px rgba(13,27,53,0.14)" }}
                >
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B35]/30 via-transparent to-transparent pointer-events-none z-10" />
                </div>
                {/* Floating badge */}
                <motion.div
                  {...fade(0.5)}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3.5 border z-20"
                  style={{
                    boxShadow: "0 8px 32px rgba(13,27,53,0.12)",
                    borderColor: "rgba(13,27,53,0.1)",
                  }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#E8503A" }}>
                    La idea era clara
                  </p>
                  <p className="text-[13px] font-semibold" style={{ color: "#0D1B35" }}>
                    Que cuidarse sea algo que sí se pueda sostener.
                  </p>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── 01 — EL PROBLEMA ─────────────────────────────────────── */}
        <section
          className="py-24 px-6 relative overflow-hidden"
          style={{ background: "#FEF7ED" }}
        >
          {/* Ghost number */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none"
            style={{ color: "rgba(13,27,53,0.04)", fontSize: "clamp(100px, 14vw, 220px)" }}
          >
            01
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-14 items-start">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black" style={{ fontSize: "clamp(24px, 2.5vw, 34px)", color: "#E8503A" }}>
                    01
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(13,27,53,0.12)" }} />
                </div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.18em] leading-relaxed"
                  style={{ color: "rgba(13,27,53,0.35)" }}
                >
                  El problema<br />que vimos
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-black leading-[1.1] mb-8 tracking-[-0.02em]"
                  style={{ fontSize: "clamp(22px, 2.4vw, 38px)", color: "#005088" }}
                >
                  El problema no era la intención.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-5 leading-[1.85] mb-12"
                  style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "rgba(13,27,53,0.6)" }}
                >
                  <p>
                    La mayoría de las personas quiere cuidarse. Compra
                    suplementos, los toma unos días, se le olvida el frasco en
                    un cajón y los abandona. No por falta de voluntad, sino
                    porque el formato no acompaña la vida real.
                  </p>
                  <p>
                    Pastillas que requieren agua, horarios estrictos, cápsulas
                    que pueden caer pesadas al estómago, rituales que se sienten
                    como obligaciones.
                  </p>
                </motion.div>

                {/* Pull quote */}
                <motion.div
                  {...fade(0.3)}
                  className="border-l-[3px] pl-7"
                  style={{ borderColor: "#E8503A" }}
                >
                  <p
                    className="font-black leading-tight"
                    style={{ fontSize: "clamp(20px, 2.2vw, 32px)", color: "#005088" }}
                  >
                    Lo complejo se abandona.<br />
                    <span style={{ color: "rgba(0,80,136,0.3)" }}>Siempre.</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 — LA IDEA ─────────────────────────────────────────── */}
        <section className="py-24 px-6 relative overflow-hidden bg-white">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(100px, 14vw, 220px)", color: "rgba(13,27,53,0.06)" }}
          >
            02
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-14 items-start">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black" style={{ fontSize: "clamp(24px, 2.5vw, 34px)", color: "#5BA8D5" }}>
                    02
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(13,27,53,0.12)" }} />
                </div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.18em] leading-relaxed"
                  style={{ color: "rgba(13,27,53,0.35)" }}
                >
                  La idea que<br />cambió todo
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-black leading-[1.1] mb-8 tracking-[-0.02em]"
                  style={{ fontSize: "clamp(22px, 2.4vw, 38px)", color: "#005088" }}
                >
                  Comenzó con una frustración, no con una fórmula.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-5 leading-[1.85] mb-8"
                  style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "rgba(13,27,53,0.6)" }}
                >
                  <p>
                    A Cristian le pasaba lo mismo que a casi todos. Empezaba
                    motivado y a las dos semanas el frasco terminaba olvidado.
                    Junto con Esteban, su amigo y socio de toda la vida,
                    empezaron a darle vueltas a una pregunta:
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: "#005088", fontSize: "clamp(16px, 1.3vw, 20px)" }}
                  >
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
                  className="font-black leading-[1.02] mb-8 tracking-[-0.02em]"
                  style={{ fontSize: "clamp(26px, 3vw, 46px)", color: "#005088" }}
                >
                  Un gesto.<br />Todo el día.
                </motion.p>

                <motion.div
                  {...fade(0.3)}
                  className="flex flex-col gap-5 leading-[1.85] mb-12"
                  style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "rgba(13,27,53,0.6)" }}
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
                  className="border-l-[3px] pl-7"
                  style={{ borderColor: "#E8503A" }}
                >
                  <p
                    className="font-black leading-tight"
                    style={{ fontSize: "clamp(20px, 2.2vw, 32px)", color: "#005088" }}
                  >
                    Bienestar que se integra a tu día.<br />
                    <span style={{ color: "rgba(0,80,136,0.3)" }}>No que lo interrumpe.</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 — LO QUE NOS GUÍA ─────────────────────────────────── */}
        <section
          className="py-24 px-6 relative overflow-hidden"
          style={{ background: "#FAF7F2" }}
        >
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(100px, 14vw, 220px)", color: "rgba(13,27,53,0.04)" }}
          >
            03
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-14 items-start">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black" style={{ fontSize: "clamp(24px, 2.5vw, 34px)", color: "#E8503A" }}>
                    03
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(13,27,53,0.12)" }} />
                </div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.18em] leading-relaxed"
                  style={{ color: "rgba(13,27,53,0.35)" }}
                >
                  Lo que<br />nos guía
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-black leading-[1.1] mb-8 tracking-[-0.02em]"
                  style={{ fontSize: "clamp(22px, 2.4vw, 38px)", color: "#005088" }}
                >
                  Constancia por sobre impacto.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-5 leading-[1.85] mb-12"
                  style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "rgba(13,27,53,0.6)" }}
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
                  className="font-black leading-[0.95] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(32px, 4.5vw, 64px)", color: "rgba(0,80,136,0.18)" }}
                >
                  Eso es{" "}
                  <span style={{ color: "#005088" }}>Novapatch.</span>
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 — LO QUE NO SOMOS ─────────────────────────────────── */}
        <section className="py-24 px-6 relative overflow-hidden bg-white">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(100px, 14vw, 220px)", color: "rgba(13,27,53,0.06)" }}
          >
            04
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[180px_1fr] gap-14 items-start">

              <motion.div {...fade(0)} className="lg:sticky lg:top-32 self-start">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black" style={{ fontSize: "clamp(24px, 2.5vw, 34px)", color: "#5BA8D5" }}>
                    04
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(13,27,53,0.12)" }} />
                </div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.18em] leading-relaxed"
                  style={{ color: "rgba(13,27,53,0.35)" }}
                >
                  Lo que<br />no somos
                </p>
              </motion.div>

              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="font-black leading-[1.1] mb-8 tracking-[-0.02em]"
                  style={{ fontSize: "clamp(22px, 2.4vw, 38px)", color: "#005088" }}
                >
                  Sin promesas que no podemos cumplir.
                </motion.h2>

                <motion.div
                  {...fade(0.2)}
                  className="flex flex-col gap-5 leading-[1.85] mb-12"
                  style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "rgba(13,27,53,0.6)" }}
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
                <motion.div
                  {...fade(0.3)}
                  className="divide-y"
                  style={{ borderColor: "#E5E7EB" }}
                >
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
                      className="py-6"
                      style={{ borderColor: "#E5E7EB" }}
                    >
                      <span
                        className="font-black leading-[1.05] tracking-[-0.02em]"
                        style={{
                          fontSize: "clamp(20px, 2.5vw, 42px)",
                          color: "rgba(0,80,136,0.18)",
                        }}
                      >
                        {item.cond}{" "}
                        <span className="block sm:inline" style={{ color: "#005088" }}>
                          {item.result}
                        </span>
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section
          className="py-28 px-6 text-center relative overflow-hidden"
          style={{ background: "#FEF7ED" }}
        >
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.p
              {...fade(0)}
              className="font-bold text-[11px] uppercase tracking-[0.22em] mb-8"
              style={{ color: "#E8503A" }}
            >
              El portfolio
            </motion.p>

            <motion.h2
              {...fade(0.1)}
              className="font-black leading-[1.02] mb-10 tracking-[-0.02em]"
              style={{ color: "#005088", fontSize: "clamp(30px, 4vw, 56px)" }}
            >
              Seis parches.<br />Un solo hábito.
            </motion.h2>

            <motion.div {...fade(0.2)}>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-3 font-bold rounded-full transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#E8503A",
                  color: "white",
                  fontSize: "15px",
                  padding: "14px 36px",
                  boxShadow: "0 8px 32px rgba(232,80,58,0.35)",
                }}
              >
                Conoce el portfolio
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
