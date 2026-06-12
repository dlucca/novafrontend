"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
});

const dotTexture = {
  backgroundImage:
    "radial-gradient(circle, rgba(0,80,136,0.05) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

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
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200"
      style={{
        borderColor: isOpen ? "rgba(0,80,136,0.2)" : "#E5E7EB",
        boxShadow: isOpen ? "0 4px 20px rgba(0,80,136,0.08)" : "none",
        background: "#fff",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span
          className={`home-item-title leading-snug ${isOpen ? "text-teal" : "text-ocean"}`}
        >
          {faq.q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center font-bold select-none"
          style={{
            background: isOpen ? "#3CBFAB" : "rgba(0,80,136,0.08)",
            color: isOpen ? "#fff" : "#3CBFAB",
            fontSize: "16px",
            lineHeight: 1,
          }}
        >
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
          >
            <div className="px-5 pb-5">
              <div className="h-px mb-4" style={{ background: "rgba(0,80,136,0.08)" }} />
              <p className="home-body">{faq.a}</p>
            </div>
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
      <main>

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section
          className="pt-32 pb-24 px-6 relative overflow-hidden"
          style={{ background: "#FEF7ED" }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-60" style={dotTexture} />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="home-section-eyebrow"
            >
              Garantía de satisfacción
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="home-section-title text-ocean"
            >
              30 días de garantía.<br />Sin riesgo.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-12 h-[3px] mx-auto mb-8"
              style={{ background: "linear-gradient(90deg, #3CBFAB, #005088)" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="home-section-subtitle"
            >
              Si tu primer pedido no te convence, te devolvemos el dinero.
              Sin trámites complicados, sin devolver el producto.
            </motion.p>
          </div>
        </section>

        {/* ── STATS BAND ──────────────────────────────────────────── */}
        <section className="py-10 px-6" style={{ background: "#F8EDEB" }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: "rgba(0,80,136,0.15)" }}>
              {stats.map((s, i) => (
                <motion.div key={i} {...fade(i * 0.08)} className="text-center px-6">
                  <p className="home-section-title text-ocean leading-none mb-1">
                    {s.value}
                    {s.unit && (
                      <span className="home-caption ml-1 font-semibold text-teal">
                        {s.unit}
                      </span>
                    )}
                  </p>
                  <p className="home-caption text-xs font-bold uppercase tracking-widest">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 CARDS ─────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">

            <motion.div {...fade(0)} className="text-center mb-14">
              <p className="home-section-eyebrow">
                Cómo funciona
              </p>
              <h2 className="home-section-title text-ocean">
                Todo lo que necesitas saber
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <motion.div
                  key={card.title}
                  {...fade(i * 0.1)}
                  className="rounded-3xl p-8 relative overflow-hidden flex flex-col gap-6"
                  style={
                    card.featured
                      ? {
                          background: "#3CBFAB",
                          boxShadow: "0 12px 48px rgba(60,191,171,0.28)",
                        }
                      : {
                          background: "#FAF7F2",
                          border: "1px solid #E5E7EB",
                        }
                  }
                >
                  {card.featured && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-40"
                      style={dotTexture}
                    />
                  )}

                  <div className="relative z-10">
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
                      style={
                        card.featured
                          ? { background: "rgba(255,255,255,0.15)", color: "#fff" }
                          : { background: "rgba(0,80,136,0.08)", color: "#3CBFAB" }
                      }
                    >
                      {card.title}
                    </div>

                    <ul
                      className="flex flex-col gap-0 divide-y"
                      style={{ borderColor: card.featured ? "rgba(255,255,255,0.12)" : "#E5E7EB" }}
                    >
                      {card.items.map((item, j) => (
                        <li
                          key={j}
                          className={`py-3.5 ${
                            card.featured
                              ? j === card.items.length - 1
                                ? "home-body text-white/50"
                                : "home-body text-white/80"
                              : j === card.items.length - 1
                              ? "home-caption"
                              : "home-body"
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT BAND ────────────────────────────────────────── */}
        <section
          className="py-8 px-6"
          style={{ background: "#FAF7F2", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.p {...fade(0)} className="home-body">
              Llenas el{" "}
              <Link
                href="/reembolso"
                className="home-body font-semibold text-teal transition-colors hover:underline"
              >
                formulario de Solicitar reembolso
              </Link>{" "}
              y nos encargamos del resto. Respondemos en 24–48 horas.
            </motion.p>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fade(0)} className="text-center mb-12">
              <p className="home-section-eyebrow">
                Preguntas frecuentes
              </p>
              <h2 className="home-section-title text-ocean">
                Dudas sobre la garantía
              </h2>
            </motion.div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} {...fade(i * 0.06)}>
                  <FAQItem
                    faq={faq}
                    isOpen={openIdx === i}
                    onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section
          className="py-24 px-6 text-center relative overflow-hidden"
          style={{ background: "#FAF7F2" }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-60" style={dotTexture} />

          <div className="max-w-xl mx-auto relative z-10">
            <motion.p
              {...fade(0)}
              className="home-section-eyebrow"
            >
              Sin riesgo
            </motion.p>

            <motion.h2
              {...fade(0.1)}
              className="home-section-title text-ocean"
            >
              Prueba Novapatch.<br />Si no funciona, te devolvemos tu dinero.
            </motion.h2>

            <motion.p
              {...fade(0.18)}
              className="home-section-subtitle mb-10"
            >
              30 días de garantía total sobre tu primer pedido.
            </motion.p>

            <motion.div {...fade(0.25)}>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#3CBFAB] px-9 py-4 font-bold text-white shadow-[0_4px_20px_rgba(60,191,171,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2da898] hover:shadow-[0_8px_32px_rgba(60,191,171,0.4)] active:scale-[0.97]"
              >
                Ver los parches
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
