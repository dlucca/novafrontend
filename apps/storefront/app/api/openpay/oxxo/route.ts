import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createOxxoCharge, type ChargeCustomer } from "@/lib/openpay-server";

const resend = new Resend(process.env.RESEND_SECRET_KEY);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cart_id || typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount) || !customer?.name || !customer?.email || !emailRegex.test(customer.email)) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    // Verificar que el carrito existe en Medusa antes de crear el cargo.
    // Previene spam de cargos con cart_ids inventados.
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
    const medusaKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";
    const cartRes = await fetch(`${medusaUrl}/store/carts/${cart_id}`, {
      headers: { "x-publishable-api-key": medusaKey },
    });
    if (!cartRes.ok) {
      console.warn("[oxxo] Carrito inválido:", cart_id, cartRes.status);
      return NextResponse.json({ error: "Carrito no encontrado." }, { status: 400 });
    }

    // 1. Crear cargo OXXO en Openpay
    const charge = await createOxxoCharge({
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
        subject: "Tu referencia OXXO — Novapatch",
        html: buildOxxoEmail({
          name: customer.name,
          reference: charge.reference,
          amount,
          due_date: charge.due_date,
        }),
      });
    } catch (emailErr) {
      console.error("[oxxo] Resend falló (no fatal):", emailErr);
    }

    // 3. Devolver datos al frontend
    return NextResponse.json({
      reference: charge.reference,
      due_date: charge.due_date,
      charge_id: charge.id,
    });
  } catch (err) {
    console.error("[oxxo] Error:", err);
    const msg = err instanceof Error ? err.message : "Error al generar referencia OXXO.";
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

function buildOxxoEmail(params: {
  name: string;
  reference: string;
  amount: number;
  due_date: string;
}): string {
  const { name, reference, amount, due_date } = params;
  // Formatear fecha límite
  const deadline = new Date(due_date).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B35;">
      <div style="background: #0D1B35; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <img src="https://novapatch.care/logos/logowht.webp" alt="Novapatch" height="32" style="display:block;" />
      </div>
      <div style="background: #FAF7F2; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
        <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #0D1B35;">Tu referencia OXXO está lista</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #6B7280; line-height: 1.6;">
          Hola <strong style="color: #0D1B35;">${escapeHtml(name)}</strong>, tienes hasta el <strong style="color: #0D1B35;">${deadline}</strong> para pagar en cualquier tienda OXXO.
        </p>

        <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 16px;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">Referencia OXXO</p>
          <p style="margin: 0; font-size: 28px; font-weight: 900; color: #0D1B35; letter-spacing: 0.14em;">${reference}</p>
        </div>

        <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #9CA3AF;">Monto a pagar</span>
          <span style="font-size: 18px; font-weight: 800; color: #E8503A;">${fmtMXN(amount)}</span>
        </div>

        <div style="margin-bottom: 24px;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF;">¿Cómo pagar?</p>
          <div style="background: #fff; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
            <div style="padding: 12px 16px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #0D1B35;">
              <strong style="color: #E8503A;">1.</strong> Ve a cualquier tienda OXXO en México
            </div>
            <div style="padding: 12px 16px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #0D1B35;">
              <strong style="color: #E8503A;">2.</strong> Dile al cajero "pago de servicio" y da la referencia
            </div>
            <div style="padding: 12px 16px; font-size: 13px; color: #0D1B35;">
              <strong style="color: #E8503A;">3.</strong> Guarda tu ticket — te confirmaremos el pedido por email
            </div>
          </div>
        </div>

        <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
          ¿Dudas? Escríbenos a <a href="mailto:hola@novapatch.care" style="color: #E8503A; text-decoration: none;">hola@novapatch.care</a>
        </p>
      </div>
    </div>
  `;
}
