import type { SupabaseClient } from "@supabase/supabase-js";

type CouponValidationResult =
  | {
      valid: true;
      code: string;
      description: string | null;
      discount_type: "percentage" | "fixed";
      discount_value: number;
      discount_amount: number;
    }
  | { valid: false; error: string };

// Shared by /api/coupons/validate (preview in checkout) and /api/orders
// (real charge) — the order creation MUST re-validate and recompute the
// discount server-side instead of trusting whatever the client sends.
export async function validateCoupon(
  supabase: SupabaseClient,
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (error || !coupon) {
    return { valid: false, error: "Cupón inválido o inexistente" };
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: "El cupón ha expirado" };
  }

  if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
    return { valid: false, error: "El cupón ya no tiene usos disponibles" };
  }

  if (coupon.min_order_amount !== null && subtotal < coupon.min_order_amount) {
    return { valid: false, error: `El monto mínimo para este cupón es ${coupon.min_order_amount}` };
  }

  const discount_amount =
    coupon.discount_type === "percentage"
      ? Math.round((subtotal * coupon.discount_value) / 100)
      : Math.min(coupon.discount_value, subtotal);

  return {
    valid: true,
    code: coupon.code,
    description: coupon.description,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
    discount_amount,
  };
}
