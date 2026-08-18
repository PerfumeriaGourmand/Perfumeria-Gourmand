import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { is_featured, is_new } = await req.json();

    const update: Record<string, boolean> = {};
    if (typeof is_featured === "boolean") update.is_featured = is_featured;
    if (typeof is_new === "boolean") update.is_new = is_new;

    if (Object.keys(update).length === 0) {
      throw new Error("Nada para actualizar");
    }

    const admin = await createAdminClient();
    const { error } = await admin.from("products").update(update).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err, "products [id] PATCH", "No se pudo actualizar el producto");
  }
}
