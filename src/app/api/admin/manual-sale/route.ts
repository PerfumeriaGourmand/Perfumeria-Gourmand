import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

// POST /api/admin/manual-sale
// Body: { variant_id, product_name, size_ml, quantity, unit_price, customer_name?, notes?,
//         payments: [{ destination_id, amount }] }   (la suma debe igualar el total)
//   o, por compatibilidad, payment_destination_id (pago único por el total)
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
      payment_destination_id,
      payments: rawPayments,
    } = body as {
      variant_id: string;
      product_name: string;
      size_ml: number | null;
      quantity: number;
      unit_price: number;
      customer_name?: string;
      notes?: string;
      payment_destination_id?: string;
      payments?: { destination_id: string; amount: number }[];
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

    const subtotal = Math.round(unit_price * quantity * 100) / 100;

    // Normalizar pagos: lista explícita o pago único por el total
    const payments =
      Array.isArray(rawPayments) && rawPayments.length > 0
        ? rawPayments.map((p) => ({
            destination_id: p?.destination_id,
            amount: Math.round(Number(p?.amount) * 100) / 100,
          }))
        : payment_destination_id
          ? [{ destination_id: payment_destination_id, amount: subtotal }]
          : [];

    if (payments.length === 0 || payments.some((p) => !p.destination_id)) {
      return NextResponse.json(
        { error: "Falta indicar el destino del dinero" },
        { status: 400 }
      );
    }
    if (payments.some((p) => !Number.isFinite(p.amount) || p.amount <= 0)) {
      return NextResponse.json(
        { error: "Cada monto del pago debe ser mayor a 0" },
        { status: 400 }
      );
    }
    const paidCents = payments.reduce((acc, p) => acc + Math.round(p.amount * 100), 0);
    if (paidCents !== Math.round(subtotal * 100)) {
      return NextResponse.json(
        { error: "La suma de los pagos no coincide con el total de la venta" },
        { status: 400 }
      );
    }
    // orders.payment_destination_id es una sola columna: guardamos el destino de mayor monto
    const mainDestinationId = payments.reduce((a, b) => (b.amount > a.amount ? b : a)).destination_id;

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

    // 2. Crear orden
    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        customer_name: customer_name?.trim() || "Venta Manual",
        customer_email: "manual@gourmand.ar",
        payment_status: "approved",
        payment_method: null,
        fulfillment_status: "delivered",
        payment_destination_id: mainDestinationId,
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

    // 6. Registrar un movimiento de dinero (entrada) por cada pago/cuenta destino
    const description = `${product_name}${size_ml ? ` ${size_ml}ml` : ""}`;
    const { error: movementError } = await admin.from("account_movements").insert(
      payments.map((p) => ({
        destination_id: p.destination_id,
        kind: "venta",
        amount: p.amount,
        description,
        order_id: order.id,
      }))
    );
    if (movementError) {
      console.error("[manual-sale] No se pudo registrar el movimiento de cuenta:", movementError);
    }

    return NextResponse.json({ ok: true, order_id: order.id });
  } catch (err) {
    return apiError(err, "manual-sale POST", "No se pudo registrar la venta");
  }
}
