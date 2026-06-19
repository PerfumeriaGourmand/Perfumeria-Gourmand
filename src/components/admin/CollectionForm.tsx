"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Collection } from "@/types";
import { slugify } from "@/lib/utils";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";

interface ProductOption {
  id: string;
  name: string;
  brand: string;
}

interface CollectionFormProps {
  collection?: Collection;
  initialProductIds?: string[];
  allProducts: ProductOption[];
}

export default function CollectionForm({
  collection,
  initialProductIds = [],
  allProducts,
}: CollectionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!collection);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    name: collection?.name ?? "",
    slug: collection?.slug ?? "",
    description: collection?.description ?? "",
    image_url: collection?.image_url ?? "",
    is_active: collection?.is_active ?? true,
    sort_order: collection?.sort_order ?? 0,
  });

  const [productIds, setProductIds] = useState<string[]>(initialProductIds);

  const updateForm = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleNameChange = (value: string) => {
    updateForm("name", value);
    if (!slugTouched) updateForm("slug", slugify(value));
  };

  const toggleProduct = (id: string) =>
    setProductIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const filteredProducts = query.trim()
    ? allProducts.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase()))
    : allProducts;

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "product-images");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir imagen");
      updateForm("image_url", data.publicUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Nombre y slug son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId: collection?.id, form, productIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

      toast.success(collection ? "Colección actualizada" : "Colección creada");
      router.push("/admin/collections");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!collection?.id) return;
    if (!confirm("¿Eliminar esta colección? Esta acción no se puede deshacer.")) return;

    const res = await fetch("/api/admin/collections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: collection.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(`Error al eliminar: ${data.error ?? res.statusText}`);
      return;
    }

    toast.success("Colección eliminada");
    router.push("/admin/collections");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
      <section className="space-y-5">
        <h2 className="font-sans text-xs tracking-widest uppercase text-gold">
          Información básica
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <AdminInput
            label="Nombre"
            value={form.name}
            onChange={handleNameChange}
            placeholder="Asad"
            required
          />
          <AdminInput
            label="Slug (URL)"
            value={form.slug}
            onChange={(v) => {
              setSlugTouched(true);
              updateForm("slug", slugify(v));
            }}
            placeholder="asad"
            required
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            rows={3}
            placeholder="Una breve descripción de la colección…"
            className="w-full bg-obsidian border border-gold/10 text-cream text-sm font-sans px-3 py-2.5 focus:border-gold/30 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => updateForm("is_active", !form.is_active)}
            className={`font-sans text-xs px-4 py-2 border transition-colors ${
              form.is_active
                ? "border-gold bg-gold/10 text-gold"
                : "border-gold/10 text-cream-dim hover:border-gold/30"
            }`}
          >
            {form.is_active ? "Activa" : "Inactiva"}
          </button>
        </div>
      </section>

      <GoldDivider />

      <section className="space-y-5">
        <h2 className="font-sans text-xs tracking-widest uppercase text-gold">Imagen</h2>

        {form.image_url ? (
          <div className="relative w-32 h-32 rounded overflow-hidden border border-gold/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt={form.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => updateForm("image_url", "")}
              className="absolute top-1 right-1 w-6 h-6 bg-obsidian/80 flex items-center justify-center rounded-full text-cream hover:text-red-400 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 border border-dashed border-gold/20 px-5 py-4 font-sans text-xs text-cream-dim hover:border-gold/40 hover:text-cream transition-colors disabled:opacity-50"
          >
            <Upload size={14} strokeWidth={1.5} />
            {uploading ? "Subiendo…" : "Subir imagen"}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
            e.target.value = "";
          }}
        />
      </section>

      <GoldDivider />

      <section className="space-y-5">
        <h2 className="font-sans text-xs tracking-widest uppercase text-gold">
          Productos en esta colección ({productIds.length})
        </h2>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o marca…"
            className="w-full bg-obsidian border border-gold/10 pl-9 pr-4 py-2.5 font-sans text-sm text-cream placeholder:text-cream-dim/50 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>

        <div className="border border-gold/10 max-h-80 overflow-y-auto">
          {filteredProducts.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-gold/5 last:border-b-0 hover:bg-obsidian/40 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={productIds.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
                className="accent-gold"
              />
              <span className="font-sans text-sm text-cream">{p.name}</span>
              <span className="font-sans text-xs text-cream-dim">{p.brand}</span>
            </label>
          ))}
          {filteredProducts.length === 0 && (
            <p className="px-4 py-6 text-center font-sans text-sm text-cream-dim italic">
              Sin resultados
            </p>
          )}
        </div>
      </section>

      <GoldDivider />

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {collection?.id ? "Guardar cambios" : "Crear colección"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/collections")}>
          Cancelar
        </Button>
        {collection?.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto font-sans text-xs text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} /> Eliminar colección
          </button>
        )}
      </div>
    </form>
  );
}

function AdminInput({
  label,
  className,
  onChange,
  ...props
}: {
  label: string;
  className?: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div className={className}>
      <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
        {label}
        {props.required && <span className="text-gold ml-1">*</span>}
      </label>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-obsidian border border-gold/10 text-cream text-sm font-sans px-3 py-2.5 focus:border-gold/30 focus:outline-none transition-colors"
      />
    </div>
  );
}
