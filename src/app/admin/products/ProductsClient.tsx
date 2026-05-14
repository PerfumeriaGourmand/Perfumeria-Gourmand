"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, AlertCircle, Search } from "lucide-react";
import { CATEGORY_LABELS, CONCENTRATION_LABELS } from "@/lib/utils";

type Variant = { stock: number; price: number; average_cost_usd: number | null };

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  concentration: string;
  is_active: boolean;
  variants: Variant[];
};

const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function priceRange(variants: Variant[]): string {
  if (!variants.length) return "—";
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? ars.format(min) : `${ars.format(min)} – ${ars.format(max)}`;
}

function avgCostUsd(variants: Variant[]): string {
  const costs = variants.map((v) => v.average_cost_usd).filter((c): c is number => c !== null);
  if (!costs.length) return "—";
  const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
  return usd.format(avg);
}

export function ProductsClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      })
    : products;

  return (
    <>
      <div className="relative mb-6">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o marca…"
          className="w-full bg-obsidian-surface border border-gold/10 pl-9 pr-4 py-2.5 font-sans text-sm text-cream placeholder:text-cream-dim/50 focus:outline-none focus:border-gold/40 transition-colors"
        />
      </div>

      <div className="border border-gold/10 bg-obsidian-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              {["Nombre / Marca", "Categoría", "Concentración", "Costo USD", "Precio ARS", "Stock mín.", "Estado", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left font-sans text-[10px] tracking-widest uppercase text-cream-dim"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const minStock = Math.min(...(product.variants ?? []).map((v) => v.stock));
              const lowStock = minStock < 5 && minStock >= 0;

              return (
                <tr
                  key={product.id}
                  className="border-b border-gold/5 hover:bg-obsidian/40 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-sans text-sm text-cream">{product.name}</p>
                    <p className="font-sans text-xs text-cream-dim">{product.brand}</p>
                  </td>
                  <td className="px-5 py-4 font-sans text-xs text-cream-muted">
                    {CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-5 py-4 font-sans text-xs text-cream-muted">
                    {CONCENTRATION_LABELS[product.concentration]}
                  </td>
                  <td className="px-5 py-4 font-sans text-xs text-cream-muted">
                    {avgCostUsd(product.variants ?? [])}
                  </td>
                  <td className="px-5 py-4 font-sans text-xs text-cream-muted">
                    {priceRange(product.variants ?? [])}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {lowStock && <AlertCircle size={12} className="text-red-400" />}
                      <span
                        className={`font-sans text-xs ${lowStock ? "text-red-400" : "text-cream-muted"}`}
                      >
                        {isFinite(minStock) ? minStock : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-sans text-[10px] tracking-wide px-2 py-0.5 ${
                        product.is_active
                          ? "bg-green-400/10 text-green-400"
                          : "bg-cream-dim/10 text-cream-dim"
                      }`}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-1.5 font-sans text-xs text-gold/60 hover:text-gold transition-colors"
                    >
                      <Edit size={12} strokeWidth={1.5} />
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center font-sans text-sm text-cream-dim italic"
                >
                  {query.trim()
                    ? `Sin resultados para "${query}"`
                    : "No hay productos todavía"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
