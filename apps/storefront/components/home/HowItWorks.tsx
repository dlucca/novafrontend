import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import HowItWorksImage from "./HowItWorksImage";

export default async function HowItWorks() {
  const t = await getTranslations("home.howItWorks");

  const steps = [
    { n: 1, title: t("step1Title"), desc: t("step1Desc") },
    { n: 2, title: t("step2Title"), desc: t("step2Desc") },
    { n: 3, title: t("step3Title"), desc: t("step3Desc") },
  ];
  return (
    <section id="como-funciona" className="bg-white py-16 sm:py-24 border-t border-[#E6E1D8]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image — left */}
        <FadeIn
          x={-40}
          y={0}
          duration={0.7}
          className="w-full"
        >
          <HowItWorksImage />
        </FadeIn>

        {/* Content — right */}
        <FadeIn x={40} y={0} duration={0.7} className="text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight mb-8 lowercase">
            así de simple.
          </h2>

          <div className="mt-8 flex flex-col gap-8">
            {steps.map((step, i) => (
              <FadeIn
                key={step.n}
                x={20}
                y={0}
                delay={i * 0.1}
                duration={0.5}
                className="flex gap-5 items-start"
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-[#0F0F0F] text-[#FAF8F5] font-sans font-medium text-[14px] shadow-2xs">
                  0{step.n}
                </div>
                <div>
                  <h3 className="text-lg font-sans font-semibold text-[#0F0F0F] mb-1">{step.title}</h3>
                  <p className="text-sm font-sans font-normal text-[#3A3A37] leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
