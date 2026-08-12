import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatPrice } from "@/lib/format";

export default async function SubscriptionBanner({ basePrice = 750, currency = "MXN" }: { basePrice?: number; currency?: string }) {
  const t = await getTranslations("home.cta");

  return (
    <section className="relative bg-white py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Imagen lado izquierdo */}
        <FadeIn x={-40} y={0} duration={0.7}>
          <div className="relative rounded-3xl overflow-hidden shadow-md border border-stone-200/60" style={{ maxHeight: "480px" }}>
            <Image
              src="/productusers/build_your_ritual_banner.webp"
              alt="Suscripción Novapatch"
              width={620}
              height={480}
              className="w-full h-auto object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          </div>
        </FadeIn>

        {/* Contenido lado derecho */}
        <FadeIn x={40} y={0} duration={0.7} delay={0.15}>
          <div className="space-y-8">
            <div>
              <span className="home-section-eyebrow">
                SUSCRIPCIÓN
              </span>
              <h2 className="home-section-title text-ocean">
                Suscríbete y ahorra hasta 20%
              </h2>
            </div>

            {/* Los 3 beneficios */}
            <div className="grid grid-cols-1 gap-6">
              {[
                { num: 1, title: "Sin interrupciones",   desc: "Tu próximo envío llega automáticamente antes de que se te acaben. Envío gratis a tu puerta, sin que tengas que preocuparte." },
                { num: 2, title: "Precio de suscriptor",  desc: "Disfruta de descuentos de hasta 20% sobre el precio normal. El hábito que sostienes, conviene más." },
                { num: 3, title: "Tú tienes el control",  desc: "Pausa, cambia la frecuencia, modifica tu selección o cancela cuando quieras. Sin penalizaciones ni complicaciones." }
              ].map((b, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-extrabold text-[20px] mt-1"
                    style={{
                      background: "var(--color-ocean)",
                      boxShadow: "0 4px 14px rgba(0,80,136,0.3)",
                    }}
                  >
                    {b.num}
                  </div>
                  <div>
                    <h4 className="home-item-title">{b.title}</h4>
                    <p className="home-body mt-1">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center bg-ocean text-white font-bold text-[15px] px-10 py-4 rounded-full hover:bg-ocean-dark transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Encuentra tu parche y suscribete
              </Link>

            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}