import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatPrice } from "@/lib/format";

export default async function CTABanner({ basePrice = 750, currency = "MXN" }: { basePrice?: number; currency?: string }) {
  const t = await getTranslations("home.cta");

  return (
    <section className="relative bg-white py-16 sm:py-24 px-5 sm:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Imagen lado izquierdo */}
        <FadeIn x={-40} y={0} duration={0.7}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/productusers/woman-using-patch.webp"
              alt="Mujer usando Novapatch"
              width={620}
              height={720}
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
              <p className="home-section-subtitle">
                Recibe tus parches cómodamente en casa. Sin preocuparte. Sin olvidarte.
              </p>
            </div>

            {/* Los 3 beneficios */}
            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  icon: "/features/ctabanner_suscripcion/1.png",
                  title: "Sin interrupciones",
                  desc: "Tu próximo envío llega automáticamente antes de que se te acaben. Así mantienes el hábito sin perder el ritmo."
                },
                {
                  icon: "/features/ctabanner_suscripcion/2.png",
                  title: "Precio de suscriptor",
                  desc: "Disfruta de descuentos de hasta 20% sobre el precio normal. El hábito que sostienes, conviene más."
                },
                {
                  icon: "/features/ctabanner_suscripcion/3.png",
                  title: "Tú tienes el control",
                  desc: "Pausa, cambia la frecuencia, modifica tu selección o cancela cuando quieras. Sin penalizaciones, sin llamadas y sin complicaciones."
                }
              ].map((b, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 mt-1 w-12 h-12 relative">
                    <Image
                      src={b.icon}
                      alt={b.title}
                      fill
                      className="object-contain"
                    />
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
              <p className="home-caption mt-4">
                Cancela cuando quieras • Envío gratis
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}