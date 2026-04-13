"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Variant {
  id: string;
  size_ml: number;
  price: number;
  stock: number;
  product: { name: string; brand: string } | null;
}

interface KitItem {
  variant_id: string;
  quantity: number;
}

interface Kit {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  items?: Array<{ variant_id: string; quantity: number }>;
}

export default function KitForm({
  kit,
  variants,
}: {
  kit?: Kit;
  variants: Variant[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState(kit?.name ?? "");
  const [description, setDescription] = useState(kit?.description ?? "");
  const [price, setPrice] = useState(kit?.price?.toString() ?? "");
  const [stock, setStock] = useState(kit?.stock?.toString() ?? "0");
  const [imageUrl, setImageUrl] = useState(kit?.image_url ?? "");
  const [isActive, setIsActive] = useState(kit?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(kit?.is_featured ?? false);
  const [items, setItems] = useState<KitItem[]>(
    kit?.items?.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })) ?? []
  );

  const addItem = () => {
    if (variants.length === 0) return;
    setItems((prev) => [...prev, { variant_id: variants[0].id, quantity: 1 }]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof KitItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !price) {
      toast.error("Nombre y precio son requeridos");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        id: kit?.id,
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        image_url: imageUrl.trim() || null,
        is_active: isActive,
        is_featured: isFeatured,
        items,
      };

      const res = await fetch("/api/admin/kits", {
        method: kit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      toast.success(kit ? "Kit actualizado" : "Kit creado");
      router.push("/admin/products?tab=kits");
      router.refresh();
    } catch (err) {
      toast.error("Error al guardar: " + (err instanceof Error ? err.message : "desconocido"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!kit || !confirm("¿Eliminar este kit?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/kits?id=${kit.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Kit eliminado");
      router.push("/admin/products?tab=kits");
      router.refresh();
    } catch (err) {
      toast.error("Error al eliminar: " + (err instanceof Error ? err.message : "desconocido"));
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full bg-obsidian border border-gold/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim focus:outline-none focus:border-gold/60 transition-colors";
  const labelClass = "font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1.5 block";

  return (
    <div className="max-w-3xl space-y-8">
      {/* Basic info */}
      <div className="bg-obsidian-surface border border-gold/10 p-6 space-y-5">
        <h2 className="font-sans text-xs tracking-widest uppercase text-gold/60 mb-1">
          Información básica
        </h2>
        <div>
          <label className={labelClass}>Nombre *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kit Árabe Exclusivo"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descripción del kit..."
            className={inputClass + " resize-none"}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Precio *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="29999"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>URL de imagen</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Items */}
      <div className="bg-obsidian-surface border border-gold/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-xs tracking-widest uppercase text-gold/60">
            Productos incluidos
          </h2>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 font-sans text-xs text-gold hover:text-gold-light transition-colors"
          >
            <Plus size={12} strokeWidth={2} />
            Agregar
          </button>
        </div>

        {items.length === 0 ? (
          <p className="font-sans text-xs text-cream-dim italic py-4 text-center">
            Agregá productos al kit
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => {
              return (
                <div key={idx} className="flex items-center gap-3">
                  <select
                    value={item.variant_id}
                    onChange={(e) => updateItem(idx, "variant_id", e.target.value)}
                    className="flex-1 bg-obsidian border border-gold/20 px-3 py-2.5 font-sans text-xs text-cream focus:outline-none focus:border-gold/60"
                  >
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.product?.brand} — {v.product?.name} {v.size_ml}ml (
                        {formatPrice(v.price)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                    className="w-16 bg-obsidian border border-gold/20 px-3 py-2.5 font-sans text-xs text-cream text-center focus:outline-none focus:border-gold/60"
                  />
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-cream-dim hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visibility */}
      <div className="bg-obsidian-surface border border-gold/10 p-6 space-y-3">
        <h2 className="font-sans text-[10px] tracking-widest uppercase text-gold/60 mb-3">
          Visibilidad
        </h2>
        {[
          { label: "Activo (visible en la tienda)", value: isActive, set: setIsActive },
          { label: "Destacado (aparece en el home)", value: isFeatured, set: setIsFeatured },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set(!value)}
              className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center ${
                value ? "bg-gold" : "bg-obsidian border border-gold/20"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 mx-0.5 ${
                  value ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="font-sans text-xs text-cream-muted group-hover:text-cream transition-colors">
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-6 py-3 hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          <Save size={14} strokeWidth={2} />
          {saving ? "Guardando..." : kit ? "Actualizar kit" : "Crear kit"}
        </button>
        {kit && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-sans text-xs text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar kit"}
          </button>
        )}
        <button
          onClick={() => router.push("/admin/products?tab=kits")}
          className="font-sans text-xs text-cream-dim hover:text-cream transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
