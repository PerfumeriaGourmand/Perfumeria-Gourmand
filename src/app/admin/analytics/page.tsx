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
import AnalyticsPeriodFilter, {
  type Period,
} from "@/components/admin/AnalyticsPeriodFilter";

// ── Period helpers ────────────────────────────────────────────────────────────

function getPeriodStart(period: Period): Date | null {
  const now = new Date();
  switch (period) {
    case "daily": {
      const d = new Date(now);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    }
    case "weekly": {
      const dow = now.getUTCDay(); // 0=dom
      const diffToMonday = dow === 0 ? -6 : 1 - dow;
      const d = new Date(now);
      d.setUTCDate(now.getUTCDate() + diffToMonday);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    }
    case "monthly": {
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    }
    case "yearly": {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      d.setDate(d.getDate() + 1);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    }
    case "lifetime":
      return null;
  }
}

function getPeriodLabel(period: Period): string {
  switch (period) {
    case "daily":    return "hoy";
    case "weekly":   return "esta semana";
    case "monthly":  return "este mes";
    case "yearly":   return "último año";
    case "lifetime": return "historial completo";
  }
}

function getChartTitle(period: Period): string {
  switch (period) {
    case "daily":    return "Ingresos por hora — hoy";
    case "weekly":   return "Ingresos por día — esta semana";
    case "monthly":  return "Ingresos por día — este mes";
    case "yearly":   return "Ingresos por mes — último año";
    case "lifetime": return "Ingresos por mes — historial completo";
  }
}

type ChartBucket = { label: string; revenue: number; count: number };
type OrderForChart = { created_at: string; total: number };

