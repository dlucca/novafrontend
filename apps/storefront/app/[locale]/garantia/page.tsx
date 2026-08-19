"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
});

// ── DATA ──────────────────────────────────────────────────────────────────────

const cards = [
  {
    title: "Qué cubre",
    featured: true,
    items: [
      "100% del importe del primer pedido por cliente",
      "Sin necesidad de devolver el producto",
      "Aplica a compra única y al primer ciclo de suscripción",
      "Te pedimos tu número de pedido y una experiencia breve — la usamos para mejorar, no para evaluar tu caso",
    ],
  },
  {
    title: "Cómo solicitarlo",
    featured: false,
    items: [
      "Llenas el formulario de Solicitar reembolso",
      "Indica tu número de pedido y nombre completo",
      "Cuéntanos brevemente qué notaste o qué no funcionó",
      "Procesamos el reembolso en 5–7 días hábiles",
    ],
  },
  {
    title: "Condiciones",
    featured: false,
    items: [
      "Solo aplica al primer pedido por cliente",
      "Solicitud dentro de los 30 días naturales de recibido",
      "Máximo un reembolso por cliente",
      "No aplica a ciclos posteriores de suscripción",
    ],
  },
];

const stats = [
  { value: "30", unit: "días", label: "plazo de solicitud" },
  { value: "100%", unit: "", label: "del importe del primer pedido" },
  { value: "5–7", unit: "días", label: "hábiles para procesar" },
];

const faqs = [
  {
    q: "¿Tengo que devolver el producto para obtener el reembolso?",
    a: "No. El reembolso es incondicional dentro del plazo de 30 días para el primer pedido. Puedes quedarte con el producto.",
  },
  {
    q: "¿Cuánto tarda en aparecer el reembolso en mi cuenta?",
    a: "El proceso toma 5–7 días hábiles desde que aprobamos tu solicitud. Dependiendo de tu banco puede tardar un par de días adicionales en verse reflejado.",
  },
  {
    q: "¿La garantía aplica si me suscribo?",
    a: "Sí, aplica al primer ciclo de cualquier suscripción. Si en los primeros 30 días no estás satisfecho, te reembolsamos ese primer cobro.",
  },
  {
    q: "Probé el parche solo 2 días, ¿igual aplica?",
    a: "Sí. No tenemos requisito mínimo de días de uso. Confiamos en tu criterio.",
  },
  {
    q: "¿Puedo pedir garantía en más de un producto?",
    a: "La garantía aplica por cliente (una vez), sin importar cuántos productos hayas comprado en el mismo pedido.",
  },
];

// ── FAQ ITEM ──────────────────────────────────────────────────────────────────

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="py-5 border-b border-[#E6E1D8]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
      >
        <span className="font-sans font-semibold text-base text-[#0F0F0F] leading-snug group-hover:text-[#3A3A37] transition-colors">
          {faq.q}
        </span>
        <span className="shrink-0 w-6 h-6 rounded-full border border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-center font-mono text-xs text-[#0F0F0F]">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-3 font-sans text-sm text-[#3A3A37] leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function GarantiaPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="pt-32 pb-16 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div className="bg-white rounded-xl border border-[#E6E1D8] p-8 sm:p-14 text-left shadow-2xs">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-3"
            >
              garantía de satisfacción
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-5"
            >
              30 días de garantía. sin riesgo.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="font-sans text-base sm:text-lg text-[#3A3A37] max-w-2xl leading-relaxed"
            >
              Si tu primer pedido no te convence, te devolvemos el 100% de tu dinero. Sin trámites complicados ni necesidad de devolver el producto.
            </motion.p>
          </div>
        </section>

        {/* ── STATS BAND ──────────────────────────────────────────── */}
        <section className="py-12 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} {...fade(i * 0.08)} className="bg-white rounded-xl border border-[#E6E1D8] p-6 text-left shadow-2xs">
                <p className="font-mono font-bold text-3xl sm:text-4xl text-[#0F0F0F] leading-none mb-2">
                  {s.value}
                  {s.unit && <span className="font-sans text-base font-normal text-[#3A3A37] ml-1">{s.unit}</span>}
                </p>
                <p className="font-sans text-xs text-[#A8A29A] uppercase tracking-[0.12em] font-medium">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3 CARDS ─────────────────────────────────────────────── */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-3">
              cómo funciona la garantía.
            </h2>
            <p className="font-sans text-base text-[#3A3A37]">
              Transparencia total para que pruebes Novapatch con absoluta tranquilidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                {...fade(i * 0.1)}
                className={`rounded-xl p-8 border flex flex-col justify-between ${
                  card.featured
                    ? "bg-[#0F0F0F] text-white border-[#0F0F0F] shadow-2xs"
                    : "bg-white text-[#0F0F0F] border-[#E6E1D8] shadow-2xs"
                }`}
              >
                <div>
                  <span
                    className={`inline-block text-[11px] font-sans font-medium uppercase tracking-[0.14em] mb-6 px-3 py-1 rounded-full ${
                      card.featured ? "bg-white/10 text-white" : "bg-[#FAF8F5] text-[#3A3A37] border border-[#E6E1D8]"
                    }`}
                  >
                    {card.title}
                  </span>

                  <ul className="space-y-3">
                    {card.items.map((item, j) => (
                      <li
                        key={j}
                        className={`text-xs font-sans leading-relaxed flex items-start gap-2 ${
                          card.featured ? "text-white/80" : "text-[#3A3A37]"
                        }`}
                      >
                        <span className={`shrink-0 ${card.featured ? "text-white" : "text-[#0F0F0F]"}`}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ & CONTACT LINK ──────────────────────────────────── */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-3">
              preguntas frecuentes sobre la garantía.
            </h2>
            <p className="font-sans text-base text-[#3A3A37]">
              Respuestas rápidas a las dudas más comunes sobre reembolsos.
            </p>
          </div>

          <div className="max-w-4xl mx-auto border-t border-[#E6E1D8]">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>

          <div className="mt-12 p-6 rounded-xl bg-white border border-[#E6E1D8] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <p className="font-sans text-sm text-[#3A3A37]">
              ¿Listo para solicitar tu garantía? Completa el formulario digital.
            </p>
            <Link
              href="/reembolso"
              className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-6 py-3 rounded-full transition-all shrink-0"
            >
              Solicitar reembolso
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
