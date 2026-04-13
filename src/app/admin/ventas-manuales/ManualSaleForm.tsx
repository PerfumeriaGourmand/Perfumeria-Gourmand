"use client";

import { useState, useMemo } from "react";
import { Search, X, CheckCircle, AlertTriangle, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import type { ProductOption } from "./page";

type Variant = ProductOption["variants"][number];

const inputClass =
  "w-full bg-obsidian border border-gold/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim focus:outline-none focus:border-gold/60 transition-colors";
const labelClass =
  "font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1.5 block";

export default function ManualSaleForm({
  products,
}: {
  products: ProductOption[];
}) {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductOption | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSale, setLastSale] = useState<{
    label: string;
    qty: number;
    total: number;
  } | null>(null);

  // ── Búsqueda filtrada ──────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [search, products]);

  // ── Cálculos derivados ─────────────────────────────────────────────────────
  const qty = Math.max(0, parseInt(quantity) || 0);
  const price = parseFloat(unitPrice) || 0;
  const total = qty * price;
  const canSubmit =
    selectedProduct !== null &&
    selectedVariant !== null &&
    qty > 0 &&
    price > 0 &&
    qty <= (selectedVariant?.stock ?? 0);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const selectProduct = (p: ProductOption) => {
    setSelectedProduct(p);
    setSelectedVariant(null);
    setUnitPrice("");
    setSearch("");
  };

  const selectVariant = (v: Variant) => {
    setSelectedVariant(v);
    setUnitPrice(v.price.toString());
  };

  const clearProduct = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setUnitPrice("");
    setQuantity("1");
  };

  const reset = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity("1");
    setUnitPrice("");
    setCustomerName("");
    setNotes("");
    setSearch("");
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedVariant) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/manual-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_id: selectedVariant.id,
          product_name: `${selectedProduct.brand} ${selectedProduct.name}`,
          size_ml: selectedVariant.size_ml,
          quantity: qty,
          unit_price: price,
          customer_name: customerName.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al registrar");

      setLastSale({
        label: `${selectedProduct.brand} ${selectedProduct.name} ${selectedVariant.size_ml}ml`,
        qty,
        total,
      });
      toast.success("Venta registrada");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Último registro */}
      {lastSale && (
        <div className="flex items-start gap-3 border border-green-500/20 bg-green-500/5 px-5 py-4">
          <CheckCircle
            size={15}
            strokeWidth={1.5}
            className="text-green-400 mt-0.5 shrink-0"
          />
          <div>
            <p className="font-sans text-xs text-green-400">
              Venta registrada correctamente
            </p>
            <p className="font-sans text-[10px] text-cream-dim mt-0.5">
              {lastSale.label} · {lastSale.qty} ud
              {lastSale.qty !== 1 ? "s" : ""} ·{" "}
              {formatPrice(lastSale.total)}
            </p>
          </div>
          <button
            onClick={() => setLastSale(null)}
            className="ml-auto text-cream-dim hover:text-cream transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Paso 1: Producto ─────────────────────────────────────────────── */}
      <div className="bg-obsidian-surface border border-gold/10 p-6">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag size={14} strokeWidth={1.5} className="text-gold/60" />
          <h2 className="font-sans text-[10px] tracking-widest uppercase text-gold/60">
            1. Producto
          </h2>
        </div>

        {selectedProduct ? (
          <div className="flex items-center justify-between bg-obsidian border border-gold/20 px-4 py-3">
            <div>
              <p className="font-sans text-sm text-cream">
                {selectedProduct.brand} {selectedProduct.name}
              </p>
              <p className="font-sans text-[10px] text-cream-dim mt-0.5">
                {selectedProduct.variants.length} variante
                {selectedProduct.variants.length !== 1 ? "s" : ""} disponible
                {selectedProduct.variants.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={clearProduct}
              className="text-cream-dim hover:text-cream transition-colors ml-4 shrink-0"
              title="Cambiar producto"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o marca..."
                className={inputClass + " pl-9"}
                autoComplete="off"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-dim hover:text-cream transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {filteredProducts.length > 0 && (
              <div className="absolute z-10 w-full mt-1 border border-gold/20 bg-obsidian shadow-lg">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectProduct(p)}
                    className="w-full text-left px-4 py-3 hover:bg-gold/5 transition-colors border-b border-gold/5 last:border-0"
                  >
                    <p className="font-sans text-sm text-cream">
                      {p.brand}{" "}
                      <span className="text-cream-muted">{p.name}</span>
                    </p>
                    <p className="font-sans text-[10px] text-cream-dim mt-0.5">
                      {p.variants.length} variante
                      {p.variants.length !== 1 ? "s" : ""}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {search.trim().length > 0 && filteredProducts.length === 0 && (
              <p className="font-sans text-xs text-cream-dim mt-3 px-1">
                Sin resultados para &ldquo;{search}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Paso 2: Variante ─────────────────────────────────────────────── */}
      {selectedProduct && (
        <div className="bg-obsidian-surface border border-gold/10 p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag
              size={14}
              strokeWidth={1.5}
              className="text-gold/60"
            />
            <h2 className="font-sans text-[10px] tracking-widest uppercase text-gold/60">
              2. Tamaño / Variante
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedProduct.variants.map((v) => {
              const active = selectedVariant?.id === v.id;
              const outOfStock = v.stock === 0;
              return (
                <button
                  key={v.id}
                  onClick={() => !outOfStock && selectVariant(v)}
                  disabled={outOfStock}
                  className={`px-4 py-2.5 border font-sans text-xs transition-all duration-150 ${
                    active
                      ? "border-gold bg-gold/10 text-gold"
                      : outOfStock
                      ? "border-gold/10 text-cream-dim/40 cursor-not-allowed"
                      : "border-gold/20 text-cream-muted hover:border-gold/40 hover:text-cream"
                  }`}
                >
                  <span className="block">{v.size_ml} ml</span>
                  <span
                    className={`block text-[10px] mt-0.5 ${
                      active
                        ? "text-gold/70"
                        : outOfStock
                        ? "text-cream-dim/30"
                        : "text-cream-dim"
                    }`}
                  >
                    {outOfStock ? "Sin stock" : `${v.stock} en stock`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Paso 3: Detalle de venta ─────────────────────────────────────── */}
      {selectedVariant && (
        <div className="bg-obsidian-surface border border-gold/10 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag
              size={14}
              strokeWidth={1.5}
              className="text-gold/60"
            />
            <h2 className="font-sans text-[10px] tracking-widest uppercase text-gold/60">
              3. Detalle de la venta
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cantidad</label>
              <input
                type="number"
                min={1}
                max={selectedVariant.stock}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputClass}
              />
              {qty > selectedVariant.stock && (
                <p className="font-sans text-[10px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Máximo disponible: {selectedVariant.stock}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Precio unitario (ARS)</label>
              <input
                type="number"
                min={0}
                step={100}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder={selectedVariant.price.toString()}
                className={inputClass}
              />
              <p className="font-sans text-[10px] text-cream-dim mt-1">
                Precio lista: {formatPrice(selectedVariant.price)}
              </p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Cliente (opcional)</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre del cliente (default: Venta Manual)"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Notas (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Venta por WhatsApp, pago en efectivo..."
              className={inputClass}
            />
          </div>

          {/* Resumen */}
          {qty > 0 && price > 0 && qty <= selectedVariant.stock && (
            <div className="border-t border-gold/10 pt-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-[10px] text-cream-dim uppercase tracking-widest">
                  Total a registrar
                </p>
                <p className="font-sans text-[10px] text-cream-dim mt-0.5">
                  {qty} ud{qty !== 1 ? "s" : ""} × {formatPrice(price)}
                </p>
              </div>
              <p className="font-display text-2xl text-gold">
                {formatPrice(total)}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Confirmar venta"}
          </button>
        </div>
      )}
    </div>
  );
}
