"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "@/lib/i18n-navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Droplets,
  Clock,
  CheckCircle2,
  XCircle,
  Layers,
  FlaskConical,
  Activity,
  ArrowRight,
  HeartHandshake,
  Dna,
  Sparkles,
} from "lucide-react";

const fade = (delay = 0, yOffset = 22) => ({
  initial: { opacity: 0, y: yOffset },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
});

// ── Anatomía del Parche: 4 Capas ──────────────────────────────────────────────
const PATCH_LAYERS = [
  {
    id: "layer-1",
    number: "01",
    name: "Capa Impermeable de Protección",
    subtitle: "Malla Respirable Flex-Shield",
    icon: ShieldCheck,
    description:
      "Sustrato microporoso ultra-delgado y flexible con ajuste ergonómico. Aísla la fórmula de la humedad externa, agua de la ducha y el roce con la ropa mientras permite que la piel respire con libertad.",
    highlight: "Sella la matriz y evita la evaporación de los ingredientes activos.",
  },
  {
    id: "layer-2",
    number: "02",
    name: "Matriz de Nutrientes Seleccionados",
    subtitle: "Reservorio de Extractos Botánicos & Vitaminas",
    icon: FlaskConical,
    description:
      "Capa homogénea donde se concentran extractos botánicos, vitaminas y minerales micronizados (< 500 Daltons) minuciosamente seleccionados para su compatibilidad cutánea.",
    highlight: "Distribución uniforme de la fórmula en toda la superficie del parche.",
  },
  {
    id: "layer-3",
    number: "03",
    name: "Capa de Liberación Sostenida",
    subtitle: "Liberación Gradual Continua (8-12h)",
    icon: Clock,
    description:
      "Estructura inteligente que controla el flujo progresivo de la fórmula a través de los poros a velocidad uniforme durante un período recomendado de 8 a 12 horas.",
    highlight: "Evita los picos repentinos y proporciona un acompañamiento constante.",
  },
  {
    id: "layer-4",
    number: "04",
    name: "Adhesivo Cutáneo Hipoalergénico",
    subtitle: "Fijación Suave Libre de Látex",
    icon: HeartHandshake,
    description:
      "Adhesivo dérmico libre de látex, parabenos y fragancias sintéticas. Formulado para respetar el pH natural de la piel, mantenerse firme durante el día y retirarse sin dolor ni residuos.",
    highlight: "Excelente tolerabilidad para uso diario incluso en pieles delicadas.",
  },
];

// ── Tabla Comparativa: Pastillas vs Parches ──────────────────────────────────
const COMPARISON_ITEMS = [
  {
    feature: "Forma de Aplicación",
    pill: "Vía digestiva (requiere tragar cápsulas o gomitas)",
    patch: "Vía tópica (se adhiere directamente a la piel)",
  },
  {
    feature: "Aprovechamiento del Nutriente",
    pill: "Sujeto a degradación por ácidos digestivos",
    patch: "Absorción directa y limpia a través de la piel",
  },
  {
    feature: "Carga Digestiva & Estomacal",
    pill: "Exige descomposición por procesos digestivos",
    patch: "0% carga digestiva (liberación limpia y constante)",
  },
  {
    feature: "Duración de la Entrega",
    pill: "Picos rápidos y caídas bruscas en pocas horas",
    patch: "Entrega constante y gradual durante 8 a 12 horas",
  },
  {
    feature: "Fricción en la Rutina",
    pill: "Requiere agua, horarios rígidos y sabor desagradable",
    patch: "Un solo gesto diario: pega, olvida y sigue con tu día",
  },
];