function getChartBuckets(
  period: Period,
  approvedOrders: OrderForChart[]
): ChartBucket[] {
  const now = new Date();

  if (period === "daily") {
    const todayUtc = now.toISOString().slice(0, 10);
    return Array.from({ length: 24 }, (_, h) => {
      const filtered = approvedOrders.filter((o) => {
        if (!o.created_at.startsWith(todayUtc)) return false;
        return parseInt(o.created_at.slice(11, 13), 10) === h;
      });
      return {
        label: `${String(h).padStart(2, "0")}h`,
        revenue: filtered.reduce((s, o) => s + (o.total ?? 0), 0),
        count: filtered.length,
      };
    });
  }

  if (period === "weekly") {
    const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const dow = now.getUTCDay();
    const diffToMonday = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + diffToMonday);
    monday.setUTCHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setUTCDate(monday.getUTCDate() + i);
      const day = d.toISOString().slice(0, 10);
      const filtered = approvedOrders.filter((o) => o.created_at.startsWith(day));
      return {
        label: DAY_LABELS[i],
        revenue: filtered.reduce((s, o) => s + (o.total ?? 0), 0),
        count: filtered.length,
      };
    });
  }

  if (period === "monthly") {
    const y = now.getUTCFullYear();
    const mo = now.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = `${y}-${String(mo + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
      const filtered = approvedOrders.filter((o) => o.created_at.startsWith(day));
      return {
        label: String(i + 1),
        revenue: filtered.reduce((s, o) => s + (o.total ?? 0), 0),
        count: filtered.length,
      };
    });
  }

  // yearly / lifetime → monthly buckets
  let startYear: number;
  let startMonth: number; // 0-indexed

  if (period === "yearly") {
    const d = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    startYear = d.getFullYear();
    startMonth = d.getMonth();
  } else {
    // lifetime: first order month
    const sorted = [...approvedOrders].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    );
    if (sorted.length === 0) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      startYear = d.getFullYear();
      startMonth = d.getMonth();
    } else {
      const [y, m] = sorted[0].created_at.slice(0, 7).split("-").map(Number);
      startYear = y;
      startMonth = m - 1;
    }
  }

  const buckets: ChartBucket[] = [];
  let y = startYear;
  let m = startMonth;

  while (y < now.getFullYear() || (y === now.getFullYear() && m <= now.getMonth())) {
    const mm = String(m + 1).padStart(2, "0");
    const monthStr = `${y}-${mm}`;
    const filtered = approvedOrders.filter((o) => o.created_at.startsWith(monthStr));
    buckets.push({
      label: `${mm}/${String(y).slice(2)}`,
      revenue: filtered.reduce((s, o) => s + (o.total ?? 0), 0),
      count: filtered.length,
    });
    m++;
    if (m > 11) { m = 0; y++; }
  }

  return buckets.length > 0 ? buckets : [{ label: "—", revenue: 0, count: 0 }];
}

function formatUSD(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const VALID_PERIODS: Period[] = ["daily", "weekly", "monthly", "yearly", "lifetime"];
  const period: Period =
    VALID_PERIODS.find((p) => p === periodParam) ?? "monthly";

  const periodStart = getPeriodStart(period);
  const periodLabel = getPeriodLabel(period);

  const supabase = await createAdminClient();

  // ── Batch 1: orders + supporting data ────────────────────────────────────
  const [ordersRes, pageViewsRes, stockLotsRes] =
    await Promise.all([
      (() => {
        const q = supabase
          .from("orders")
          .select("id, total, payment_status, created_at")
          .order("created_at", { ascending: true });
        return periodStart ? q.gte("created_at", periodStart.toISOString()) : q;
      })(),
      (() => {
        const q = supabase
          .from("page_views")
          .select("path, product_id, created_at");
        return periodStart ? q.gte("created_at", periodStart.toISOString()) : q;
      })(),
      supabase
        .from("stock_lots")
        .select(
          "variant_id, cost_price_usd, cost_price_ars, purchase_date, created_at, product:products(name, brand)"
        )
        .order("purchase_date", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

  const allOrders = ordersRes.data ?? [];
  const approvedOrders = allOrders.filter((o) => o.payment_status === "approved");
  const approvedOrderIds = approvedOrders.map((o) => o.id);

  // ── Batch 2: order items (period-filtered via approvedOrderIds) ───────────
  const noOrderItems = { data: [] as never[] };

  const [orderItemsWithCostRes, categoryItemsRes, topProductsRes, salesHistoryRes] =
    approvedOrderIds.length > 0
      ? await Promise.all([
          supabase
            .from("order_items")
            .select(
              "product_name, quantity, unit_price, total_price, cost_price"
            )
            .in("order_id", approvedOrderIds)
            .not("cost_price", "is", null),

          supabase
            .from("order_items")
            .select(
              "quantity, total_price, cost_price, variant:product_variants(product:products(category))"
            )
            .in("order_id", approvedOrderIds)
            .not("cost_price", "is", null)
            .not("variant_id", "is", null),

          supabase
            .from("order_items")
            .select("product_name, quantity, total_price")
            .in("order_id", approvedOrderIds),

          supabase
            .from("order_items")
            .select("product_name, quantity, unit_price, total_price, cost_price, order:orders!order_id(created_at)")
            .in("order_id", approvedOrderIds),
        ])
      : [noOrderItems, noOrderItems, noOrderItems, noOrderItems];

  // ── Stat card metrics ─────────────────────────────────────────────────────
  const totalRevenue = approvedOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const totalOrders = allOrders.length;
  const approvedCount = approvedOrders.length;
  const aov = approvedCount > 0 ? totalRevenue / approvedCount : 0;
  const pageViews = pageViewsRes.data?.length ?? 0;

  // ── FIFO metrics ──────────────────────────────────────────────────────────
  // Items already filtered to approved orders in period — no extra filter needed
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
  const hasFifoData = itemsWithCost.length > 0;

  // ── Top products by units ─────────────────────────────────────────────────
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  (topProductsRes.data ?? []).forEach((item) => {
    const key = item.product_name;
    if (!productMap[key]) productMap[key] = { name: key, qty: 0, revenue: 0 };
    productMap[key].qty += item.quantity;
    productMap[key].revenue += item.total_price;
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);
  const maxProductQty = Math.max(...topProducts.map((p) => p.qty), 1);

  // ── Top products by profit (FIFO) ─────────────────────────────────────────
  const profitByProduct: Record<
    string,
    { name: string; qty: number; revenue: number; cost: number; profit: number }
  > = {};
  for (const item of itemsWithCost) {
    const name = item.product_name;
    if (!profitByProduct[name])
      profitByProduct[name] = { name, qty: 0, revenue: 0, cost: 0, profit: 0 };
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

  // ── Cost alerts (all-time — not period-sensitive) ─────────────────────────
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
        name:
          (last.product as unknown as { name: string; brand: string } | null)
            ?.name ?? "—",
        brand:
          (last.product as unknown as { name: string; brand: string } | null)
            ?.brand ?? "",
        prevCost: prev.cost_price_usd,
        newCost: last.cost_price_usd,
        increasePct,
      });
    }
  }

  // ── Category profit ───────────────────────────────────────────────────────
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
    .map(([cat, stats]) => ({ cat, label: CATEGORY_LABELS[cat] ?? cat, ...stats }))
    .sort((a, b) => b.profit - a.profit);
  const maxCategoryProfit = Math.max(...categoryProfit.map((c) => c.profit), 1);

  // ── Sales history ─────────────────────────────────────────────────────────
  type SaleHistoryItem = {
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    cost_price: number | null;
    order: { created_at: string } | null;
  };
  const salesHistory = ((salesHistoryRes.data ?? []) as unknown as SaleHistoryItem[]).sort(
    (a, b) => (b.order?.created_at ?? "").localeCompare(a.order?.created_at ?? "")
  );

  // ── Chart ─────────────────────────────────────────────────────────────────
  const chartBuckets = getChartBuckets(period, approvedOrders);
  const maxChartRevenue = Math.max(...chartBuckets.map((b) => b.revenue), 1);

  // ── Stat cards ────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: "Ingresos Brutos",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      sub: `${approvedCount} órdenes · ticket prom. ${formatPrice(aov)}`,
      color: "text-gold",
    },
    {
      label: "Ingresos Netos",
      value: formatPrice(totalRealProfit),
      icon: TrendingUp,
      sub: `Margen ${avgMarginPct}% · ingresos − costo`,
      color: "text-green-400",
    },
    {
      label: "Órdenes totales",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      sub: periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1),
      color: "text-blue-400",
    },
    {
      label: "Visitas",
      value: pageViews.toLocaleString(),
      icon: Users,
      sub: `Vistas de producto · ${periodLabel}`,
      color: "text-purple-400",
    },
  ];

  return (
    <div>
      {/* Header + filtro de período */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Analytics</h1>
          <p className="font-sans text-xs text-cream-dim capitalize">{periodLabel}</p>
        </div>
        <AnalyticsPeriodFilter active={period} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-obsidian-surface border border-gold/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                {card.label}
              </span>
              <card.icon size={16} strokeWidth={1.5} className={card.color} />
            </div>
            <p className={`font-display text-2xl ${card.color} mb-1`}>
              {card.value}
            </p>
            <p className="font-sans text-[10px] text-cream-dim">{card.sub}</p>
          </div>
        ))}
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
                <p className="font-sans text-xs text-cream">
                  {alert.brand} {alert.name}
                </p>
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

      {/* Gráfico unificado */}
      <div className="bg-obsidian-surface border border-gold/10 p-6 mb-8">
        <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim mb-6">
          {getChartTitle(period)}
        </h2>
        <div
          className={`flex items-end h-40 ${
            period === "monthly" ? "gap-[3px]" : "gap-1"
          }`}
        >
          {chartBuckets.map((b, i) => {
            const heightPct =
              maxChartRevenue > 0 ? (b.revenue / maxChartRevenue) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 h-full flex flex-col items-center justify-end group relative"
              >
                <div
                  className="w-full bg-gold/30 hover:bg-gold/60 transition-colors duration-200 min-h-[2px] rounded-t-sm"
                  style={{ height: `${Math.max(heightPct, 1)}%` }}
                />
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-obsidian border border-gold/20 px-2 py-1 text-[9px] font-sans text-cream whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {b.label}
                  <br />
                  {formatPrice(b.revenue)}
                  {b.count > 0 && (
                    <>
                      <br />
                      {b.count} orden{b.count !== 1 ? "es" : ""}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* X axis labels: first and last */}
        <div className="flex justify-between mt-2">
          <span className="font-sans text-[9px] text-cream-dim">
            {chartBuckets[0]?.label}
          </span>
          <span className="font-sans text-[9px] text-cream-dim">
            {chartBuckets[chartBuckets.length - 1]?.label}
          </span>
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
              Ganancia por categoría
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


      {/* Historial de ventas */}
      <div className="bg-obsidian-surface border border-gold/10 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag size={14} strokeWidth={1.5} className="text-gold/60" />
          <h2 className="font-sans text-xs tracking-widest uppercase text-cream-dim">
            Historial de ventas
          </h2>
        </div>
        {salesHistory.length === 0 ? (
          <p className="font-sans text-sm text-cream-dim italic text-center py-8">
            Sin ventas en el período
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gold/10">
                  {["Producto", "Cantidad", "Precio compra", "Precio venta", "Ganancia"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-sans text-[10px] tracking-widest uppercase text-cream-dim whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesHistory.map((item, i) => {
                  const profit = item.cost_price != null
                    ? item.total_price - item.cost_price * item.quantity
                    : null;
                  return (
                    <tr key={i} className="border-b border-gold/5 hover:bg-obsidian/40">
                      <td className="px-3 py-2.5 font-sans text-xs text-cream max-w-[220px] truncate">
                        {item.product_name}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-xs text-cream-dim text-center">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-xs text-cream-muted whitespace-nowrap">
                        {item.cost_price != null ? formatPrice(item.cost_price) : "—"}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-xs text-gold whitespace-nowrap">
                        {formatPrice(item.unit_price)}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-xs whitespace-nowrap">
                        {profit != null ? (
                          <span className={profit >= 0 ? "text-green-400" : "text-red-400"}>
                            {formatPrice(profit)}
                          </span>
                        ) : (
                          <span className="text-cream-dim">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                  <p className="font-sans text-xs text-cream truncate mb-1">
                    {p.name}
                  </p>
                  <div className="relative h-1.5 bg-obsidian rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gold/50 rounded-full"
                      style={{ width: `${(p.qty / maxProductQty) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-sans text-xs text-gold">{p.qty} uds</p>
                  <p className="font-sans text-[10px] text-cream-dim">
                    {formatPrice(p.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
