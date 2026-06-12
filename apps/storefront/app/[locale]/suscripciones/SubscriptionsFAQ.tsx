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

function FAQItem({
  faq,
  id,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  id: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const triggerId = `sub-faq-trigger-${id}`;
  const panelId = `sub-faq-panel-${id}`;

  return (
    <div className="border-b border-gray-200">
      <button
        id={triggerId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="home-item-title flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-ocean focus-visible:outline-none focus-visible:text-ocean"
      >
        <span>{faq.q}</span>
        <span
          aria-hidden="true"
          className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full text-lg font-normal leading-none transition-all duration-[250ms]"
          style={{
            background: isOpen ? "var(--color-ocean)" : "#F3F4F6",
            color: isOpen ? "white" : "var(--color-ocean)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className="grid transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className="home-body"
            style={{
              paddingBottom: isOpen ? "20px" : "0px",
              paddingRight: "48px",
              transition: "padding-bottom 0.35s",
            }}
          >
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionsFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {faqs.map((faq, i) => (
        <FAQItem
          key={faq.q}
          faq={faq}
          id={String(i)}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}
