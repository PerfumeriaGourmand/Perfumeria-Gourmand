export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, AlertCircle } from "lucide-react";
import { CATEGORY_LABELS, CONCENTRATION_LABELS } from "@/lib/utils";

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

      <div className="border border-gold/10 bg-obsidian-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              {["Nombre / Marca", "Categoría", "Concentración", "Stock mín.", "Estado", ""].map(
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
            {list.map((product) => {
              const minStock = Math.min(...(product.variants ?? []).map((v: { stock: number }) => v.stock));
              const lowStock = minStock < 5 && minStock >= 0;

              return (
                <tr key={product.id} className="border-b border-gold/5 hover:bg-obsidian/40 transition-colors">
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
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {lowStock && <AlertCircle size={12} className="text-red-400" />}
                      <span className={`font-sans text-xs ${lowStock ? "text-red-400" : "text-cream-muted"}`}>
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
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center font-sans text-sm text-cream-dim italic">
                  No hay productos todavía —{" "}
                  <Link href="/admin/products/new" className="text-gold hover:underline">
                    crear el primero
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
