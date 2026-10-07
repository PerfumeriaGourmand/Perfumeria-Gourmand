"use client";

import { useState, useMemo } from "react";
import { Search, X, CheckCircle, AlertTriangle, ShoppingBag, Wallet, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import type { ProductOption, PaymentDestination } from "./page";

type Variant = ProductOption["variants"][number];

const inputClass =
  "w-full bg-obsidian border border-gold/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim focus:outline-none focus:border-gold/60 transition-colors";
const labelClass =
  "font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1.5 block";

export default function ManualSaleForm({
  products,
  destinations,
  exchangeRate,
}: {
  products: ProductOption[];
  destinations: PaymentDestination[];
  exchangeRate: number | null;
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

  const [destinationList, setDestinationList] = useState(destinations);
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [addingDestination, setAddingDestination] = useState(false);
  const [newDestinationName, setNewDestinationName] = useState("");
  const [savingDestination, setSavingDestination] = useState(false);

  // Pago dividido: cada fila es un destino + monto; la suma debe igualar el total
  const [splitMode, setSplitMode] = useState(false);
  const [splits, setSplits] = useState<{ destinationId: string; amount: string }[]>([]);

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
  const costArs =
    selectedVariant?.average_cost_usd != null && exchangeRate != null
      ? selectedVariant.average_cost_usd * exchangeRate
      : null;
  const totalCents = Math.round(total * 100);
  const splitCents = splits.reduce(
    (acc, s) => acc + Math.round((parseFloat(s.amount) || 0) * 100),
    0
  );
  const remainingCents = totalCents - splitCents;
  const paymentValid = splitMode
    ? splits.length >= 2 &&
      splits.every((s) => s.destinationId && (parseFloat(s.amount) || 0) > 0) &&
      remainingCents === 0
    : destinationId !== null;
  const canSubmit =
    selectedProduct !== null &&
    selectedVariant !== null &&
    qty > 0 &&
    price > 0 &&
    qty <= (selectedVariant?.stock ?? 0) &&
    paymentValid;

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
    setDestinationId(null);
    setSplitMode(false);
    setSplits([]);
  };

  const toggleSplit = () => {
    if (splitMode) {
      setSplitMode(false);
      return;
    }
    // Arranca con dos filas: la primera hereda el destino ya elegido
    setSplits([
      { destinationId: destinationId ?? "", amount: "" },
      { destinationId: "", amount: "" },
    ]);
    setSplitMode(true);
  };

  const updateSplit = (
    i: number,
    patch: Partial<{ destinationId: string; amount: string }>
  ) => setSplits((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const fillRemaining = (i: number) => {
    const others = splits.reduce(
      (acc, s, idx) => (idx === i ? acc : acc + Math.round((parseFloat(s.amount) || 0) * 100)),
      0
    );
    const rest = Math.max(0, totalCents - others);
    updateSplit(i, { amount: (rest / 100).toString() });
  };

  const createDestination = async () => {
    const name = newDestinationName.trim();
    if (!name) return;

    setSavingDestination(true);
    try {
      const res = await fetch("/api/admin/payment-destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear destino");

      setDestinationList((prev) => [...prev, data.destination]);
      setDestinationId(data.destination.id);
      setNewDestinationName("");
      setAddingDestination(false);
      toast.success("Destino agregado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSavingDestination(false);
    }
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
          payments: splitMode
            ? splits.map((s) => ({
                destination_id: s.destinationId,
                amount: parseFloat(s.amount),
              }))
            : [{ destination_id: destinationId, amount: total }],
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
              <p className="font-sans text-[10px] text-cream-dim mt-0.5">
                {costArs !== null
                  ? `Costo: ${formatPrice(costArs)}`
                  : "Costo: sin datos"}
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
            <div className="flex flex-wrap gap-2 mb-2">
              {["Whatsapp", "Marketplace"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNotes(c)}
                  className={`px-3 py-1.5 border font-sans text-xs transition-all duration-150 ${
                    notes === c
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/20 text-cream-muted hover:border-gold/40 hover:text-cream"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Venta por WhatsApp, pago en efectivo... (u 'Otro', escribí acá)"
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass + " mb-0"}>Destino del dinero</label>
              <button
                type="button"
                onClick={toggleSplit}
                className="font-sans text-[10px] tracking-widest uppercase text-gold/60 hover:text-gold transition-colors"
              >
                {splitMode ? "Un solo pago" : "Dividir pago"}
              </button>
            </div>

            {splitMode && (
              <div className="space-y-2">
                {splits.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={s.destinationId}
                      onChange={(e) => updateSplit(i, { destinationId: e.target.value })}
                      className={inputClass + " flex-1 min-w-0 py-2.5"}
                    >
                      <option value="">Destino…</option>
                      {destinationList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={s.amount}
                      onChange={(e) => updateSplit(i, { amount: e.target.value })}
                      placeholder="Monto"
                      className={inputClass + " w-32 py-2.5"}
                    />
                    <button
                      type="button"
                      onClick={() => fillRemaining(i)}
                      title="Completar con lo que falta"
                      className="px-2 py-2.5 border border-gold/20 text-cream-dim font-sans text-[10px] uppercase tracking-widest hover:border-gold/40 hover:text-cream transition-colors"
                    >
                      Resto
                    </button>
                    {splits.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setSplits((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-cream-dim hover:text-red-400 transition-colors"
                        aria-label="Quitar pago"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSplits((prev) => [...prev, { destinationId: "", amount: "" }])}
                    className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-gold/20 text-cream-dim font-sans text-xs hover:border-gold/40 hover:text-cream transition-colors"
                  >
                    <Plus size={12} strokeWidth={1.5} />
                    Agregar pago
                  </button>
                  {total > 0 && (
                    <p
                      className={`font-sans text-[10px] ${
                        remainingCents === 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {remainingCents === 0
                        ? "Pagos completos"
                        : remainingCents > 0
                          ? `Faltan ${formatPrice(remainingCents / 100)}`
                          : `Sobran ${formatPrice(-remainingCents / 100)}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className={splitMode ? "hidden" : "flex flex-wrap gap-2"}>
              {destinationList.map((d) => {
                const active = destinationId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDestinationId(d.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 border font-sans text-xs transition-all duration-150 ${
                      active
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-cream-muted hover:border-gold/40 hover:text-cream"
                    }`}
                  >
                    <Wallet size={12} strokeWidth={1.5} />
                    {d.name}
                  </button>
                );
              })}

              {addingDestination ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    autoFocus
                    value={newDestinationName}
                    onChange={(e) => setNewDestinationName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createDestination();
                      if (e.key === "Escape") setAddingDestination(false);
                    }}
                    placeholder="Nombre del destino"
                    className="bg-obsidian border border-gold/20 px-3 py-2 font-sans text-xs text-cream placeholder:text-cream-dim focus:outline-none focus:border-gold/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={createDestination}
                    disabled={savingDestination || !newDestinationName.trim()}
                    className="px-3 py-2 border border-gold/40 text-gold font-sans text-xs hover:bg-gold/10 transition-colors disabled:opacity-40"
                  >
                    {savingDestination ? "..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingDestination(false);
                      setNewDestinationName("");
                    }}
                    className="text-cream-dim hover:text-cream transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingDestination(true)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-gold/20 text-cream-dim font-sans text-xs hover:border-gold/40 hover:text-cream transition-colors"
                >
                  <Plus size={12} strokeWidth={1.5} />
                  Nuevo destino
                </button>
              )}
            </div>
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
