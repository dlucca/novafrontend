"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "¿Cuándo se hace el primer cobro?",
    a: "Al confirmar tu suscripción. Después, cada producto se factura según la frecuencia que elegiste.",
  },
  {
    q: "¿Puedo cambiar mis productos o mi frecuencia?",
    a: "Sí. Desde tu cuenta puedes ajustar qué parches recibes y cada cuánto, antes del próximo envío.",
  },
  {
    q: "¿Cómo pauso o cancelo?",
    a: "Desde tu perfil, con un clic. Sin llamadas, sin penalizaciones y sin permanencia mínima.",
  },
  {
    q: "¿Cuál es la diferencia de descuento entre frecuencias?",
    a: "Mensual (30 días): 20% off. Bimestral (60 días): 15% off. Trimestral (90 días): 10% off.",
  },
  {
    q: "¿Todos mis productos llegan juntos?",
    a: "No necesariamente. Cada parche tiene su propio ciclo, así recibes lo que necesitas cuando lo necesitas.",
  },
];

export default function SubscriptionsFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#E6E1D8] border-y border-[#E6E1D8]">
      {faqs.map((faq, i) => (
        <div key={faq.q} className="py-5 text-left">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between text-left group cursor-pointer"
          >
            <span className="text-base sm:text-lg font-sans font-semibold text-[#0F0F0F] group-hover:text-[#3A3A37] transition-colors">
              {faq.q}
            </span>
            <span className="shrink-0 w-6 h-6 rounded-full border border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-center font-mono text-xs text-[#0F0F0F]">
              {open === i ? "−" : "+"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pt-3 text-xs sm:text-sm font-sans font-normal text-[#3A3A37] leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
