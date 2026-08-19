import { Mail, Clock, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.49a8.16 8.16 0 0 0 4.77 1.52V7.56a4.85 4.85 0 0 1-1-.87z" />
    </svg>
  );
}

const contactItems = [
  {
    icon: Mail,
    title: "Email",
    value: "hola@novapatch.care",
    link: "mailto:hola@novapatch.care",
    display: "link",
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: "55 4545 1328",
    link: "tel:5545451328",
    display: "link",
  },
  {
    icon: Clock,
    title: "Horario de atención",
    value: "Lunes – Viernes\n9:00 AM – 6:00 PM (CDMX)",
    link: null,
    display: "text",
  },
  {
    icon: MapPin,
    title: "Dirección",
    value: "Privada Lago Bolsena 22, Col. Modelo Pensil, CP 11450, Miguel Hidalgo, CDMX",
    link: null,
    display: "text",
  },
];

export default function ContactoPage() {
  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* Hero Stage */}
        <section className="pt-32 pb-16 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div className="bg-white rounded-xl border border-[#E6E1D8] p-8 sm:p-14 text-left shadow-2xs">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-3">
              soporte & atención
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-4">
              estamos aquí para ayudarte.
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#3A3A37] max-w-xl leading-relaxed">
              Respondemos en menos de 24 horas en días hábiles.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact info */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-6 border border-[#E6E1D8] shadow-2xs flex gap-4 items-start"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-[#0F0F0F]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-1">
                        {item.title}
                      </p>
                      {item.display === "link" && item.link ? (
                        <a href={item.link} className="font-sans text-sm font-semibold text-[#0F0F0F] hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-sans text-sm text-[#3A3A37] whitespace-pre-line leading-relaxed">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Social */}
              <div className="bg-white rounded-xl p-6 border border-[#E6E1D8] shadow-2xs">
                <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-4">
                  redes sociales
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/novapatch.mx?igsh=dGZ4cGNoNjluc3Vl"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] text-xs font-sans font-medium text-[#0F0F0F] hover:bg-white transition-colors"
                  >
                    <InstagramIcon />
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@novapatch.mx?_r=1&_t=ZS-95C7N0OkUke"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] text-xs font-sans font-medium text-[#0F0F0F] hover:bg-white transition-colors"
                  >
                    <TikTokIcon />
                    TikTok
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#E6E1D8] shadow-2xs">
                <p className="font-display font-semibold text-base text-[#0F0F0F] lowercase mb-1">
                  ¿tienes una duda frecuente?
                </p>
                <p className="font-sans text-xs text-[#3A3A37] mb-3">
                  Revisa nuestro centro de ayuda para obtener respuestas al instante.
                </p>
                <a href="/faq" className="font-sans text-xs font-medium text-[#0F0F0F] underline">
                  Ver preguntas frecuentes →
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
