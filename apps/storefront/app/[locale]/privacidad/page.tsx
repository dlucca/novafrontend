import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Identidad y datos de contacto del responsable",
    content: `NOVAPATCH (SOCIEDAD ANÓNIMA PROMOTORA DE INVERSIÓN DE CAPITAL VARIABLE), en lo sucesivo "Novapatch", con domicilio en PRIVADA LAGO BOLSENA 22, COLONIA MODELO PENSIL, C.P. 11450, ALCALDÍA MIGUEL HIDALGO, CIUDAD DE MÉXICO, es el responsable del tratamiento de los datos personales que recopila a través del sitio web www.novapatch.care.

Para cualquier asunto relacionado con el tratamiento de tus datos personales puedes contactarnos en: info@novapatch.care · Teléfono: 55 4545 1328`,
  },
  {
    title: "2. Datos personales que recopilamos",
    content: `Podemos recopilar las siguientes categorías de datos personales cuando navegas por el Sitio, creas una cuenta, realizas una compra, te suscribes a nuestro newsletter o te comunicas con nosotros:

Datos de identificación y contacto: nombre, apellidos, correo electrónico, número de teléfono, dirección de envío y facturación.
Datos de cuenta: usuario, contraseña, historial de compras, preferencias, suscripciones activas.
Datos de pago: tipo de tarjeta y últimos dígitos, método de pago. Los datos completos son procesados por nuestros proveedores de pago y no se almacenan en nuestros servidores.
Datos de navegación: dirección IP, tipo de navegador, páginas visitadas, cookies.
Datos de comunicaciones: mensajes que nos envías por chat, correo o formularios de contacto.`,
  },
  {
    title: "3. Finalidades del tratamiento",
    content: `Finalidades primarias (necesarias para la prestación del servicio):

Procesar y gestionar tus pedidos, pagos, envíos y devoluciones.
Crear, administrar y mantener tu cuenta de usuario.
Gestionar tu suscripción y envíos recurrentes.
Atender consultas, reclamaciones y ejercicio de derechos.
Cumplir con obligaciones legales y fiscales aplicables.

Finalidades secundarias (sujetas a consentimiento):

Enviarte comunicaciones comerciales y promociones.
Realizar encuestas de satisfacción.
Mejorar nuestros productos y servicios mediante análisis de uso.`,
  },
  {
    title: "4. Base legal del tratamiento",
    content: `El tratamiento de tus datos se basa en: (a) la ejecución del contrato de compraventa; (b) el cumplimiento de obligaciones legales; (c) tu consentimiento para finalidades secundarias; y (d) nuestro interés legítimo en mejorar nuestros servicios.`,
  },
  {
    title: "5. Transferencia de datos a terceros",
    content: `Podemos compartir tus datos con proveedores de servicios que actúan en nuestro nombre (procesadores de pago, empresas de logística, plataformas de email marketing, servicios de análisis web). Estos proveedores están obligados a tratar tus datos únicamente según nuestras instrucciones y a mantener su confidencialidad.

No vendemos tus datos personales a terceros.`,
  },
  {
    title: "6. Cookies y tecnologías similares",
    content: `Utilizamos cookies propias y de terceros para el funcionamiento del Sitio, análisis de uso y personalización. Puedes configurar o deshabilitar las cookies desde la configuración de tu navegador, aunque esto puede afectar algunas funcionalidades del Sitio.`,
  },
  {
    title: "7. Tus derechos (ARCO)",
    content: `Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales. Para ejercer estos derechos, envía tu solicitud a info@novapatch.care indicando tu nombre completo, descripción del derecho que deseas ejercer y cualquier documento que facilite la localización de tus datos.`,
  },
  {
    title: "8. Seguridad de los datos",
    content: `Implementamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida, alteración o divulgación. Sin embargo, ningún sistema de transmisión por internet es 100% seguro.`,
  },
  {
    title: "9. Cambios a este aviso",
    content: `Podemos actualizar este Aviso de Privacidad periódicamente. Te notificaremos de cambios significativos a través del Sitio o por correo electrónico. El uso continuado del Sitio tras la publicación de cambios implica tu aceptación.`,
  },
  {
    title: "10. Contacto",
    content: `Para cualquier pregunta sobre este Aviso de Privacidad, contáctanos en info@novapatch.care o al teléfono 55 4545 1328.`,
  },
];

export default function PrivacidadPage() {
  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* Hero Stage */}
        <section className="pt-32 pb-16 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div className="bg-white rounded-xl border border-[#E6E1D8] p-8 sm:p-14 text-left shadow-2xs">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-3">
              legal & protección de datos
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-4">
              aviso de privacidad.
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#A8A29A]">
              Última actualización: enero de 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-6 sm:px-10 max-w-[1240px] mx-auto border-t border-[#E6E1D8] text-left">
          <div className="max-w-3xl space-y-10">
            {sections.map((s, i) => (
              <div key={i} className="space-y-2">
                <h2 className="text-xl font-display font-semibold text-[#0F0F0F] lowercase">{s.title}</h2>
                <p className="font-sans text-sm text-[#3A3A37] leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}

            {/* Contact ARCO box */}
            <div className="pt-8 border-t border-[#E6E1D8]">
              <div className="p-6 rounded-xl bg-white border border-[#E6E1D8] shadow-2xs">
                <h3 className="font-display font-semibold text-lg text-[#0F0F0F] lowercase mb-1">contacto arco</h3>
                <p className="font-sans text-xs text-[#3A3A37] mb-3">
                  Para dudas sobre este Aviso de Privacidad o para ejercer tus derechos ARCO, contáctanos en:
                </p>
                <a href="mailto:info@novapatch.care" className="font-sans text-xs font-medium text-[#0F0F0F] underline">
                  info@novapatch.care
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
