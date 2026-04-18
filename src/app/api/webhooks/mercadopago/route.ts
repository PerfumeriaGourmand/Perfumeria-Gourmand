import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import MercadoPagoConfig, { Payment } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ received: true });
    }

    const paymentClient = new Payment(mpClient);
    const payment = await paymentClient.get({ id: data.id });

    if (!payment || !payment.external_reference) {
      return NextResponse.json({ received: true });
    }

    const supabase = await createAdminClient();
    const orderId = payment.external_reference;

    // Map MP status to our status
    const statusMap: Record<string, string> = {
      approved: "approved",
      rejected: "rejected",
      cancelled: "cancelled",
      refunded: "refunded",
      in_process: "in_process",
      pending: "pending",
    };

    const newStatus = statusMap[payment.status ?? ""] ?? "pending";

    // Update order
    await supabase
      .from("orders")
      .update({
        payment_status: newStatus,
        mp_payment_id: String(payment.id),
        mp_merchant_order_id: payment.order?.id ? String(payment.order.id) : null,
      })
      .eq("id", orderId);

    // Decrement stock and record CPP cost on approval
    if (newStatus === "approved") {
      // 1. Descontar stock de product_variants
      await supabase.rpc("decrement_stock_on_order", { p_order_id: orderId });

      // 2. Registrar cost_price (CPP × TC) en cada order_item aprobado
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("id, variant_id")
        .eq("order_id", orderId)
        .not("variant_id", "is", null);

      if (orderItems && orderItems.length > 0) {
        const variantIds = [...new Set(orderItems.map((i) => i.variant_id as string))];

        const [variantsRes, lotsRes] = await Promise.all([
          supabase
            .from("product_variants")
            .select("id, average_cost_usd")
            .in("id", variantIds),
          supabase
            .from("stock_lots")
            .select("variant_id, exchange_rate")
            .in("variant_id", variantIds)
            .order("purchase_date", { ascending: false })
            .order("created_at", { ascending: false }),
        ]);

        // Mapa: variant_id → average_cost_usd
        const avgCostMap = new Map(
          (variantsRes.data ?? []).map((v) => [v.id, v.average_cost_usd])
        );

        // Mapa: variant_id → exchange_rate del lote más reciente
        const exchangeRateMap = new Map<string, number>();
        for (const lot of lotsRes.data ?? []) {
          if (!exchangeRateMap.has(lot.variant_id)) {
            exchangeRateMap.set(lot.variant_id, lot.exchange_rate);
          }
        }

        for (const item of orderItems) {
          const vid = item.variant_id as string;
          const avgCostUsd = avgCostMap.get(vid);
          const exchangeRate = exchangeRateMap.get(vid);
          if (avgCostUsd && exchangeRate) {
            const costPriceArs =
              Math.round(avgCostUsd * exchangeRate * 100) / 100;
            await supabase
              .from("order_items")
              .update({ cost_price: costPriceArs })
              .eq("id", item.id);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
