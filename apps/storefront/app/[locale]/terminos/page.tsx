import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Aceptación de los Términos",
    content: `Al acceder y utilizar novapatch.care, usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguna parte, le pedimos no utilizar nuestros servicios.`,
  },
  {
    title: "2. Productos y Precios",
    content: `Todos los productos están sujetos a disponibilidad. Los precios están expresados en Pesos Mexicanos (MXN) e incluyen IVA (16%). Novapatch se reserva el derecho de modificar precios sin previo aviso. El precio aplicable es el vigente al momento de confirmar la compra.`,
  },
  {
    title: "3. Suscripciones",
    content: `Al adquirir una suscripción usted autoriza a Novapatch a realizar cobros automáticos recurrentes según la frecuencia elegida (mensual, bimestral o trimestral) al método de pago registrado.\n\n• Puede cancelar su suscripción en cualquier momento desde su cuenta, sin penalidades\n• Los cambios de frecuencia aplican a partir del siguiente ciclo de facturación\n• Novapatch no se hace responsable por rechazos bancarios que interrumpan el servicio`,
  },
  {
    title: "4. Pagos",
    content: `Los pagos son procesados de forma segura por Openpay. Al proporcionar sus datos de pago, usted garantiza que está autorizado a usar dicho método de pago.\n\nMétodos aceptados:\n• Tarjeta de crédito y débito (Visa, Mastercard, American Express)`,
  },
  {
    title: "5. Envíos y Entregas",
    content: `Los pedidos se procesan en días hábiles. Los tiempos de entrega son estimados y pueden variar por circunstancias externas (clima, huelgas, situaciones de fuerza mayor). Novapatch no se hace responsable por demoras ocasionadas por la empresa de mensajería una vez que el paquete ha sido despachado.`,
  },
  {
    title: "6. Garantía de Satisfacción",
    content: `Ofrecemos 30 días de garantía de satisfacción aplicable al primer pedido por cliente. Si no está satisfecho, le reembolsamos el importe sin necesidad de devolver el producto.\n\n• Solo aplica al primer pedido por cliente\n• La solicitud debe realizarse dentro de los 30 días naturales de recibido el pedido\n• No aplica a ciclos posteriores de suscripción`,
  },
  {
    title: "7. Propiedad Intelectual",
    content: `Todo el contenido de novapatch.care, incluyendo textos, imágenes, logotipos, diseños y código fuente, es propiedad exclusiva de Novapatch o sus licenciantes. Queda prohibida su reproducción total o parcial sin autorización escrita.`,
  },
  {
    title: "8. Limitación de Responsabilidad",
    content: `Los parches vitamínicos de Novapatch son suplementos de bienestar general y no son medicamentos. No están destinados a diagnosticar, tratar, curar ni prevenir enfermedades. Novapatch no se hace responsable por reacciones individuales derivadas del uso inadecuado del producto.`,
  },
  {
    title: "9. Ley Aplicable",
    content: `Estos Términos y Condiciones se rigen por las leyes vigentes en los Estados Unidos Mexicanos. Cualquier controversia será sometida a los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponder por razón de domicilio.`,
  },
];

export default function TerminosPage() {
  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5]">

        {/* Hero Stage */}
        <section className="pt-32 pb-16 px-6 sm:px-10 max-w-[1240px] mx-auto">
          <div className="bg-white rounded-xl border border-[#E6E1D8] p-8 sm:p-14 text-left shadow-2xs">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-3">
              legal & condiciones
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-4">
              términos y condiciones.
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

            <div className="pt-8 border-t border-[#E6E1D8]">
              <div className="p-6 rounded-xl bg-white border border-[#E6E1D8] shadow-2xs">
                <h3 className="font-display font-semibold text-lg text-[#0F0F0F] lowercase mb-1">¿tienes alguna duda legal?</h3>
                <p className="font-sans text-xs text-[#3A3A37] mb-3">Contáctanos en cualquier momento a través de nuestro correo corporativo.</p>
                <a href="mailto:hola@novapatch.care" className="font-sans text-xs font-medium text-[#0F0F0F] underline">hola@novapatch.care</a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
