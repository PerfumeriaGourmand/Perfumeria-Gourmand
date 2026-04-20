import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

// POST /api/admin/manual-sale
// Body: { product_id, variant_id, product_name, size_ml, quantity, unit_price, customer_name?, notes? }
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const {
      variant_id,
      product_name,
      size_ml,
      quantity,
      unit_price,
      customer_name,
      notes,
    } = body as {
      variant_id: string;
      product_name: string;
      size_ml: number | null;
      quantity: number;
      unit_price: number;
      customer_name?: string;
      notes?: string;
    };

    if (!variant_id || !product_name || !quantity || !unit_price) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (quantity <= 0 || unit_price <= 0) {
      return NextResponse.json(
        { error: "Cantidad y precio deben ser mayores a 0" },
        { status: 400 }
      );
    }

    const admin = await createAdminClient();

    // 1. Verificar stock disponible
    const { data: variant, error: variantError } = await admin
      .from("product_variants")
      .select("stock")
      .eq("id", variant_id)
      .single();

    if (variantError || !variant) {
      return NextResponse.json(
        { error: "Variante no encontrada" },
        { status: 404 }
      );
    }

    if (variant.stock < quantity) {
      return NextResponse.json(
        {
          error: `Stock insuficiente. Disponible: ${variant.stock} unidad${
            variant.stock !== 1 ? "es" : ""
          }`,
        },
        { status: 400 }
      );
    }

    const subtotal = Math.round(unit_price * quantity * 100) / 100;

    // 2. Crear orden
    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        customer_name: customer_name?.trim() || "Venta Manual",
        customer_email: "manual@gourmand.ar",
        payment_status: "approved",
        payment_method: null,
        subtotal,
        shipping_cost: 0,
        total: subtotal,
        notes: notes?.trim() || null,
        source: "manual",
        installments: 1,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw orderError ?? new Error("No se pudo crear la orden");
    }

    // 3. Crear order_item (cost_price lo asigna FIFO en el paso 5)
    const { error: itemError } = await admin.from("order_items").insert({
      order_id: order.id,
      variant_id,
      kit_id: null,
      product_name,
      size_ml: size_ml ?? null,
      quantity,
      unit_price: Math.round(unit_price * 100) / 100,
      total_price: subtotal,
      cost_price: null,
    });

    if (itemError) {
      await admin.from("orders").delete().eq("id", order.id);
      throw itemError;
    }

    // 4. Decrementar stock en product_variants
    const { error: decrementError } = await admin.rpc(
      "decrement_stock_on_order",
      { p_order_id: order.id }
    );

    if (decrementError) {
      console.error("[manual-sale] RPC decrement falló, fallback manual:", decrementError);
      await admin
        .from("product_variants")
        .update({ stock: variant.stock - quantity, updated_at: new Date().toISOString() })
        .eq("id", variant_id);
    }

    // 5. Asignar lotes FIFO y registrar cost_price real (ARS histórico del lote)
    const { error: fifoError } = await admin.rpc("apply_fifo_lots_on_order", { p_order_id: order.id });
    if (fifoError) {
      console.error("[manual-sale] RPC apply_fifo_lots_on_order falló:", fifoError);
    }

    return NextResponse.json({ ok: true, order_id: order.id });
  } catch (err) {
    console.error("[manual-sale POST]", err);
    const message = err instanceof Error ? err.message : "Error inesperado";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
