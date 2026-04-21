"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { Coupon } from "@/types";

const inputClass =
  "w-full bg-obsidian border border-gold/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim focus:outline-none focus:border-gold/60 transition-colors rounded";
const labelClass = "font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1.5 block";

const EMPTY_FORM = {
  code: "",
  description: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: "",
  min_order_amount: "",
  max_uses: "",
  expires_at: "",
};

export default function CouponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const supabase = createClient();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const updateForm = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discount_value) return;

    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        expires_at: form.expires_at || null,
      };

      const { data, error } = await supabase
        .from("coupons")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      setCoupons((prev) => [data as Coupon, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      toast.success("Cupón creado");
    } catch {
      toast.error("Error al crear el cupón");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);

    if (error) { toast.error("Error al actualizar"); return; }
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cupón?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) { toast.error("Error al eliminar"); return; }
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Cupón eliminado");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Cupones</h1>
          <p className="font-sans text-xs text-cream-dim">{coupons.length} cupones</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold/10 border border-gold/30 text-gold font-sans text-xs tracking-widest uppercase hover:bg-gold/20 transition-colors"
        >
          <Plus size={14} />
          Nuevo cupón
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-obsidian-surface border border-gold/10 p-6 mb-8 space-y-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Tag size={15} strokeWidth={1.5} className="text-gold" />
            <h2 className="font-display text-lg text-cream">Nuevo cupón</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Código <span className="text-gold">*</span></label>
              <input
                className={inputClass}
                value={form.code}
                onChange={(e) => updateForm("code", e.target.value.toUpperCase())}
                placeholder="PROMO20"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Descripción</label>
              <input
                className={inputClass}
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="20% de descuento en toda la tienda"
              />
            </div>
            <div>
              <label className={labelClass}>Tipo de descuento <span className="text-gold">*</span></label>
              <select
                className={inputClass}
                value={form.discount_type}
                onChange={(e) => updateForm("discount_type", e.target.value)}
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Valor {form.discount_type === "percentage" ? "(%)" : "($)"} <span className="text-gold">*</span>
              </label>
              <input
                className={inputClass}
                type="number"
                min="0.01"
                step="0.01"
                value={form.discount_value}
                onChange={(e) => updateForm("discount_value", e.target.value)}
                placeholder={form.discount_type === "percentage" ? "20" : "5000"}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Monto mínimo ($)</label>
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.min_order_amount}
                onChange={(e) => updateForm("min_order_amount", e.target.value)}
                placeholder="Sin mínimo"
              />
            </div>
            <div>
              <label className={labelClass}>Usos máximos</label>
              <input
                className={inputClass}
                type="number"
                min="1"
                value={form.max_uses}
                onChange={(e) => updateForm("max_uses", e.target.value)}
                placeholder="Ilimitado"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Vencimiento</label>
              <input
                className={inputClass}
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => updateForm("expires_at", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gold text-obsidian font-sans text-xs tracking-widest uppercase hover:bg-gold/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Guardando..." : "Crear cupón"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-gold/20 text-cream-dim font-sans text-xs tracking-widest uppercase hover:border-gold/40 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="bg-obsidian-surface border border-gold/10 p-12 text-center">
          <Tag size={32} strokeWidth={1} className="text-gold/30 mx-auto mb-4" />
          <p className="font-display text-xl text-cream-dim">No hay cupones</p>
          <p className="font-sans text-xs text-cream-dim mt-2">Creá el primero con el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`bg-obsidian-surface border p-5 flex items-center gap-4 transition-colors ${
                coupon.is_active ? "border-gold/10" : "border-gold/5 opacity-50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-sans text-sm text-gold tracking-widest font-medium">
                    {coupon.code}
                  </span>
                  <span
                    className={`font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full ${
                      coupon.is_active
                        ? "bg-green-400/10 text-green-400"
                        : "bg-cream-dim/10 text-cream-dim"
                    }`}
                  >
                    {coupon.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                {coupon.description && (
                  <p className="font-sans text-xs text-cream-dim mb-1">{coupon.description}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="font-sans text-xs text-cream-muted">
                    {coupon.discount_type === "percentage"
                      ? `${coupon.discount_value}% off`
                      : `${formatPrice(coupon.discount_value)} off`}
                  </span>
                  {coupon.min_order_amount && (
                    <span className="font-sans text-xs text-cream-dim">
                      Mín. {formatPrice(coupon.min_order_amount)}
                    </span>
                  )}
                  <span className="font-sans text-xs text-cream-dim">
                    {coupon.current_uses}{coupon.max_uses ? `/${coupon.max_uses}` : ""} usos
                  </span>
                  {coupon.expires_at && (
                    <span className="font-sans text-xs text-cream-dim">
                      Vence {new Date(coupon.expires_at).toLocaleDateString("es-AR")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(coupon)}
                  title={coupon.is_active ? "Desactivar" : "Activar"}
                  className="text-cream-dim hover:text-gold transition-colors"
                >
                  {coupon.is_active
                    ? <ToggleRight size={22} strokeWidth={1.5} className="text-gold" />
                    : <ToggleLeft size={22} strokeWidth={1.5} />
                  }
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  title="Eliminar"
                  className="text-cream-dim hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
