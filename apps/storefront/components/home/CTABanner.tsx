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
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/productusers/woman-using-patch.webp"   // ← Cambia esta ruta por la imagen que tengas
            alt="Mujer usando Novapatch"
            width={620}
            height={720}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
        </div>

        {/* Contenido lado derecho */}
        <div className="space-y-8">
          <div>
            <span className="inline-block text-sm font-bold uppercase tracking-[0.12em] text-teal mb-3">
              SUSCRIPCIÓN
            </span>
            <h2 className="font-black text-ocean text-4xl md:text-5xl leading-[1.1] tracking-[-0.02em]">
              Suscríbete y ahorra hasta 20%
            </h2>
            <p className="text-xl text-gray-600 mt-4 leading-relaxed">
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
        <h4 className="font-bold text-xl text-ocean">{b.title}</h4>
        <p className="text-gray-600 mt-1 leading-relaxed">{b.desc}</p>
      </div>
    </div>
  ))}
</div>

          {/* CTA */}
          <div className="pt-4">
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center bg-ocean text-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-ocean-dark transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Encuentra tu parche y suscribete →
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Cancela cuando quieras • Envío gratis
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}