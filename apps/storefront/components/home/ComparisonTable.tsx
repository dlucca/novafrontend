import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import ComparisonImage from "./ComparisonImage";

const rows = [
  { feature: "Alta tasa de absorción", nova: true, caps: false, gummies: false, powders: false, sprays: false },
  { feature: "Sin pastillas difíciles de tragar", nova: true, caps: false, gummies: true, powders: true, sprays: true },
  { feature: "Sin azúcar ni calorías", nova: true, caps: true, gummies: false, powders: true, sprays: true },
  { feature: "Sin colorantes ni rellenos artificiales", nova: true, caps: false, gummies: false, powders: false, sprays: false },
  { feature: "No afecta tu sistema digestivo", nova: true, caps: false, gummies: false, powders: false, sprays: true },
];

function Check({ ok }: { ok: boolean }) {
  if (ok) {
    return (
      <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[20px] sm:h-[20px]">
        <circle cx="11" cy="11" r="10" fill="#0F0F0F" />
        <path d="M6.5 11.2l3 3 6-6" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[20px] sm:h-[20px]">
      <circle cx="11" cy="11" r="10" fill="#E6E1D8" fillOpacity="0.6" />
      <path d="M8 8l6 6M14 8l-6 6" stroke="#A8A29A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default async function ComparisonTable() {
  const t = await getTranslations("home.comparison");
  return (
    <section className="bg-[#FAF8F5] py-16 sm:py-24 border-t border-[#E6E1D8]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        {/* Header text - Brand Kit V2 Eyebrow + Open Sauce Sans H2 */}
        <FadeIn>
          <div className="text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
              novapatch vs otros suplementos.
            </h2>
          </div>
        </FadeIn>

        {/* Two-column layout: table left (2/3), image right (1/3) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Table */}
          <FadeIn
            x={-40}
            y={0}
            duration={0.7}
            delay={0.1}
            className="lg:col-span-8"
          >
            <div className="rounded-xl overflow-hidden border border-[#E6E1D8] bg-white h-full flex flex-col overflow-x-auto shadow-2xs">

              {/* Header row */}
              <div className="grid border-b border-[#E6E1D8] [grid-template-columns:1fr_44px_44px_44px_44px_44px] sm:[grid-template-columns:1fr_64px_64px_64px_64px_64px] md:[grid-template-columns:1fr_88px_88px_88px_88px_88px]">
                {/* Feature label */}
                <div className="px-2.5 sm:px-4 py-3 sm:py-4 text-[10px] sm:text-[12px] font-sans font-medium uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[#A8A29A] flex items-end">
                  <span className="hidden sm:inline">Características</span>
                  <span className="sm:hidden">Beneficios</span>
                </div>

                {/* Novapatch */}
                <div
                  className="py-2.5 sm:py-4 px-0.5 flex flex-col items-center justify-end gap-1 bg-[#0F0F0F] text-[#FAF8F5]"
                >
                  <Image
                    src="/logos/logo.webp"
                    alt="Novapatch"
                    width={48}
                    height={16}
                    className="h-3 sm:h-4 w-auto object-contain brightness-0 invert"
                  />
                  <span className="text-[8.5px] sm:text-[10px] font-sans font-semibold uppercase tracking-wider text-white">Parche</span>
                </div>

                {/* Cápsulas */}
                <div className="py-3 sm:py-4 px-0.5 flex flex-col items-center justify-end gap-1.5 border-r border-[#E6E1D8]/60">
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 opacity-40">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      fill="#0F0F0F"
                      d="M44.59 3.38c4.29 4.39 4.36 11.36 0.2 15.86L20 44.05C8.85 53.7-5.92 38.94 3.73 27.78L28.52 2.98C33.15-1.27 40.2-1.11 44.59 3.38zm-1.34 14.14c7.24-8.62-3.65-20.09-12.64-13.32L18.58 16.15l13.03 13.03zm-25.79 25.63c.33-.23.62-.52.94-.75L29.92 31l-13.03-13.03-11.52 11.52c-7.38 8.05 3.06 20.17 12.09 13.79z"
                    />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-sans font-normal text-[#3A3A37]">Cápsulas</span>
                </div>

                {/* Gomitas */}
                <div className="py-3 sm:py-4 px-0.5 flex flex-col items-center justify-end gap-1.5 border-r border-[#E6E1D8]/60">
                  <Image
                    src="/comparison/bear.svg"
                    alt="Gomitas"
                    width={20}
                    height={20}
                    className="h-4 sm:h-5 w-auto opacity-40 grayscale"
                  />
                  <span className="text-[10px] sm:text-[11px] font-sans font-normal text-[#3A3A37]">Gomitas</span>
                </div>

                {/* Polvos */}
                <div className="py-3 sm:py-4 px-0.5 flex flex-col items-center justify-end gap-1.5 border-r border-[#E6E1D8]/60">
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 opacity-40">
                    <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" fill="#0F0F0F" fillOpacity="0.2" stroke="#0F0F0F" strokeWidth="2.5" />
                    <path d="M16 30c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="24" cy="18" r="3" fill="#0F0F0F" />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-sans font-normal text-[#3A3A37]">Polvos</span>
                </div>

                {/* Sprays & Cremas */}
                <div className="py-3 sm:py-4 px-0.5 flex flex-col items-center justify-end gap-1.5">
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 opacity-40">
                    <rect x="14" y="20" width="16" height="22" rx="4" fill="#0F0F0F" fillOpacity="0.2" stroke="#0F0F0F" strokeWidth="2.5" />
                    <path d="M22 20v-6h6v6" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28 14h4" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M32 11v6" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M20 28h8M20 34h8" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                  </svg>
                  <span className="text-[9px] sm:text-[10px] font-sans font-normal text-[#3A3A37] text-center leading-tight">Sprays &<br />Cremas</span>
                </div>
              </div>

              {/* Data rows */}
              {rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid border-b border-[#E6E1D8]/60 last:border-b-0 [grid-template-columns:1fr_44px_44px_44px_44px_44px] sm:[grid-template-columns:1fr_64px_64px_64px_64px_64px] md:[grid-template-columns:1fr_88px_88px_88px_88px_88px] ${i % 2 === 1 ? "bg-[#FAF8F5]/50" : "bg-white"}`}
                >
                  <div className="px-2.5 sm:px-4 py-3 sm:py-4 text-[11.5px] sm:text-[13px] md:text-[14px] font-sans font-normal text-[#0F0F0F] flex items-center leading-snug">
                    {row.feature}
                  </div>
                  <div className="py-3 sm:py-4 flex items-center justify-center bg-[#0F0F0F]/5 border-x border-[#E6E1D8]/40">
                    <Check ok={row.nova} />
                  </div>
                  <div className="py-3 sm:py-4 flex items-center justify-center">
                    <Check ok={row.caps} />
                  </div>
                  <div className="py-3 sm:py-4 flex items-center justify-center">
                    <Check ok={row.gummies} />
                  </div>
                  <div className="py-3 sm:py-4 flex items-center justify-center">
                    <Check ok={row.powders} />
                  </div>
                  <div className="py-3 sm:py-4 flex items-center justify-center">
                    <Check ok={row.sprays} />
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Image + Editorial Bubble */}
          <FadeIn
            x={40}
            y={0}
            duration={0.7}
            delay={0.15}
            className="lg:col-span-4 h-full"
          >
            <ComparisonImage />
          </FadeIn>
        </div>

        {/* Closing Editorial Quote (Brand Kit V2 — Open Sauce Sans, Left Aligned) */}
        <FadeIn
          y={20}
          delay={0.25}
          duration={0.6}
          className="mt-16 sm:mt-24 w-full text-left"
        >
          <p className="font-sans font-medium text-lg sm:text-2xl text-[#3A3A37] leading-relaxed mb-2">
            lo simple se repite. lo complejo se abandona.
          </p>
          <h3 className="font-sans font-bold text-2xl sm:text-4xl text-[#0F0F0F] tracking-[-0.03em] lowercase">
            novapatch está diseñado para ser el hábito que sí se sostiene.
          </h3>
        </FadeIn>
      </div>
    </section>
  );
}
