import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["pending", "in_process", "approved", "rejected", "cancelled", "refunded"];

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
  const { status } = await req.json();

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const admin = await createAdminClient();

  const { error } = await admin
    .from("orders")
    .update({ payment_status: status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (status === "approved") {
    const { error: decrementError } = await admin.rpc("decrement_stock_on_order", { p_order_id: id });
    if (decrementError) console.error("[orders PATCH] decrement_stock_on_order:", decrementError);

    const { error: fifoError } = await admin.rpc("apply_fifo_lots_on_order", { p_order_id: id });
    if (fifoError) console.error("[orders PATCH] apply_fifo_lots_on_order:", fifoError);
  }

  return NextResponse.json({ ok: true });
}
