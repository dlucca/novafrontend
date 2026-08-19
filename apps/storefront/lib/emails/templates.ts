/**
 * lib/emails/templates.ts — Plantillas de Email Transaccionales de Novapatch (Brand Kit)
 * Contiene el renderizador HTML para las 11 plantillas del sistema.
 */

export type EmailOrderItem = {
  title: string;
  quantity: number;
  price: number;
  image?: string;
  modeText?: string;
};

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: EmailOrderItem[];
  subtotal: number;
  bundleDiscount: number;
  bundleName: string | null;
  total: number;
  shippingAddress: {
    name?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
};

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.novapatch.care";

const BASE_HEAD = `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #FAF8F5 !important;
      -webkit-font-smoothing: antialiased;
    }
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .card-body {
        padding: 24px 20px !important;
      }
      .two-col {
        display: block !important;
        width: 100% !important;
        margin-bottom: 16px !important;
      }
    }
  </style>
`;

function getHeroHeader(baseUrl?: string): string {
  const root = baseUrl ?? DEFAULT_SITE_URL;
  const imageUrl = root ? `${root.replace(/\/$/, "")}/carousel/Email_hero.jpg` : "https://www.novapatch.care/carousel/Email_hero.jpg";
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; border-radius: 16px; overflow: hidden;">
      <tr>
        <td align="left" style="padding: 0; margin: 0; line-height: 0;">
          <img
            src="${imageUrl}"
            alt="Novapatch Bienestar Silencioso"
            width="508"
            style="width: 100%; height: auto; display: block; border-radius: 16px;"
          />
        </td>
      </tr>
    </table>
  `;
}

const FOOTER = `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 36px; border-top: 1px solid #E6E1D8;">
    <tr>
      <td align="left" style="padding: 24px 0 12px;">
        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #A8A29A; margin: 0 0 10px; letter-spacing: -0.01em; font-style: italic;">
          bienestar silencioso.
        </p>
        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; color: #3A3A37; margin: 0 0 6px; line-height: 1.5;">
          Novapatch Care · Ciudad de México · <a href="https://novapatch.care/mx" style="color: #0F0F0F; text-decoration: underline; font-weight: 600;">novapatch.care/mx</a>
        </p>
        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; color: #A8A29A; margin: 0;">
          © ${new Date().getFullYear()} Novapatch Inc. Todos los derechos reservados.
        </p>
      </td>
    </tr>
  </table>
`;

// Helper para formato de moneda
function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── 1. Confirmación de Compra ────────────────────────────────────────────────
export function renderOrderConfirmationEmail(data: OrderEmailData, baseUrl?: string): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E6E1D8; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; font-weight: 600; color: #0F0F0F;">
          ${item.title} ${item.modeText ? `<span style="font-size: 11px; color: #0F0F0F; font-weight: 600;">· ${item.modeText}</span>` : ""}
        </td>
        <td align="center" style="padding: 12px 0; border-bottom: 1px solid #E6E1D8; font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 13px; color: #A8A29A; width: 48px;">
          ×${item.quantity}
        </td>
        <td align="right" style="padding: 12px 0; border-bottom: 1px solid #E6E1D8; font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 14px; font-weight: 700; color: #0F0F0F; width: 100px;">
          ${fmtCurrency(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <!-- Greeting & Order Number -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                      <td align="left" style="vertical-align: top;">
                        <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px; letter-spacing: -0.025em;">
                          ¡Hola, ${data.customerName}!
                        </h1>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0;">
                          Confirmamos tu pedido.
                        </p>
                      </td>
                      <td align="right" style="vertical-align: top;">
                        <span style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 10px; font-weight: 700; color: #A8A29A; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 2px;">
                          PEDIDO
                        </span>
                        <span style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 18px; font-weight: 700; color: #0F0F0F;">
                          #${data.orderNumber}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Tracker -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 12px; padding: 14px 16px;">
                    <tr>
                      <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; font-weight: 600; color: #0F0F0F;">
                        ✓ Confirmado &nbsp; ➔ &nbsp; <span style="color: #A8A29A;">En camino</span> &nbsp; ➔ &nbsp; <span style="color: #A8A29A;">Entregado</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Shipping details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td class="two-col" width="50%" style="vertical-align: top; padding-right: 14px;">
                        <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 10px; font-weight: 700; color: #A8A29A; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 6px;">
                          MÉTODO DE ENVÍO
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #0F0F0F; margin: 0 0 2px;">
                          Envío Estándar Express
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0;">
                          3–5 días hábiles
                        </p>
                      </td>
                      <td class="two-col" width="50%" style="vertical-align: top; padding-left: 14px;">
                        <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 10px; font-weight: 700; color: #A8A29A; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 6px;">
                          DIRECCIÓN DE ENVÍO
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #0F0F0F; margin: 0 0 2px;">
                          ${data.shippingAddress.name || data.customerName}
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0 0 2px;">
                          ${data.shippingAddress.address}
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0;">
                          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Items Table -->
                  <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 10px; font-weight: 700; color: #A8A29A; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 12px;">
                    DETALLE DEL PEDIDO
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                    ${itemsHtml}
                  </table>

                  <!-- Totals -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; padding-top: 12px;">
                    <tr>
                      <td align="right" style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #0F0F0F; padding-right: 8px;">
                        Total
                      </td>
                      <td align="right" style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 18px; font-weight: 800; color: #0F0F0F; width: 110px;">
                        ${fmtCurrency(data.total)}
                      </td>
                    </tr>
                  </table>

                  <!-- Tips Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 20px 24px;">
                    <tr>
                      <td>
                        <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 10px; font-weight: 700; color: #0F0F0F; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">
                          TIPS PARA USAR TU PARCHE
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0; line-height: 1.6;">
                          Úsalo entre 8 y 10 horas sobre la piel limpia y seca. Alterna la zona de colocación cada día (antebrazos, hombros o espalda alta). Si lo humedeces ligeramente antes de retirarlo, se desprende con total suavidad.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                    <tr>
                      <td align="center">
                        <a href="https://www.novapatch.care/mx/cuenta" style="background-color: #0F0F0F; color: #FFFFFF; border: 1px solid #0F0F0F; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; border-radius: 100px; display: inline-block; text-decoration: none;">
                          VER DETALLE DE TU PEDIDO
                        </a>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 2. Pedido Enviado ────────────────────────────────────────────────────────
export function renderOrderShippedEmail(data: { name: string; displayId: string; trackingNumber: string; carrier: string; trackingUrl: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    ¡Hola, ${data.name}!
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    Tu pedido #${data.displayId} está en camino.
                  </p>

                  <!-- Order Tracker -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 12px; padding: 14px 16px;">
                    <tr>
                      <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; font-weight: 600; color: #0F0F0F;">
                        ✓ Confirmado &nbsp; ➔ &nbsp; <strong style="color: #0F0F0F;">► EN CAMINO</strong> &nbsp; ➔ &nbsp; <span style="color: #A8A29A;">Entregado</span>
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 20px 24px;">
                    <tr>
                      <td>
                        <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 10px; font-weight: 700; color: #A8A29A; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 6px;">
                          NÚMERO DE GUÍA DE RASTREO
                        </p>
                        <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 18px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                          ${data.trackingNumber}
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0;">
                          Paquetería: <strong>${data.carrier}</strong>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="${data.trackingUrl}" style="background-color: #0F0F0F; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; border-radius: 100px; display: inline-block; text-decoration: none;">
                          RASTREAR MI PEDIDO EN VIVO
                        </a>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 3. Pedido Entregado ──────────────────────────────────────────────────────
export function renderOrderDeliveredEmail(data: { name: string; displayId: string; trackingNumber: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    ¡Hola, ${data.name}!
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    Tu pedido #${data.displayId} ha sido entregado en tu domicilio.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 20px 24px;">
                    <tr>
                      <td>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                          ¡Entregado con éxito! 🎉
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0;">
                          Guía: <strong style="font-family: 'JetBrains Mono', monospace;">${data.trackingNumber}</strong>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0 0 24px; line-height: 1.6;">
                    Esperamos que disfrutes tu nuevo ritual de bienestar Novapatch. Si tienes cualquier duda sobre cómo aplicar tus parches, escríbenos directamente a <a href="mailto:hola@novapatch.care" style="color: #0F0F0F; font-weight: 600;">hola@novapatch.care</a>.
                  </p>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 4. Intento de Entrega Fallido ───────────────────────────────────────────
export function renderOrderDeliveryFailedEmail(data: { name: string; displayId: string; trackingNumber: string; reason?: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    ¡Hola, ${data.name}!
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    La paquetería no pudo completar la entrega de tu pedido #${data.displayId}.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 20px 24px;">
                    <tr>
                      <td>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #0F0F0F; margin: 0 0 6px;">
                          Aviso de Entrega Pendiente
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0 0 6px;">
                          El transportista intentó entregar tu pedido pero no fue posible completarlo.
                        </p>
                        ${data.reason ? `<p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; color: #A8A29A; margin: 0;">Detalle: ${data.reason}</p>` : ""}
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="mailto:hola@novapatch.care" style="background-color: #0F0F0F; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; border-radius: 100px; display: inline-block; text-decoration: none;">
                          CONTACTAR A SOPORTE
                        </a>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 5. Bienvenida a Suscripción ─────────────────────────────────────────────
export function renderSubscriptionWelcomeEmail(data: { name: string; planName: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    ¡Bienvenido a tu suscripción, ${data.name}!
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    Tu plan de bienestar continuo <strong>${data.planName}</strong> ya está activo.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 20px 24px;">
                    <tr>
                      <td>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0; line-height: 1.6;">
                          A partir de hoy recibirás tus parches automáticamente en la puerta de tu casa. Podrás pausar, modificar o cancelar tu plan en cualquier momento desde tu panel de usuario.
                        </p>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 6. Aviso de Próximo Cobro de Suscripción ───────────────────────────────
export function renderSubscriptionUpcomingChargeEmail(data: { name: string; planName: string; chargeDate: string; amount: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    Tu suscripción se renovará pronto
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    Hola ${data.name}, te recordamos que tu plan <strong>${data.planName}</strong> se procesará el <strong>${data.chargeDate}</strong>.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 20px 24px;">
                    <tr>
                      <td>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0 0 6px;">
                          Monto a cobrar: <strong>${data.amount}</strong>
                        </p>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; color: #A8A29A; margin: 0;">
                          Si deseas hacer cambios en la dirección o pausar la entrega, puedes hacerlo desde tu cuenta antes de esa fecha.
                        </p>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 7. Renovación Exitosa de Suscripción ────────────────────────────────────
export function renderSubscriptionRenewedEmail(data: { name: string; planName: string; amount: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    ¡Renovación procesada con éxito!
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    Hola ${data.name}, confirmamos el cobro de tu plan <strong>${data.planName}</strong> por <strong>${data.amount}</strong>.
                  </p>

                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0 0 24px; line-height: 1.6;">
                    Estamos preparando tu pedido y te enviaremos la guía de rastreo en cuanto salga de nuestro almacén.
                  </p>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 8. Pago Fallido de Suscripción ──────────────────────────────────────────
export function renderSubscriptionPaymentFailedEmail(data: { name: string; planName: string; updateUrl: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    No pudimos procesar tu pago de suscripción
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    Hola ${data.name}, la tarjeta asociada a tu plan <strong>${data.planName}</strong> fue rechazada.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="${data.updateUrl}" style="background-color: #0F0F0F; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; border-radius: 100px; display: inline-block; text-decoration: none;">
                          ACTUALIZAR MÉTODO DE PAGO
                        </a>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 9. Recuperación de Carrito Abandonado ──────────────────────────────────
export function renderCartRecoveryEmail(customerName: string, items: EmailOrderItem[], total: number, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 8px;">
                    Tus parches Novapatch te están esperando
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px; line-height: 1.6;">
                    Hola ${customerName}, notamos que dejaste algunos productos seleccionados en tu carrito. Guardamos tu selección para que retomes tu pedido cuando gustes.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="https://www.novapatch.care/mx/checkout" style="background-color: #0F0F0F; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; border-radius: 100px; display: inline-block; text-decoration: none;">
                          VOLVER A MI CARRITO
                        </a>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 10. Muestras a Influencers / PR ─────────────────────────────────────────
export function renderInfluencerSamplesEmail(data: { name: string; trackingNumber: string; carrier: string; trackingUrl: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    ¡Tus muestras están en camino, ${data.name}! 🎁
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px; line-height: 1.6;">
                    Qué emoción colaborar contigo. Tus parches Novapatch ya están viajando a tu domicilio.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 20px 24px;">
                    <tr>
                      <td>
                        <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 10px; font-weight: 700; color: #A8A29A; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 6px;">
                          NÚMERO DE GUÍA DE RASTREO
                        </p>
                        <p style="font-family: 'JetBrains Mono', monospace, sans-serif; font-size: 18px; font-weight: 700; color: #0F0F0F; margin: 0;">
                          ${data.trackingNumber}
                        </p>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── 11. Invitación a Administrador ──────────────────────────────────────────
export function renderAdminInviteEmail(data: { email: string; inviteUrl: string }, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>${BASE_HEAD}</head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table class="email-container" width="580" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 32px 36px;">
              <tr>
                <td>
                  ${getHeroHeader(baseUrl)}

                  <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px;">
                    Te invitaron al equipo de Novapatch
                  </h1>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 20px;">
                    Recibiste acceso para ingresar al panel de administración con el correo <strong>${data.email}</strong>.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="${data.inviteUrl}" style="background-color: #0F0F0F; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; border-radius: 100px; display: inline-block; text-decoration: none;">
                          ACEPTAR INVITACIÓN
                        </a>
                      </td>
                    </tr>
                  </table>

                  ${FOOTER}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Mantener retrocompatibilidad con importación de bienvenida previa
export function renderWelcomeEmail(name: string, baseUrl?: string): string {
  return renderSubscriptionWelcomeEmail({ name, planName: "Plan Ritual Novapatch" }, baseUrl);
}

export function renderSubscriptionAlertEmail(name: string, planName: string, chargeDate: string, amount: number, baseUrl?: string): string {
  return renderSubscriptionUpcomingChargeEmail({ name, planName, chargeDate, amount: fmtCurrency(amount) }, baseUrl);
}
