"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/order-utils";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import FulfillmentStatusUpdater from "@/components/admin/FulfillmentStatusUpdater";
import type { Order, OrderItem } from "@/types";

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: "Crédito",
  debit_card: "Débito",
  bank_transfer: "Transferencia",
  mercadopago_wallet: "MercadoPago",
};

type OrderWithItems = Order & { items: OrderItem[] };

function itemsSummary(items: OrderItem[]) {
  if (!items.length) return "—";
  return items
    .map((item) => `${item.product_name}${item.size_ml ? ` ${item.size_ml}ml` : ""}${item.quantity > 1 ? ` x${item.quantity}` : ""}`)
    .join(", ");
}

export default function OrdersTable({ orders }: { orders: OrderWithItems[] }) {
  const [selected, setSelected] = useState<OrderWithItems | null>(null);
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (order) =>
        order.customer_name.toLowerCase().includes(q) ||
        order.items.some((item) => item.product_name.toLowerCase().includes(q))
    );
  }, [orders, query]);

  return (
    <>
      <div className="relative mb-5 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por cliente o perfume..."
          className="w-full bg-obsidian-surface border border-gold/10 text-cream font-sans text-sm pl-9 pr-3 py-2.5 focus:outline-none focus:border-gold/30 transition-colors placeholder:text-cream-dim"
        />
      </div>

      <div className="border border-gold/10 bg-obsidian-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              {["ID", "Cliente", "Perfume", "Pago", "Total", "Estado", "Fecha", ""].map((h) => (
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gold/5 hover:bg-obsidian/40 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-cream-dim">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-5 py-4">
                  <p className="font-sans text-sm text-cream">{order.customer_name}</p>
                  <p className="font-sans text-xs text-cream-dim">{order.customer_email}</p>
                </td>
                <td className="px-5 py-4 font-sans text-xs text-cream-muted max-w-[220px]">
                  {itemsSummary(order.items)}
                </td>
                <td className="px-5 py-4 font-sans text-xs text-cream-muted">
                  {PAYMENT_LABELS[order.payment_method ?? ""] ?? "—"}
                  {order.installments > 1 && ` (${order.installments}c)`}
                </td>
                <td className="px-5 py-4 font-sans text-sm text-gold">
                  {formatPrice(order.total)}
                </td>
                <td className="px-5 py-4">
                  <span className={`font-sans text-[10px] tracking-wide px-2 py-0.5 ${STATUS_STYLES[order.payment_status] ?? ""}`}>
                    {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                  </span>
                </td>
                <td className="px-5 py-4 font-sans text-xs text-cream-dim">
                  {new Date(order.created_at).toLocaleDateString("es-AR")}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setSelected(order)}
                    className="font-sans text-xs text-gold/60 hover:text-gold transition-colors"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center font-sans text-sm text-cream-dim italic">
                  {query ? "Sin resultados para tu búsqueda" : "Sin órdenes"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => setSelected(updated)}
        />
      )}
    </>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onUpdated,
}: {
  order: OrderWithItems;
  onClose: () => void;
  onUpdated: (order: OrderWithItems) => void;
}) {
  const router = useRouter();
  const addr = order.shipping_address as Record<string, string> | null;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});

  const startEditing = () => {
    setPriceDrafts(
      Object.fromEntries(order.items.map((item) => [item.id, String(item.unit_price)]))
    );
    setEditing(true);
  };

  const cancelEditing = () => setEditing(false);

  const handleSave = async () => {
    const parsed = order.items.map((item) => ({
      id: item.id,
      unit_price: Number(priceDrafts[item.id]),
    }));

    if (parsed.some((p) => !Number.isFinite(p.unit_price) || p.unit_price < 0)) {
      toast.error("Precio inválido");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: parsed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al actualizar");

      const updatedItems = order.items.map((item) => {
        const unit_price = parsed.find((p) => p.id === item.id)!.unit_price;
        return { ...item, unit_price, total_price: unit_price * item.quantity };
      });
      onUpdated({ ...order, items: updatedItems, subtotal: data.subtotal, total: data.total });
      setEditing(false);
      toast.success("Precios actualizados");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-obsidian-surface border border-gold/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10 sticky top-0 bg-obsidian-surface">
          <h2 className="font-display text-xl text-cream">
            Orden #{order.id.slice(0, 8).toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="text-cream-dim hover:text-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <InfoBlock title="Cliente">
              <p>{order.customer_name}</p>
              <p className="text-cream-dim">{order.customer_email}</p>
              {order.customer_phone && <p className="text-cream-dim">{order.customer_phone}</p>}
            </InfoBlock>

            {addr && (
              <InfoBlock title="Dirección">
                <p>{addr.street} {addr.number}{addr.apt ? ` ${addr.apt}` : ""}</p>
                <p className="text-cream-dim">{addr.city}, {addr.province} {addr.zip}</p>
              </InfoBlock>
            )}

            <InfoBlock title="Pago">
              <p>{order.payment_method?.replace("_", " ")}</p>
              {order.installments > 1 && (
                <p className="text-cream-dim">{order.installments} cuotas</p>
              )}
              {order.mp_payment_id && (
                <p className="text-cream-dim text-xs font-mono">MP: {order.mp_payment_id}</p>
              )}
            </InfoBlock>

            <InfoBlock title="Estado">
              <OrderStatusUpdater orderId={order.id} currentStatus={order.payment_status} />
            </InfoBlock>

            {order.payment_status === "approved" && (
              <InfoBlock title="Envío">
                <FulfillmentStatusUpdater
                  orderId={order.id}
                  currentStatus={order.fulfillment_status}
                />
              </InfoBlock>
            )}
          </div>

          <div className="border border-gold/10 bg-obsidian mb-6">
            <div className="px-5 py-3 border-b border-gold/10 flex items-center justify-between">
              <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                Productos
              </p>
              {!editing ? (
                <button
                  onClick={startEditing}
                  className="flex items-center gap-1 font-sans text-[10px] tracking-widest uppercase text-gold/60 hover:text-gold transition-colors"
                >
                  <Pencil size={11} /> Editar precios
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="font-sans text-[10px] tracking-widest uppercase text-cream-dim hover:text-cream transition-colors disabled:opacity-40"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="font-sans text-[10px] tracking-widest uppercase text-gold/60 hover:text-gold transition-colors disabled:opacity-40"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              )}
            </div>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-5 py-3 border-b border-gold/5"
              >
                <div>
                  <p className="font-sans text-sm text-cream">{item.product_name}</p>
                  <p className="font-sans text-xs text-cream-dim">
                    {item.size_ml ? `${item.size_ml}ml × ` : ""}{item.quantity}
                  </p>
                </div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs text-cream-dim">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceDrafts[item.id] ?? ""}
                      onChange={(e) =>
                        setPriceDrafts((d) => ({ ...d, [item.id]: e.target.value }))
                      }
                      className="w-28 bg-obsidian-surface border border-gold/20 text-cream font-sans text-sm px-2 py-1.5 text-right focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                ) : (
                  <p className="font-sans text-sm text-gold">{formatPrice(item.total_price)}</p>
                )}
              </div>
            ))}
            <div className="px-5 py-4 flex justify-between">
              <span className="font-sans text-xs text-cream-muted uppercase tracking-widest">Total</span>
              <span className="font-display text-xl text-gold">
                {formatPrice(
                  editing
                    ? order.items.reduce(
                        (sum, item) => sum + Number(priceDrafts[item.id] ?? item.unit_price) * item.quantity,
                        0
                      ) - order.discount_amount
                    : order.total
                )}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="border border-gold/10 bg-obsidian p-5">
              <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
                Notas
              </p>
              <p className="font-sans text-sm text-cream-muted">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gold/10 bg-obsidian p-5">
      <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-3">{title}</p>
      <div className="font-sans text-sm text-cream space-y-1">{children}</div>
    </div>
  );
}
