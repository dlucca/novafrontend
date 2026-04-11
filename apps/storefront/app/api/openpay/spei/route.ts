// apps/storefront/app/api/openpay/spei/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSpeiCharge, type ChargeCustomer } from "@/lib/openpay-server";

const resend = new Resend(process.env.RESEND_SECRET_KEY);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart_id, amount, customer } = body as {
      cart_id: string;
      amount: number;
      customer: ChargeCustomer;
    };

    if (
      !cart_id ||
      typeof amount !== "number" ||
      amount <= 0 ||
      !Number.isFinite(amount) ||
      !customer?.name ||
      !customer?.email ||
      !emailRegex.test(customer.email)
    ) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    // 1. Crear cargo SPEI en Openpay
    const charge = await createSpeiCharge({
      amount,
      order_id: cart_id,
      customer,
      description: "Pedido Novapatch",
    });

    // 2. Enviar email — no fatal: si Resend falla, el cargo ya existe y devolvemos igual
    try {
      await resend.emails.send({
        from: "Novapatch <hola@novapatch.care>",
        to: customer.email,
        subject: "Datos para tu transferencia SPEI — Novapatch",
        html: buildSpeiEmail({
          name: customer.name,
          clabe: charge.clabe,
          bank: charge.bank,
          beneficiary: charge.beneficiary,
          amount,
        }),
      });
    } catch (emailErr) {
      console.error("[spei] Resend falló (no fatal):", emailErr);
    }

    // 3. Devolver datos al frontend
    return NextResponse.json({
      clabe: charge.clabe,
      bank: charge.bank,
      beneficiary: charge.beneficiary,
      charge_id: charge.id,
    });
  } catch (err) {
    console.error("[spei] Error:", err);
    const msg = err instanceof Error ? err.message : "Error al generar CLABE SPEI.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function fmtMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);
}

function buildSpeiEmail(params: {
  name: string;
  clabe: string;
  bank: string;
  beneficiary: string;
  amount: number;
}): string {
  const { name, clabe, bank, beneficiary, amount } = params;
  // Formatear CLABE con espacios cada 4 dígitos para legibilidad
  const clabeFormatted = clabe.replace(/(\d{4})/g, "$1 ").trim();

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B35;">
      <div style="background: #0D1B35; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <img src="https://novapatch.care/logos/logowht.webp" alt="Novapatch" height="32" style="display:block;" />
      </div>
      <div style="background: #FAF7F2; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
        <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #0D1B35;">Datos para tu transferencia SPEI</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #6B7280; line-height: 1.6;">
          Hola <strong style="color: #0D1B35;">${escapeHtml(name)}</strong>, realiza la transferencia con los siguientes datos. Tu pedido se confirma al recibir el pago.
        </p>

        <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; padding: 20px; margin-bottom: 16px;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">CLABE interbancaria</p>
          <p style="margin: 0 0 16px; font-size: 22px; font-weight: 900; color: #0D1B35; letter-spacing: 0.08em;">${clabeFormatted}</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #9CA3AF; font-weight: 600; width: 120px;">Banco</td>
              <td style="padding: 6px 0; color: #0D1B35; font-weight: 700;">${escapeHtml(bank)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9CA3AF; font-weight: 600;">Beneficiario</td>
              <td style="padding: 6px 0; color: #0D1B35; font-weight: 700;">${escapeHtml(beneficiary)}</td>
            </tr>
          </table>
        </div>

        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 10px; padding: 14px 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #92400E;">Monto exacto a transferir</p>
          <p style="margin: 0 0 6px; font-size: 22px; font-weight: 900; color: #92400E;">${fmtMXN(amount)}</p>
          <p style="margin: 0; font-size: 12px; color: #92400E;">⚠️ Transfiere el monto exacto o el pago no se acreditará automáticamente.</p>
        </div>

        <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
          ¿Dudas? Escríbenos a <a href="mailto:hola@novapatch.care" style="color: #E8503A; text-decoration: none;">hola@novapatch.care</a>
        </p>
      </div>
    </div>
  `;
}
