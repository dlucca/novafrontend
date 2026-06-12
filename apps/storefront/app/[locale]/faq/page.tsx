"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["Todas", "Suscripciones", "Envíos", "Pagos", "Producto", "Garantía"];

const faqs = [
  { cat: "Suscripciones", q: "¿Cómo cancelo mi suscripción?", a: "Puedes cancelar desde tu cuenta en cualquier momento, antes de la siguiente fecha de cobro. Sin penalidades ni cargos adicionales." },
  { cat: "Suscripciones", q: "¿Puedo pausar mi suscripción?", a: "Sí. Desde tu dashboard puedes pausar por 1 mes sin costo. Tu próximo pedido se reprograma automáticamente al mes siguiente." },
  { cat: "Suscripciones", q: "¿Puedo cambiar la frecuencia de entrega?", a: "Claro. Entra a tu cuenta, selecciona la suscripción y elige la nueva frecuencia. El cambio aplica desde el siguiente ciclo de facturación." },
  { cat: "Suscripciones", q: "¿Cuándo se realiza el cobro?", a: "El cobro se realiza automáticamente en tu fecha de renovación. Recibirás un recordatorio por email 3 días antes." },
  { cat: "Suscripciones", q: "¿Cuántas suscripciones puedo tener activas?", a: "Las que quieras. Puedes suscribirte a múltiples productos simultáneamente, cada uno con su propia frecuencia y ciclo de entrega." },
  { cat: "Envíos", q: "¿Cuánto tarda en llegar mi pedido?", a: "Ciudad de México: 1–2 días hábiles. Resto de México: 3–5 días hábiles. Todos los pedidos incluyen número de seguimiento por email." },
  { cat: "Envíos", q: "¿Envían a toda la República Mexicana?", a: "Sí, hacemos envíos a todo México. Próximamente Brasil y otros países de LATAM." },
  { cat: "Envíos", q: "¿Cuánto cuesta el envío?", a: "El costo de envío es de $85 MXN fijo para todos los pedidos, incluyendo suscripciones." },
  { cat: "Envíos", q: "¿Puedo rastrear mi pedido?", a: "Sí. Una vez que tu pedido es despachado recibirás un email con el número de guía para rastrear tu envío en tiempo real." },
  { cat: "Pagos", q: "¿Qué métodos de pago aceptan?", a: "Tarjeta de crédito y débito (Visa, Mastercard, American Express)." },
  { cat: "Pagos", q: "¿Es seguro pagar en la web?", a: "Sí. Usamos encriptación SSL y los datos de tu tarjeta se tokenizan mediante Openpay — nunca se almacenan en nuestros servidores." },
  { cat: "Pagos", q: "¿Me pueden dar factura?", a: "Sí. Solicítala por email a hola@novapatch.care con tus datos fiscales dentro de los 5 días naturales de tu compra." },
  { cat: "Producto", q: "¿Cómo se usa el parche?", a: "1. Retira el film protector. 2. Pega en piel limpia y seca (brazo, hombro o espalda). 3. Presiona 30 segundos. 4. Déjalo actuar 8–12 horas." },
  { cat: "Producto", q: "¿El parche es resistente al agua?", a: "Sí. Puedes ducharte, nadar y hacer ejercicio con el parche puesto. Está diseñado para mantenerse adherido en condiciones normales de humedad." },
  { cat: "Producto", q: "¿Cuáles son los ingredientes?", a: "Cada parche tiene ingredientes específicos según su función. Puedes ver la lista completa en la página de cada producto. Todos son veganos, sin gluten y sin azúcar." },
  { cat: "Producto", q: "¿Tiene efectos secundarios?", a: "Los parches están formulados con ingredientes naturales y seguros. Si tienes piel sensible, prueba primero en un área pequeña. Consulta a tu médico si estás embarazada o tomas medicamentos." },
  { cat: "Garantía", q: "¿Cómo funciona la garantía de satisfacción?", a: "30 días de garantía total. Si no estás satisfecho con tu primer pedido, te reembolsamos el importe completo sin necesidad de devolver el producto." },
  { cat: "Garantía", q: "¿Cuánto tarda el reembolso?", a: "Una vez aprobada tu solicitud, el reembolso se procesa en 5–7 días hábiles dependiendo de tu banco." },
  { cat: "Garantía", q: "¿La garantía aplica a suscripciones activas?", a: "La garantía de 30 días aplica solo al primer pedido por cliente. Los ciclos subsecuentes de suscripción no están cubiertos por la garantía." },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: { cat: string; q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "bg-white border-[#3CBFAB]/25 shadow-[0_4px_20px_rgba(60,191,171,0.1)]" : "bg-white border-[#0D1B35]/8 hover:border-[#3CBFAB]/20"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className={`home-item-title leading-snug ${isOpen ? "text-teal" : "text-ocean"}`}>{faq.q}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${isOpen ? "bg-[#3CBFAB]" : "bg-[#0D1B35]/8"}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke={isOpen ? "white" : "#0D1B35"} strokeWidth="1.5" strokeLinecap="round" /></svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}>
            <div className="px-5 pb-5"><div className="h-px bg-[#3CBFAB]/15 mb-4" /><p className="home-body">{faq.a}</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [active, setActive] = useState("Todas");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = active === "Todas" ? faqs : faqs.filter((f) => f.cat === active);

  return (
    <>
      <Navbar lightBg />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center" style={{ background: "#FEF7ED" }}>
          <div className="max-w-2xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="home-section-eyebrow">Soporte</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="home-section-title text-ocean">Preguntas frecuentes</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="home-section-subtitle">Todo lo que necesitas saber sobre NovaPatch.</motion.p>
          </div>
        </section>

        {/* FAQ content */}
        <section className="py-16 px-6 bg-[#FAF7F2]">
          <div className="max-w-4xl mx-auto">
            {/* Category tabs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2 justify-center mb-12">
              {categories.map((cat) => (
                <button key={cat} onClick={() => { setActive(cat); setOpenIdx(null); }}
                  className={`home-body rounded-xl px-5 py-2 font-semibold transition-all duration-200 ${active === cat ? "bg-[#3CBFAB] text-white shadow-[0_4px_12px_rgba(60,191,171,0.25)]" : "border border-[#0D1B35]/10 bg-white text-[#6B7280] hover:border-[#3CBFAB]/30 hover:text-teal"}`}>
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* FAQ list */}
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="flex flex-col gap-3 mb-16">
                {filtered.map((faq, i) => (
                  <FAQItem key={`${active}-${i}`} faq={faq} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <div className="bg-[#F8EDEB] rounded-3xl p-8 text-center border border-[#005088]/15">
              <h3 className="home-item-title text-ocean mb-2">¿No encontraste tu respuesta?</h3>
              <p className="home-body mb-6">Nuestro equipo responde en menos de 24h en días hábiles.</p>
              <Link href="/contacto"
                className="inline-flex items-center gap-2 rounded-full bg-[#3CBFAB] px-8 py-4 font-bold text-white shadow-[0_4px_20px_rgba(60,191,171,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2da898] hover:shadow-[0_8px_32px_rgba(60,191,171,0.4)] active:scale-[0.97]">
                Contáctanos
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
