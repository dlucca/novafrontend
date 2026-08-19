import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos de Colaboración para Influencers | Novapatch",
  description: "Condiciones de colaboración entre creadores de contenido y Novapatch México.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. Partes del acuerdo",
    body: `Este documento establece los términos de colaboración entre Novapatch México, sus afiliadas, subsidiarias, licenciatarias o entidades relacionadas que operen la marca Novapatch en México o en otros territorios que ésta determine de tiempo en tiempo (en lo sucesivo, "Novapatch" o la "Marca"), y el creador de contenido que complete el formulario de postulación o acepte expresamente participar en una colaboración (el "Influencer"). La relación entre las partes es de naturaleza estrictamente mercantil y civil, por lo que no constituye relación laboral, asociación, mandato, agencia, representación, joint venture ni exclusividad, salvo pacto expreso y por escrito.`,
  },
  {
    title: "2. Proceso de postulación y selección",
    body: `El envío del formulario de postulación no garantiza la aceptación en el programa. Novapatch evaluará cada perfil a su entera discreción y podrá aceptar o rechazar cualquier solicitud sin necesidad de expresar causa. La decisión podrá notificarse dentro de los 7 días hábiles posteriores al envío o en cualquier otro plazo razonable que Novapatch determine. Los criterios de selección podrán incluir, de manera enunciativa mas no limitativa, el nicho de contenido, tamaño y calidad de la audiencia, nivel de engagement, reputación digital, alineación con los valores de la marca, historial de colaboraciones, cumplimiento regulatorio y tipo de colaboración solicitado.`,
  },
  {
    title: "3. Modalidades de colaboración",
    body: `Las colaboraciones podrán ser, entre otras, de los siguientes tipos:\n\n• Producto a cambio de contenido: el Influencer recibe productos Novapatch como parte de la contraprestación o beneficio asociado a la colaboración, a cambio de crear y publicar el contenido acordado.\n• Colaboración paga: el Influencer recibe una compensación económica previamente acordada por la creación, entrega y publicación de contenido específico.\n• Embajador a largo plazo: relación continua con beneficios exclusivos, productos, compensación recurrente u otros incentivos, sujeta en su caso a condiciones particulares o contrato separado.\n\nEn todos los casos, los términos específicos de cada colaboración, incluyendo piezas requeridas, entregables, formatos, plazos, canales, uso de códigos, links, whitelisting, paid usage o cualquier otra condición aplicable, podrán ser confirmados por escrito por Novapatch antes del inicio de la colaboración y formarán parte integrante de este acuerdo.`,
  },
  {
    title: "4. Obligaciones del Influencer",
    body: `Al participar en el programa, el Influencer se obliga a:\n\n• Crear, entregar para revisión previa cuando Novapatch lo solicite, y publicar el contenido acordado en la forma, cantidad, formato, canales y dentro de los plazos establecidos por Novapatch.\n\n• Incluir de forma clara, visible y comprensible en cada publicación, historia, video o cualquier otro contenido patrocinado la existencia de su relación comercial con Novapatch, cumpliendo en todo momento con la normativa y lineamientos aplicables en materia de publicidad, protección al consumidor y divulgación comercial, así como con las instrucciones razonables que Novapatch le comunique. El incumplimiento de esta obligación facultará a Novapatch para exigir la corrección o eliminación inmediata del contenido y, en su caso, suspender o retener cualquier pago o compensación pendiente.\n\n• Abstenerse de realizar afirmaciones falsas, engañosas, no comprobadas, médicas, terapéuticas o de salud no autorizadas por escrito por Novapatch respecto de los productos, así como de efectuar declaraciones o publicaciones que puedan afectar la reputación, imagen o intereses comerciales de Novapatch.\n\n• No promocionar, colaborar, participar directa o indirectamente, ni aparecer asociado con marcas, productos o servicios que compitan directa o indirectamente con Novapatch durante la vigencia de la colaboración y por un plazo de 3 meses posteriores a su terminación, salvo autorización previa y por escrito de Novapatch.\n\n• Compartir con Novapatch, dentro de los 5 días naturales siguientes a cada publicación y también cuando ésta lo solicite, las métricas, reportes, capturas, enlaces, accesos y demás información relacionada con el desempeño del contenido, incluyendo alcance, impresiones, interacciones, clics, conversiones y cualquier otro indicador disponible.\n\n• Corregir, ajustar, retirar o sustituir, a solicitud de Novapatch y dentro del plazo que ésta indique, cualquier contenido que incumpla este acuerdo, los lineamientos de marca o la normativa aplicable.\n\n• Garantizar que el contenido creado o publicado por el Influencer será original o contará con todas las autorizaciones, licencias, consentimientos y derechos necesarios para su explotación conforme a este acuerdo, y que dicho contenido no infringirá derechos de terceros, incluidos derechos de autor, propiedad industrial, imagen, privacidad, datos personales o cualquier otro derecho aplicable.`,
  },
  {
    title: "5. Obligaciones de Novapatch",
    body: `Novapatch se obliga únicamente a:\n\n• Proporcionar al Influencer, en su caso, los productos, materiales, lineamientos de marca o la compensación expresamente acordados, sujeto al cumplimiento previo y completo por parte del Influencer de sus obligaciones conforme al presente acuerdo.\n\n• Revisar y emitir comentarios sobre el contenido cuando así lo considere conveniente, sin que la falta de observaciones, comentarios o respuesta implique aprobación automática del contenido ni limite el derecho de Novapatch de solicitar modificaciones, rechazar publicaciones o requerir el retiro de contenido en cualquier momento.\n\n• Realizar el pago o entrega de la compensación acordada conforme a los términos pactados, pudiendo suspender, retener, compensar o negar dicho pago en caso de incumplimiento del Influencer, publicación defectuosa, extemporánea, incompleta o contraria a los lineamientos de Novapatch o a la normativa aplicable.\n\n• Tratar la información personal del Influencer conforme a la legislación aplicable; sin perjuicio de lo anterior, Novapatch podrá utilizar, almacenar, analizar y compartir internamente las métricas, resultados y datos de desempeño derivados de la colaboración para fines comerciales, operativos, analíticos, regulatorios y legales.`,
  },
  {
    title: "6. Derechos sobre el contenido",
    body: `El Influencer reconoce y acepta que todo contenido creado, desarrollado, entregado o publicado con motivo de la colaboración podrá ser utilizado por Novapatch en los términos previstos en esta cláusula. En consecuencia, el Influencer otorga a favor de Novapatch, desde el momento de creación del contenido y sin necesidad de autorización adicional, una licencia gratuita, mundial, sublicenciable, transferible, no exclusiva e irrevocable durante el plazo máximo permitido por la ley aplicable, para usar, reproducir, fijar, almacenar, comunicar públicamente, distribuir, publicar, republicar, exhibir, adaptar, editar, recortar, traducir, subtitular, digitalizar y explotar dicho contenido, total o parcialmente, en cualquier medio, formato, canal o soporte, conocido o por conocerse, incluyendo de manera enunciativa redes sociales, sitios web, e-commerce, marketplaces, newsletters, materiales promocionales, presentaciones comerciales, materiales para puntos de venta y campañas publicitarias pagadas o no pagadas.\n\nEl Influencer autoriza expresamente a Novapatch para utilizar su nombre, imagen, voz, seudónimo, identificadores de redes sociales, signos distintivos personales y demás elementos de su personalidad incorporados en el contenido, exclusivamente en relación con la promoción, publicidad, comercialización y posicionamiento de Novapatch y sus productos.\n\nNovapatch podrá realizar las adaptaciones, modificaciones, ediciones, recortes y ajustes que considere razonablemente necesarios para fines de formato, diseño, consistencia de marca, adecuación a medios, cumplimiento normativo o aprovechamiento comercial, siempre que no se altere de manera dolosa el sentido general de las manifestaciones del Influencer. Salvo pacto expreso en contrario, el Influencer no tendrá derecho a pago adicional alguno por los usos autorizados en esta cláusula.`,
  },
  {
    title: "7. Productos, contraprestación y envíos",
    body: `Los productos enviados por Novapatch podrán constituir, según el caso, parte de la contraprestación, incentivo o beneficio asociado a la colaboración. La recepción de productos por parte del Influencer no lo libera del cumplimiento íntegro de sus obligaciones de contenido, publicación, disclosure y entrega de métricas.\n\nEn caso de que el Influencer no publique el contenido acordado dentro del plazo establecido, o incumpla cualquier obligación material de este acuerdo sin causa justificada aceptada por Novapatch, ésta podrá, a su elección, exigir la devolución de los productos enviados en buen estado, cobrar su valor comercial, compensar dicho valor contra pagos pendientes o dar por terminada la colaboración de forma inmediata, sin perjuicio de otras acciones que pudieran corresponderle.\n\nSalvo pacto expreso en contrario, los envíos correspondientes a la Fase 1 del programa se realizarán únicamente dentro del territorio mexicano.`,
  },
  {
    title: "8. Privacidad de datos",
    body: `Los datos personales recopilados mediante el formulario de postulación o durante la ejecución de la colaboración, incluyendo nombre, correo electrónico, handles, métricas, domicilio, datos fiscales o bancarios cuando resulten necesarios, serán tratados por Novapatch para evaluar, gestionar, documentar, ejecutar y dar seguimiento a la relación de colaboración, así como para fines administrativos, analíticos, legales y regulatorios relacionados con la misma.\n\nNovapatch no compartirá dichos datos con terceros ajenos a la operación ordinaria de la colaboración, salvo cuando ello sea necesario para la ejecución de la campaña, el cumplimiento de obligaciones legales o regulatorias, la defensa de sus derechos o conforme a su Aviso de Privacidad aplicable. Para más información, el Influencer podrá consultar el Aviso de Privacidad de Novapatch en el sitio web oficial de la marca.`,
  },
  {
    title: "9. Modificaciones y terminación",
    body: `Novapatch podrá modificar estos términos en cualquier momento, notificándolo por medios razonables, incluyendo correo electrónico, publicación en el sitio correspondiente o comunicación directa al Influencer. Las modificaciones entrarán en vigor en la fecha indicada por Novapatch y serán aplicables a futuras colaboraciones y, en la medida legalmente permitida, a colaboraciones en curso.\n\nCualquiera de las partes podrá dar por terminada una colaboración futura no iniciada en cualquier momento. Respecto de colaboraciones ya iniciadas o en ejecución, Novapatch podrá terminarlas total o parcialmente, de forma inmediata y sin responsabilidad, en caso de que el Influencer: (i) incumpla este acuerdo o los lineamientos de marca; (ii) publique contenido falso, engañoso, ilícito, ofensivo o reputacionalmente dañino; (iii) omita la divulgación de la relación comercial con Novapatch; (iv) realice afirmaciones médicas o regulatorias no autorizadas; (v) infrinja derechos de terceros; (vi) incurra en conductas públicas o privadas que, a juicio razonable de Novapatch, puedan afectar la imagen, reputación o intereses comerciales de la marca; o (vii) deje de cumplir con la campaña en tiempo, forma o calidad razonablemente esperada.\n\nLa terminación no liberará al Influencer de las obligaciones ya causadas ni afectará las cláusulas que por su naturaleza deban subsistir, incluyendo las relativas a derechos sobre el contenido, confidencialidad, responsabilidad, indemnización, jurisdicción y protección de datos.`,
  },
  {
    title: "10. Responsabilidad e indemnización",
    body: `El Influencer será el único responsable por las declaraciones, afirmaciones, opiniones, expresiones y materiales que emita o utilice en el marco de la colaboración, salvo respecto de textos o afirmaciones expresamente proporcionados por Novapatch para su reproducción literal.\n\nEl Influencer se obliga a sacar en paz y a salvo, defender e indemnizar a Novapatch, sus afiliadas, directivos, representantes, empleados, licenciatarios, distribuidores y cesionarios, frente a cualquier reclamación, queja, procedimiento, multa, sanción, daño, perjuicio, costo o gasto, incluyendo honorarios razonables de abogados, derivados de o relacionados con: (i) el incumplimiento de este acuerdo; (ii) la falta de divulgación adecuada de la relación comercial; (iii) afirmaciones falsas, engañosas, médicas o no autorizadas; (iv) la infracción de derechos de terceros; (v) el uso no autorizado de música, imágenes, marcas, obras o materiales; o (vi) cualquier conducta del Influencer que genere contingencias legales, regulatorias o reputacionales para Novapatch.\n\nEn ningún caso Novapatch será responsable frente al Influencer por daños indirectos, incidentales, especiales, consecuenciales o punitivos, ni por lucro cesante, pérdida de oportunidad, pérdida de audiencia o daño reputacional derivado de la suspensión, rechazo, edición o terminación de la colaboración.`,
  },
  {
    title: "11. Jurisdicción",
    body: `Este acuerdo se regirá e interpretará conforme a las leyes aplicables de los Estados Unidos Mexicanos. Cualquier controversia derivada de su interpretación, cumplimiento o ejecución que no pueda resolverse de buena fe entre las partes será sometida a la jurisdicción de los tribunales competentes de la Ciudad de México, renunciando las partes a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.`,
  },
];

