import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { sendStatusUpdate, sendFulfillmentUpdate } from "@/lib/email";

const VALID_STATUSES = ["pending", "in_process", "approved", "rejected", "cancelled", "refunded"];
const VALID_FULFILLMENT_STATUSES = ["shipped", "delivered"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 401 });
  }

  const { id } = await params;
  const { status, fulfillment_status } = await req.json();

  if (fulfillment_status !== undefined) {
    if (!VALID_FULFILLMENT_STATUSES.includes(fulfillment_status)) {
      return NextResponse.json({ error: "Estado de envío inválido" }, { status: 400 });
    }

    const admin = await createAdminClient();

    const { data: existing } = await admin
      .from("orders")
      .select("payment_status")
      .eq("id", id)
      .single();

    if (existing?.payment_status !== "approved") {
      return NextResponse.json({ error: "El pedido todavía no tiene el pago aprobado" }, { status: 400 });
    }

    const { data: order, error } = await admin
      .from("orders")
      .update({ fulfillment_status })
      .eq("id", id)
      .select("id, customer_name, customer_email, total")
      .single();

    if (error) {
      console.error("[orders PATCH] fulfillment_status update:", error);
      return NextResponse.json({ error: "No se pudo actualizar el estado de envío" }, { status: 500 });
    }

    sendFulfillmentUpdate({
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      fulfillmentStatus: fulfillment_status,
      total: order.total,
    }).catch((err) => console.error("[email] sendFulfillmentUpdate:", err));

    return NextResponse.json({ ok: true });
  }

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const admin = await createAdminClient();

  const { error } = await admin
    .from("orders")
    .update({ payment_status: status })
    .eq("id", id);

  if (error) {
    console.error("[orders PATCH] payment_status update:", error);
    return NextResponse.json({ error: "No se pudo actualizar el estado" }, { status: 500 });
  }

  if (status === "approved") {
    const { error: decrementError } = await admin.rpc("decrement_stock_on_order", { p_order_id: id });
    if (decrementError) console.error("[orders PATCH] decrement_stock_on_order:", decrementError);

    const { error: fifoError } = await admin.rpc("apply_fifo_lots_on_order", { p_order_id: id });
    if (fifoError) console.error("[orders PATCH] apply_fifo_lots_on_order:", fifoError);
  }

  // Send status update email (fire-and-forget)
  admin
    .from("orders")
    .select("id, customer_name, customer_email, total")
    .eq("id", id)
    .single()
    .then(({ data: order }) => {
      if (!order) return;
      sendStatusUpdate({
        orderId: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        newStatus: status,
        total: order.total,
      }).catch((err) => console.error("[email] sendStatusUpdate:", err));
    });

  return NextResponse.json({ ok: true });
}
