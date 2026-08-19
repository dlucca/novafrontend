import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  renderOrderConfirmationEmail,
  renderWelcomeEmail,
  renderCartRecoveryEmail,
  renderSubscriptionAlertEmail,
} from "@/lib/emails/templates";

const resend = new Resend(process.env.RESEND_SECRET_KEY || process.env.RESEND_API_KEY || "re_test");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { template, targetEmail, customerName = "Cliente", orderDetails } = body;

    if (!targetEmail) {
      return NextResponse.json({ error: "Email de destino requerido" }, { status: 400 });
    }

    let html = "";
    let subject = "";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.novapatch.care";

    switch (template) {
      case "order": {
        const orderNum = orderDetails?.orderNumber ?? `NV-${Math.floor(10000 + Math.random() * 90000)}`;
        subject = `Confirmación de pedido #${orderNum} · Novapatch`;
        html = renderOrderConfirmationEmail(
          {
            orderNumber: orderNum,
            customerName: orderDetails?.customerName || customerName,
            customerEmail: targetEmail,
            items: orderDetails?.items ?? [
              { title: "Novapatch Energy", quantity: 1, price: 750, image: `${siteUrl}/products/Energy_thumb.jpg` },
              { title: "Novapatch Sleep", quantity: 1, price: 750, image: `${siteUrl}/products/Sleep_thumb.jpg` },
            ],
            subtotal: orderDetails?.subtotal ?? 1500,
            bundleDiscount: orderDetails?.bundleDiscount ?? 0,
            bundleName: orderDetails?.bundleName ?? null,
            total: orderDetails?.total ?? 1275,
            shippingAddress: orderDetails?.shippingAddress ?? {
              name: customerName,
              address: "Av. Insurgentes Sur 1602, Piso 4",
              city: "Ciudad de México",
              state: "CDMX",
              postalCode: "03940",
            },
          },
          siteUrl
        );
        break;
      }

      case "welcome":
        subject = "Bienvenido a Novapatch · Tu ritual empieza hoy";
        html = renderWelcomeEmail(customerName, siteUrl);
        break;

      case "cart":
        subject = "Tus parches te están esperando · Novapatch";
        html = renderCartRecoveryEmail(customerName, [
          { title: "Novapatch Glow", quantity: 1, price: 750, image: `${siteUrl}/products/Glow_thumb.jpg` },
          { title: "Novapatch Woman", quantity: 1, price: 750, image: `${siteUrl}/products/Woman_thumb.jpg` },
        ], 1275, siteUrl);
        break;

      case "subscription":
        subject = "Tu próxima recarga mensual se prepara · Novapatch";
        html = renderSubscriptionAlertEmail(customerName, "Suscripción Pack Día & Noche (15% OFF)", "18 de Agosto, 2026", 1275, siteUrl);
        break;

      default:
        return NextResponse.json({ error: "Plantilla no válida" }, { status: 400 });
    }

    // Check if real Resend API key is present
    const apiKey = process.env.RESEND_SECRET_KEY || process.env.RESEND_API_KEY;
    if (apiKey && !apiKey.startsWith("re_test")) {
      const resendInstance = new Resend(apiKey);
      
      let sendResult = await resendInstance.emails.send({
        from: "Novapatch <hola@novapatch.care>",
        to: targetEmail,
        subject,
        html,
      });

      // Fallback to Resend onboarding sender if domain is not fully verified in testing environment
      if (sendResult.error && sendResult.error.message.includes("domain")) {
        sendResult = await resendInstance.emails.send({
          from: "Novapatch <onboarding@resend.dev>",
          to: targetEmail,
          subject,
          html,
        });
      }

      if (sendResult.error) {
        return NextResponse.json({ error: sendResult.error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, messageId: sendResult.data?.id, mode: "resend" });
    }

    // Fallback: Simulated success for preview / dev
    return NextResponse.json({
      success: true,
      mode: "preview",
      message: "Email simulado correctamente (en dev sin RESEND_SECRET_KEY)",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error interno al enviar email" },
      { status: 500 }
    );
  }
}
