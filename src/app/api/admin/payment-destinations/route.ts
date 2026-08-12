import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

// GET /api/admin/payment-destinations
export async function GET() {
  try {
    await requireAdmin();
    const admin = await createAdminClient();

    const { data, error } = await admin
      .from("payment_destinations")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ destinations: data ?? [] });
  } catch (err) {
    return apiError(err, "payment-destinations GET", "No se pudieron obtener los destinos");
  }
}

// POST /api/admin/payment-destinations
// Body: { name }
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const { name } = (await req.json()) as { name?: string };
    const trimmed = name?.trim();

    if (!trimmed) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    const admin = await createAdminClient();

    const { data, error } = await admin
      .from("payment_destinations")
      .insert({ name: trimmed })
      .select("id, name")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ya existe un destino con ese nombre" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ destination: data });
  } catch (err) {
    return apiError(err, "payment-destinations POST", "No se pudo crear el destino");
  }
}
