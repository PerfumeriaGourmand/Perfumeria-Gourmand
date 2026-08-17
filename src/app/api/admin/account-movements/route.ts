import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

const SIMPLE_KINDS = ["retiro", "gasto", "ajuste"] as const;
type SimpleKind = (typeof SIMPLE_KINDS)[number];

// POST /api/admin/account-movements
// Body: { destination_id, kind, amount, description? }
// "retiro" y "gasto" son salidas (se guardan en negativo); "ajuste" puede ser + o -
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { destination_id, kind, amount, description } = body as {
      destination_id?: string;
      kind?: string;
      amount?: number;
      description?: string;
    };

    if (!destination_id || !kind || !SIMPLE_KINDS.includes(kind as SimpleKind)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (!amount || amount === 0) {
      return NextResponse.json(
        { error: "El monto debe ser distinto de 0" },
        { status: 400 }
      );
    }

    const signedAmount =
      kind === "ajuste" ? amount : -Math.abs(amount);

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from("account_movements")
      .insert({
        destination_id,
        kind,
        amount: Math.round(signedAmount * 100) / 100,
        description: description?.trim() || null,
      })
      .select("id, destination_id, kind, amount, description, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({ movement: data });
  } catch (err) {
    return apiError(err, "account-movements POST", "No se pudo registrar el movimiento");
  }
}
