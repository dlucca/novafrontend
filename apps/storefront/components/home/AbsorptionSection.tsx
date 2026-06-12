"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

const MOLECULES = [
  { x: 88,  delay: 0.0 },
  { x: 148, delay: 0.7 },
  { x: 195, delay: 1.4 },
  { x: 248, delay: 0.35 },
  { x: 298, delay: 1.05 },
  { x: 118, delay: 1.75 },
  { x: 222, delay: 2.1 },
  { x: 268, delay: 0.55 },
];

const TRAVEL = 222; // cy start=78 → end=300

function SkinDiagram({ shouldAnimate }: { shouldAnimate: boolean }) {
  return (
    <svg
      viewBox="0 0 380 390"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ maxWidth: 420 }}
    >
      <defs>
        <linearGradient id="patchShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="black" stopOpacity="0.08" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Patch ── */}
      <rect x="28" y="10" width="324" height="60" rx="12" fill="var(--color-gold)" />
      <rect x="28" y="10" width="324" height="60" rx="12" fill="url(#patchShine)" />
      {/* perforation dots */}
      {[55, 90, 125, 160, 195, 230, 265, 300, 335].map((x) => (
        <circle key={`t${x}`} cx={x} cy="10" r="2.8" fill="rgba(0,0,0,0.18)" />
      ))}
      {[55, 90, 125, 160, 195, 230, 265, 300, 335].map((x) => (
        <circle key={`b${x}`} cx={x} cy="70" r="2.8" fill="rgba(0,0,0,0.18)" />
      ))}
      <text x="190" y="39" textAnchor="middle" fontFamily="Outfit,system-ui,sans-serif" fontSize="13" fontWeight="800" fill="var(--color-ocean)" letterSpacing="1.5">NOVAPATCH</text>
      <text x="190" y="57" textAnchor="middle" fontFamily="Outfit,system-ui,sans-serif" fontSize="10" fill="rgba(0,0,0,0.48)" fontWeight="500">Liberación controlada · 10–12 horas</text>

      {/* dashed connectors patch → skin */}
      {[88, 148, 195, 248, 298].map((x) => (
        <line key={x} x1={x} y1="70" x2={x} y2="82" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 2" />
      ))}

      {/* ── Estrato córneo ── */}
      <path d="M8 84 C68 78 130 90 190 84 C250 78 312 90 372 84 L372 122 C312 128 250 116 190 122 C130 128 68 116 8 122 Z" fill="#002E4E" />
      <text x="22" y="106" fontFamily="Outfit,system-ui,sans-serif" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="0.6">ESTRATO CÓRNEO</text>

      {/* ── Epidermis ── */}
      <path d="M8 124 C68 118 130 130 190 124 C250 118 312 130 372 124 L372 192 C312 198 250 186 190 192 C130 198 68 186 8 192 Z" fill="#00223C" />
      <text x="22" y="162" fontFamily="Outfit,system-ui,sans-serif" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="0.6">EPIDERMIS</text>

      {/* ── Dermis ── */}
      <path d="M8 194 C68 188 130 200 190 194 C250 188 312 200 372 194 L372 302 C312 308 250 296 190 302 C130 308 68 296 8 302 Z" fill="#001628" />
      {/* collagen texture lines */}
      {[[28,220,140,238],[80,264,220,278],[200,212,350,230],[155,260,270,272],[70,288,210,298]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.055)" strokeWidth="1.5"/>
      ))}
      <text x="22" y="255" fontFamily="Outfit,system-ui,sans-serif" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="0.6">DERMIS</text>

      {/* ── Blood vessel layer ── */}
      <rect x="8" y="304" width="364" height="72" fill="#000D1A" />
      <path d="M18 326 Q110 318 200 326 Q290 334 362 326" stroke="#D94F4F" strokeWidth="6" strokeLinecap="round" opacity="0.72" />
      <path d="M18 350 Q100 358 210 350 Q295 342 362 350" stroke="#D94F4F" strokeWidth="3.5" strokeLinecap="round" opacity="0.40" />
      <text x="22" y="368" fontFamily="Outfit,system-ui,sans-serif" fontSize="9" fontWeight="700" fill="rgba(217,79,79,0.65)" letterSpacing="0.6">TORRENTE SANGUÍNEO</text>

      {/* ── <500 Da badge ── */}
      <rect x="258" y="88" width="104" height="22" rx="11" fill="rgba(28,177,188,0.14)" stroke="rgba(28,177,188,0.45)" strokeWidth="1" />
      <text x="310" y="103" textAnchor="middle" fontFamily="Outfit,system-ui,sans-serif" fontSize="10" fontWeight="700" fill="var(--color-teal)">{"< 500 Daltons"}</text>

      {/* ── Animated molecules ── */}
      {MOLECULES.map((m, i) => (
        <motion.circle
          key={i}
          cx={m.x}
          cy={78}
          r="4.5"
          fill="var(--color-teal)"
          filter="url(#glow)"
          initial={{ y: 0, opacity: 0 }}
          animate={shouldAnimate ? { y: [0, TRAVEL], opacity: [0, 1, 1, 0] } : { y: TRAVEL * 0.5, opacity: 0.55 }}
          transition={shouldAnimate ? {
            duration: 3.6,
            delay: m.delay,
            repeat: Infinity,
            ease: "linear",
          } : { duration: 0 }}
        />
      ))}
    </svg>
  );
}

