import { Mail, Clock, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
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
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center" style={{ background: "#FEF7ED" }}>
          <div className="max-w-2xl mx-auto">
            <p className="home-section-eyebrow">
              Soporte
            </p>
            <h1 className="home-section-title text-ocean">
              Estamos aquí para ayudarte
            </h1>
            <p className="home-section-subtitle">
              Respondemos en menos de 24 horas en días hábiles.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-6 bg-[#FAF7F2]">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
            {/* Form — client island */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact info — static, server-rendered */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(13,27,53,0.05)] border border-[#005088]/6 flex gap-4"
                  >
                    <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-[#EAF5FB] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#3CBFAB]" />
                    </div>
                    <div>
                      <p className="home-caption mb-1 text-xs font-bold uppercase tracking-widest">
                        {item.title}
                      </p>
                      {item.display === "link" && item.link ? (
                        <a href={item.link} className="home-body font-semibold text-teal hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <p className="home-body font-semibold text-ocean whitespace-pre-line">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Social */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(13,27,53,0.05)] border border-[#005088]/6">
                <p className="home-caption mb-4 text-xs font-bold uppercase tracking-widest">
                  Redes sociales
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/novapatch.mx?igsh=dGZ4cGNoNjluc3Vl"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAF5FB] text-ocean transition-colors duration-200 home-body font-semibold"
                  >
                    <InstagramIcon />
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@novapatch.mx?_r=1&_t=ZS-95C7N0OkUke"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAF5FB] text-ocean transition-colors duration-200 home-body font-semibold"
                  >
                    <TikTokIcon />
                    TikTok
                  </a>
                </div>
              </div>

              <div className="bg-[#EAF5FB] rounded-2xl p-6 border border-[#5BA8D5]/20">
                <p className="home-item-title mb-1">
                  ¿Tienes una pregunta frecuente?
                </p>
                <p className="home-body mb-4">
                  Puede que ya tengamos la respuesta.
                </p>
                <a href="/faq" className="home-body font-semibold text-teal hover:underline">
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
