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
    <div className="py-5 border-b border-[#E6E1D8]">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer">
        <span className="font-sans font-semibold text-base text-[#0F0F0F] leading-snug group-hover:text-[#3A3A37] transition-colors">{faq.q}</span>
        <span className="shrink-0 w-6 h-6 rounded-full border border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-center font-mono text-xs text-[#0F0F0F]">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }} className="overflow-hidden">
            <p className="pt-3 font-sans text-sm text-[#3A3A37] leading-relaxed">{faq.a}</p>
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
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* Hero Stage */}
        <section className="pt-32 pb-16 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div className="bg-white rounded-xl border border-[#E6E1D8] p-8 sm:p-14 text-left shadow-2xs">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-3">centro de ayuda</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-4">preguntas frecuentes.</motion.h1>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
              className="font-sans text-base sm:text-lg text-[#3A3A37] max-w-xl leading-relaxed">Todo lo que necesitas saber sobre el uso, envíos, pagos y garantía de Novapatch.</motion.p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          {/* Category tabs */}
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActive(cat); setOpenIdx(null); }}
                className={`text-xs font-sans font-medium uppercase tracking-[0.12em] px-4 py-2.5 rounded-full transition-all cursor-pointer ${
                  active === cat
                    ? "bg-[#0F0F0F] text-white border border-[#0F0F0F]"
                    : "bg-white text-[#3A3A37] border border-[#E6E1D8] hover:border-[#0F0F0F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="max-w-4xl mx-auto border-t border-[#E6E1D8]">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {filtered.map((faq, i) => (
                  <FAQItem key={`${active}-${i}`} faq={faq} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Contact Box */}
          <div className="mt-12 p-6 sm:p-8 rounded-xl bg-white border border-[#E6E1D8] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-display font-semibold text-xl text-[#0F0F0F] lowercase mb-1">¿no encontraste tu respuesta?</h3>
              <p className="font-sans text-xs text-[#3A3A37]">Nuestro equipo te responderá en menos de 24h en días hábiles.</p>
            </div>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-6 py-3.5 rounded-full transition-all shrink-0"
            >
              Contáctanos
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
