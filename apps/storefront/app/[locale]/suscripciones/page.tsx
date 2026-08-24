import Image from "next/image";
import HeroImageWithScroll from "./HeroImageWithScroll";
import ProcessImageWithScroll from "./ProcessImageWithScroll";
import { Link } from "@/lib/i18n-navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionsFAQ from "./SubscriptionsFAQ";
import { FadeIn } from "@/components/ui/FadeIn";
import { getSubscriptionPlanTiers } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";

const steps = [
  { n: 1, title: "Elige tus parches", desc: "Combina los que necesites desde la tienda." },
  { n: 2, title: "Define la frecuencia", desc: "Cada producto puede ir a 30, 60 o 90 días." },
  { n: 3, title: "Recibe y olvídate", desc: "Llega solo, con descuento exclusivo de suscriptor." },
];

const controlItems = [
  {
    title: "Pausa cuando lo necesites",
    desc: "¿Te vas de viaje o ya tienes stock? Pausa cualquier producto desde tu cuenta, sin explicaciones.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" />
      </svg>
    ),
  },
  {
    title: "Cambia tus parches o tu frecuencia",
    desc: "¿Cambió tu rutina? Ajusta qué productos recibes y cada cuánto, antes de tu próximo envío.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
      </svg>
    ),
  },
  {
    title: "Cancela sin penalizaciones",
    desc: "Si decides salir, sales. Sin llamadas, sin formularios complicados, sin cargos extra.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
];

export const revalidate = 3600;

