import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";

const FROM = process.env.RESEND_FROM_EMAIL ?? "Gourmand Perfumería <noreply@perfumeriagourmand.com>";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.perfumeriagourmand.com";

const STATUS_LABELS: Record<string, { label: string; message: string; color: string }> = {
  pending:    { label: "Pendiente de pago",    color: "#a4854c", message: "Tu pedido está esperando confirmación de pago." },
  in_process: { label: "En proceso",           color: "#a4854c", message: "Tu pago está siendo procesado. Te avisamos cuando se confirme." },
  approved:   { label: "Pago aprobado ✓",      color: "#4a9e6a", message: "¡Tu pago fue aprobado! Estamos preparando tu pedido para el envío." },
  rejected:   { label: "Pago rechazado",       color: "#c0392b", message: "Hubo un problema con tu pago. Comunicate con nosotros para resolverlo." },
  cancelled:  { label: "Pedido cancelado",     color: "#888",    message: "Tu pedido fue cancelado. Si tenés dudas, contactanos." },
  refunded:   { label: "Reintegro procesado",  color: "#4a9e6a", message: "El reintegro de tu pago fue procesado correctamente." },
};

const PAYMENT_LABELS: Record<string, string> = {
  credit_card:          "Tarjeta de crédito",
  debit_card:           "Tarjeta de débito",
  bank_transfer:        "Transferencia / CBU",
  mercadopago_wallet:   "MercadoPago",
};

// ─── Shared layout ──────────────────────────────────────────────────────────

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Gourmand Perfumería</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="max-width:580px;margin:0 auto;padding:40px 24px;font-family:Georgia,'Times New Roman',serif;">

    <!-- Header -->
    <div style="text-align:center;padding-bottom:32px;margin-bottom:32px;border-bottom:1px solid rgba(164,133,76,0.2);">
      <h1 style="margin:0;font-weight:300;font-size:30px;letter-spacing:0.15em;color:#a4854c;">GOURMAND</h1>
      <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(245,240,232,0.35);">Perfumería Premium</p>
    </div>

    <!-- Body -->
    ${content}

    <!-- Footer -->
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(164,133,76,0.1);text-align:center;">
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,240,232,0.25);">© ${new Date().getFullYear()} Gourmand Perfumería</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,240,232,0.2);">
        <a href="${BASE_URL}" style="color:#a4854c;text-decoration:none;">perfumeriagourmand.com</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Order confirmation ──────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  size_ml?: number | null;
  quantity: number;
  unit_price: number;
}

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  installments?: number;
  shippingAddress?: {
    street: string;
    number: string;
    apt?: string;
    city: string;
    province: string;
    zip: string;
  } | null;
  notes?: string | null;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const orderNum = data.orderId.slice(0, 8).toUpperCase();

  const itemsHtml = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(164,133,76,0.07);color:#f5f0e8;font-size:14px;">
          ${i.name}${i.size_ml ? ` <span style="color:rgba(245,240,232,0.4);font-size:12px;">${i.size_ml}ml</span>` : ""}
          <br><span style="font-family:Arial,sans-serif;font-size:11px;color:rgba(245,240,232,0.4);">x${i.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(164,133,76,0.07);text-align:right;color:#a4854c;font-size:14px;white-space:nowrap;">
          ${formatPrice(i.unit_price * i.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const addressText = data.shippingAddress
    ? `${data.shippingAddress.street} ${data.shippingAddress.number}${data.shippingAddress.apt ? `, ${data.shippingAddress.apt}` : ""}, ${data.shippingAddress.city}, ${data.shippingAddress.province} (${data.shippingAddress.zip})`
    : null;

  const content = `
    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(245,240,232,0.4);">Confirmación de pedido</p>
    <h2 style="margin:0 0 6px;font-weight:300;font-size:28px;color:#f5f0e8;">Recibimos tu pedido</h2>
    <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,232,0.5);">Hola ${data.customerName.split(" ")[0]}, gracias por tu compra.</p>

    <!-- Order number -->
    <div style="background:#111;border:1px solid rgba(164,133,76,0.15);padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(245,240,232,0.35);">Número de orden</p>
      <p style="margin:4px 0 0;font-family:'Courier New',monospace;font-size:18px;color:#a4854c;letter-spacing:0.1em;">#${orderNum}</p>
    </div>

    <!-- Items -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tbody>${itemsHtml}</tbody>
    </table>

    <!-- Total -->
    <div style="display:flex;justify-content:space-between;padding:14px 0;border-top:1px solid rgba(164,133,76,0.2);margin-bottom:28px;">
      <span style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.5);">Total</span>
      <span style="font-size:20px;color:#a4854c;">${formatPrice(data.total)}</span>
    </div>

    <!-- Meta -->
    <div style="background:#111;border:1px solid rgba(164,133,76,0.1);padding:18px 20px;margin-bottom:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(245,240,232,0.35);width:40%;">Pago</td>
          <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:13px;color:#f5f0e8;">
            ${PAYMENT_LABELS[data.paymentMethod] ?? data.paymentMethod}
            ${data.installments && data.installments > 1 ? ` — ${data.installments} cuotas` : ""}
          </td>
        </tr>
        ${addressText ? `
        <tr>
          <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(245,240,232,0.35);vertical-align:top;">Envío a</td>
          <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:13px;color:#f5f0e8;">${addressText}</td>
        </tr>` : ""}
        ${data.notes ? `
        <tr>
          <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(245,240,232,0.35);vertical-align:top;">Notas</td>
          <td style="padding:5px 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,232,0.6);">${data.notes}</td>
        </tr>` : ""}
      </table>
    </div>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,232,0.5);line-height:1.7;margin:0;">
      Nos pondremos en contacto para coordinar el envío. Si tenés alguna duda podés responder este mail.
    </p>
  `;

  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Pedido #${orderNum} recibido — Gourmand Perfumería`,
    html: layout(content),
  });
}

