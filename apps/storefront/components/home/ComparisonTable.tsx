import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";

const rows = [
  { feature: "Alta tasa de absorción",               nova: true,  caps: false, gummies: false },
  { feature: "Sin pastillas difíciles de tragar",    nova: true,  caps: false, gummies: true  },
  { feature: "Sin azúcar ni calorías",               nova: true,  caps: true,  gummies: false },
  { feature: "Sin colorantes ni rellenos artificiales", nova: true, caps: false, gummies: false },
  { feature: "No afecta tu sistema digestivo",       nova: true,  caps: false, gummies: false },
];

function Check({ ok }: { ok: boolean }) {
  if (ok) {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="11" fill="#10B981" fillOpacity="0.12" />
        <path d="M6.5 11.2l3 3 6-6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="11" fill="#EF4444" fillOpacity="0.10" />
      <path d="M7.5 7.5l7 7M14.5 7.5l-7 7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default async function ComparisonTable() {
  const t = await getTranslations("home.comparison");
  return (
    <section className="bg-gray-50 py-[72px] px-5 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        {/* Header text */}
        <FadeIn>
          <h2
            className="font-extrabold text-ocean leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px,3vw,40px)" }}
          >
            {t("title")}
          </h2>
        </FadeIn>

        {/* Two-column layout: table left, image right */}
        <FadeIn
          delay={0.1}
          className="mt-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-stretch"
        >
          {/* Table */}
          <div className="rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.10)] bg-white h-full flex flex-col">

            {/* Header row */}
            <div className="grid border-b-2 border-gray-200 [grid-template-columns:1fr_76px_76px_76px] md:[grid-template-columns:1fr_100px_100px_100px]">
              {/* Feature label */}
              <div className="px-4 py-4 text-[13px] font-bold text-gray-400 flex items-end">
                Características
              </div>

              {/* Novapatch */}
              <div
                className="py-4 px-2 flex flex-col items-center justify-end gap-2 text-white"
                style={{ background: "var(--color-ocean)" }}
              >
                <Image
                  src="/logos/logowht.webp"
                  alt="Novapatch"
                  width={80}
                  height={22}
                  className="h-5 w-auto object-contain brightness-0 invert"
                />
                <span className="text-[11px] font-bold opacity-90">Novapatch</span>
              </div>

              {/* Cápsulas */}
              <div className="py-4 px-2 flex flex-col items-center justify-end gap-2">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#9CA3AF"
                    d="M44.59 3.38c4.29 4.39 4.36 11.36 0.2 15.86L20 44.05C8.85 53.7-5.92 38.94 3.73 27.78L28.52 2.98C33.15-1.27 40.2-1.11 44.59 3.38zm-1.34 14.14c7.24-8.62-3.65-20.09-12.64-13.32L18.58 16.15l13.03 13.03zm-25.79 25.63c.33-.23.62-.52.94-.75L29.92 31l-13.03-13.03-11.52 11.52c-7.38 8.05 3.06 20.17 12.09 13.79z"
                  />
                </svg>
                <span className="text-[11px] font-bold text-gray-500">Cápsulas</span>
              </div>

              {/* Gomitas */}
              <div className="py-4 px-2 flex flex-col items-center justify-end gap-2">
                <Image
                  src="/comparison/bear.svg"
                  alt="Gomitas"
                  width={24}
                  height={24}
                  className="h-6 w-auto opacity-60"
                />
                <span className="text-[11px] font-bold text-gray-500">Gomitas</span>
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid border-b border-gray-100 last:border-b-0 [grid-template-columns:1fr_76px_76px_76px] md:[grid-template-columns:1fr_100px_100px_100px] ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
              >
                <div className="px-4 py-4 text-[13px] md:text-[14px] font-medium text-gray-800 flex items-center leading-snug">
                  {row.feature}
                </div>
                <div
                  className={`py-4 flex items-center justify-center ${i % 2 === 1 ? "bg-sky-pale/70" : "bg-sky-pale"}`}
                >
                  <Check ok={row.nova} />
                </div>
                <div className="py-4 flex items-center justify-center">
                  <Check ok={row.caps} />
                </div>
                <div className="py-4 flex items-center justify-center">
                  <Check ok={row.gummies} />
                </div>
              </div>
            ))}
          </div>

          {/* Image + bubble */}
          <div className="relative flex flex-col h-full">
            <div className="flex-1 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative">
              <Image
                src="/productusers/armpatch.webp"
                alt="Novapatch en uso"
                fill
                loading="lazy"
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            
            {/* Bubble */}
            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-5 bg-white rounded-[20px] px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
              <strong className="block text-[16px] font-extrabold text-ocean">
                Un parche, todo el día.
              </strong>
              <span className="text-[12px] text-gray-500">Sin agua. Sin horarios. Sin pastillas.</span>
            </div>
          </div>
        </FadeIn>

        {/* Closing text */}
        <FadeIn
          y={16}
          delay={0.2}
          duration={0.5}
          className="text-center mt-12 text-[15px] text-gray-500 leading-[1.7]"
        >
          <em>Lo simple se repite. Lo complejo se abandona.</em>
          <br />
          <strong className="text-gray-900">
            Novapatch está diseñado para ser el hábito que sí se sostiene.
          </strong>
        </FadeIn>
      </div>
    </section>
  );
}
