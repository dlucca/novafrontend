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
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center" style={{ background: "#FEF7ED" }}>
          <div className="max-w-2xl mx-auto">
            <p className="home-section-eyebrow">Legal</p>
            <h1 className="home-section-title text-ocean">Aviso de Privacidad</h1>
            <p className="home-caption">Última actualización: enero de 2025 · Cumplimiento LFPDPPP</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-6 bg-[#FAF7F2]">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-10">
              {sections.map((s, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-[#005088]">{s.title}</h2>
                  <p className="text-[#6B7280] leading-relaxed whitespace-pre-line text-base">{s.content}</p>
                </div>
              ))}
            </div>

            {/* Contact ARCO box */}
            <div className="mt-12 bg-[#F8EDEB] rounded-3xl p-8 border border-[#005088]/15">
              <h3 className="text-lg font-bold text-[#005088] mb-2">Contacto</h3>
              <p className="text-[#6B7280] mb-4">
                Para dudas sobre este Aviso de Privacidad o para ejercer tus derechos ARCO, contáctanos en:
              </p>
              <div className="flex flex-col gap-1">
                <a href="mailto:info@novapatch.care" className="text-[#3CBFAB] font-semibold hover:underline">
                  info@novapatch.care
                </a>
                <p className="text-[#6B7280]">55 4545 1328</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
