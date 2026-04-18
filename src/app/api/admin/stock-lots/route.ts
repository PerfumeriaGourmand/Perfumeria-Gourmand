import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

// GET /api/admin/stock-lots — lista todos los lotes con detalle de producto y variant
export async function GET() {
  try {
    await requireAuth();
    const admin = await createAdminClient();

    const { data, error } = await admin
      .from("stock_lots")
      .select(`*, product:products(id, name, brand), variant:product_variants(id, size_ml)`)
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// POST /api/admin/stock-lots — crea un nuevo lote e incrementa el stock del variant
export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const {
      product_id,
      variant_id,
      quantity_purchased,
      cost_price_usd,
      exchange_rate,
      cost_price_ars,
      purchase_date,
      notes,
    } = body;

    if (
      !product_id ||
      !variant_id ||
      !quantity_purchased ||
      !cost_price_usd ||
      !exchange_rate ||
      !cost_price_ars ||
      !purchase_date
    ) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const admin = await createAdminClient();

    // 0. Leer stock y CPP actual del variant ANTES de incrementar
    const { data: currentVariant } = await admin
      .from("product_variants")
      .select("stock, average_cost_usd")
      .eq("id", variant_id)
      .single();

    // 1. Crear lote
    const { data: lot, error: lotError } = await admin
      .from("stock_lots")
      .insert({
        product_id,
        variant_id,
        quantity_purchased: Number(quantity_purchased),
        quantity_remaining: Number(quantity_purchased),
        cost_price_usd: Number(cost_price_usd),
        exchange_rate: Number(exchange_rate),
        cost_price_ars: Number(cost_price_ars),
        purchase_date,
        notes: notes || null,
      })
      .select()
      .single();

    if (lotError || !lot) {
      throw lotError ?? new Error("No se pudo crear el lote");
    }

    // 2. Incrementar stock del variant (vía función SQL)
    const { error: rpcError } = await admin.rpc("increment_variant_stock", {
      p_variant_id: variant_id,
      p_quantity: Number(quantity_purchased),
    });

    if (rpcError) {
      console.error("[stock-lots] Error incrementando stock:", rpcError);
      // Fallback manual si la función aún no está en la DB
      const { data: variantData } = await admin
        .from("product_variants")
        .select("stock")
        .eq("id", variant_id)
        .single();
      if (variantData) {
        await admin
          .from("product_variants")
          .update({ stock: variantData.stock + Number(quantity_purchased) })
          .eq("id", variant_id);
      }
    }

    // 3. Recalcular CPP del variant
    //    Fórmula incremental: (avg_ant × stock_ant + costo_nuevo × qty_nueva)
    //                        / (stock_ant + qty_nueva)
    if (currentVariant) {
      const oldStock = currentVariant.stock ?? 0;
      const oldAvg = currentVariant.average_cost_usd ?? null;
      const newQty = Number(quantity_purchased);
      const newCostUsd = Number(cost_price_usd);

      const newAvg =
        oldStock > 0 && oldAvg !== null
          ? (oldAvg * oldStock + newCostUsd * newQty) / (oldStock + newQty)
          : newCostUsd;

      await admin
        .from("product_variants")
        .update({ average_cost_usd: Math.round(newAvg * 10000) / 10000 })
        .eq("id", variant_id);
    }

    return NextResponse.json({ id: lot.id, ok: true });
  } catch (err) {
    console.error("[stock-lots POST]", err);
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
