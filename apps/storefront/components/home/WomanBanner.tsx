"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function WomanBanner() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";

  return (
    <section className="relative w-full min-h-[560px] sm:min-h-[640px] md:min-h-[700px] lg:min-h-[750px] flex items-center overflow-hidden bg-[#FAF7F2]">
      {/* Background Image Full Width */}
      <Image
        src="/productusers/bannerwoman.webp"
        alt="Novapatch Woman"
        fill
        className="object-cover object-top md:object-[center_top]"
        sizes="100vw"
        priority
      />

      {/* Light Cream Gradient Mask for Seamless Alignment with Website */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/85 to-transparent md:w-[62%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/50 to-transparent md:hidden" />

      {/* Content Container over Image */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full flex flex-col items-start"
      >
        <span className="inline-block text-xs font-black tracking-[0.18em] uppercase text-[#9B489A] bg-[#c693c4]/15 border border-[#c693c4]/30 px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-sm">
          NOVAPATCH WOMAN
        </span>

        {/* Título de 3 líneas con acento token #9B489A */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0D1B35] leading-[1.1] tracking-tight mb-4 uppercase max-w-2xl">
          Sigue tu ritmo.<br />
          <span className="text-[#9B489A]">Siente tu bienestar.</span><br />
          Disfruta tus días.
        </h2>

        {/* Descripción */}
        <p className="text-stone-600 max-w-lg mb-8 leading-relaxed text-sm md:text-base font-medium">
          Conoce el parche Woman de Novapatch — diseñado para acompañar el día a día de tus ciclos y apoyar tu bienestar femenino de forma natural.
        </p>

        {/* Botón Principal */}
        <Link
          href={`/${locale}/tienda/woman`}
          className="inline-flex items-center justify-center bg-[#0D1B35] hover:bg-[#1D3461] text-white px-8 py-3.5 rounded-full text-sm md:text-[15px] font-bold transition-all hover:-translate-y-0.5 active:scale-[0.98] duration-200 shadow-md"
        >
          Conoce Novapatch Woman
        </Link>
      </motion.div>
    </section>
  );
}
