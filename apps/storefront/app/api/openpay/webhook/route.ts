// apps/storefront/app/api/openpay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCharge } from "@/lib/openpay-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ignorar eventos que no sean charge.succeeded
    if (body?.type !== "charge.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const transaction = body?.transaction as {
      id?: string;
      order_id?: string;
      status?: string;
    } | undefined;

    const charge_id = transaction?.id;
    const cart_id   = transaction?.order_id;

    if (!charge_id || !cart_id) {
      console.warn("[webhook] Payload incompleto:", body);
      return NextResponse.json({ ok: true });
    }

    // Verificar autenticidad: consultar el cargo directamente a Openpay
    const charge = await getCharge(charge_id);

    if (charge.status !== "completed") {
      console.warn("[webhook] Cargo no completado:", charge_id, charge.status);
      return NextResponse.json({ ok: true });
    }

    if (charge.order_id !== cart_id) {
      console.warn("[webhook] order_id mismatch:", charge.order_id, "!=", cart_id);
      return NextResponse.json({ ok: true });
    }

    // Completar cart en Medusa (server-side fetch — no usar lib/medusa.ts que usa localStorage)
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
    const medusaKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

    const medusaRes = await fetch(`${medusaUrl}/store/carts/${cart_id}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": medusaKey,
      },
      body: JSON.stringify({}),
    });

    if (!medusaRes.ok) {
      const errBody = await medusaRes.json().catch(() => ({}));
      // Si el cart ya fue completado (idempotencia), loguear pero no fallar
      if (medusaRes.status === 404 || medusaRes.status === 422) {
        console.warn("[webhook] Cart ya completado o no encontrado:", cart_id, errBody);
        return NextResponse.json({ ok: true });
      }
      console.error("[webhook] Medusa completeCart error:", medusaRes.status, errBody);
      // Devolver 500 para que Openpay reintente el webhook
      return NextResponse.json({ error: "Error completando cart" }, { status: 500 });
    }

    console.log("[webhook] Cart completado exitosamente:", cart_id);
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[webhook] Error inesperado:", err);
    // Devolver 200 para evitar reintentos infinitos en errores de parseo
    return NextResponse.json({ ok: true });
  }
}
