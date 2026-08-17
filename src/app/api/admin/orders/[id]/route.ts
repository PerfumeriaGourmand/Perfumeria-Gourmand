import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { sendStatusUpdate, sendFulfillmentUpdate } from "@/lib/email";
import { apiError } from "@/lib/api-error";

const VALID_STATUSES = ["pending", "in_process", "approved", "rejected", "cancelled", "refunded"];
const VALID_FULFILLMENT_STATUSES = ["shipped", "delivered"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (err) {
    return apiError(err, "orders PATCH auth");
  }

  const { id } = await params;
  const { status, fulfillment_status, items } = await req.json();

  if (items !== undefined) {
    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some(
        (item) =>
          typeof item.id !== "string" ||
          typeof item.unit_price !== "number" ||
          !Number.isFinite(item.unit_price) ||
          item.unit_price < 0
      )
    ) {
      return NextResponse.json({ error: "Precios inválidos" }, { status: 400 });
    }

    const admin = await createAdminClient();

    const { data: existingItems, error: itemsFetchError } = await admin
      .from("order_items")
      .select("id, quantity")
      .eq("order_id", id);

    if (itemsFetchError || !existingItems) {
      return NextResponse.json({ error: "No se pudieron obtener los ítems" }, { status: 500 });
    }

    const quantityById = new Map(existingItems.map((i) => [i.id, i.quantity]));
    if (items.some((item) => !quantityById.has(item.id))) {
      return NextResponse.json({ error: "Ítem no pertenece a esta orden" }, { status: 400 });
    }

    for (const item of items as { id: string; unit_price: number }[]) {
      const quantity = quantityById.get(item.id)!;
      const { error: updateError } = await admin
        .from("order_items")
        .update({ unit_price: item.unit_price, total_price: item.unit_price * quantity })
        .eq("id", item.id);

      if (updateError) {
        console.error("[orders PATCH] order_items update:", updateError);
        return NextResponse.json({ error: "No se pudo actualizar el ítem" }, { status: 500 });
      }
    }

    const { data: allItems, error: allItemsError } = await admin
      .from("order_items")
      .select("total_price")
      .eq("order_id", id);

    const { data: orderRow, error: orderFetchError } = await admin
      .from("orders")
      .select("discount_amount")
      .eq("id", id)
      .single();

    if (allItemsError || !allItems || orderFetchError || !orderRow) {
      return NextResponse.json({ error: "No se pudo recalcular el total" }, { status: 500 });
    }

    const subtotal = allItems.reduce((sum, i) => sum + i.total_price, 0);
    const total = Math.max(0, subtotal - orderRow.discount_amount);

    const { error: orderUpdateError } = await admin
      .from("orders")
      .update({ subtotal, total })
      .eq("id", id);

    if (orderUpdateError) {
      console.error("[orders PATCH] order total update:", orderUpdateError);
      return NextResponse.json({ error: "No se pudo actualizar el total" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, subtotal, total });
  }

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

  const { data: existingOrder } = await admin
    .from("orders")
    .select("payment_status, coupon_code")
    .eq("id", id)
    .single();
  const wasAlreadyApproved = existingOrder?.payment_status === "approved";

  const { error } = await admin
    .from("orders")
    .update({ payment_status: status })
    .eq("id", id);

  if (error) {
    console.error("[orders PATCH] payment_status update:", error);
    return NextResponse.json({ error: "No se pudo actualizar el estado" }, { status: 500 });
  }

  if (status === "approved" && !wasAlreadyApproved) {
    const { error: decrementError } = await admin.rpc("decrement_stock_on_order", { p_order_id: id });
    if (decrementError) console.error("[orders PATCH] decrement_stock_on_order:", decrementError);

    const { error: fifoError } = await admin.rpc("apply_fifo_lots_on_order", { p_order_id: id });
    if (fifoError) console.error("[orders PATCH] apply_fifo_lots_on_order:", fifoError);

    if (existingOrder?.coupon_code) {
      const { error: couponError } = await admin.rpc("increment_coupon_usage", { p_code: existingOrder.coupon_code });
      if (couponError) console.error("[orders PATCH] increment_coupon_usage:", couponError);
    }
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