// ── FAQ Científico ───────────────────────────────────────────────────────────
const SCIENCE_FAQS = [
  {
    question: "¿Cómo funciona la tecnología de parches tópicos?",
    answer:
      "Los parches de liberación tópica permiten que los ingredientes activos micronizados atraviesen suavemente la capa exterior de la piel. Al adherirse, el calor corporal y la matriz del parche facilitan la difusión continua de los nutrientes durante 8 a 12 horas de manera limpia y constante.",
  },
  {
    question: "¿Qué es la regla de los 500 Daltons?",
    answer:
      "Es un principio de formulación que establece que solo las moléculas de tamaño molecular pequeño (menor a 500 Daltons) son idóneas para ser absorbidas a través de la piel. En Novapatch seleccionamos e integramos únicamente ingredientes que cumplen con este criterio para asegurar un formato verdaderamente práctico y funcional.",
  },
  {
    question: "¿Por qué muchas personas prefieren parches sobre cápsulas o gomitas?",
    answer:
      "Principalmente por la constancia y la comodidad. Las cápsulas tradicionales requieren agua, pueden causar pesadez digestiva y contienen aglutinantes. Las gomitas suelen sumar azúcar innecesaria. El parche es un hábito de fricción cero: sin azúcar, sin sabor y sin alterar tu digestión.",
  },
  {
    question: "¿Es seguro usar un parche Novapatch todos los días?",
    answer:
      "Sí. Todos nuestros parches utilizan adhesivos hipoalergénicos libres de látex y parabenos. Están diseñados para acompañar tu rutina diaria de bienestar de forma suave y sin interrumpir tus actividades normales.",
  },
  {
    question: "¿Puedo usar dos fórmulas distintas al mismo tiempo?",
    answer:
      "Sí, puedes combinar fórmulas complementarias (por ejemplo, Energy por la mañana y Sleep antes de acostarte) colocándolas en zonas limpias y secas del cuerpo como antebrazos, hombros o espalda alta.",
  },
  {
    question: "¿Qué pasa si me ducho o hago ejercicio con el parche?",
    answer:
      "La capa protectora Flex-Shield está formulada para resistir el agua de la ducha y la sudoración habitual durante el entrenamiento, manteniendo el parche seguro en su lugar.",
  },
];

// ── Atributos Canónicos de Marca ──────────────────────────────────────────────
const BRAND_PILLARS = [
  {
    title: "100% Vegano",
    subtitle: "Sin ingredientes de origen animal",
    icon: "/features/vegan-cropped.svg",
  },
  {
    title: "Sin Azúcar",
    subtitle: "No altera la glucemia ni suma calorías",
    icon: "/features/not_sugar-cropped.svg",
  },
  {
    title: "Libre de Gluten",
    subtitle: "Apto para personas con sensibilidades",
    icon: "/features/gluten_free-cropped.svg",
  },
  {
    title: "Sin Látex",
    subtitle: "Adhesivo hipoalergénico suave con la piel",
    icon: "/features/not_latex-cropped.svg",
  },
  {
    title: "Resistente al Agua",
    subtitle: "Sostiene el ritmo en la ducha y el ejercicio",
    icon: "/features/water_proo-cropped.svg",
  },
  {
    title: "Formato Práctico",
    subtitle: "Un solo gesto diario sin necesidad de agua",
    icon: "/features/easy_format.svg",
  },
];