// ─── Status update ───────────────────────────────────────────────────────────

interface StatusUpdateData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  newStatus: string;
  total: number;
}

export async function sendStatusUpdate(data: StatusUpdateData) {
  const orderNum = data.orderId.slice(0, 8).toUpperCase();
  const statusInfo = STATUS_LABELS[data.newStatus] ?? { label: data.newStatus, message: "", color: "#a4854c" };

  const content = `
    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(245,240,232,0.4);">Actualización de pedido</p>
    <h2 style="margin:0 0 6px;font-weight:300;font-size:28px;color:#f5f0e8;">Tu pedido fue actualizado</h2>
    <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,232,0.5);">Hola ${data.customerName.split(" ")[0]},</p>

    <!-- Order number -->
    <div style="background:#111;border:1px solid rgba(164,133,76,0.15);padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(245,240,232,0.35);">Número de orden</p>
      <p style="margin:4px 0 0;font-family:'Courier New',monospace;font-size:18px;color:#a4854c;letter-spacing:0.1em;">#${orderNum}</p>
    </div>

    <!-- Status -->
    <div style="background:#111;border-left:3px solid ${statusInfo.color};padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(245,240,232,0.35);">Estado actual</p>
      <p style="margin:0 0 8px;font-size:18px;color:${statusInfo.color};">${statusInfo.label}</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,232,0.6);line-height:1.6;">${statusInfo.message}</p>
    </div>

    <div style="display:flex;justify-content:space-between;padding:14px 0;border-top:1px solid rgba(164,133,76,0.15);margin-bottom:28px;">
      <span style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.4);">Total del pedido</span>
      <span style="font-size:18px;color:#a4854c;">${formatPrice(data.total)}</span>
    </div>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,232,0.5);line-height:1.7;margin:0;">
      Si tenés alguna pregunta, podés responder este mail o visitarnos en
      <a href="${BASE_URL}" style="color:#a4854c;text-decoration:none;">perfumeriagourmand.com</a>.
    </p>
  `;

  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Tu pedido #${orderNum} — ${statusInfo.label}`,
    html: layout(content),
  });
}
