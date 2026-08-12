"use client";

import { motion } from "framer-motion";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-[#1ec8c8] flex-shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-coral flex-shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
}

export default function ComparisonBlock() {
  return (
    <section className="py-20 bg-[#FAF7F2] border-y border-stone-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.15em] text-[#1a4b8c] uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
            DIFERENCIA TRANSDÉRMICA
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0D1B35] mt-4 tracking-tight">
            ¿Por qué un parche?
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto mt-3 text-base md:text-lg">
            La forma más directa y constante de absorber nutrientes, sin pasar por tu sistema digestivo.
          </p>
        </div>

        {/* Side-by-side grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Traditional pills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-stone-200/60 shadow-[0_4px_24px_rgba(13,27,53,0.02)]"
          >
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-widest block mb-1">
              SUPLEMENTOS COMUNES
            </span>
            <h3 className="text-2xl font-black text-[#0D1B35] mb-6">
              Pastillas y Gomitas
            </h3>

            <ul className="flex flex-col gap-5">
              <li className="flex gap-3.5 items-start">
                <CrossIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">Pasan por la digestión</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">Los ácidos gástricos destruyen parte de los ingredientes antes de absorberlos.</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <CrossIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">Liberación en un pico</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">El cuerpo procesa todo el suplemento de golpe, eliminando rápidamente el exceso.</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <CrossIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">Alto contenido de azúcar</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">Muchas gomitas comerciales contienen azúcares, jarabes y colorantes innecesarios.</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <CrossIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">Constancia difícil</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">Olvidarse el frasco en el cajón es el motivo número uno del abandono de hábitos.</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Novapatch */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 border-2 border-[#1a4b8c]/20 shadow-[0_8px_30px_rgba(26,75,140,0.06)] relative overflow-hidden"
          >
            {/* Spotlight blur */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#1ec8c8]/10 filter blur-2xl rounded-full" />

            <span className="text-xs font-extrabold text-[#1a4b8c] uppercase tracking-widest block mb-1">
              LA NUEVA ALTERNATIVA
            </span>
            <h3 className="text-2xl font-black text-[#0D1B35] mb-6 flex items-center gap-2">
              Parches Novapatch
            </h3>

            <ul className="flex flex-col gap-5">
              <li className="flex gap-3.5 items-start">
                <CheckIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">Absorción directa</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">Los ingredientes atraviesan las capas de la piel directo al torrente sanguíneo.</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <CheckIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">Liberación constante 8-12h</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">Una dosificación continua sin picos elevados ni caídas abruptas de efectividad.</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <CheckIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">0% azúcar, 100% vegano</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">Fórmulas puras, hipoalergénicas y totalmente libres de rellenos sintéticos.</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <CheckIcon />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D1B35]">Se integra a tu día (Fricción Cero)</h4>
                  <p className="text-stone-500 text-xs md:text-sm mt-0.5">Te lo pegas por la mañana y te olvidas. Resistente al agua, duchas y entrenamientos.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
