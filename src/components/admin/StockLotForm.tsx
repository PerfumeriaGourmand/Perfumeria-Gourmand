"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

interface Props {
  products: ProductWithVariants[];
}

export default function StockLotForm({ products }: Props) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costUsd, setCostUsd] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  const variants = selectedProduct?.variants ?? [];

  const costArs = useMemo(() => {
    const u = parseFloat(costUsd);
    const tc = parseFloat(exchangeRate);
    if (!isNaN(u) && !isNaN(tc) && u > 0 && tc > 0) {
      return u * tc;
    }
    return null;
  }, [costUsd, exchangeRate]);

  const handleProductChange = (value: string) => {
    setProductId(value);
    setVariantId(""); // reset variant when product changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !variantId || !quantity || !costUsd || !exchangeRate || !purchaseDate) {
      toast.error("Completá todos los campos requeridos");
      return;
    }

    if (costArs === null) {
      toast.error("Verificá el costo USD y el tipo de cambio");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/stock-lots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          variant_id: variantId,
          quantity_purchased: parseInt(quantity, 10),
          cost_price_usd: parseFloat(costUsd),
          exchange_rate: parseFloat(exchangeRate),
          cost_price_ars: costArs,
          purchase_date: purchaseDate,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear el lote");

      toast.success("Lote ingresado correctamente");
      router.push("/admin/stock");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-obsidian border border-gold/10 text-cream font-sans text-sm px-3 py-2.5 focus:outline-none focus:border-gold/30 transition-colors placeholder:text-cream-dim/40";
  const labelClass =
    "block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {/* Producto */}
      <div>
        <label className={labelClass}>Producto *</label>
        <select
          value={productId}
          onChange={(e) => handleProductChange(e.target.value)}
          className={inputClass}
          required
        >
          <option value="">Seleccionar producto...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.brand} — {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Variante (tamaño) */}
      <div>
        <label className={labelClass}>Variante / Tamaño *</label>
        <select
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
          className={inputClass}
          required
          disabled={!productId}
        >
          <option value="">
            {productId ? "Seleccionar tamaño..." : "Primero seleccioná un producto"}
          </option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.size_ml} ml · Stock actual: {v.stock} uds
            </option>
          ))}
        </select>
      </div>

      {/* Cantidad */}
      <div>
        <label className={labelClass}>Cantidad de unidades *</label>
        <input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Ej: 12"
          className={inputClass}
          required
        />
      </div>

      {/* Costo y tipo de cambio */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Costo por unidad (USD) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={costUsd}
            onChange={(e) => setCostUsd(e.target.value)}
            placeholder="Ej: 18.50"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Tipo de cambio (ARS/USD) *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            placeholder="Ej: 1200"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Costo ARS calculado */}
      <div className="border border-gold/10 bg-obsidian px-4 py-3">
        <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1">
          Costo por unidad en ARS (calculado)
        </p>
        <p className="font-display text-2xl text-gold">
          {costArs !== null ? formatPrice(costArs) : "—"}
        </p>
        {costArs !== null && quantity && (
          <p className="font-sans text-[10px] text-cream-dim mt-1">
            Total del lote: {formatPrice(costArs * parseInt(quantity || "0", 10))}
          </p>
        )}
      </div>

      {/* Fecha de compra */}
      <div>
        <label className={labelClass}>Fecha de compra *</label>
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      {/* Notas */}
      <div>
        <label className={labelClass}>Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Proveedor X, factura #123, lote especial..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold font-sans text-xs tracking-widest uppercase px-6 py-2.5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Ingresar lote"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="font-sans text-xs text-cream-dim hover:text-cream transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
