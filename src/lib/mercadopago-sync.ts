import MercadoPagoConfig, { Payment } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/server";
import { sendStatusUpdate } from "@/lib/email";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const STATUS_MAP: Record<string, string> = {
  approved: "approved",
  rejected: "rejected",
  cancelled: "cancelled",
  refunded: "refunded",
  in_process: "in_process",
  pending: "pending",
};

// Fetches a payment from MercadoPago's API (never trusts a client-supplied
// status) and syncs orders.payment_status. Shared by the webhook and by the
// /checkout/success fallback, so a missed/failed webhook doesn't leave an
// order stuck as "pending" forever after the customer actually paid.
export async function syncMpPayment(paymentId: string) {
  const paymentClient = new Payment(mpClient);
  const payment = await paymentClient.get({ id: paymentId });

  if (!payment || !payment.external_reference) return null;

  const supabase = await createAdminClient();
  const orderId = payment.external_reference;

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("payment_status, coupon_code")
    .eq("id", orderId)
    .single();

  if (!existingOrder) return null;

  const newStatus = STATUS_MAP[payment.status ?? ""] ?? "pending";
  const wasAlreadyApproved = existingOrder.payment_status === "approved";

  await supabase
    .from("orders")
    .update({
      payment_status: newStatus,
      mp_payment_id: String(payment.id),
      mp_merchant_order_id: payment.order?.id ? String(payment.order.id) : null,
    })
    .eq("id", orderId);

  if (newStatus === "approved" && !wasAlreadyApproved) {
    await supabase.rpc("decrement_stock_on_order", { p_order_id: orderId });
    await supabase.rpc("apply_fifo_lots_on_order", { p_order_id: orderId });

    if (existingOrder.coupon_code) {
      await supabase.rpc("increment_coupon_usage", { p_code: existingOrder.coupon_code });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, total")
      .eq("id", orderId)
      .single();

    if (order) {
      sendStatusUpdate({
        orderId: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        newStatus: "approved",
        total: order.total,
      }).catch((err) => console.error("[email] sendStatusUpdate:", err));
    }
  }

  return { orderId, status: newStatus };
}
