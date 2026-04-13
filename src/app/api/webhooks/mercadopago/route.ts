import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import MercadoPagoConfig, { Payment } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    // Decrement stock on approval
    if (newStatus === "approved") {
      // 1. Descontar stock de product_variants (sistema existente)
      await supabase.rpc("decrement_stock_on_order", { p_order_id: orderId });
      // 2. Asignar lotes FIFO y registrar costo en order_items
      await supabase.rpc("apply_fifo_lots_on_order", { p_order_id: orderId });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