export default function CienciaPage() {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroImageScale = useTransform(heroScroll, [0, 0.6], [1.18, 1.0]);

  const { scrollYProgress: bannerScroll } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  const bannerImageScale = useTransform(bannerScroll, [0, 0.6], [1.18, 1.0]);

  const { scrollYProgress: pillarsScroll } = useScroll({
    target: pillarsRef,
    offset: ["start end", "end start"],
  });
  const pillarsImageScale = useTransform(pillarsScroll, [0, 0.6], [1.18, 1.0]);

  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* ── 1. HERO ────────────────────────────────────────────────── */}
        <section className="pt-24 pb-8 px-4 sm:px-8 max-w-[1400px] mx-auto">
          <div
            ref={heroRef}
            className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0F0F0F] shadow-[0_8px_30px_rgba(15,15,15,0.05)] border border-[#E6E1D8] flex flex-col justify-end p-6 sm:p-10 lg:p-14 text-left"
          >
            {/* Background Image with Scroll-Driven Scale */}
            <motion.div style={{ scale: heroImageScale }} className="absolute inset-0">
              <Image
                src="/productusers/Hero_ciencia.webp"
                alt="Absorción tópica Novapatch en uso real"
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-center"
              />
            </motion.div>

            {/* Gradient Overlay for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-[1]" />

            {/* Hero Content Over Image */}
            <div className="relative z-10 max-w-2xl text-white">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display font-semibold text-white tracking-[-0.035em] leading-tight lowercase text-3xl sm:text-4xl lg:text-5xl mb-4"
              >
                bienestar, en su versión más simple.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-sans font-normal text-sm sm:text-base lg:text-lg text-white/90 max-w-xl leading-relaxed"
              >
                Un formato pensado para adaptarse a tu día a día, no para complicarlo. Sin cápsulas difíciles de tragar, sin acidez estomacal y sin rutinas complejas que cuesta sostener.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ── 2. DISEÑADOS PARA LA VIDA REAL ─────────────────────────── */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column */}
            <motion.div {...fade(0)} className="lg:col-span-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-4">
                diseñados para la vida real.
              </h2>
              <p className="font-sans font-normal text-base sm:text-lg text-[#3A3A37] leading-relaxed">
                Desarrollados con un enfoque absoluto en la simplicidad, la constancia y el uso cotidiano.
              </p>
            </motion.div>

            {/* Right Column */}
            <motion.div {...fade(0.12)} className="lg:col-span-7 space-y-6">
              <p className="font-sans font-normal text-base sm:text-lg text-[#3A3A37] leading-relaxed">
                Mientras la mayoría de los productos de bienestar dependen de rutinas complicadas y cápsulas difíciles de sostener, creamos algo diferente: una forma más simple y práctica de acompañar tu día.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center shrink-0 mt-0.5 font-sans font-medium text-xs">
                    ✓
                  </div>
                  <p className="font-sans text-sm sm:text-base text-[#3A3A37] leading-normal">
                    <strong className="font-semibold text-[#0F0F0F]">Únicos en su diseño</strong> – creados enfocándonos en la comodidad, la facilidad de uso y la vida cotidiana.
                  </p>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center shrink-0 mt-0.5 font-sans font-medium text-xs">
                    ✓
                  </div>
                  <p className="font-sans text-sm sm:text-base text-[#3A3A37] leading-normal">
                    <strong className="font-semibold text-[#0F0F0F]">Únicos en su formato</strong> – una solución que se adhiere directamente a tu piel y se integra de forma invisible a tu rutina.
                  </p>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center shrink-0 mt-0.5 font-sans font-medium text-xs">
                    ✓
                  </div>
                  <p className="font-sans text-sm sm:text-base text-[#3A3A37] leading-normal">
                    <strong className="font-semibold text-[#0F0F0F]">Únicos en su simplicidad</strong> – solo despegas, pegas y sigues con tu día.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6E1D8]">
                <p className="font-display font-semibold text-xl sm:text-2xl text-[#0F0F0F] tracking-[-0.03em] lowercase">
                  no se trata de hacer más. se trata de hacer que el bienestar sea fácil de sostener.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 3. BANNER "ES SIMPLE" (Foto Protagonista Full-Bleed con Texto Superpuesto) ── */}
        <section className="py-12 sm:py-16 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div
            ref={bannerRef}
            className="relative w-full min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0F0F0F] border border-[#E6E1D8] shadow-2xs flex flex-col justify-end p-8 sm:p-12 lg:p-16 text-left"
          >
            {/* Background Image with Scroll-Driven Scale */}
            <motion.div style={{ scale: bannerImageScale }} className="absolute inset-0">
              <Image
                src="/productusers/Banner_ciencia.webp"
                alt="Aplicación sencilla del parche Novapatch"
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-center"
              />
            </motion.div>

            {/* Dark Gradient Overlay for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25 z-[1]" />

            {/* Hero Text Content Layer */}
            <div className="relative z-10 max-w-3xl">
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-white tracking-[-0.035em] leading-tight lowercase mb-4">
                es simple.
              </h3>

              {/* Quick Negative Pills */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-sans font-medium text-white shadow-2xs">
                  <span className="text-stone-400">✕</span> Sin pastillas
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-sans font-medium text-white shadow-2xs">
                  <span className="text-stone-400">✕</span> Sin polvos
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-sans font-medium text-white shadow-2xs">
                  <span className="text-stone-400">✕</span> Sin rutinas complicadas
                </span>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-sans font-semibold text-white mb-2">
                  Pega, olvida y sigue con tu día.
                </h4>
                <p className="font-sans font-normal text-sm sm:text-base text-stone-200 leading-relaxed max-w-2xl">
                  Novapatch está diseñado para hacer que el bienestar diario no requiera esfuerzo. Un formato simple que se adhiere a tu piel y se integra de forma invisible a tu jornada. Lo aplicas una vez y continúas con lo que realmente importa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. LA REGLA DE LOS 500 DALTONS ────────────────────────── */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left: Content */}
            <motion.div {...fade(0)} className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-6">
                la regla de los 500 daltons: diseñado para la piel.
              </h2>
              <p className="font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed mb-4">
                No cualquier ingrediente es adecuado para un parche. En ciencia cosmética existe un principio técnico conocido como la <strong className="font-semibold text-[#0F0F0F]">Regla de los 500 Daltons</strong>: solo las moléculas cuyo tamaño molecular es inferior a 500 Da pueden penetrar la barrera exterior de la piel de forma pasiva.
              </p>
              <p className="font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed">
                Por eso en Novapatch diseñamos cada fórmula desde cero para la absorción tópica de liberación continua, seleccionando vitaminas y extractos botánicos micronizados de alta compatibilidad cutánea.
              </p>
            </motion.div>

            {/* Right: Graphic Box (Clear Visual Explanation of 500 Daltons Rule) */}
            <motion.div {...fade(0.15)} className="lg:col-span-5">
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E6E1D8] shadow-2xs relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E6E1D8]">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] text-[#0F0F0F] flex items-center justify-center font-bold">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-base text-[#0F0F0F]">Calibración Molecular</h3>
                    <p className="text-xs font-mono text-[#A8A29A]">Absorción Tópica Sostenida</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Item 1: < 500 Daltons (Pasa) */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0F0F0F]" />
                        &lt; 500 Daltons (Novapatch)
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-[#0F0F0F]">Atraviesa la piel ✓</span>
                    </div>
                    <p className="text-xs font-sans text-[#3A3A37] leading-relaxed">
                      Moléculas micronizadas seleccionadas que atraviesan pasivamente la barrera cutánea durante 8 a 12 horas.
                    </p>
                  </div>

                  {/* Item 2: > 500 Daltons (No Pasa) */}
                  <div className="p-4 rounded-xl bg-white border border-[#E6E1D8] text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans font-medium uppercase tracking-[0.12em] text-[#A8A29A] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#A8A29A]" />
                        &gt; 500 Daltons (Macromoléculas)
                      </span>
                      <span className="text-[11px] font-mono text-[#A8A29A]">No atraviesa ✕</span>
                    </div>
                    <p className="text-xs font-sans text-[#A8A29A] leading-relaxed">
                      Moléculas demasiado grandes que quedan retenidas en la capa superficial sin ser aprovechadas.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E1D8] flex items-center justify-between text-xs font-sans text-[#3A3A37]">
                  <span>Fórmula Novapatch</span>
                  <span className="font-semibold font-mono text-[#0F0F0F]">100% Calibrada a &lt; 500 Da</span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── 5. ANATOMÍA DEL PARCHE (4 CAPAS INTERACTIVAS) ──────────── */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-3">
              anatomía de la matriz novapatch.
            </h2>
            <p className="font-sans font-normal text-base text-[#3A3A37] leading-relaxed">
              Cuatro capas diseñadas en armonía para asegurar protección externa, estabilidad de activos y liberación progresiva.
            </p>
          </div>

            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              {/* Left: Layer Selector Buttons */}
              <div className="lg:col-span-5 space-y-3">
                {PATCH_LAYERS.map((layer, index) => {
                  const isSelected = selectedLayer === index;

                  return (
                    <button
                      key={layer.id}
                      onClick={() => setSelectedLayer(index)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-200 border flex items-center gap-4 cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? "bg-[#FAF8F5] border-[#0F0F0F] shadow-2xs"
                          : "bg-white border-[#E6E1D8] hover:border-[#AEAEAF]"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors border"
                        style={{
                          backgroundColor: isSelected ? "#0F0F0F" : "#FFFFFF",
                          color: isSelected ? "#FFFFFF" : "#0F0F0F",
                          borderColor: isSelected ? "#0F0F0F" : "#E6E1D8",
                        }}
                      >
                        {layer.number}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-sans font-semibold text-sm sm:text-base text-[#0F0F0F] truncate">{layer.name}</h3>
                          {isSelected && <ArrowRight className="w-4 h-4 text-[#0F0F0F] shrink-0" />}
                        </div>
                        <p className="text-xs font-sans text-[#A8A29A]">{layer.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right: Active Layer Detail Card */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedLayer}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="bg-[#FAF8F5] rounded-xl p-6 sm:p-10 border border-[#E6E1D8] shadow-2xs h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-sans font-medium uppercase tracking-[0.12em] px-3 py-1 rounded-full bg-white border border-[#E6E1D8] text-[#0F0F0F]">
                          Capa {PATCH_LAYERS[selectedLayer].number} / 04
                        </span>
                        <Layers className="w-5 h-5 text-[#A8A29A]" />
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] lowercase mb-2">
                        {PATCH_LAYERS[selectedLayer].name}
                      </h3>
                      <p className="text-xs font-sans font-medium text-[#A8A29A] mb-6">
                        {PATCH_LAYERS[selectedLayer].subtitle}
                      </p>

                      <p className="font-sans font-normal text-sm sm:text-base text-[#3A3A37] leading-relaxed mb-8">
                        {PATCH_LAYERS[selectedLayer].description}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E6E1D8] flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#0F0F0F] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[10px] uppercase font-sans font-medium tracking-[0.12em] text-[#0F0F0F] block mb-1">
                          Beneficio Principal
                        </strong>
                        <span className="text-xs font-sans font-normal text-[#3A3A37]">
                          {PATCH_LAYERS[selectedLayer].highlight}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

        {/* ── 6. COMPARATIVA (PASTILLAS VS PARCHES) ───────────────────── */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-3">
              cápsulas tradicionales vs. tecnología novapatch.
            </h2>
            <p className="font-sans font-normal text-base text-[#3A3A37]">
              Por qué el formato influye en la constancia y la experiencia diaria.
            </p>
          </div>

          <motion.div {...fade(0.2)} className="bg-white rounded-xl border border-[#E6E1D8] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8]">
                    <th className="p-4 sm:p-5 text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] w-1/4">Atributo</th>
                    <th className="p-4 sm:p-5 text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[#A8A29A] w-3/8">Vía Oral (Cápsulas & Gomitas)</th>
                    <th className="p-4 sm:p-5 text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] bg-[#FAF8F5] w-3/8">Vía Tópica (Novapatch)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8]">
                  {COMPARISON_ITEMS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F5]/50 transition-colors">
                      <td className="p-4 sm:p-5 text-xs sm:text-sm font-sans font-semibold text-[#0F0F0F]">
                        {item.feature}
                      </td>
                      <td className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-[#A8A29A]">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-[#A8A29A] shrink-0 mt-0.5" />
                          <span>{item.pill}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-xs sm:text-sm font-sans font-medium text-[#0F0F0F] bg-[#FAF8F5]/40">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#0F0F0F] shrink-0 mt-0.5" />
                          <span>{item.patch}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* ── 7. ATRIBUTOS CANÓNICOS (Banner Protagonista con Foto Lifestyle & Iconos) ── */}
        <section className="py-12 sm:py-16 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div
            ref={pillarsRef}
            className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0F0F0F] border border-[#E6E1D8] shadow-2xs flex flex-col justify-end p-8 sm:p-12 lg:p-16 text-left"
          >
            {/* Full-Bleed Lifestyle Photo Stage with Scroll Scale Effect */}
            <motion.div style={{ scale: pillarsImageScale }} className="absolute inset-0">
              <Image
                src="/productusers/Banner_ciencia2.webp"
                alt="Novapatch en uso cotidiano"
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-center"
              />
            </motion.div>

            {/* Dark Gradient Overlay for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-[1]" />

            {/* Content Layer over Photo */}
            <div className="relative z-10 w-full">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-[-0.035em] leading-tight lowercase mb-3">
                atributos compartidos en cada parche.
              </h2>
              <p className="font-sans font-normal text-sm sm:text-base text-stone-300 max-w-xl mb-8 leading-relaxed">
                Estándares canónicos rigurosos aplicados a las seis fórmulas de Novapatch.
              </p>

              {/* 6 Features Grid with FeaturesBanner Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {BRAND_PILLARS.map((pillar, i) => (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex flex-col items-start justify-between h-full group hover:bg-black/60 transition-colors shadow-2xs"
                  >
                    <Image
                      src={pillar.icon}
                      alt={pillar.title}
                      width={28}
                      height={28}
                      className="w-6 h-6 object-contain brightness-0 invert opacity-90 mb-3"
                    />
                    <div>
                      <h3 className="font-sans font-semibold text-xs sm:text-sm text-white mb-1 leading-tight">{pillar.title}</h3>
                      <p className="text-[11px] font-sans text-stone-300 leading-tight">{pillar.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. PREGUNTAS FRECUENTES (FAQ de Ciencia) ───────────────── */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto text-left">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-3">
              preguntas sobre el formato tópico.
            </h2>
            <p className="font-sans font-normal text-base text-[#3A3A37]">
              Respuestas claras para incorporar Novapatch a tu día a día con total tranquilidad.
            </p>
          </div>

          <div className="divide-y divide-[#E6E1D8] border-y border-[#E6E1D8]">
            {SCIENCE_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`science-faq-panel-${index}`}
                    className="flex w-full items-center justify-between text-left group cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-sans font-semibold text-[#0F0F0F] group-hover:text-[#3A3A37] transition-colors">
                      {faq.question}
                    </span>
                    <span className="shrink-0 w-6 h-6 rounded-full border border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-center font-mono text-xs text-[#0F0F0F]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`science-faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-xs sm:text-sm font-sans font-normal text-[#3A3A37] leading-relaxed max-w-2xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 9. CTA BANNER FINAL ────────────────────────────────────── */}
        <section className="pb-24 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div className="rounded-xl p-8 sm:p-12 bg-white border border-[#E6E1D8] shadow-2xs text-center flex flex-col items-center gap-4 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase">
              pega, olvida y deja que trabaje.
            </h2>
            <p className="font-sans font-normal text-sm sm:text-base text-[#3A3A37] max-w-md">
              Descubre nuestras 6 fórmulas diseñadas para integrarse a tu ritmo de vida sin modificar tus hábitos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-2">
              <Link
                href="/tienda"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] px-8 py-4 text-[11px] font-sans font-medium uppercase tracking-[0.12em] transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                Ver Todos los Parches
              </Link>
              <Link
                href="/suscripciones"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white text-[#0F0F0F] border border-[#E6E1D8] hover:border-[#0F0F0F] px-8 py-4 text-[11px] font-sans font-medium uppercase tracking-[0.12em] transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                Suscríbete y Ahorra
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
