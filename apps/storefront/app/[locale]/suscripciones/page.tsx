import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionsFAQ from "./SubscriptionsFAQ";
import { getSubscriptionPlanTiers } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";

const steps = [
  { n: 1, title: "Elige tus parches", desc: "Combina los que necesites desde la tienda." },
  { n: 2, title: "Define la frecuencia", desc: "Cada producto puede ir a 30, 60 o 90 días." },
  { n: 3, title: "Recibe y olvídate", desc: "Llega solo, con descuento de suscriptor." },
];

const controlItems = [
  {
    title: "Pausa cuando lo necesites",
    desc: "¿Te vas de viaje o ya tienes stock? Pausa cualquier producto desde tu cuenta, sin explicaciones.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" />
      </svg>
    ),
  },
  {
    title: "Cambia tus parches o tu frecuencia",
    desc: "¿Cambió tu rutina? Ajusta qué productos recibes y cada cuánto, antes de tu próximo envío.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
      </svg>
    ),
  },
  {
    title: "Cancela sin penalizaciones",
    desc: "Si decides salir, sales. Sin llamadas, sin formularios complicados, sin cargos extra.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      <main className="min-h-screen bg-[#FAF7F2]">

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-10 px-6 pt-28 pb-16 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <Image
              src="/productusers/threepack.webp"
              alt="Novapatch Sleep, Woman y Shield"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover object-top"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="home-section-eyebrow">Suscripciones</p>
            <h1 className="home-section-title text-ocean">
              El hábito que no tienes que recordar
            </h1>
            <p className="home-section-subtitle max-w-md">
              Elige tus parches, define cada cuánto los quieres y olvídate del resto. Con descuento, sin compromiso.
            </p>
            <Link
              href="/tienda"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ocean px-8 py-4 text-base font-bold text-white transition hover:bg-ocean-dark sm:w-auto"
            >
              Armar mi plan
            </Link>
            <p className="home-caption mt-3 text-center sm:text-left">
              Pausa, cambia o cancela cuando quieras · Sin penalizaciones
            </p>
          </div>
        </section>

        {/* Planes */}
        <section id="planes" className="border-y border-[#E8E2D8] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="home-section-eyebrow">Frecuencias</p>
            <h2 className="home-section-title text-ocean">Cada producto, a tu ritmo</h2>
            <p className="home-section-subtitle mb-10 max-w-xl">
              Mientras más seguido recibes, mayor es el descuento. Cada parche puede tener su propia frecuencia.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {frecuencias.map((f) => (
                <div
                  key={f.freq}
                  className="rounded-2xl border-2 px-5 py-5 text-left"
                  style={{
                    borderColor: f.best ? "var(--color-ocean)" : "#E7E1D6",
                    background: f.best ? "color-mix(in srgb, var(--color-sky-pale) 45%, #fff)" : "#FCFAF6",
                    boxShadow: f.best ? "0 4px 16px rgba(13,27,53,0.08)" : "none",
                  }}
                >
                  {f.best && (
                    <span className="mb-3 inline-block rounded-full bg-ocean px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      Más popular
                    </span>
                  )}
                  <p className="home-item-title">{f.label}</p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="home-caption text-base line-through">
                      {formatPrice(f.basePrice, market.currency, market.locale)}
                    </span>
                    <span className="text-2xl font-black text-ocean">
                      {formatPrice(f.price, market.currency, market.locale)}
                      <span className="home-caption ml-1 text-sm font-medium">/ caja</span>
                    </span>
                  </div>
                  <p className="home-body mt-2">
                    <span className="font-bold text-teal">{f.discountPct}% de descuento</span>
                    {" · "}
                    <span className="font-bold text-[#1E7D4F]">
                      Ahorras {formatPrice(f.basePrice - f.price, market.currency, market.locale)}
                    </span>
                  </p>
                  <p className="home-caption mt-2">Cada {f.freq} días</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona — compacto */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="home-section-eyebrow">El proceso</p>
          <h2 className="home-section-title text-ocean">Así de simple</h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="border-t-2 border-ocean pt-5">
                <span className="block text-[clamp(40px,4vw,56px)] font-black leading-none text-ocean">
                  {step.n}
                </span>
                <h3 className="home-item-title mt-4">{step.title}</h3>
                <p className="home-body mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Control total */}
        <section className="bg-blush px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="home-section-eyebrow">Control total</p>
            <h2 className="home-section-title text-ocean">Tú tienes el control, siempre.</h2>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {controlItems.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-4 rounded-3xl bg-white p-7 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                  style={{ border: "1px solid rgba(0,80,136,0.08)" }}
                >
                  <div className="text-ocean">{item.icon}</div>
                  <h3 className="home-item-title">{item.title}</h3>
                  <p className="home-body">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="home-section-eyebrow">Antes de empezar</p>
            <h2 className="home-section-title text-ocean">Preguntas frecuentes</h2>
            <div className="mt-10">
              <SubscriptionsFAQ />
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-white px-6 pb-24">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[28px] border border-[#E8E2D8] bg-white px-10 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[clamp(24px,2.5vw,32px)] font-black leading-tight text-[#0D1B35]">
                ¿Listo para empezar?
              </h2>
              <p className="home-body mt-1">Elige tus parches en la tienda y activa tu suscripción al checkout.</p>
            </div>
            <Link
              href="/tienda"
              className="shrink-0 rounded-full bg-ocean px-10 py-4 text-base font-bold text-white transition hover:bg-ocean-dark"
            >
              Ir a la tienda
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
