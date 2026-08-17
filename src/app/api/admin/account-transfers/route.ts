import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

// POST /api/admin/account-transfers
// Body: { from_destination_id, to_destination_id, amount, description? }
// Crea dos movimientos "transferencia" enlazados (salida en origen, entrada en destino)
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { from_destination_id, to_destination_id, amount, description } = body as {
      from_destination_id?: string;
      to_destination_id?: string;
      amount?: number;
      description?: string;
    };

    if (!from_destination_id || !to_destination_id) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (from_destination_id === to_destination_id) {
      return NextResponse.json(
        { error: "El origen y destino deben ser distintos" },
        { status: 400 }
      );
    }
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "El monto debe ser mayor a 0" },
        { status: 400 }
      );
    }

    const roundedAmount = Math.round(amount * 100) / 100;
    const trimmedDescription = description?.trim() || null;
    const transferGroupId = randomUUID();

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from("account_movements")
      .insert([
        {
          destination_id: from_destination_id,
          kind: "transferencia",
          amount: -roundedAmount,
          description: trimmedDescription,
          transfer_group_id: transferGroupId,
        },
        {
          destination_id: to_destination_id,
          kind: "transferencia",
          amount: roundedAmount,
          description: trimmedDescription,
          transfer_group_id: transferGroupId,
        },
      ])
      .select("id, destination_id, kind, amount, description, created_at");

    if (error) throw error;

    return NextResponse.json({ movements: data });
  } catch (err) {
    return apiError(err, "account-transfers POST", "No se pudo registrar la transferencia");
  }
}