export default async function SuscripcionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const market = MARKETS[locale as Locale] ?? MARKETS.mx;
  const frecuencias = await getSubscriptionPlanTiers(
    market.medusaRegionId || undefined,
    market.currency
  );

  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* ── Hero ── */}
        <section className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-8 pt-32 pb-16 lg:grid-cols-2 lg:items-center">
          <FadeIn x={-40} y={0} duration={0.7}>
            <HeroImageWithScroll />
          </FadeIn>

          <FadeIn x={40} y={0} duration={0.7}>
            <div className="flex flex-col justify-center text-left">
              <h1 className="font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight text-4xl sm:text-5xl lg:text-6xl lowercase mb-4">
                el hábito que no tienes que recordar.
              </h1>
              <p className="font-sans font-normal text-base sm:text-lg text-[#3A3A37] max-w-md leading-relaxed">
                Elige tus parches, define cada cuánto los quieres y olvídate del resto. Con descuento, sin compromiso.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/tienda"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] px-8 py-4 text-xs font-sans font-medium uppercase tracking-[0.12em] transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  Armar mi plan
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Planes / Frecuencias ── */}
        <section id="planes" className="border-y border-[#E6E1D8] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-10 text-left">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
                cada producto, a tu ritmo.
              </h2>
              <p className="font-sans font-normal text-sm sm:text-base text-[#3A3A37] mt-3 mb-10 max-w-xl leading-relaxed">
                Mientras más seguido recibes, mayor es el descuento. Cada parche puede tener su propia frecuencia.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
              {frecuencias.map((f, i) => {
                const isHero = f.best || f.discountPct >= 20;

                return (
                  <FadeIn key={f.freq} delay={i * 0.1} y={24}>
                    <div
                      className={`relative rounded-2xl p-7 text-left flex flex-col justify-between h-full ${
                        isHero
                          ? "bg-[#0F0F0F] text-white shadow-xl ring-1 ring-[#0F0F0F] scale-[1.02] md:-translate-y-2"
                          : "bg-white text-[#0F0F0F] border border-[#E6E1D8] shadow-2xs"
                      }`}
                    >
                      <div>
                        {/* Top Badge & Discount Pill */}
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-[0.12em] ${
                              isHero
                                ? "bg-white text-[#0F0F0F]"
                                : "bg-[#FAF8F5] border border-[#E6E1D8] text-[#3A3A37]"
                            }`}
                          >
                            {isHero ? "MÁS POPULAR · RECOMENDADO" : `FRECUENCIA ${f.freq} DÍAS`}
                          </span>

                          <span
                            className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              isHero
                                ? "bg-white/15 text-white"
                                : "bg-[#0F0F0F] text-white"
                            }`}
                          >
                            {f.discountPct}% OFF
                          </span>
                        </div>

                        {/* Title & Frequency */}
                        <h3
                          className={`text-2xl sm:text-3xl font-display font-semibold lowercase mb-1 ${
                            isHero ? "text-white" : "text-[#0F0F0F]"
                          }`}
                        >
                          {f.label}
                        </h3>
                        <p
                          className={`text-xs font-sans mb-6 ${
                            isHero ? "text-stone-400" : "text-[#A8A29A]"
                          }`}
                        >
                          Entrega automática cada {f.freq} días en tu puerta.
                        </p>

                        {/* Price & Savings Block */}
                        <div
                          className={`p-4 rounded-xl mb-6 ${
                            isHero ? "bg-white/10 border border-white/10" : "bg-[#FAF8F5] border border-[#E6E1D8]"
                          }`}
                        >
                          <div className="flex items-baseline gap-2 mb-1">
                            <span
                              className={`font-mono text-sm line-through ${
                                isHero ? "text-stone-400" : "text-[#A8A29A]"
                              }`}
                            >
                              {formatPrice(f.basePrice, market.currency, market.locale)}
                            </span>
                            <span
                              className={`text-3xl font-mono font-extrabold ${
                                isHero ? "text-white" : "text-[#0F0F0F]"
                              }`}
                            >
                              {formatPrice(f.price, market.currency, market.locale)}
                            </span>
                            <span
                              className={`text-xs font-sans ${
                                isHero ? "text-stone-300" : "text-[#A8A29A]"
                              }`}
                            >
                              / sobre
                            </span>
                          </div>

                          <div
                            className={`text-xs font-sans font-medium ${
                              isHero ? "text-emerald-400" : "text-[#0F0F0F]"
                            }`}
                          >
                            Ahorras {formatPrice(f.basePrice - f.price, market.currency, market.locale)} por sobre
                          </div>
                        </div>

                        {/* Feature Bullet List */}
                        <ul className="space-y-2.5 text-xs font-sans">
                          <li className="flex items-center gap-2">
                            <span className={`text-xs ${isHero ? "text-white" : "text-[#0F0F0F]"}`}>✓</span>
                            <span className={isHero ? "text-stone-200" : "text-[#3A3A37]"}>Envío automático prioritario</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`text-xs ${isHero ? "text-white" : "text-[#0F0F0F]"}`}>✓</span>
                            <span className={isHero ? "text-stone-200" : "text-[#3A3A37]"}>Pausa o cancela sin comisiones</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`text-xs ${isHero ? "text-white" : "text-[#0F0F0F]"}`}>✓</span>
                            <span className={isHero ? "text-stone-200" : "text-[#3A3A37]"}>Descuento permanente asegurado</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── El Proceso / Cómo funciona ── */}
        <section className="py-16 sm:py-20 text-left">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
              <FadeIn className="lg:col-start-1 lg:row-start-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
                  así de simple.
                </h2>
              </FadeIn>

              <FadeIn
                x={40}
                y={0}
                delay={0.15}
                duration={0.7}
                className="mx-auto w-full max-w-[320px] lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mx-0 lg:sticky lg:top-28"
              >
                <ProcessImageWithScroll />
              </FadeIn>

              <div className="lg:col-start-1 lg:row-start-2">
                <div className="grid gap-10 sm:grid-cols-3 lg:mt-8">
                  {steps.map((step, i) => (
                    <FadeIn key={step.n} delay={i * 0.1} y={24}>
                      <div className="border-t border-[#E6E1D8] pt-5">
                        <span className="block text-4xl sm:text-5xl font-mono font-bold text-[#0F0F0F]">
                          {String(step.n).padStart(2, "0")}
                        </span>
                        <h3 className="font-sans font-semibold text-base sm:text-lg text-[#0F0F0F] mt-3">{step.title}</h3>
                        <p className="font-sans font-normal text-xs sm:text-sm text-[#3A3A37] mt-1.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Control Total ── */}
        <section className="bg-white border-y border-[#E6E1D8] py-16 sm:py-20 text-left">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
                tú tienes el control, siempre.
              </h2>
            </FadeIn>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {controlItems.map((item, i) => (
                <FadeIn key={item.title} delay={i * 0.1} y={24}>
                  <div className="flex h-full flex-col justify-between gap-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] p-7 shadow-2xs hover:border-[#AEAEAF] hover:shadow-md transition-all">
                    <div className="flex flex-col gap-3">
                      <div className="text-[#0F0F0F]">{item.icon}</div>
                      <h3 className="font-sans font-semibold text-base sm:text-lg text-[#0F0F0F]">{item.title}</h3>
                      <p className="font-sans font-normal text-xs sm:text-sm text-[#3A3A37] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-[#FAF8F5] py-16 sm:py-20 text-left">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase mb-10">
                preguntas frecuentes.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <SubscriptionsFAQ />
            </FadeIn>
          </div>
        </section>

        {/* ── CTA Final ── */}
        <section className="bg-[#FAF8F5] pb-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
            <FadeIn y={30} duration={0.6}>
              <div className="rounded-xl p-8 sm:p-12 bg-white border border-[#E6E1D8] shadow-2xs text-center flex flex-col items-center gap-4 sm:gap-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase">
                  ¿listo para empezar tu plan?
                </h2>
                <p className="font-sans font-normal text-sm sm:text-base text-[#3A3A37] max-w-md">
                  Elige tus parches en la tienda y activa tu suscripción al checkout.
                </p>
                <Link
                  href="/tienda"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] px-8 py-4 text-[11px] font-sans font-medium uppercase tracking-[0.12em] transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  Ir a la tienda
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
