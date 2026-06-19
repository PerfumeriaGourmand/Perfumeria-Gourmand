export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsClient } from "./ProductsClient";

const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function AdminProductsPage() {
  const supabase = await createAdminClient();

  const [{ data: products }, { data: allLots }] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .order("name", { ascending: true }),
    supabase
      .from("stock_lots")
      .select("variant_id, cost_price_ars, purchase_date, created_at, quantity_remaining"),
  ]);

  type RawLot = { variant_id: string; cost_price_ars: number; purchase_date: string; created_at: string; quantity_remaining: number };

  // Group all lots by variant_id
  const lotsByVariant: Record<string, RawLot[]> = {};
  for (const lot of (allLots ?? []) as RawLot[]) {
    if (!lotsByVariant[lot.variant_id]) lotsByVariant[lot.variant_id] = [];
    lotsByVariant[lot.variant_id].push(lot);
  }

  const byDate = (a: RawLot, b: RawLot) =>
    new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime() ||
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

  // Per variant: FIFO cost (oldest active) or latest exhausted cost as fallback
  const costByVariant: Record<string, number> = {};
  for (const [variantId, lots] of Object.entries(lotsByVariant)) {
    const active = lots.filter((l) => l.quantity_remaining > 0).sort(byDate);
    if (active.length > 0) {
      costByVariant[variantId] = active[0].cost_price_ars;
    } else {
      const exhausted = lots
        .filter((l) => l.quantity_remaining <= 0 && l.cost_price_ars != null)
        .sort((a, b) => byDate(b, a)); // DESC: most recent first
      if (exhausted.length > 0) costByVariant[variantId] = exhausted[0].cost_price_ars;
    }
  }

  const list = (products ?? []).map((p) => {
    const costs = (p.variants ?? [])
      .map((v: { id: string }) => costByVariant[v.id])
      .filter((c: number | undefined): c is number => c != null);
    return {
      ...p,
      fifo_cost_ars: costs.length ? Math.min(...costs) : null,
    };
  });

  // Valor total del inventario: precio × stock por cada variante con stock > 0
  const totalInventoryValue = (products ?? []).reduce((total, p) => {
    return total + (p.variants ?? []).reduce((sub: number, v: { stock: number; price: number }) => {
      return sub + (v.stock > 0 ? v.price * v.stock : 0);
    }, 0);
  }, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Productos</h1>
          <p className="font-sans text-xs text-cream-dim">
            {list.length} perfumes en el catálogo
          </p>
        </div>
        <div className="flex items-start gap-8">
          <div className="text-right">
            <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1">
              Valor del inventario
            </p>
            <p className="font-display text-2xl text-gold">
              {ars.format(totalInventoryValue)}
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-5 py-3 hover:bg-gold-light transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            Nuevo producto
          </Link>
        </div>
      </div>

      <ProductsClient products={list} />
    </div>
  );
}
