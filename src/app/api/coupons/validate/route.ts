import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Cupón inválido o inexistente" }, { status: 404 });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "El cupón ha expirado" }, { status: 400 });
    }

    if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json({ error: "El cupón ya no tiene usos disponibles" }, { status: 400 });
    }

    if (coupon.min_order_amount !== null && subtotal < coupon.min_order_amount) {
      return NextResponse.json(
        { error: `El monto mínimo para este cupón es ${coupon.min_order_amount}` },
        { status: 400 }
      );
    }

    const discount_amount =
      coupon.discount_type === "percentage"
        ? Math.round((subtotal * coupon.discount_value) / 100)
        : Math.min(coupon.discount_value, subtotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount,
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
