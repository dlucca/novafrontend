import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_SECRET_KEY || "re_123");

const ASUNTOS: Record<string, string> = {
  pedido:      "Pedido",
  suscripcion: "Suscripción",
  producto:    "Producto",
  otro:        "Otro",
};

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, asunto, mensaje } = await req.json();

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from:    "Novapatch Contacto <hola@novapatch.care>",
      to:      "hola@novapatch.care",
      replyTo: email,
      subject: `[Contacto] ${ASUNTOS[asunto] ?? asunto} — ${nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B35;">
          <div style="background: #0D1B35; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <img src="https://novapatch.care/logos/logowht.webp" alt="Novapatch" height="32" style="display:block;" />
          </div>
          <div style="background: #FAF7F2; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
            <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 800; color: #0D1B35;">
              Nuevo mensaje de contacto
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 12px; background: #fff; border: 1px solid #E5E7EB; border-radius: 8px 8px 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF; width: 100px;">Nombre</td>
                <td style="padding: 10px 12px; background: #fff; border: 1px solid #E5E7EB; border-left: none; border-radius: 0 8px 0 0; font-size: 14px; font-weight: 600; color: #0D1B35;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; background: #fff; border: 1px solid #E5E7EB; border-top: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">Email</td>
                <td style="padding: 10px 12px; background: #fff; border: 1px solid #E5E7EB; border-top: none; border-left: none; font-size: 14px; color: #E8503A;"><a href="mailto:${email}" style="color: #E8503A; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; background: #fff; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 0 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">Asunto</td>
                <td style="padding: 10px 12px; background: #fff; border: 1px solid #E5E7EB; border-top: none; border-left: none; border-radius: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #0D1B35;">${ASUNTOS[asunto] ?? asunto}</td>
              </tr>
            </table>

            <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;">
              <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">Mensaje</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0D1B35; white-space: pre-wrap;">${mensaje}</p>
            </div>

            <p style="margin: 24px 0 0; font-size: 12px; color: #9CA3AF; text-align: center;">
              Puedes responder directamente a este email — irá a <strong>${email}</strong>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "No se pudo enviar el mensaje." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
