import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { sendStatusUpdate } from "@/lib/email";
import { verifyMpSignature } from "@/lib/mercadopago-signature";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const isValidSignature = verifyMpSignature({
      signatureHeader: req.headers.get("x-signature"),
      requestId: req.headers.get("x-request-id"),
      dataId: new URL(req.url).searchParams.get("data.id"),
      secret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
    });

    if (!isValidSignature) {
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

    // Fetch prior status before updating — MercadoPago retries webhooks, so
    // this guards stock decrement / coupon usage from running more than once
    // for the same order.
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("payment_status, coupon_code")
      .eq("id", orderId)
      .single();
    const wasAlreadyApproved = existingOrder?.payment_status === "approved";

    // Update order
    await supabase
      .from("orders")
      .update({
        payment_status: newStatus,
        mp_payment_id: String(payment.id),
        mp_merchant_order_id: payment.order?.id ? String(payment.order.id) : null,
      })
      .eq("id", orderId);

    if (newStatus === "approved" && !wasAlreadyApproved) {
      // 1. Descontar stock de product_variants
      await supabase.rpc("decrement_stock_on_order", { p_order_id: orderId });

      // 2. Asignar lotes FIFO y registrar cost_price real (ARS histórico del lote)
      await supabase.rpc("apply_fifo_lots_on_order", { p_order_id: orderId });

      // 3. Incrementar el contador de usos del cupón, si se usó uno
      if (existingOrder?.coupon_code) {
        await supabase.rpc("increment_coupon_usage", { p_code: existingOrder.coupon_code });
      }

      // 4. Send payment approved email (fire-and-forget)
      supabase
        .from("orders")
        .select("id, customer_name, customer_email, total")
        .eq("id", orderId)
        .single()
        .then(({ data: order }) => {
          if (!order) return;
          sendStatusUpdate({
            orderId: order.id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            newStatus: "approved",
            total: order.total,
          }).catch((err) => console.error("[email] sendStatusUpdate MP:", err));
        });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
