export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, AlertCircle, Package, Gift } from "lucide-react";
import { CATEGORY_LABELS, CONCENTRATION_LABELS, formatPrice } from "@/lib/utils";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "kits" ? "kits" : "products";

  const supabase = await createAdminClient();

  const [productsRes, kitsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .order("sort_order")
      .order("created_at", { ascending: false }),
    supabase
      .from("kits")
      .select("*, items:kit_items(*)")
      .order("created_at", { ascending: false }),
  ]);

  const products = productsRes.data ?? [];
  const kits = kitsRes.data ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Catálogo</h1>
          <p className="font-sans text-xs text-cream-dim">
            {activeTab === "products"
              ? `${products.length} perfumes en el catálogo`
              : `${kits.length} kits disponibles`}
          </p>
        </div>
        {activeTab === "products" ? (
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-5 py-3 hover:bg-gold-light transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            Nuevo producto
          </Link>
        ) : (
          <Link
            href="/admin/products/kits/new"
            className="flex items-center gap-2 bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-5 py-3 hover:bg-gold-light transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            Nuevo kit
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 mb-8 border-b border-gold/10">
        <Link
          href="/admin/products"
          className={`flex items-center gap-2 px-5 py-3 font-sans text-xs tracking-wide transition-colors duration-200 border-b-2 -mb-px ${
            activeTab === "products"
              ? "text-gold border-gold"
              : "text-cream-dim hover:text-cream border-transparent"
          }`}
        >
          <Package size={14} strokeWidth={1.5} />
          Perfumes
          <span className="ml-1 text-[10px] bg-obsidian-surface px-1.5 py-0.5 rounded-sm">
            {products.length}
          </span>
        </Link>
        <Link
          href="/admin/products?tab=kits"
          className={`flex items-center gap-2 px-5 py-3 font-sans text-xs tracking-wide transition-colors duration-200 border-b-2 -mb-px ${
            activeTab === "kits"
              ? "text-gold border-gold"
              : "text-cream-dim hover:text-cream border-transparent"
          }`}
        >
          <Gift size={14} strokeWidth={1.5} />
          Kits
          <span className="ml-1 text-[10px] bg-obsidian-surface px-1.5 py-0.5 rounded-sm">
            {kits.length}
          </span>
        </Link>
      </div>

      {/* Products tab */}
      {activeTab === "products" && (
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
              {products.map((product) => {
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
              {products.length === 0 && (
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
      )}

      {/* Kits tab */}
      {activeTab === "kits" && (
        <div className="border border-gold/10 bg-obsidian-surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                {["Nombre", "Precio", "Stock", "Estado", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left font-sans text-[10px] tracking-widest uppercase text-cream-dim"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kits.map((kit) => (
                <tr key={kit.id} className="border-b border-gold/5 hover:bg-obsidian/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-sans text-sm text-cream">{kit.name}</p>
                    {kit.description && (
                      <p className="font-sans text-xs text-cream-dim truncate max-w-xs">
                        {kit.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 font-sans text-xs text-cream-muted">
                    {formatPrice(kit.price)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {kit.stock < 5 && <AlertCircle size={12} className="text-red-400" />}
                      <span className={`font-sans text-xs ${kit.stock < 5 ? "text-red-400" : "text-cream-muted"}`}>
                        {kit.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-sans text-[10px] tracking-wide px-2 py-0.5 ${
                        kit.is_active
                          ? "bg-green-400/10 text-green-400"
                          : "bg-cream-dim/10 text-cream-dim"
                      }`}
                    >
                      {kit.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/products/kits/${kit.id}`}
                      className="flex items-center gap-1.5 font-sans text-xs text-gold/60 hover:text-gold transition-colors"
                    >
                      <Edit size={12} strokeWidth={1.5} />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {kits.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center font-sans text-sm text-cream-dim italic">
                    No hay kits todavía —{" "}
                    <Link href="/admin/products/kits/new" className="text-gold hover:underline">
                      crear el primero
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
