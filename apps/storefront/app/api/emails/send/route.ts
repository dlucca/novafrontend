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
    const { template, targetEmail, customerName = "Esteban" } = body;

    if (!targetEmail) {
      return NextResponse.json({ error: "Email de destino requerido" }, { status: 400 });
    }

    let html = "";
    let subject = "";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://novapatch.care";

    switch (template) {
      case "order":
        subject = "Confirmación de pedido #NV-84920 · Novapatch";
        html = renderOrderConfirmationEmail({
          orderNumber: "NV-84920",
          customerName,
          customerEmail: targetEmail,
          items: [
            { title: "Novapatch Energy", quantity: 1, price: 750, image: "https://novapatch.care/products/Energy_thumb.webp" },
            { title: "Novapatch Sleep", quantity: 1, price: 750, image: "https://novapatch.care/products/Sleep_thumb.webp" },
          ],
          subtotal: 1500,
          bundleDiscount: 225,
          bundleName: "Pack Día & Noche (15% OFF)",
          total: 1275,
          shippingAddress: {
            address: "Av. Insurgentes Sur 1602, Piso 4",
            city: "Ciudad de México",
            state: "CDMX",
            postalCode: "03940",
          },
        }, siteUrl);
        break;

      case "welcome":
        subject = "Bienvenido a Novapatch · Tu ritual empieza hoy";
        html = renderWelcomeEmail(customerName, siteUrl);
        break;

      case "cart":
        subject = "Tus parches te están esperando · Novapatch";
        html = renderCartRecoveryEmail(customerName, [
          { title: "Novapatch Glow", quantity: 1, price: 750, image: "https://novapatch.care/products/Glow_thumb.webp" },
          { title: "Novapatch Woman", quantity: 1, price: 750, image: "https://novapatch.care/products/Woman_thumb.webp" },
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
