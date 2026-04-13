import { formatPrice } from "@/lib/utils";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import type { StockLotWithDetails } from "@/types";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatUSD(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

interface LotWithMetrics extends StockLotWithDetails {
  units_sold: number;
  revenue: number;
  profit: number;
  costIncreased: boolean;
}

interface Props {
  lots: LotWithMetrics[];
  totalProfit: number;
  avgMarginPct: number;
}

export default function ProductLotHistory({ lots, totalProfit, avgMarginPct }: Props) {
  if (lots.length === 0) {
    return (
      <div className="border border-gold/10 bg-obsidian-surface p-8 text-center">
        <Package size={24} strokeWidth={1} className="text-cream-dim/30 mx-auto mb-3" />
        <p className="font-sans text-sm text-cream-dim italic">
          No hay lotes registrados para este producto.
        </p>
        <p className="font-sans text-xs text-cream-dim/60 mt-1">
          Ingresá un lote desde Gestión de Stock para activar el seguimiento FIFO.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-gold/10 bg-obsidian p-4">
          <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1">
            Ganancia total
          </p>
          <p className="font-display text-xl text-gold">{formatPrice(totalProfit)}</p>
        </div>
        <div className="border border-gold/10 bg-obsidian p-4">
          <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1">
            Margen promedio
          </p>
          <p className="font-display text-xl text-green-400">
            {avgMarginPct.toFixed(1)}%
          </p>
        </div>
        <div className="border border-gold/10 bg-obsidian p-4">
          <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1">
            Lotes totales
          </p>
          <p className="font-display text-xl text-cream">
            {lots.length}
          </p>
        </div>
      </div>

      {/* Tabla de lotes */}
      <div className="border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gold/10 bg-obsidian-surface">
                {[
                  "Fecha",
                  "Tamaño",
                  "Costo USD",
                  "Costo ARS",
                  "Compradas",
                  "Vendidas",
                  "Restantes",
                  "Ganancia",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-sans text-[10px] tracking-widest uppercase text-cream-dim"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lots.map((lot, index) => {
                const soldPct =
                  lot.quantity_purchased > 0
                    ? (lot.units_sold / lot.quantity_purchased) * 100
                    : 0;

                return (
                  <tr
                    key={lot.id}
                    className={`border-b border-gold/5 transition-colors ${
                      lot.costIncreased
                        ? "bg-orange-500/5"
                        : index % 2 === 0
                        ? "bg-obsidian/20"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-sans text-xs text-cream-dim whitespace-nowrap">
                      {formatDate(lot.purchase_date)}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-muted whitespace-nowrap">
                      {lot.variant?.size_ml ?? "—"} ml
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans text-xs text-gold">
                          {formatUSD(lot.cost_price_usd)}
                        </span>
                        {lot.costIncreased && (
                          <TrendingUp size={11} strokeWidth={2} className="text-orange-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-muted whitespace-nowrap">
                      {formatPrice(lot.cost_price_ars)}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-dim text-center">
                      {lot.quantity_purchased}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div>
                        <span className="font-sans text-xs text-cream-dim">
                          {lot.units_sold}
                        </span>
                        <div className="w-12 h-1 bg-obsidian rounded-full mt-1 mx-auto overflow-hidden">
                          <div
                            className="h-full bg-gold/40 rounded-full"
                            style={{ width: `${soldPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-center">
                      <span
                        className={
                          lot.quantity_remaining === 0
                            ? "text-cream-dim/50"
                            : lot.quantity_remaining < 5
                            ? "text-yellow-400"
                            : "text-green-400"
                        }
                      >
                        {lot.quantity_remaining}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-right whitespace-nowrap">
                      {lot.units_sold > 0 ? (
                        <span className={lot.profit >= 0 ? "text-green-400" : "text-red-400"}>
                          {formatPrice(lot.profit)}
                        </span>
                      ) : (
                        <span className="text-cream-dim/50">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertas */}
      {lots.some((l) => l.costIncreased) && (
        <div className="flex items-start gap-2 border border-orange-500/20 bg-orange-500/5 px-4 py-3">
          <AlertTriangle size={14} strokeWidth={2} className="text-orange-400 mt-0.5 shrink-0" />
          <p className="font-sans text-xs text-orange-300">
            El costo del último lote subió más del 20% respecto al anterior. Considerá
            actualizar el precio de venta.
          </p>
        </div>
      )}
    </div>
  );
}
