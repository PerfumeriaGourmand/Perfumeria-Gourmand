import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    return apiError(err, "orders pending-count auth");
  }

  const admin = await createAdminClient();

  const { count, error } = await admin
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("payment_status", "approved")
    .is("fulfillment_status", null);

  if (error) {
    console.error("[orders pending-count]", error);
    return NextResponse.json({ error: "No se pudo obtener el conteo" }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
