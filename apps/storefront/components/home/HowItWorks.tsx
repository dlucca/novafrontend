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
    <section id="como-funciona" className="bg-stone-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image — left (Swaps automatically every 7 seconds) */}
        <FadeIn
          x={-40}
          y={0}
          duration={0.7}
          className="w-full"
        >
          <HowItWorksImage />
        </FadeIn>

        {/* Content — right */}
        <FadeIn x={40} y={0} duration={0.7}>
          <p className="home-section-eyebrow">
            {t("badge")}
          </p>
          <h2 className="home-section-title text-ocean">
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
                  <h3 className="home-item-title mb-1">{step.title}</h3>
                  <p className="home-body">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
