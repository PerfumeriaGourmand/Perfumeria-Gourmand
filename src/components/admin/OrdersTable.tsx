"use client";

import { useState } from "react";
import { X } from "lucide-react";
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

  return (
    <>
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
            {orders.map((order) => (
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
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center font-sans text-sm text-cream-dim italic">
                  Sin órdenes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function OrderDetailModal({ order, onClose }: { order: OrderWithItems; onClose: () => void }) {
  const addr = order.shipping_address as Record<string, string> | null;

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
            <div className="px-5 py-3 border-b border-gold/10">
              <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                Productos
              </p>
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
                <p className="font-sans text-sm text-gold">{formatPrice(item.total_price)}</p>
              </div>
            ))}
            <div className="px-5 py-4 flex justify-between">
              <span className="font-sans text-xs text-cream-muted uppercase tracking-widest">Total</span>
              <span className="font-display text-xl text-gold">{formatPrice(order.total)}</span>
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
