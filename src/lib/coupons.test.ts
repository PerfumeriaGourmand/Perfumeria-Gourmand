import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { validateCoupon } from "./coupons";

// Mock minimo del builder encadenado de supabase-js que usa validateCoupon:
// supabase.from("coupons").select("*").eq(...).eq(...).single()
function mockSupabase(coupon: Record<string, unknown> | null, error: unknown = null) {
  const builder = {
    select: () => builder,
    eq: () => builder,
    single: async () => ({ data: coupon, error }),
  };
  return { from: () => builder } as unknown as SupabaseClient;
}

describe("validateCoupon", () => {
  it("calcula el descuento porcentual sobre el subtotal", async () => {
    const supabase = mockSupabase({
      code: "VERANO20",
      description: null,
      discount_type: "percentage",
      discount_value: 20,
      current_uses: 0,
      max_uses: null,
      min_order_amount: null,
      expires_at: null,
      is_active: true,
    });

    const result = await validateCoupon(supabase, "verano20", 100000);

    expect(result.valid).toBe(true);
    if (result.valid) expect(result.discount_amount).toBe(20000);
  });

  it("calcula el descuento fijo, sin superar el subtotal", async () => {
    const supabase = mockSupabase({
      code: "FIJO50000",
      description: null,
      discount_type: "fixed",
      discount_value: 50000,
      current_uses: 0,
      max_uses: null,
      min_order_amount: null,
      expires_at: null,
      is_active: true,
    });

    const result = await validateCoupon(supabase, "FIJO50000", 30000);

    expect(result.valid).toBe(true);
    // El descuento fijo no puede superar el subtotal, si no la orden queda negativa
    if (result.valid) expect(result.discount_amount).toBe(30000);
  });

  it("rechaza un cupon inexistente o inactivo", async () => {
    const supabase = mockSupabase(null, { message: "not found" });
    const result = await validateCoupon(supabase, "NOEXISTE", 10000);
    expect(result.valid).toBe(false);
  });

  it("rechaza un cupon expirado", async () => {
    const supabase = mockSupabase({
      code: "VIEJO",
      discount_type: "fixed",
      discount_value: 1000,
      current_uses: 0,
      max_uses: null,
      min_order_amount: null,
      expires_at: "2020-01-01T00:00:00Z",
      is_active: true,
    });

    const result = await validateCoupon(supabase, "VIEJO", 10000);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toMatch(/expirado/i);
  });

  it("rechaza un cupon que ya alcanzo su limite de usos", async () => {
    const supabase = mockSupabase({
      code: "LIMITADO",
      discount_type: "fixed",
      discount_value: 1000,
      current_uses: 5,
      max_uses: 5,
      min_order_amount: null,
      expires_at: null,
      is_active: true,
    });

    const result = await validateCoupon(supabase, "LIMITADO", 10000);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toMatch(/usos/i);
  });

  it("rechaza si el subtotal no llega al minimo requerido", async () => {
    const supabase = mockSupabase({
      code: "MIN50000",
      discount_type: "percentage",
      discount_value: 10,
      current_uses: 0,
      max_uses: null,
      min_order_amount: 50000,
      expires_at: null,
      is_active: true,
    });

    const result = await validateCoupon(supabase, "MIN50000", 30000);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toMatch(/m[ií]nimo/i);
  });
});
