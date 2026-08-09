import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { price } = await req.json();

    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      throw new Error("Precio inválido");
    }

    const admin = await createAdminClient();
    const { error } = await admin.from("product_variants").update({ price }).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err, "product variants PATCH", "No se pudo actualizar el precio");
  }
}