export default function AbsorptionSection() {
  const t = useTranslations("home.absorption");
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Only animate while the section is visible — stops the infinite loop off-screen
  const inView = useInView(sectionRef, { margin: "0px 0px -100px 0px" });

  const stats = [
    { value: t("stat1Value"), unit: "Da", label: t("stat1Label") },
    { value: t("stat2Value"), unit: "h",  label: t("stat2Label") },
    { value: t("stat3Value"), unit: "×",  label: t("stat3Label") },
  ];
  return (
    <section
      ref={sectionRef}
      className="text-ocean overflow-hidden py-20 sm:py-24 px-5 sm:px-8 lg:px-12"
      style={{ background: "var(--color-blush)" }}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Left — Content ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          
            
            <p
              className="inline-block text-sm font-bold uppercase tracking-[0.12em] text-teal mb-3"
              style={{ color: "var(--color-teal)" }}
            >
              {t("badge")}
            </p>
          

          <h2 className="home-section-title text-ocean">
            {t("title")}
          </h2>

          <p
            className="leading-[1.65] mb-10"
            style={{ fontSize: "16px", color: "rgba(13,27,53,0.65)" }}
          >
            {t("subtitle")}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 flex flex-col gap-1.5"
                style={{
                  background: "rgba(13,27,53,0.06)",
                  border: "1px solid rgba(13,27,53,0.12)",
                }}
              >
                <div
                  className="font-black leading-none"
                  style={{ fontSize: "22px", color: "var(--color-ocean)" }}
                >
                  {s.value}
                  <span style={{ fontSize: "12px", opacity: 0.5, marginLeft: "2px" }}>
                    {s.unit}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#5A7A9A", fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

                    <Link
            href="#productos"
            className="inline-flex items-center gap-2 bg-ocean text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:bg-ocean-dark hover:shadow-[0_8px_32px_rgba(0,80,136,0.28)] shadow-[0_4px_20px_rgba(0,80,136,0.18)]"
          >
            Encuentra tu parche
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* ── Right — Diagram ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex justify-center"
        >
          <div
            className="w-full rounded-3xl p-6"
            style={{
              maxWidth: 460,
              background: "rgba(13,27,53,0.05)",
              border: "1px solid rgba(13,27,53,0.10)",
            }}
          >
            <SkinDiagram shouldAnimate={inView && !prefersReducedMotion} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
