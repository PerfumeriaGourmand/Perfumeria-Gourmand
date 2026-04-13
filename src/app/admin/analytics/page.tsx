export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

function getPast30Days() {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getPast12Months() {
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7)); // "YYYY-MM"
  }
  return months;
}

function formatUSD(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function AnalyticsPage() {
  const supabase = await createAdminClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const [ordersRes, topProductsRes, pageViewsRes, orderItemsWithCostRes, stockLotsRes, categoryItemsRes, activeVariantsRes] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, total, payment_status, created_at, items:order_items(product_name, quantity, total_price)"
        )
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true }),

      supabase
        .from("order_items")
        .select("product_name, quantity, total_price")
        .order("total_price", { ascending: false })
        .limit(50),

      supabase
        .from("page_views")
        .select("path, product_id, created_at")
        .gte("created_at", thirtyDaysAgo.toISOString()),

      // Order items con costo (para ganancia real) — solo de órdenes aprobadas
      supabase
        .from("order_items")
        .select("product_name, quantity, unit_price, total_price, cost_price, lot_id")
        .not("cost_price", "is", null)
        .not("lot_id", "is", null),

      // Lotes para detectar aumentos de costo
      supabase
        .from("stock_lots")
        .select("variant_id, cost_price_usd, cost_price_ars, purchase_date, created_at, product:products(name, brand)")
        .order("purchase_date", { ascending: true })
        .order("created_at", { ascending: true }),

      // Items con costo + categoría del producto (para ganancia por categoría)
      supabase
        .from("order_items")
        .select("quantity, total_price, cost_price, variant:product_variants(product:products(category))")
        .not("cost_price", "is", null)
        .not("variant_id", "is", null),

      // Variantes activas con stock > 0 (para productos sin movimiento)
      supabase
        .from("product_variants")
        .select("id, size_ml, stock, product:products!product_id(id, name, brand)")
        .eq("is_active", true)
        .gt("stock", 0),
    ]);

  const orders = ordersRes.data ?? [];
  const approvedOrders = orders.filter((o) => o.payment_status === "approved");
  const totalRevenue = approvedOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const totalOrders = orders.length;
  const approvedCount = approvedOrders.length;
  const conversionRate =
    totalOrders > 0 ? Math.round((approvedCount / totalOrders) * 100) : 0;
  const aov = approvedCount > 0 ? totalRevenue / approvedCount : 0;

  // ── Gráfico de ventas por día (30d) ──────────────────────────────────────
  const days = getPast30Days();
  const salesByDay = days.map((day) => {
    const dayOrders = approvedOrders.filter((o) => o.created_at.startsWith(day));
    return {
      day: day.slice(5), // MM-DD
      revenue: dayOrders.reduce((s, o) => s + (o.total ?? 0), 0),
      count: dayOrders.length,
    };
  });
  const maxRevenue = Math.max(...salesByDay.map((d) => d.revenue), 1);

  // ── Top productos por ingresos ────────────────────────────────────────────
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  (topProductsRes.data ?? []).forEach((item) => {
    if (!productMap[item.product_name]) {
      productMap[item.product_name] = { name: item.product_name, qty: 0, revenue: 0 };
    }
    productMap[item.product_name].qty += item.quantity;
    productMap[item.product_name].revenue += item.total_price;
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);
  const maxProductQty = Math.max(...topProducts.map((p) => p.qty), 1);

  const pageViews = pageViewsRes.data?.length ?? 0;

  // ── Ganancia real (FIFO) ──────────────────────────────────────────────────
  const itemsWithCost = orderItemsWithCostRes.data ?? [];
  const totalRealProfit = itemsWithCost.reduce(
    (sum, item) => sum + (item.total_price - (item.cost_price ?? 0) * item.quantity),
    0
  );
  const totalCost = itemsWithCost.reduce(
    (sum, item) => sum + (item.cost_price ?? 0) * item.quantity,
    0
  );
  const totalRevenueWithCost = itemsWithCost.reduce(
    (sum, item) => sum + item.total_price,
    0
  );
  const avgMarginPct =
    totalRevenueWithCost > 0
      ? Math.round((totalRealProfit / totalRevenueWithCost) * 100)
      : 0;

  // Top 10 más rentables por ganancia real
  const profitByProduct: Record<
    string,
    { name: string; qty: number; revenue: number; cost: number; profit: number }
  > = {};
  for (const item of itemsWithCost) {
    const name = item.product_name;
    if (!profitByProduct[name]) {
      profitByProduct[name] = { name, qty: 0, revenue: 0, cost: 0, profit: 0 };
    }
    profitByProduct[name].qty += item.quantity;
    profitByProduct[name].revenue += item.total_price;
    profitByProduct[name].cost += (item.cost_price ?? 0) * item.quantity;
    profitByProduct[name].profit +=
      item.total_price - (item.cost_price ?? 0) * item.quantity;
  }
  const topProfitProducts = Object.values(profitByProduct)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);
  const maxProfit = Math.max(...topProfitProducts.map((p) => p.profit), 1);

  // ── Productos con costo ↑20%+ ─────────────────────────────────────────────
  const allLots = stockLotsRes.data ?? [];
  const costAlerts: Array<{
    name: string;
    brand: string;
    prevCost: number;
    newCost: number;
    increasePct: number;
  }> = [];

  const lotsByVariant: Record<string, typeof allLots> = {};
  for (const lot of allLots) {
    if (!lotsByVariant[lot.variant_id]) lotsByVariant[lot.variant_id] = [];
    lotsByVariant[lot.variant_id].push(lot);
  }

  for (const [, varLots] of Object.entries(lotsByVariant)) {
    if (varLots.length < 2) continue;
    const last = varLots[varLots.length - 1];
    const prev = varLots[varLots.length - 2];
    if (last.cost_price_usd > prev.cost_price_usd * 1.2) {
      const increasePct = Math.round(
        ((last.cost_price_usd - prev.cost_price_usd) / prev.cost_price_usd) * 100
      );
      costAlerts.push({
        name: (last.product as unknown as { name: string; brand: string } | null)?.name ?? "—",
        brand: (last.product as unknown as { name: string; brand: string } | null)?.brand ?? "",
        prevCost: prev.cost_price_usd,
        newCost: last.cost_price_usd,
        increasePct,
      });
    }
  }

  // ── Ganancia por mes (12 meses) + IDs de órdenes recientes ──────────────
  const months = getPast12Months();
  const [allApprovedOrdersRes, recentApprovedOrderIdsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total, created_at")
      .eq("payment_status", "approved"),
    supabase
      .from("orders")
      .select("id")
      .eq("payment_status", "approved")
      .gte("created_at", ninetyDaysAgo.toISOString()),
  ]);

  const recentOrderIds = recentApprovedOrderIdsRes.data?.map((o) => o.id) ?? [];
  const soldVariantsRes =
    recentOrderIds.length > 0
      ? await supabase
          .from("order_items")
          .select("variant_id")
          .in("order_id", recentOrderIds)
          .not("variant_id", "is", null)
      : { data: [] as { variant_id: string | null }[] };

  const allApprovedOrders = allApprovedOrdersRes.data ?? [];
  const profitByMonth = months.map((month) => {
    const monthOrders = allApprovedOrders.filter((o) =>
      o.created_at.startsWith(month)
    );
    const revenue = monthOrders.reduce((s, o) => s + (o.total ?? 0), 0);
    const [year, monthNum] = month.split("-");
    return {
      label: `${monthNum}/${year.slice(2)}`,
      revenue,
      count: monthOrders.length,
    };
  });
  const maxMonthRevenue = Math.max(...profitByMonth.map((m) => m.revenue), 1);

  const hasFifoData = itemsWithCost.length > 0;

  // ── Ganancia por categoría ────────────────────────────────────────────────
  const CATEGORY_LABELS: Record<string, string> = {
    arabe: "Árabe",
    disenador: "Diseñador",
    nicho: "Nicho",
  };
  type CatStat = { revenue: number; cost: number; profit: number; qty: number };
  const categoryProfitMap: Record<string, CatStat> = {};
  for (const item of categoryItemsRes.data ?? []) {
    const cat =
      (item.variant as unknown as { product: { category: string } } | null)
        ?.product?.category ?? "otros";
    if (!categoryProfitMap[cat])
      categoryProfitMap[cat] = { revenue: 0, cost: 0, profit: 0, qty: 0 };
    categoryProfitMap[cat].revenue += item.total_price;
    categoryProfitMap[cat].cost += (item.cost_price ?? 0) * item.quantity;
    categoryProfitMap[cat].profit +=
      item.total_price - (item.cost_price ?? 0) * item.quantity;
    categoryProfitMap[cat].qty += item.quantity;
  }
  const categoryProfit = Object.entries(categoryProfitMap)
    .map(([cat, stats]) => ({
      cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      ...stats,
    }))
    .sort((a, b) => b.profit - a.profit);
  const maxCategoryProfit = Math.max(...categoryProfit.map((c) => c.profit), 1);

  // ── Productos sin movimiento (90 días) ────────────────────────────────────
  const soldVariantIds = new Set(
    (soldVariantsRes.data ?? [])
      .map((i) => i.variant_id)
      .filter((id): id is string => id !== null)
  );

  type ProductMovement = {
    productId: string;
    name: string;
    brand: string;
    totalStock: number;
  };
  // Productos cuyas variantes activas NO vendieron nada en 90 días
  const productIdsWithRecentSales = new Set(
    (activeVariantsRes.data ?? [])
      .filter((v) => soldVariantIds.has(v.id))
      .map(
        (v) =>
          (v.product as unknown as { id: string } | null)?.id
      )
      .filter((id): id is string => id !== undefined)
  );
  const noMovementMap: Record<string, ProductMovement> = {};
  for (const v of activeVariantsRes.data ?? []) {
    const p = v.product as unknown as { id: string; name: string; brand: string } | null;
    if (!p) continue;
    if (productIdsWithRecentSales.has(p.id)) continue;
    if (!noMovementMap[p.id]) {
      noMovementMap[p.id] = {
        productId: p.id,
        name: p.name,
        brand: p.brand,
        totalStock: 0,
      };
    }
    noMovementMap[p.id].totalStock += v.stock;
  }
  const productsWithoutMovement = Object.values(noMovementMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const statCards = [
    {
      label: "Ingresos (30d)",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      sub: `${approvedCount} órdenes · ticket prom. ${formatPrice(aov)}`,
      color: "text-gold",
    },
    {
      label: "Órdenes totales",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      sub: "Últimos 30 días",
      color: "text-blue-400",
    },
    {
      label: "Conversión",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      sub: `${approvedCount} de ${totalOrders} órdenes`,
      color: "text-green-400",
    },
    {
      label: "Visitas",
      value: pageViews.toLocaleString(),
      icon: Users,
      sub: "Vistas de producto (30d)",
      color: "text-purple-400",
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl text-cream mb-1">Analytics</h1>
        <p className="font-sans text-xs text-cream-dim">Datos de los últimos 30 días</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-obsidian-surface border border-gold/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                {card.label}
              </span>
              <card.icon size={16} strokeWidth={1.5} className={card.color} />
            </div>
            <p className={`font-display text-2xl ${card.color} mb-1`}>{card.value}</p>
            <p className="font-sans text-[10px] text-cream-dim">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── RENTABILIDAD REAL (FIFO) ─────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} strokeWidth={1.5} className="text-gold/60" />
          <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim">
            Rentabilidad real (costos FIFO)
          </h2>
        </div>

        {!hasFifoData ? (
          <div className="border border-gold/10 bg-obsidian-surface p-6 text-center">
            <p className="font-sans text-sm text-cream-dim italic">
              Sin datos de costos aún. Ingresá lotes de stock para activar el análisis de rentabilidad.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-obsidian-surface border border-gold/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                  Ganancia real total
                </span>
                <DollarSign size={16} strokeWidth={1.5} className="text-green-400" />
              </div>
              <p className="font-display text-2xl text-green-400 mb-1">
                {formatPrice(totalRealProfit)}
              </p>
              <p className="font-sans text-[10px] text-cream-dim">
                En ventas con lote asignado
              </p>
            </div>
            <div className="bg-obsidian-surface border border-gold/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                  Costo mercadería
                </span>
                <Package size={16} strokeWidth={1.5} className="text-red-400" />
              </div>
              <p className="font-display text-2xl text-red-400 mb-1">
                {formatPrice(totalCost)}
              </p>
              <p className="font-sans text-[10px] text-cream-dim">
                Costo total vendido (FIFO)
              </p>
            </div>
            <div className="bg-obsidian-surface border border-gold/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                  Margen promedio
                </span>
                <TrendingUp size={16} strokeWidth={1.5} className="text-gold" />
              </div>
              <p className="font-display text-2xl text-gold mb-1">
                {avgMarginPct}%
              </p>
              <p className="font-sans text-[10px] text-cream-dim">
                Sobre ventas con costo registrado
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Alertas de costo */}
      {costAlerts.length > 0 && (
        <div className="mb-8 border border-orange-500/20 bg-orange-500/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} strokeWidth={2} className="text-orange-400" />
            <h3 className="font-sans text-xs tracking-widest uppercase text-orange-400">
              Costo subió +20% — considerar actualizar precios
            </h3>
          </div>
          <div className="space-y-2">
            {costAlerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-orange-500/10 last:border-0"
              >
                <div>
                  <p className="font-sans text-xs text-cream">
                    {alert.brand} {alert.name}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="font-sans text-xs text-cream-dim">
                    Antes: {formatUSD(alert.prevCost)}
                  </span>
                  <span className="font-sans text-xs text-orange-400 font-medium">
                    Ahora: {formatUSD(alert.newCost)}
                  </span>
                  <span className="font-sans text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5">
                    +{alert.increasePct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico de ganancia por mes */}
      <div className="bg-obsidian-surface border border-gold/10 p-6 mb-8">
        <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim mb-6">
          Ingresos por mes — últimos 12 meses
        </h2>
        <div className="flex items-end gap-2 h-40">
          {profitByMonth.map((m) => {
            const heightPct =
              maxMonthRevenue > 0 ? (m.revenue / maxMonthRevenue) * 100 : 0;
            return (
              <div
                key={m.label}
                className="flex-1 flex flex-col items-center justify-end gap-1 group relative"
              >
                <div
                  className="w-full bg-gold/30 hover:bg-gold/60 transition-colors duration-200 min-h-[2px] rounded-t-sm"
                  style={{ height: `${Math.max(heightPct, 1)}%` }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-obsidian border border-gold/20 px-2 py-1 text-[9px] font-sans text-cream whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {m.label}
                  <br />
                  {formatPrice(m.revenue)}
                  <br />
                  {m.count} órdenes
                </div>
                <span className="font-sans text-[8px] text-cream-dim/60 mt-1">
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráfico de ventas por día (30d) */}
      <div className="bg-obsidian-surface border border-gold/10 p-6 mb-8">
        <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim mb-6">
          Ingresos por día — últimos 30 días
        </h2>
        <div className="flex items-end gap-[3px] h-40">
          {salesByDay.map((d) => {
            const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center justify-end gap-1 group relative"
              >
                <div
                  className="w-full bg-gold/30 hover:bg-gold/60 transition-colors duration-200 min-h-[2px] rounded-t-sm"
                  style={{ height: `${Math.max(heightPct, 1)}%` }}
                />
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-obsidian border border-gold/20 px-2 py-1 text-[9px] font-sans text-cream whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {d.day}
                  <br />
                  {formatPrice(d.revenue)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-sans text-[9px] text-cream-dim">{salesByDay[0]?.day}</span>
          <span className="font-sans text-[9px] text-cream-dim">Hoy</span>
        </div>
      </div>

      {/* Top productos rentables (FIFO) */}
      {hasFifoData && (
        <div className="bg-obsidian-surface border border-gold/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Package size={14} strokeWidth={1.5} className="text-gold/60" />
            <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim">
              Top 10 más rentables (ganancia real)
            </h2>
          </div>
          {topProfitProducts.length === 0 ? (
            <p className="font-sans text-sm text-cream-dim italic text-center py-8">
              Sin datos suficientes
            </p>
          ) : (
            <div className="space-y-4">
              {topProfitProducts.map((p, i) => {
                const marginPct =
                  p.revenue > 0 ? Math.round((p.profit / p.revenue) * 100) : 0;
                return (
                  <div key={p.name} className="flex items-center gap-4">
                    <span className="font-display text-lg text-cream-dim/30 w-6 text-right shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-cream truncate mb-1">
                        {p.name}
                      </p>
                      <div className="relative h-1.5 bg-obsidian rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-green-500/50 rounded-full"
                          style={{ width: `${(p.profit / maxProfit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-sans text-xs text-green-400">
                        {formatPrice(p.profit)}
                      </p>
                      <p className="font-sans text-[10px] text-cream-dim">
                        {p.qty} uds · {marginPct}% margen
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ganancia por categoría */}
      {categoryProfit.length > 0 && (
        <div className="bg-obsidian-surface border border-gold/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={14} strokeWidth={1.5} className="text-gold/60" />
            <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim">
              Ganancia por categoría (costos FIFO)
            </h2>
          </div>
          <div className="space-y-5">
            {categoryProfit.map((c) => {
              const marginPct =
                c.revenue > 0 ? Math.round((c.profit / c.revenue) * 100) : 0;
              return (
                <div key={c.cat} className="flex items-center gap-4">
                  <span className="font-sans text-xs text-cream w-24 shrink-0">
                    {c.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="relative h-1.5 bg-obsidian rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gold/50 rounded-full"
                        style={{ width: `${(c.profit / maxCategoryProfit) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0 min-w-[140px]">
                    <p className="font-sans text-xs text-green-400">
                      {formatPrice(c.profit)}
                    </p>
                    <p className="font-sans text-[10px] text-cream-dim">
                      {c.qty} uds · {marginPct}% margen · {formatPrice(c.revenue)} ingreso
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Productos sin movimiento (90 días) */}
      {productsWithoutMovement.length > 0 && (
        <div className="bg-obsidian-surface border border-gold/10 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} strokeWidth={1.5} className="text-yellow-400/70" />
              <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim">
                Sin ventas en últimos 90 días
              </h2>
            </div>
            <span className="font-sans text-[10px] text-cream-dim">
              {productsWithoutMovement.length} producto
              {productsWithoutMovement.length !== 1 ? "s" : ""} con stock inmovilizado
            </span>
          </div>
          <div className="divide-y divide-gold/5">
            {productsWithoutMovement.map((p) => (
              <div
                key={p.productId}
                className="flex items-center justify-between py-2.5"
              >
                <div>
                  <p className="font-sans text-xs text-cream">{p.name}</p>
                  <p className="font-sans text-[10px] text-cream-dim">{p.brand}</p>
                </div>
                <span className="font-sans text-[10px] text-yellow-400/80">
                  {p.totalStock} ud{p.totalStock !== 1 ? "s" : ""} en stock
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 10 más vendidos por unidades */}
      <div className="bg-obsidian-surface border border-gold/10 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package size={14} strokeWidth={1.5} className="text-gold/60" />
          <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim">
            Top 10 más vendidos (unidades)
          </h2>
        </div>
        {topProducts.length === 0 ? (
          <p className="font-sans text-sm text-cream-dim italic text-center py-8">
            Todavía no hay ventas registradas
          </p>
        ) : (
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="font-display text-lg text-cream-dim/30 w-6 text-right shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-cream truncate mb-1">{p.name}</p>
                  <div className="relative h-1.5 bg-obsidian rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gold/50 rounded-full"
                      style={{ width: `${(p.qty / maxProductQty) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-sans text-xs text-gold">{p.qty} uds</p>
                  <p className="font-sans text-[10px] text-cream-dim">{formatPrice(p.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
