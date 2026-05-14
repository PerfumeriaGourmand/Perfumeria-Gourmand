export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsClient } from "./ProductsClient";

export default async function AdminProductsPage() {
  const supabase = await createAdminClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .order("sort_order")
    .order("created_at", { ascending: false });

  const list = products ?? [];

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
