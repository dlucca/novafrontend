/**
 * lib/emails/templates.ts — Plantillas de Email Transaccionales de Novapatch
 * Estilo estándar limpio (sin overrides de modo oscuro).
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
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; border-radius: 16px; overflow: hidden; background-color: #0F0F0F;">
      <tr>
        <td align="left" style="position: relative; padding: 0; margin: 0; line-height: 0;">
          <img
            src="${imageUrl}"
            alt="Novapatch Bienestar Silencioso"
            width="508"
            style="width: 100%; height: 210px; object-fit: cover; display: block; border-radius: 16px;"
          />
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 16px; padding: 24px 28px; display: flex; flex-direction: column; justify-content: flex-end; box-sizing: border-box; line-height: normal;">
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.035em; margin: 0 0 2px;">
              novapatch<span style="color: rgba(255, 255, 255, 0.7); font-weight: 400;">.care</span>
            </div>
            <div style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; font-weight: 500; color: rgba(255, 255, 255, 0.9); letter-spacing: -0.02em; text-transform: lowercase;">
              bienestar silencioso.
            </div>
          </div>
        </td>
      </tr>
    </table>
  `;
}

const FOOTER = `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 36px; border-top: 1px solid #E6E1D8;">
    <tr>
      <td align="left" style="padding: 24px 0 12px;">
        <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #A8A29A; margin: 0 0 10px; letter-spacing: -0.01em;">
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

// ─── 1. Confirmación de Compra ────────────────────────────────────────────────

export function renderOrderConfirmationEmail(data: OrderEmailData, baseUrl?: string): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 14px 0; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; font-weight: 600; color: #0F0F0F;">
        ${item.title}
      </td>
      <td style="padding: 14px 0; text-align: center; font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace; font-size: 13px; color: #A8A29A;">
        ×${item.quantity}
      </td>
      <td style="padding: 14px 0; text-align: right; font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace; font-size: 14px; font-weight: 700; color: #0F0F0F;">
        $${(item.price * item.quantity).toLocaleString()} MXN
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es-MX">
      <head>
        ${BASE_HEAD}
        <title>Confirmación de Pedido #${data.orderNumber} · Novapatch</title>
      </head>
      <body style="background-color: #FAF8F5; margin: 0; padding: 32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              
              <table width="580" className="email-container" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E6E1D8; border-radius: 20px; max-width: 580px; width: 100%; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.03);">
                <tr>
                  <td className="card-body" style="padding: 32px 36px 32px; text-align: left;">
                    
                    ${getHeroHeader(baseUrl)}

                    <!-- Header Row: Greeting & Order Number -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px; margin-bottom: 24px;">
                      <tr>
                        <td style="vertical-align: top;">
                          <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 0 0 4px; letter-spacing: -0.025em; text-transform: none;">
                            ¡Hola, ${data.customerName}!
                          </h1>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0;">
                            Confirmamos tu pedido.
                          </p>
                        </td>
                        <td style="vertical-align: top; text-align: right;">
                          <p style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; uppercase; tracking: 0.12em; color: #A8A29A; margin: 0 0 2px;">
                            PEDIDO
                          </p>
                          <p style="font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: #0F0F0F; margin: 0;">
                            #${data.orderNumber}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Stepper Visual Tracker -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; padding: 16px 8px;">
                      <tr>
                        <td width="33%" align="center" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; border-radius: 100px; background-color: #0F0F0F; color: #FFFFFF; font-size: 13px; font-weight: 700; text-align: center; line-height: 32px; margin: 0 auto 6px;">✓</div>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #0F0F0F; margin: 0;">Confirmado</p>
                        </td>
                        <td width="34%" align="center" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; border-radius: 100px; background-color: #FFFFFF; border: 1px solid #E6E1D8; color: #A8A29A; font-size: 12px; text-align: center; line-height: 32px; margin: 0 auto 6px;">►</div>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 500; color: #A8A29A; margin: 0;">En camino</p>
                        </td>
                        <td width="33%" align="center" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; border-radius: 100px; background-color: #FFFFFF; border: 1px solid #E6E1D8; color: #A8A29A; font-size: 12px; text-align: center; line-height: 32px; margin: 0 auto 6px;">✓</div>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 11px; font-weight: 500; color: #A8A29A; margin: 0;">Entregado</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Shipping Method & Address Columns -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                        <td width="50%" className="two-col" style="vertical-align: top; padding-right: 14px;">
                          <p style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #A8A29A; margin: 0 0 6px;">MÉTODO DE ENVÍO</p>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #0F0F0F; margin: 0 0 2px;">Envío Estándar Express</p>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0;">3–5 días hábiles</p>
                        </td>
                        <td width="50%" className="two-col" style="vertical-align: top; padding-left: 14px;">
                          <p style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #A8A29A; margin: 0 0 6px;">DIRECCIÓN DE ENVÍO</p>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #0F0F0F; margin: 0 0 2px;">${data.shippingAddress.name || data.customerName}</p>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0 0 2px;">${data.shippingAddress.address}</p>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0;">${data.shippingAddress.city}, ${data.shippingAddress.state}, ${data.shippingAddress.postalCode}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0 0 28px; line-height: 1.5;">
                      Tiempo estimado: <strong>2-3 días hábiles</strong>. Te enviaremos el número de guía por correo en cuanto tu paquete salga de almacén.
                    </p>

                    <div style="border-top: 1px solid #E6E1D8; margin-bottom: 24px;"></div>

                    <!-- Details Table -->
                    <p style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #A8A29A; margin: 0 0 12px;">DETALLE DEL PEDIDO</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #0F0F0F; border-bottom: 1px solid #0F0F0F; margin-bottom: 20px;">
                      ${itemsHtml}
                    </table>

                    <!-- Subtotal, Discount & Total Breakdown -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 12px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37;">Subtotal</td>
                              <td style="padding-bottom: 8px; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: #0F0F0F;">$${data.subtotal.toLocaleString()} MXN</td>
                            </tr>
                            ${
                              data.bundleDiscount > 0
                                ? `
                            <tr>
                              <td style="padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #0F0F0F; font-weight: 600;">
                                <span style="background-color: #0F0F0F; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 4px; margin-right: 6px; letter-spacing: 0.08em;">BUNDLE</span>
                                ${data.bundleName ?? "Descuento de Kit"}
                              </td>
                              <td style="padding-bottom: 8px; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #0F0F0F;">−$${data.bundleDiscount.toLocaleString()} MXN</td>
                            </tr>
                            `
                                : ""
                            }
                            <tr>
                              <td style="padding-bottom: 12px; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37;">Envío Estándar Express</td>
                              <td style="padding-bottom: 12px; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #0F0F0F;">GRATIS</td>
                            </tr>
                            <tr>
                              <td style="padding-top: 12px; border-top: 1px solid #E6E1D8; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #0F0F0F;">Total</td>
                              <td style="padding-top: 12px; border-top: 1px solid #E6E1D8; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: #0F0F0F;">$${data.total.toLocaleString()} MXN</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- TIPS PARA USARLO BIEN (Brand Kit Style) -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 20px 24px; text-align: left;">
                          <p style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #0F0F0F; margin: 0 0 8px;">
                            TIPS PARA USAR TU PARCHE
                          </p>
                          <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 13px; color: #3A3A37; margin: 0; line-height: 1.6;">
                            Úsalo entre 8 y 10 horas sobre la piel limpia y seca. Alterna la zona de colocación cada día (antebrazos, hombros o espalda alta). Si lo humedeces ligeramente antes de retirarlo, se desprende con total suavidad.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Pill CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td align="left">
                          <a href="https://novapatch.care/mx/cuenta/pedidos" style="background-color: #0F0F0F; color: #FFFFFF; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 16px 36px; border-radius: 100px; display: inline-block;">
                            Rastrear mi pedido →
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

// ─── 2. Carrito Abandonado / En Espera ─────────────────────────────────────────

export function renderCartRecoveryEmail(customerName: string, items: EmailOrderItem[], total: number, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es-MX">
      <head>
        ${BASE_HEAD}
        <title>Guardamos tu carrito · Novapatch</title>
      </head>
      <body style="background-color: #FAF8F5; margin: 0; padding: 32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              
              <table width="580" className="email-container" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E6E1D8; border-radius: 20px; max-width: 580px; width: 100%; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.03);">
                <tr>
                  <td className="card-body" style="padding: 32px 36px 32px; text-align: left;">
                    
                    ${getHeroHeader(baseUrl)}

                    <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 16px 0 16px; letter-spacing: -0.025em;">
                      Hola, ${customerName}.
                    </h1>
                    
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 16px; line-height: 1.6;">
                      Vimos que estuviste revisando Novapatch y dejaste algunos parches en tu carrito.
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 16px; line-height: 1.6;">
                      Sabemos que a veces no es el momento... pero si estabas pensando en probarlos, los dejamos listos para ti.
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 32px; line-height: 1.6;">
                      Pequeños cambios en la rutina pueden hacer una diferencia real — sobre todo cuando se trata de energía, foco o desconectar al final del día.
                    </p>

                    <!-- Pill CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td align="left">
                          <a href="https://novapatch.care/mx/checkout" style="background-color: #0F0F0F; color: #FFFFFF; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 16px 36px; border-radius: 100px; display: inline-block;">
                            Volver a mi carrito →
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

// ─── 3. Bienvenida & Guía de Uso ───────────────────────────────────────────────

export function renderWelcomeEmail(customerName: string, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es-MX">
      <head>
        ${BASE_HEAD}
        <title>Por qué un parche y no una pastilla · Novapatch</title>
      </head>
      <body style="background-color: #FAF8F5; margin: 0; padding: 32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              
              <table width="580" className="email-container" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E6E1D8; border-radius: 20px; max-width: 580px; width: 100%; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.03);">
                <tr>
                  <td className="card-body" style="padding: 32px 36px 32px; text-align: left;">
                    
                    ${getHeroHeader(baseUrl)}

                    <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 16px 0 16px; letter-spacing: -0.025em;">
                      Por qué un parche y no una pastilla
                    </h1>
                    
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 16px; line-height: 1.6;">
                      Hola, ${customerName}.
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 16px; line-height: 1.6;">
                      Tu piel filtra por tamaño molecular. Es la razón por la que un parche bien formulado puede acompañar tu bienestar de una forma que una pastilla no: vía tópica de liberación continua, sin pasar por la digestión y sin acordarte a mitad de la comida.
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #0F0F0F; margin: 0 0 28px; line-height: 1.6;">
                      Un solo gesto al día. Sin agua. Sin fricción.
                    </p>

                    <!-- Pill CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td align="left">
                          <a href="https://novapatch.care/mx/tienda" style="background-color: #0F0F0F; color: #FFFFFF; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 16px 36px; border-radius: 100px; display: inline-block;">
                            Conocer los parches →
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

// ─── 4. Alerta de Suscripción / Próximo Envío ─────────────────────────────────

export function renderSubscriptionAlertEmail(customerName: string, planName: string, nextDate: string, price: number, baseUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es-MX">
      <head>
        ${BASE_HEAD}
        <title>El plan que no tienes que volver a pensar · Novapatch</title>
      </head>
      <body style="background-color: #FAF8F5; margin: 0; padding: 32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              
              <table width="580" className="email-container" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E6E1D8; border-radius: 20px; max-width: 580px; width: 100%; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.03);">
                <tr>
                  <td className="card-body" style="padding: 32px 36px 32px; text-align: left;">
                    
                    ${getHeroHeader(baseUrl)}

                    <h1 style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #0F0F0F; margin: 16px 0 12px; letter-spacing: -0.025em;">
                      El plan que no tienes que volver a pensar
                    </h1>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 16px; line-height: 1.6;">
                      Hola, ${customerName}.
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; color: #3A3A37; margin: 0 0 24px; line-height: 1.6;">
                      El suplemento que funciona es el que sostienes. En 3 días procesaremos el envío automático de tu renovación para que nunca te quedes sin tu dosis diaria de bienestar.
                    </p>

                    <!-- Details Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 14px; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #0F0F0F;">${planName}</td>
                              <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #0F0F0F;">$${price.toLocaleString()} MXN</td>
                            </tr>
                            <tr>
                              <td style="padding-top: 8px; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; color: #A8A29A;">Fecha estimada de cobro</td>
                              <td style="padding-top: 8px; text-align: right; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; color: #0F0F0F; font-weight: 600;">${nextDate}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Pill CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td align="left">
                          <a href="https://novapatch.care/mx/cuenta/suscripciones" style="background-color: #0F0F0F; color: #FFFFFF; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 16px 36px; border-radius: 100px; display: inline-block;">
                            Gestionar mi suscripción →
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
