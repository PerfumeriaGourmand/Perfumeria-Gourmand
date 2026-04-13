export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import ProductLotHistory from "@/components/admin/ProductLotHistory";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const [productRes, lotsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("stock_lots")
      .select("*, variant:product_variants(id, size_ml)")
      .eq("product_id", id)
      .order("purchase_date", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (!productRes.data) notFound();

  const product = productRes.data;
  const rawLots = lotsRes.data ?? [];

  // ── Calcular métricas por lote ──────────────────────────────────────────
  // Necesitamos los order_items asociados a cada lote para calcular ventas y ganancias
  const lotIds = rawLots.map((l) => l.id);
  let orderItemsByLot: Record<string, { quantity: number; total_price: number }[]> = {};

  if (lotIds.length > 0) {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("lot_id, quantity, total_price, unit_price")
      .in("lot_id", lotIds);

    for (const item of orderItems ?? []) {
      if (!item.lot_id) continue;
      if (!orderItemsByLot[item.lot_id]) orderItemsByLot[item.lot_id] = [];
      orderItemsByLot[item.lot_id].push(item);
    }
  }

  // Detectar aumento de costo entre lotes consecutivos por variant
  const lotsByVariant: Record<string, typeof rawLots> = {};
  for (const lot of rawLots) {
    if (!lotsByVariant[lot.variant_id]) lotsByVariant[lot.variant_id] = [];
    lotsByVariant[lot.variant_id].push(lot);
  }

  const lotsWithMetrics = rawLots.map((lot) => {
    const items = orderItemsByLot[lot.id] ?? [];
    const units_sold = items.reduce((s, i) => s + i.quantity, 0);
    const revenue = items.reduce((s, i) => s + i.total_price, 0);
    const cost = units_sold * lot.cost_price_ars;
    const profit = revenue - cost;

    // ¿El costo de este lote subió >20% respecto al lote anterior del mismo variant?
    const varLots = lotsByVariant[lot.variant_id] ?? [];
    const lotIndex = varLots.findIndex((l) => l.id === lot.id);
    let costIncreased = false;
    if (lotIndex > 0) {
      const prevLot = varLots[lotIndex - 1];
      if (lot.cost_price_usd > prevLot.cost_price_usd * 1.2) {
        costIncreased = true;
      }
    }

    return { ...lot, units_sold, revenue, profit, costIncreased };
  });

  const totalProfit = lotsWithMetrics.reduce((s, l) => s + l.profit, 0);
  const totalRevenue = lotsWithMetrics.reduce((s, l) => s + l.revenue, 0);
  const avgMarginPct = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-2">Editar producto</h1>
      <p className="font-sans text-xs text-cream-dim mb-10 tracking-wide">
        {product.name} — {product.brand}
      </p>

      <ProductForm product={product} />

      {/* Historial de lotes */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl text-cream">Historial de lotes</h2>
            <p className="font-sans text-xs text-cream-dim mt-1 tracking-wide">
              Seguimiento FIFO — costos y rentabilidad por lote
            </p>
          </div>
        </div>

        <ProductLotHistory
          lots={lotsWithMetrics}
          totalProfit={totalProfit}
          avgMarginPct={avgMarginPct}
        />
      </div>
    </div>
  );
}
