export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import type { StockLotWithDetails } from "@/types";

function formatUSD(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function StockPage() {
  const supabase = await createAdminClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("low_stock_threshold")
    .eq("id", 1)
    .single();
  const threshold = settings?.low_stock_threshold ?? 5;

  const { data: rawLots } = await supabase
    .from("stock_lots")
    .select(`*, product:products(id, name, brand), variant:product_variants(id, size_ml)`)
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false });

  const lots: StockLotWithDetails[] = rawLots ?? [];

  // ── Calcular alertas por variant ──────────────────────────────────────────
  // Agrupar lotes por variant_id para detectar alertas
  const lotsByVariant: Record<string, StockLotWithDetails[]> = {};
  for (const lot of lots) {
    if (!lotsByVariant[lot.variant_id]) lotsByVariant[lot.variant_id] = [];
    lotsByVariant[lot.variant_id].push(lot);
  }

  // Por cada variant: lotes activos, último lote, alerta de costo
  const variantAlerts: Record<
    string,
    { isLastLot: boolean; costIncreased: boolean; lowStock: boolean }
  > = {};

  for (const [variantId, varLots] of Object.entries(lotsByVariant)) {
    const activeLots = varLots.filter((l) => l.quantity_remaining > 0);
    // Ordenar por fecha asc para comparar costos
    const sorted = [...varLots].sort(
      (a, b) =>
        new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime() ||
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const isLastLot = activeLots.length === 1;
    const lowStock = activeLots.reduce((s, l) => s + l.quantity_remaining, 0) < threshold;

    let costIncreased = false;
    if (sorted.length >= 2) {
      const last = sorted[sorted.length - 1];
      const prev = sorted[sorted.length - 2];
      if (last.cost_price_usd > prev.cost_price_usd * 1.2) {
        costIncreased = true;
      }
    }

    variantAlerts[variantId] = { isLastLot, costIncreased, lowStock };
  }

  // Total de lotes activos y alertas globales
  const activeLots = lots.filter((l) => l.quantity_remaining > 0);
  const totalAlerts =
    activeLots.filter(
      (l) =>
        variantAlerts[l.variant_id]?.isLastLot ||
        variantAlerts[l.variant_id]?.lowStock ||
        variantAlerts[l.variant_id]?.costIncreased
    ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-cream mb-2">
            Gestión de Stock
          </h1>
          <p className="font-sans text-xs text-cream-dim tracking-wide">
            {lots.length} lote{lots.length !== 1 ? "s" : ""} registrado
            {lots.length !== 1 ? "s" : ""} · {activeLots.length} activo
            {activeLots.length !== 1 ? "s" : ""}
            {totalAlerts > 0 && (
              <span className="text-yellow-400 ml-3">
                · {totalAlerts} alerta{totalAlerts !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/stock/new"
          className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-colors duration-200"
        >
          <Plus size={14} strokeWidth={2} />
          Ingresar lote
        </Link>
      </div>

      {/* Leyenda de alertas */}
      {totalAlerts > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 font-sans text-[10px] tracking-wide text-yellow-400">
            <AlertTriangle size={12} strokeWidth={2} />
            Último lote / Poco stock
          </div>
          <div className="flex items-center gap-2 font-sans text-[10px] tracking-wide text-orange-400">
            <TrendingUp size={12} strokeWidth={2} />
            Costo subió +20% — considerar actualizar precio
          </div>
        </div>
      )}

      {/* Tabla de lotes */}
      <div className="border border-gold/10 bg-obsidian-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gold/10">
                {[
                  "Producto",
                  "Tamaño",
                  "Fecha compra",
                  "Costo USD",
                  "TC",
                  "Costo ARS",
                  "Compradas",
                  "Vendidas",
                  "Restantes",
                  "Estado",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-sans text-[10px] tracking-widest uppercase text-cream-dim whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lots.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-16 text-center font-sans text-sm text-cream-dim italic"
                  >
                    No hay lotes registrados. Ingresá el primer lote para empezar.
                  </td>
                </tr>
              )}
              {lots.map((lot) => {
                const sold = lot.quantity_purchased - lot.quantity_remaining;
                const alerts = variantAlerts[lot.variant_id];
                const isActive = lot.quantity_remaining > 0;
                const hasCostAlert = alerts?.costIncreased;
                const hasStockAlert = alerts?.isLastLot || alerts?.lowStock;

                return (
                  <tr
                    key={lot.id}
                    className={`border-b border-gold/5 transition-colors ${
                      !isActive
                        ? "opacity-40"
                        : hasCostAlert
                        ? "bg-orange-500/5 hover:bg-orange-500/10"
                        : hasStockAlert
                        ? "bg-yellow-500/5 hover:bg-yellow-500/10"
                        : "hover:bg-obsidian/40"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-sans text-xs text-cream truncate max-w-[200px]">
                          {lot.product?.name ?? "—"}
                        </p>
                        <p className="font-sans text-[10px] text-cream-dim">
                          {lot.product?.brand}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-muted whitespace-nowrap">
                      {lot.variant?.size_ml ?? "—"} ml
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-dim whitespace-nowrap">
                      {formatDate(lot.purchase_date)}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-gold whitespace-nowrap">
                      {formatUSD(lot.cost_price_usd)}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-dim whitespace-nowrap">
                      {lot.exchange_rate?.toLocaleString("es-AR") ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-muted whitespace-nowrap">
                      {formatPrice(lot.cost_price_ars)}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-dim text-center">
                      {lot.quantity_purchased}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-dim text-center">
                      {sold}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-center">
                      <span
                        className={
                          lot.quantity_remaining === 0
                            ? "text-cream-dim"
                            : lot.quantity_remaining < threshold
                            ? "text-yellow-400 font-medium"
                            : "text-green-400"
                        }
                      >
                        {lot.quantity_remaining}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!isActive ? (
                        <span className="flex items-center gap-1 font-sans text-[10px] text-cream-dim">
                          <CheckCircle size={11} strokeWidth={1.5} />
                          Agotado
                        </span>
                      ) : hasCostAlert ? (
                        <span className="flex items-center gap-1 font-sans text-[10px] text-orange-400">
                          <TrendingUp size={11} strokeWidth={2} />
                          Costo ↑20%+
                        </span>
                      ) : alerts?.isLastLot ? (
                        <span className="flex items-center gap-1 font-sans text-[10px] text-yellow-400">
                          <AlertTriangle size={11} strokeWidth={2} />
                          Último lote
                        </span>
                      ) : alerts?.lowStock ? (
                        <span className="flex items-center gap-1 font-sans text-[10px] text-yellow-400">
                          <AlertTriangle size={11} strokeWidth={2} />
                          Poco stock
                        </span>
                      ) : (
                        <span className="font-sans text-[10px] text-green-400/80">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notas */}
      {lots.some((l) => l.notes) && (
        <div className="mt-4 space-y-1">
          {lots
            .filter((l) => l.notes)
            .slice(0, 5)
            .map((l) => (
              <p key={l.id} className="font-sans text-[10px] text-cream-dim">
                <span className="text-cream-muted">
                  {l.product?.name} {l.variant?.size_ml}ml:
                </span>{" "}
                {l.notes}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
