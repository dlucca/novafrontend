import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";

export default async function HowItWorks() {
  const t = await getTranslations("home.howItWorks");

  const steps = [
    { n: 1, title: t("step1Title"), desc: t("step1Desc") },
    { n: 2, title: t("step2Title"), desc: t("step2Desc") },
    { n: 3, title: t("step3Title"), desc: t("step3Desc") },
  ];
  return (
    <section id="como-funciona" className="bg-white py-16 sm:py-20 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image — left */}
        <FadeIn
          x={-40}
          y={0}
          duration={0.7}
          className="relative rounded-[48px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
        >
          <div className="relative w-full" style={{ height: "480px" }}>
            <Image
              src="/productusers/bellypatch.webp"
              alt="Cómo usar Novapatch"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Badge — 30-day grid */}
          <div
            className="absolute top-7 right-7 rounded-[20px] p-4 flex flex-col items-center gap-2.5 border border-white/40"
            style={{ 
              background: "rgba(255, 255, 255, 0.3)", 
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)" 
            }}
          >
            {/* 5 × 6 grid — one square per day, number centered */}
            <div className="relative grid gap-[0.25em]" style={{ gridTemplateColumns: "repeat(6, 0.7em)" }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[0.7em] h-[0.7em]"
                  style={{ background: "rgba(0,0,0,0.20)", borderRadius: "3px" }}
                />
              ))}
              {/* Number centered over the grid */}
               <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[30px] font-black leading-none text-gray-900 tracking-tight">
                  30
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-navy/60 leading-none">
              un día · un parche
            </span>
          </div>
        </FadeIn>

        {/* Content — right */}
        <FadeIn x={40} y={0} duration={0.7}>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5"
            style={{ color: "var(--color-teal)" }}
          >
            {t("badge")}
          </p>
          <h2
            className="font-extrabold text-ocean leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px,3vw,40px)" }}
          >
            {t("title")}
          </h2>

          <div className="mt-10 flex flex-col gap-7">
            {steps.map((step, i) => (
              <FadeIn
                key={step.n}
                x={20}
                y={0}
                delay={i * 0.1}
                duration={0.5}
                className="flex gap-5 items-start"
              >
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-extrabold text-[20px]"
                  style={{
                    background: "var(--color-ocean)",
                    boxShadow: "0 4px 14px rgba(0,80,136,0.3)",
                  }}
                >
                  {step.n}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-navy mb-1">{step.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-[1.6]">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
