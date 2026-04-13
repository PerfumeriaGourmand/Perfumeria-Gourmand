"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import type { Product, ProductVariant, ProductImage } from "@/types";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "arabe", label: "Árabe" },
  { value: "disenador", label: "Diseñador" },
  { value: "nicho", label: "Nicho" },
];
const GENDERS = [
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
];
const CONCENTRATIONS = [
  { value: "parfum", label: "Parfum" },
  { value: "edp", label: "EDP" },
  { value: "edt", label: "EDT" },
  { value: "edc", label: "EDC" },
  { value: "oil", label: "Aceite" },
  { value: "otro", label: "Otro" },
];
const SEASONS = [
  { value: "verano", label: "Verano" },
  { value: "invierno", label: "Invierno" },
  { value: "primavera", label: "Primavera" },
  { value: "otono", label: "Otoño" },
  { value: "todo_clima", label: "Todo clima" },
];


interface ProductFormProps {
  product?: Product & { images?: ProductImage[]; variants?: ProductVariant[] };
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    description: product?.description ?? "",
    short_desc: product?.short_desc ?? "",
    category: product?.category ?? "disenador",
    gender: product?.gender ?? "unisex",
    concentration: product?.concentration ?? "edp",
    seasons: product?.seasons ?? [],
    is_featured: product?.is_featured ?? false,
    is_new: product?.is_new ?? false,
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order ?? 0,
  });

  const [variants, setVariants] = useState<Partial<ProductVariant>[]>(
    product?.variants ?? [{ size_ml: 100, price: 0, stock: 0, is_active: true }]
  );

  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [uploadingImage, setUploadingImage] = useState(false);
  // Local previews for newly picked files before upload
  const [pendingPreviews, setPendingPreviews] = useState<{ file: File; preview: string }[]>([]);

  const updateForm = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSeason = (s: string) => {
    setForm((f) => ({
      ...f,
      seasons: f.seasons.includes(s as never)
        ? f.seasons.filter((x) => x !== s)
        : [...f.seasons, s as never],
    }));
  };

  const addVariant = () =>
    setVariants((v) => [...v, { size_ml: 50, price: 0, stock: 0, is_active: true }]);

  const updateVariant = (i: number, key: string, value: unknown) =>
    setVariants((v) => v.map((x, idx) => (idx === i ? { ...x, [key]: value } : x)));

  const removeVariant = (i: number) =>
    setVariants((v) => v.filter((_, idx) => idx !== i));

  const uploadFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setUploadingImage(true);

    for (const file of files) {
      console.log("[ProductForm] Uploading file:", file.name, "size:", file.size);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "product-images");

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        console.error("[ProductForm] Upload error:", data);
        toast.error(`Error al subir "${file.name}": ${data.error ?? res.statusText}`);
        continue;
      }

      console.log("[ProductForm] Uploaded successfully. Path:", data.path, "URL:", data.publicUrl);

      setImages((imgs) => [
        ...imgs,
        {
          // Use a proper UUID so product_images.id (UUID PK) accepts the value.
          // The storage path is recorded separately via the URL.
          id: crypto.randomUUID(),
          product_id: product?.id ?? "",
          url: data.publicUrl,
          alt: form.name,
          is_primary: imgs.length === 0,
          sort_order: imgs.length,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    // Clear pending previews after upload
    setPendingPreviews([]);
    setUploadingImage(false);
    toast.success("Imágenes subidas");
  }, [form.name, product?.id]);

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    // Show local previews immediately
    const previews = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setPendingPreviews((p) => [...p, ...previews]);
    await uploadFiles(files);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    await handleFileSelect(files);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    await handleFileSelect(files);
  };

  const setPrimary = (imgId: string) =>
    setImages((imgs) =>
      imgs.map((img) => ({ ...img, is_primary: img.id === imgId }))
    );

  const removeImage = (img: ProductImage) => {
    // Optimistically remove from UI
    setImages((imgs) => imgs.filter((i) => i.id !== img.id));

    // Delete from Storage + DB in background (non-blocking)
    fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: img.url, imageId: img.id, bucket: "product-images" }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          console.error("[ProductForm] Image delete failed:", data.error);
          toast.error(`No se pudo eliminar la imagen: ${data.error}`);
        } else {
          toast.success("Imagen eliminada");
        }
      })
      .catch(console.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          form,
          variants,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

      toast.success(product?.id ? "Producto actualizado" : "Producto creado");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error("[ProductForm] Submit error:", err);
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      toast.error(`Error al guardar: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;

    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(`Error al eliminar: ${data.error ?? res.statusText}`);
      return;
    }

    toast.success("Producto eliminado");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
      {/* Basic info */}
      <section className="space-y-5">
        <h2 className="font-sans text-xs tracking-widest uppercase text-gold">
          Información básica
        </h2>
        <div className="grid grid-cols-2 gap-5">
          <AdminInput
            label="Nombre del perfume"
            value={form.name}
            onChange={(v) => updateForm("name", v)}
            required
            className="col-span-2 sm:col-span-1"
          />
          <AdminInput
            label="Marca"
            value={form.brand}
            onChange={(v) => updateForm("brand", v)}
            required
          />
        </div>

        <AdminSelect
          label="Categoría"
          value={form.category}
          onChange={(v) => updateForm("category", v)}
          options={CATEGORIES}
        />

        <div className="grid grid-cols-2 gap-5">
          <AdminSelect
            label="Género"
            value={form.gender}
            onChange={(v) => updateForm("gender", v)}
            options={GENDERS}
          />
          <AdminSelect
            label="Concentración"
            value={form.concentration}
            onChange={(v) => updateForm("concentration", v)}
            options={CONCENTRATIONS}
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
            Estaciones
          </label>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSeason(s.value)}
                className={`font-sans text-xs px-3 py-1.5 border transition-all ${
                  form.seasons.includes(s.value as never)
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-gold/10 text-cream-muted hover:border-gold/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            rows={4}
            className="w-full bg-obsidian border border-gold/10 text-cream text-sm font-sans p-3 focus:border-gold/30 focus:outline-none resize-none transition-colors"
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
            Descripción corta (sección nicho)
          </label>
          <textarea
            value={form.short_desc}
            onChange={(e) => updateForm("short_desc", e.target.value)}
            rows={2}
            placeholder="Texto poético breve para la sección nicho"
            className="w-full bg-obsidian border border-gold/10 text-cream text-sm font-sans p-3 focus:border-gold/30 focus:outline-none resize-none transition-colors placeholder:text-cream-dim/30"
          />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-5">
          {[
            { key: "is_active", label: "Activo" },
            { key: "is_featured", label: "Destacado" },
            { key: "is_new", label: "Nuevo" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) => updateForm(key, e.target.checked)}
                className="accent-gold"
              />
              <span className="font-sans text-xs text-cream-muted">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* Variants */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-xs tracking-widest uppercase text-gold">
            Tamaños y precios
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 font-sans text-xs text-gold/60 hover:text-gold transition-colors"
          >
            <Plus size={12} /> Agregar tamaño
          </button>
        </div>

        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 items-end border border-gold/10 p-4">
            <AdminInput
              label="ml"
              type="number"
              value={String(v.size_ml ?? "")}
              onChange={(val) => updateVariant(i, "size_ml", parseInt(val))}
              required
            />
            <AdminInput
              label="Precio ARS"
              type="number"
              value={String(v.price ?? "")}
              onChange={(val) => updateVariant(i, "price", parseFloat(val))}
              required
            />
            <AdminInput
              label="Stock"
              type="number"
              value={String(v.stock ?? "")}
              onChange={(val) => updateVariant(i, "stock", parseInt(val))}
              required
            />
            <div className="flex items-center gap-3 pb-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={v.is_active ?? true}
                  onChange={(e) => updateVariant(i, "is_active", e.target.checked)}
                  className="accent-gold"
                />
                <span className="font-sans text-xs text-cream-muted">Activo</span>
              </label>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      <GoldDivider />

      {/* Images */}
      <section className="space-y-5">
        <h2 className="font-sans text-xs tracking-widest uppercase text-gold">
          Fotos del producto
        </h2>

        {/* Drag & drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg px-6 py-10 cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-gold bg-gold/10 scale-[1.01]"
              : "border-gold/20 hover:border-gold/40 hover:bg-gold/5"
          }`}
        >
          {uploadingImage ? (
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload size={22} strokeWidth={1.5} className="text-gold/50" />
          )}
          <div className="text-center">
            <p className="font-sans text-xs text-cream-muted">
              {uploadingImage
                ? "Subiendo imágenes..."
                : isDragging
                ? "Suelta aquí"
                : "Arrastrá imágenes o hacé clic para seleccionar"}
            </p>
            <p className="font-sans text-[10px] text-cream-dim/50 mt-1">
              JPG, PNG, WEBP · máx. 5MB por archivo
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Pending previews (uploading) */}
        {pendingPreviews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {pendingPreviews.map((p, i) => (
              <div key={i} className="relative w-20 h-24 rounded overflow-hidden border border-gold/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group w-20 h-24 rounded overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className={`w-full h-full object-cover border transition-all ${
                    img.is_primary ? "border-gold" : "border-gold/10"
                  }`}
                />
                {img.is_primary && (
                  <span className="absolute top-1 left-1 bg-gold text-obsidian font-sans text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                    Principal
                  </span>
                )}
                <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(img.id)}
                      className="font-sans text-[9px] tracking-widest uppercase text-gold border border-gold/40 px-2 py-0.5 rounded hover:bg-gold/10 transition-colors"
                    >
                      Principal
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && pendingPreviews.length === 0 && (
          <div className="flex items-center gap-2 text-cream-dim/40">
            <ImageIcon size={14} strokeWidth={1.5} />
            <span className="font-sans text-xs">Sin imágenes aún</span>
          </div>
        )}
      </section>

      <GoldDivider />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {product?.id ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/products")}
        >
          Cancelar
        </Button>
        {product?.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto font-sans text-xs text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} /> Eliminar producto
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

function AdminSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-obsidian border border-gold/10 text-cream text-sm font-sans px-3 py-2.5 focus:border-gold/30 focus:outline-none transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
