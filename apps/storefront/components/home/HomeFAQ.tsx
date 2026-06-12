"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

const faqs = [
  {
    q: "¿Cómo funcionan los parches Novapatch?",
    a: "Los parches Novapatch liberan sus ingredientes activos directamente a través de la piel hacia el torrente sanguíneo. A diferencia de las cápsulas orales, la absorción es gradual y constante durante 10 a 12 horas, evitando los picos y caídas de concentración.",
  },
  {
    q: "¿Cuánto tiempo tarda en hacer efecto?",
    a: "La absorción comienza en los primeros 30–60 minutos tras la aplicación. Para resultados óptimos recomendamos el uso constante durante al menos 2–3 semanas. Algunos usuarios reportan mejoras notables desde el primer día.",
  },
  {
    q: "¿Puedo usar más de un parche a la vez?",
    a: "Sí, puedes usar más de un parche simultáneamente siempre que sean de fórmulas diferentes. Los ingredientes de cada parche son complementarios y han sido formulados para usarse de forma segura en combinación. Consulta con tu médico si tienes condiciones específicas.",
  },
  {
    q: "¿Cómo funciona la suscripción?",
    a: "Elige la frecuencia (30, 60 o 90 días) y recibe tu caja automáticamente con hasta un 20% de descuento. Puedes pausar, cambiar de plan o cancelar en cualquier momento desde tu cuenta, sin penalizaciones ni contratos.",
  },
  {
    q: "¿Qué pasa si no estoy satisfecho con mi compra?",
    a: "Ofrecemos una garantía de satisfacción de 30 días. Si no estás conforme, completa el formulario de reembolso en novapatch.care/reembolso — es rápido y nuestro equipo revisará tu caso en 2 a 5 días hábiles. Te devolvemos el 100% del valor del primer pedido, sin complicaciones.",
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
  const triggerId = `faq-trigger-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <div className="border-b border-gray-200">
      <button
        id={triggerId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex justify-between items-center gap-4 text-left transition-colors duration-150 hover:text-ocean focus-visible:outline-none focus-visible:text-ocean home-item-title"
        style={{ padding: "22px 0" }}
      >
        <span>{faq.q}</span>
        <span
          aria-hidden="true"
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 text-[18px] font-normal leading-none transition-all duration-[250ms]"
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
            style={{ paddingBottom: isOpen ? "20px" : "0px", paddingRight: "48px", transition: "padding-bottom 0.35s" }}
          >
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomeFAQ() {
  const t = useTranslations("home.faq");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white px-5 sm:px-8 md:px-12 py-20">
      <div className="max-w-[600px] mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="home-section-eyebrow">
            {t("badge")}
          </p>
          <h2 className="home-section-title text-ocean">
            {t("title")}
          </h2>
        </motion.div>
      </div>

      <div className="max-w-[720px] mx-auto">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            id={String(i)}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="home-body mb-5">¿No encontraste lo que buscabas?</p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-[15px] transition-all duration-200 hover:-translate-y-0.5 bg-ocean hover:bg-ocean-dark shadow-[0_4px_16px_rgba(0,80,136,0.3)]"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </section>
  );
}
