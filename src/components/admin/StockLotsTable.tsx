"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, TrendingUp, CheckCircle, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { StockLotWithDetails } from "@/types";

interface VariantAlert {
  isLastLot: boolean;
  costIncreased: boolean;
  lowStock: boolean;
}

interface Props {
  lots: StockLotWithDetails[];
  variantAlerts: Record<string, VariantAlert>;
  threshold: number;
}

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

export default function StockLotsTable({ lots, variantAlerts, threshold }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lots;
    return lots.filter(
      (lot) =>
        lot.product?.name?.toLowerCase().includes(q) ||
        lot.product?.brand?.toLowerCase().includes(q)
    );
  }, [lots, search]);

  return (
    <>
      {/* Buscador */}
      <div className="relative mb-4 max-w-xs">
        <Search
          size={13}
          strokeWidth={2}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full pl-8 pr-3 py-2 bg-obsidian-surface border border-gold/10 text-cream font-sans text-xs placeholder:text-cream-dim focus:outline-none focus:border-gold/30 transition-colors"
        />
      </div>

      {/* Tabla */}
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-16 text-center font-sans text-sm text-cream-dim italic"
                  >
                    {search
                      ? "No se encontraron lotes para esa búsqueda."
                      : "No hay lotes registrados. Ingresá el primer lote para empezar."}
                  </td>
                </tr>
              )}
              {filtered.map((lot) => {
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
                      {lot.variant?.average_cost_usd != null ? formatUSD(lot.variant.average_cost_usd) : "—"}
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
                      {lot.variant?.stock !== undefined ? (
                        <span
                          className={
                            lot.variant.stock === 0
                              ? "text-cream-dim"
                              : lot.variant.stock < threshold
                              ? "text-yellow-400 font-medium"
                              : "text-green-400"
                          }
                        >
                          {lot.variant.stock}
                        </span>
                      ) : (
                        <span className="text-cream-dim">—</span>
                      )}
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
    </>
  );
}
