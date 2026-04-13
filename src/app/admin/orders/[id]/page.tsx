export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const addr = order.shipping_address as Record<string, string> | null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 font-sans text-xs text-cream-dim hover:text-cream transition-colors"
        >
          <ChevronLeft size={12} /> Órdenes
        </Link>
        <h1 className="font-display text-2xl text-cream">
          Orden #{order.id.slice(0, 8).toUpperCase()}
        </h1>
      </div>

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
      </div>

      {/* Items */}
      <div className="border border-gold/10 bg-obsidian-surface mb-6">
        <div className="px-5 py-3 border-b border-gold/10">
          <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
            Productos
          </p>
        </div>
        {(order.items ?? []).map((item: {
          id: string;
          product_name: string;
          size_ml: number | null;
          quantity: number;
          unit_price: number;
          total_price: number;
        }) => (
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
        <div className="border border-gold/10 bg-obsidian-surface p-5">
          <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
            Notas
          </p>
          <p className="font-sans text-sm text-cream-muted">{order.notes}</p>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gold/10 bg-obsidian-surface p-5">
      <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-3">{title}</p>
      <div className="font-sans text-sm text-cream space-y-1">{children}</div>
    </div>
  );
}
