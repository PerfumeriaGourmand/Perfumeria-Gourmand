export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  approved: "text-green-400 bg-green-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  rejected: "text-red-400 bg-red-400/10",
  in_process: "text-blue-400 bg-blue-400/10",
  cancelled: "text-cream-dim bg-cream-dim/10",
  refunded: "text-cream-dim bg-cream-dim/10",
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  in_process: "En proceso",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: "Crédito",
  debit_card: "Débito",
  bank_transfer: "Transferencia",
  mercadopago_wallet: "MercadoPago",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createAdminClient();

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("payment_status", status);

  const { data: orders } = await query.limit(100);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Órdenes</h1>
          <p className="font-sans text-xs text-cream-dim">{orders?.length ?? 0} órdenes</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { value: "", label: "Todas" },
          { value: "pending", label: "Pendientes" },
          { value: "approved", label: "Aprobadas" },
          { value: "in_process", label: "En proceso" },
          { value: "rejected", label: "Rechazadas" },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/orders?status=${f.value}` : "/admin/orders"}
            className={`font-sans text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
              (status ?? "") === f.value
                ? "border-gold/50 text-gold bg-gold/5"
                : "border-gold/10 text-cream-dim hover:border-gold/30 hover:text-cream-muted"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="border border-gold/10 bg-obsidian-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              {["ID", "Cliente", "Pago", "Total", "Estado", "Fecha", ""].map((h) => (
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
            {(orders ?? []).map((order) => (
              <tr key={order.id} className="border-b border-gold/5 hover:bg-obsidian/40 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-cream-dim">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-5 py-4">
                  <p className="font-sans text-sm text-cream">{order.customer_name}</p>
                  <p className="font-sans text-xs text-cream-dim">{order.customer_email}</p>
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
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-sans text-xs text-gold/60 hover:text-gold transition-colors"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center font-sans text-sm text-cream-dim italic">
                  Sin órdenes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
