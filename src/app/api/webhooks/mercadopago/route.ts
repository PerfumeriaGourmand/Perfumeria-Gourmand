import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { createHmac } from "crypto";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

function verifyMpSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // Si no está configurado, se omite la validación

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");
  const dataId = new URL(req.url).searchParams.get("data.id");

  if (!xSignature || !xRequestId) return false;

  const parts = Object.fromEntries(xSignature.split(",").map((p) => p.split("=")));
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId ?? ""};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return expected === v1;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!verifyMpSignature(req, rawBody)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { type, data } = body;

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ received: true });
    }

    const paymentClient = new Payment(mpClient);
    const payment = await paymentClient.get({ id: data.id });

    if (!payment || !payment.external_reference) {
      return NextResponse.json({ received: true });
    }

    const supabase = await createAdminClient();
    const orderId = payment.external_reference;

    // Map MP status to our status
    const statusMap: Record<string, string> = {
      approved: "approved",
      rejected: "rejected",
      cancelled: "cancelled",
      refunded: "refunded",
      in_process: "in_process",
      pending: "pending",
    };

    const newStatus = statusMap[payment.status ?? ""] ?? "pending";

    // Update order
    await supabase
      .from("orders")
      .update({
        payment_status: newStatus,
        mp_payment_id: String(payment.id),
        mp_merchant_order_id: payment.order?.id ? String(payment.order.id) : null,
      })
      .eq("id", orderId);

    if (newStatus === "approved") {
      // 1. Descontar stock de product_variants
      await supabase.rpc("decrement_stock_on_order", { p_order_id: orderId });

      // 2. Asignar lotes FIFO y registrar cost_price real (ARS histórico del lote)
      await supabase.rpc("apply_fifo_lots_on_order", { p_order_id: orderId });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
