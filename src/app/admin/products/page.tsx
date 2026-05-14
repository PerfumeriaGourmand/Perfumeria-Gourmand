export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsClient } from "./ProductsClient";

export default async function AdminProductsPage() {
  const supabase = await createAdminClient();

  const [{ data: products }, { data: activeLots }] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .order("sort_order")
      .order("created_at", { ascending: false }),
    supabase
      .from("stock_lots")
      .select("variant_id, cost_price_ars, purchase_date, created_at")
      .gt("quantity_remaining", 0)
      .order("purchase_date", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  // FIFO: first active lot per variant_id (already sorted oldest-first)
  const fifoCostByVariant: Record<string, number> = {};
  for (const lot of activeLots ?? []) {
    if (!(lot.variant_id in fifoCostByVariant)) {
      fifoCostByVariant[lot.variant_id] = lot.cost_price_ars;
    }
  }

  // For each product aggregate the FIFO costs of its variants (min)
  const list = (products ?? []).map((p) => {
    const costs = (p.variants ?? [])
      .map((v: { id: string }) => fifoCostByVariant[v.id])
      .filter((c: number | undefined): c is number => c !== undefined);
    return {
      ...p,
      fifo_cost_ars: costs.length ? Math.min(...costs) : null,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Catálogo</h1>
          <p className="font-sans text-xs text-cream-dim">
            {list.length} perfumes en el catálogo
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

      <ProductsClient products={list} />
    </div>
  );
}
