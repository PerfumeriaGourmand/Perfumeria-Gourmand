export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import OrdersTable from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createAdminClient();

  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)")
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

      <OrdersTable orders={orders ?? []} />
    </div>
  );
}
