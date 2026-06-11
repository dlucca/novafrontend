"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const attrs = [
  { icon: "/features/not_sugar-cropped.svg", label: "Sin azúcar" },
  { icon: "/features/vegan-cropped.svg", label: "100% Vegano" },
  { icon: "/features/gluten_free-cropped.svg", label: "Libre de gluten" },
  { icon: "/features/water_proo-cropped.svg", label: "Resistente al agua" },
  { icon: "/features/not_latex-cropped.svg", label: "Sin látex" },
];

interface AttributeBarProps {
  accent: string;
}

export default function AttributeBar({ accent }: AttributeBarProps) {
  return (
    <motion.section
      animate={{ backgroundColor: accent }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full"
    >
      <div className="max-w-[1100px] mx-auto px-2 sm:px-8 lg:px-12 py-6 sm:py-8">

        {/* Attributes — siempre en una sola fila */}
        <div className="flex items-start justify-center gap-1 flex-nowrap">
          {attrs.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="flex flex-col items-center gap-2 sm:gap-2.5 min-w-0 flex-1"
            >
              {/* Icono más pequeño en móvil */}
              <div
                className="w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: "2px solid rgba(255, 255, 255, 0.8)" }}
              >
                <Image
                  src={a.icon}
                  alt={a.label}
                  width={28}
                  height={28}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain brightness-0 invert"
                />
              </div>

              {/* Texto más pequeño en móvil */}
              <span className="text-white text-[9px] sm:text-[11px] font-semibold text-center leading-tight max-w-[64px] sm:max-w-[68px]">
                {a.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}