import { Resend } from "resend";
import type { Locale } from "./i18n";

const emailCopy = {
  es: {
    subject: "🎁 Tu cupón de Barceló Guatemala City",
    preheader: "Aquí está tu cupón de bienvenida.",
    eyebrow: "Cupón de bienvenida",
    heading: "¡Aquí está tu cupón!",
    greeting: (name?: string | null) => (name ? `Hola ${name},` : "Hola,"),
    body: "Gracias por registrarte. Este es tu cupón de bienvenida para que lo disfrutes durante tu estancia en Barceló Guatemala City. Solo muestra tu código para canjearlo.",
    codeLabel: "Tu código",
    validity: "Válido por 1 semana a partir de hoy.",
    note: "Guarda este código. Te enviaremos también futuras ofertas exclusivas.",
    footer1: "Barceló Guatemala City · Ciudad de Guatemala",
    footer2:
      "Recibiste este correo porque te registraste en nuestra promoción. Si no fuiste tú, puedes ignorar este mensaje.",
  },
  en: {
    subject: "🎁 Your Barceló Guatemala City coupon",
    preheader: "Here is your welcome coupon.",
    eyebrow: "Welcome coupon",
    heading: "Here is your coupon!",
    greeting: (name?: string | null) => (name ? `Hi ${name},` : "Hi,"),
    body: "Thanks for signing up. This is your welcome coupon to enjoy during your stay at Barceló Guatemala City. Just show your code to redeem it.",
    codeLabel: "Your code",
    validity: "Valid for 1 week from today.",
    note: "Save this code. We'll also send you future exclusive offers.",
    footer1: "Barceló Guatemala City · Guatemala City",
    footer2:
      "You received this email because you signed up for our promotion. If this wasn't you, you can ignore this message.",
  },
} as const;

export function couponEmailHtml({
  name,
  couponCode,
  lang = "es",
  baseUrl = "",
}: {
  name?: string | null;
  couponCode: string;
  lang?: Locale;
  baseUrl?: string;
}) {
  const c = emailCopy[lang];
  // URL absoluta del banner (los correos requieren rutas absolutas para imágenes).
  const bannerSrc = `${baseUrl.replace(/\/$/, "")}/promo-banner.jpg`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="color-scheme" content="light" /><title>${c.heading}</title></head>
<body style="margin:0;padding:0;background-color:#f6f4ef;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${c.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f4ef;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(20,50,61,0.08);">
        <tr><td style="background-color:#2f5c78;background:linear-gradient(120deg,#2f5c78 0%,#1f7d9c 60%,#309dba 100%);padding:36px 40px;text-align:center;">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#ffffff;letter-spacing:0.3px;"><strong>Barceló</strong> <span style="opacity:0.9;">Guatemala City</span></span>
        </td></tr>
        <tr><td style="padding:40px 40px 8px 40px;font-family:Helvetica,Arial,sans-serif;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c99a3f;font-weight:bold;">${c.eyebrow}</p>
          <h1 style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:#14323d;">${c.heading}</h1>
          <p style="margin:0 0 14px 0;font-size:16px;line-height:1.6;color:#33474f;">${c.greeting(name)}</p>
          <p style="margin:0 0 28px 0;font-size:16px;line-height:1.6;color:#33474f;">${c.body}</p>
        </td></tr>
        <tr><td style="padding:0 40px 32px 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e3e0d8;border-radius:12px;background-color:#ffffff;overflow:hidden;">
            <tr><td style="padding:0;line-height:0;">
              <img src="${bannerSrc}" alt="1 bebida no alcohólica + 1 tapa de cortesía en nuestros centros de consumo" width="518" style="display:block;width:100%;height:auto;border:0;" />
            </td></tr>
            <tr><td style="padding:22px 24px;text-align:center;background-color:#f6f4ef;border-top:2px dashed #c9c5bb;">
              <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8e9091;font-weight:bold;">${c.codeLabel}</p>
              <p style="margin:0 0 10px 0;font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:bold;letter-spacing:3px;color:#14323d;">${couponCode}</p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:bold;color:#c99a3f;">${c.validity}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 40px 36px 40px;font-family:Helvetica,Arial,sans-serif;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#8e9091;text-align:center;">${c.note}</p>
        </td></tr>
        <tr><td style="background-color:#f6f4ef;padding:24px 40px;font-family:Helvetica,Arial,sans-serif;">
          <p style="margin:0 0 4px 0;font-size:12px;line-height:1.6;color:#8e9091;text-align:center;">${c.footer1}</p>
          <p style="margin:0;font-size:12px;line-height:1.6;color:#8e9091;text-align:center;">${c.footer2}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendCouponEmail({
  to,
  name,
  couponCode,
  lang = "es",
  baseUrl = "",
}: {
  to: string;
  name?: string | null;
  couponCode: string;
  lang?: Locale;
  baseUrl?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Faltan RESEND_API_KEY o EMAIL_FROM.");
  const resend = new Resend(apiKey);
  return resend.emails.send({
    from,
    to,
    subject: emailCopy[lang].subject,
    html: couponEmailHtml({ name, couponCode, lang, baseUrl }),
  });
}