export default function TerminosInfluencersPage() {
  return (
    <>
      <Navbar lightBg />
      <main className="bg-[#FAF8F5]">
        {/* Header */}
        <section className="pt-32 pb-16 px-6 border-b border-[#E6E1D8]">
          <div className="max-w-3xl mx-auto">
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] block mb-3">
              legal · programa de influencers
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase mb-4">
              términos de colaboración.
            </h1>
            <p className="text-xs font-mono text-[#A8A29A]">
              Versión 1.0 · Vigente desde abril 2026 · México
            </p>
          </div>
        </section>

        {/* Intro callout */}
        <section className="px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl px-7 py-6 bg-white border border-[#E6E1D8] shadow-2xs">
              <p className="text-sm font-sans text-[#3A3A37] leading-relaxed">
                Este documento describe cómo funciona la relación entre Novapatch y los creadores de contenido que forman parte de nuestro programa de embajadores. Lo escribimos en lenguaje claro para que sepas exactamente qué podés esperar de nosotros y qué esperamos de vos.
              </p>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-base font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase mb-3">
                  {s.title}
                </h2>
                <div className="text-sm font-sans text-[#3A3A37] leading-relaxed whitespace-pre-line">
                  {s.body}
                </div>
              </div>
            ))}

            {/* CTA back to form */}
            <div className="mt-6 pt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-[#E6E1D8]">
              <a
                href="/influencers#aplicar"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer"
              >
                Volver a postularme
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2.5 7H11.5M11.5 7L7 2.5M11.5 7L7 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <p className="text-xs font-sans text-[#A8A29A]">
                ¿Tenés preguntas? Escribinos a{" "}
                <a href="mailto:hola@novapatch.care" className="text-[#0F0F0F] underline font-medium">
                  hola@novapatch.care
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
