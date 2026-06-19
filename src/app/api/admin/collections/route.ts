import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { collectionId, form, productIds } = await req.json();
    const admin = await createAdminClient();

    let id = collectionId as string | undefined;

    if (id) {
      const { error } = await admin.from("collections").update(form).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await admin.from("collections").insert(form).select().single();
      if (error) throw error;
      id = data.id;
    }

    if (!id) throw new Error("No collection ID returned");

    // Replace product assignments wholesale — simpler and safe since the
    // form always sends the full desired set, not a diff.
    const { error: deleteError } = await admin.from("collection_products").delete().eq("collection_id", id);
    if (deleteError) throw deleteError;

    const ids = (productIds as string[]) ?? [];
    if (ids.length > 0) {
      const rows = ids.map((product_id, idx) => ({
        collection_id: id,
        product_id,
        sort_order: idx,
      }));
      const { error: insertError } = await admin.from("collection_products").insert(rows);
      if (insertError) throw insertError;
    }

    return NextResponse.json({ id });
  } catch (err) {
    console.error("[collections API] error:", err);
    const message = err instanceof Error ? err.message : "Error interno";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    const admin = await createAdminClient();
    const { error } = await admin.from("collections").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
