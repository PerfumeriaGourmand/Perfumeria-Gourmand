export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import CuentasView from "./CuentasView";

export type Destination = {
  id: string;
  name: string;
};

export type Movement = {
  id: string;
  destination_id: string;
  kind: "venta" | "retiro" | "gasto" | "transferencia" | "ajuste";
  amount: number;
  description: string | null;
  created_at: string;
};

export default async function CuentasPage() {
  const supabase = await createAdminClient();

  const { data: destinations } = await supabase
    .from("payment_destinations")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  // Traemos monto y destino de TODOS los movimientos para que el saldo sea exacto,
  // aunque en pantalla solo se listen los últimos.
  const { data: allAmounts } = await supabase
    .from("account_movements")
    .select("destination_id, amount");

  const balances: Record<string, number> = {};
  for (const m of allAmounts ?? []) {
    balances[m.destination_id] = (balances[m.destination_id] ?? 0) + Number(m.amount);
  }

  const { data: recentMovements } = await supabase
    .from("account_movements")
    .select("id, destination_id, kind, amount, description, created_at")
    .order("created_at", { ascending: false })
    .limit(150);

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl text-cream mb-1">Cuentas</h1>
        <p className="font-sans text-xs text-cream-dim">
          Saldo y movimientos de cada cuenta (ventas, retiros, gastos, transferencias)
        </p>
      </div>
      <CuentasView
        destinations={(destinations ?? []) as Destination[]}
        balances={balances}
        movements={(recentMovements ?? []) as Movement[]}
      />
    </div>
  );
}
