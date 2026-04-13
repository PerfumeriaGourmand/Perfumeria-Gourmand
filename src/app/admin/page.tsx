export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

async function getMetrics() {
  const supabase = await createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: settings } = await supabase
    .from("site_settings")
    .select("low_stock_threshold")
    .eq("id", 1)
    .single();
  const threshold = settings?.low_stock_threshold ?? 5;

  const [ordersRes, pendingRes, lowStockRes, salesRes] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact" })
        .gte("created_at", today),
      supabase
        .from("orders")
        .select("id", { count: "exact" })
        .eq("payment_status", "pending"),
      supabase
        .from("product_variants")
        .select("id", { count: "exact" })
        .lt("stock", threshold)
        .eq("is_active", true),
      supabase
        .from("orders")
        .select("total")
        .eq("payment_status", "approved"),
    ]);

  const totalSales = (salesRes.data ?? []).reduce(
    (sum, o) => sum + (o.total ?? 0),
    0
  );

  return {
    ordersToday: ordersRes.count ?? 0,
    ordersPending: pendingRes.count ?? 0,
    lowStockCount: lowStockRes.count ?? 0,
    totalSales,
  };
}

async function getRecentOrders() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("id, customer_name, total, payment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

const STATUS_STYLES: Record<string, string> = {
  approved: "text-green-400 bg-green-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  rejected: "text-red-400 bg-red-400/10",
  in_process: "text-blue-400 bg-blue-400/10",
  cancelled: "text-cream-dim bg-cream-dim/10",
  refunded: "text-cream-dim bg-cream-dim/10",
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  in_process: "En proceso",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export default async function AdminDashboard() {
  const [metrics, recentOrders] = await Promise.all([getMetrics(), getRecentOrders()]);

  const stats = [
    {
      label: "Ventas totales",
      value: formatPrice(metrics.totalSales),
      icon: TrendingUp,
      color: "text-gold",
    },
    {
      label: "Órdenes hoy",
      value: metrics.ordersToday,
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "Pagos pendientes",
      value: metrics.ordersPending,
      icon: ShoppingBag,
      color: "text-yellow-400",
    },
    {
      label: "Stock bajo",
      value: metrics.lowStockCount,
      icon: AlertTriangle,
      color: "text-red-400",
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl text-cream mb-2">Dashboard</h1>
        <p className="font-sans text-xs text-cream-dim tracking-wide">
          {new Date().toLocaleDateString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-gold/10 bg-obsidian-surface p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <stat.icon size={18} strokeWidth={1.5} className={stat.color} />
            </div>
            <p className="font-display text-2xl text-cream mb-1">{stat.value}</p>
            <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="border border-gold/10 bg-obsidian-surface">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
          <h2 className="font-sans text-xs tracking-widest uppercase text-cream-muted">
            Órdenes recientes
          </h2>
          <Link
            href="/admin/orders"
            className="font-sans text-[10px] tracking-widest uppercase text-gold/60 hover:text-gold transition-colors"
          >
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/5">
                {["ID", "Cliente", "Total", "Estado", "Fecha"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left font-sans text-[10px] tracking-widest uppercase text-cream-dim"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gold/5 hover:bg-obsidian/40 transition-colors"
                >
                  <td className="px-6 py-3 font-mono text-xs text-cream-dim">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-gold transition-colors"
                    >
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-sans text-sm text-cream-muted">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-3 font-sans text-sm text-gold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`font-sans text-[10px] tracking-wide px-2 py-1 ${
                        STATUS_STYLES[order.payment_status] ?? "text-cream-dim"
                      }`}
                    >
                      {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-sans text-xs text-cream-dim">
                    {new Date(order.created_at).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center font-sans text-sm text-cream-dim italic"
                  >
                    Sin órdenes todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-8">
        {[
          { href: "/admin/products/new", label: "Nuevo producto", icon: Package },
          { href: "/admin/orders", label: "Ver órdenes", icon: ShoppingBag },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 border border-gold/10 hover:border-gold/30 bg-obsidian-surface hover:bg-gold/5 px-5 py-4 transition-all duration-200 group"
          >
            <link.icon
              size={16}
              strokeWidth={1.5}
              className="text-cream-dim group-hover:text-gold transition-colors"
            />
            <span className="font-sans text-xs tracking-wide text-cream-muted group-hover:text-cream transition-colors">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
