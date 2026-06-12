import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Aceptación de los Términos",
    content: `Al acceder y utilizar novapatch.care, usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguna parte, le pedimos no utilizar nuestros servicios.`,
  },
  {
    title: "2. Productos y Precios",
    content: `Todos los productos están sujetos a disponibilidad. Los precios están expresados en Pesos Mexicanos (MXN) e incluyen IVA (16%). NovaPatch se reserva el derecho de modificar precios sin previo aviso. El precio aplicable es el vigente al momento de confirmar la compra.`,
  },
  {
    title: "3. Suscripciones",
    content: `Al adquirir una suscripción usted autoriza a NovaPatch a realizar cobros automáticos recurrentes según la frecuencia elegida (mensual, bimestral o trimestral) al método de pago registrado.\n\n• Puede cancelar su suscripción en cualquier momento desde su cuenta, sin penalidades\n• Los cambios de frecuencia aplican a partir del siguiente ciclo de facturación\n• NovaPatch no se hace responsable por rechazos bancarios que interrumpan el servicio`,
  },
  {
    title: "4. Pagos",
    content: `Los pagos son procesados de forma segura por Openpay. Al proporcionar sus datos de pago, usted garantiza que está autorizado a usar dicho método de pago.\n\nMétodos aceptados:\n• Tarjeta de crédito y débito (Visa, Mastercard, American Express)`,
  },
  {
    title: "5. Envíos y Entregas",
    content: `Los pedidos se procesan en días hábiles. Los tiempos de entrega son estimados y pueden variar por circunstancias externas (clima, huelgas, situaciones de fuerza mayor). NovaPatch no se hace responsable por demoras ocasionadas por la empresa de mensajería una vez que el paquete ha sido despachado.`,
  },
  {
    title: "6. Garantía de Satisfacción",
    content: `Ofrecemos 30 días de garantía de satisfacción aplicable al primer pedido por cliente. Si no está satisfecho, le reembolsamos el importe sin necesidad de devolver el producto.\n\n• Solo aplica al primer pedido por cliente\n• La solicitud debe realizarse dentro de los 30 días naturales de recibido el pedido\n• No aplica a ciclos posteriores de suscripción`,
  },
  {
    title: "7. Propiedad Intelectual",
    content: `Todo el contenido de novapatch.care, incluyendo textos, imágenes, logotipos, diseños y código fuente, es propiedad exclusiva de NovaPatch o sus licenciantes. Queda prohibida su reproducción total o parcial sin autorización escrita.`,
  },
  {
    title: "8. Limitación de Responsabilidad",
    content: `Los parches vitamínicos de NovaPatch son suplementos de bienestar general y no son medicamentos. No están destinados a diagnosticar, tratar, curar ni prevenir enfermedades. NovaPatch no se hace responsable por reacciones individuales derivadas del uso inadecuado del producto.`,
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
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center" style={{ background: "#FEF7ED" }}>
          <div className="max-w-2xl mx-auto">
            <p className="home-section-eyebrow">Legal</p>
            <h1 className="home-section-title text-ocean">Términos y Condiciones</h1>
            <p className="home-caption">Última actualización: enero de 2025 · Ley aplicable: México</p>
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

            <div className="mt-12 bg-[#F8EDEB] rounded-3xl p-8 border border-[#005088]/15">
              <h3 className="text-lg font-bold text-[#005088] mb-2">¿Tienes alguna duda legal?</h3>
              <p className="text-[#6B7280] mb-4">Contáctanos en cualquier momento.</p>
              <a href="mailto:hola@novapatch.care" className="text-[#3CBFAB] font-semibold hover:underline">hola@novapatch.care</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
