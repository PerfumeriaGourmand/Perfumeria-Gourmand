"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Edit, AlertCircle, Search, MessageCircleQuestion } from "lucide-react";
import toast from "react-hot-toast";
import { CATEGORY_LABELS, CONCENTRATION_LABELS } from "@/lib/utils";

type Variant = { id: string; size_ml: number; stock: number; price: number };

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  concentration: string;
  is_active: boolean;
  variants: Variant[];
  fifo_cost_ars: number | null;
};

const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function EditablePrice({ variant, onSaved }: { variant: Variant; onSaved: (price: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(variant.price));
  const [saving, setSaving] = useState(false);

  async function save() {
    const price = Number(value);
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Precio inválido");
      setValue(String(variant.price));
      setEditing(false);
      return;
    }
    if (price === variant.price) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/variants/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      onSaved(price);
      toast.success("Precio actualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar el precio");
      setValue(String(variant.price));
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <input
        type="number"
        min={0}
        autoFocus
        value={value}
        disabled={saving}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setValue(String(variant.price));
            setEditing(false);
          }
        }}
        className="w-24 bg-obsidian border border-gold/40 text-cream text-xs font-sans px-2 py-1 focus:outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="font-sans text-xs text-cream-muted hover:text-gold hover:underline decoration-dotted underline-offset-2 transition-colors text-left"
      title="Click para editar el precio"
    >
      {variant.size_ml}ml — {ars.format(variant.price)}
    </button>
  );
}

const CATEGORY_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "disenador", label: "Diseñador" },
  { value: "nicho", label: "Nicho" },
  { value: "arabe", label: "Árabe" },
  { value: "kit", label: "Kit" },
];

export function ProductsClient({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  function updateVariantPrice(productId: string, variantId: string, price: number) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id !== productId
          ? p
          : { ...p, variants: p.variants.map((v) => (v.id === variantId ? { ...v, price } : v)) }
      )
    );
  }

  const filtered = products
    .filter((p) => category === "all" || p.category === category)
    .filter((p) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    });

  const outOfStock = useMemo(
    () =>
      products.filter(
        (p) => p.is_active && (p.variants ?? []).length > 0 && (p.variants ?? []).every((v) => v.stock === 0)
      ),
    [products]
  );

  function copyRestockMessage() {
    const message = [
      "Hola, ¿cómo va? ¿Tienen estos perfumes en stock?",
      "",
      ...outOfStock.map((p) => `- ${p.brand} ${p.name}`),
    ].join("\n");

    navigator.clipboard
      .writeText(message)
      .then(() => toast.success("Mensaje copiado al portapapeles"))
      .catch(() => toast.error("No se pudo copiar el mensaje"));
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
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
        {outOfStock.length > 0 && (
          <button
            onClick={copyRestockMessage}
            className="flex items-center gap-2 shrink-0 border border-gold/30 text-gold font-sans text-xs tracking-wide px-4 py-2.5 hover:bg-gold/10 transition-colors"
            title="Copia un mensaje con todos los perfumes sin stock para mandarle al proveedor"
          >
            <MessageCircleQuestion size={14} strokeWidth={1.5} />
            Mensaje de reposición ({outOfStock.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setCategory(f.value)}
            className={`font-sans text-xs px-4 py-2 border transition-colors ${
              category === f.value
                ? "border-gold bg-gold/10 text-gold"
                : "border-gold/10 text-cream-dim hover:border-gold/30 hover:text-cream"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="border border-gold/10 bg-obsidian-surface overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gold/10">
              {["Nombre / Marca", "Categoría", "Concentración", "Costo lote ($)", "Precio ARS", "Stock mín.", "Estado", ""].map(
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
                    {product.fifo_cost_ars != null ? ars.format(product.fifo_cost_ars) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      {(product.variants ?? []).map((v) => (
                        <EditablePrice
                          key={v.id}
                          variant={v}
                          onSaved={(price) => updateVariantPrice(product.id, v.id, price)}
                        />
                      ))}
                    </div>
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
                    : category !== "all"
                    ? "Sin productos en esta categoría"
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
