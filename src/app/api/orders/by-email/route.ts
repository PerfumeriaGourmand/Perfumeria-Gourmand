import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  if (!rateLimit(`orders-by-email:${getClientIp(req)}`, 8, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en unos minutos." }, { status: 429 });
  }

  const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, total, payment_status, created_at, payment_method, installments, items:order_items(product_name, size_ml, quantity, unit_price, total_price)"
    )
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}
