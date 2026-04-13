import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const admin = await createAdminClient();

    const { form, variants, images, productId } = body;

    let id = productId as string | undefined;

    if (id) {
      // Update
      const { error } = await admin.from("products").update(form).eq("id", id);
      if (error) throw error;
    } else {
      // Create
      const { data, error } = await admin
        .from("products")
        .insert(form)
        .select()
        .single();
      if (error) throw error;
      id = data.id;
    }

    if (!id) throw new Error("No product ID returned");

    // Upsert variants
    for (const v of variants as Record<string, unknown>[]) {
      if (v.id) {
        const { error } = await admin.from("product_variants").update(v).eq("id", v.id);
        if (error) console.error("[products API] variant update:", error);
      } else {
        const { error } = await admin
          .from("product_variants")
          .insert({ ...v, product_id: id });
        if (error) console.error("[products API] variant insert:", error);
      }
    }

    // Upsert images — always upsert so new images (id = storage path) get
    // INSERTed and existing ones (id = DB uuid) get their metadata updated.
    if (images.length > 0) {
      const rows = (images as Record<string, unknown>[]).map((img) => ({
        id: img.id,
        product_id: id,
        url: img.url,
        alt: img.alt ?? null,
        is_primary: img.is_primary ?? false,
        sort_order: img.sort_order ?? 0,
      }));

      console.log("[products API] upserting images:", rows.map((r) => ({ id: r.id, url: r.url })));

      const { error } = await admin
        .from("product_images")
        .upsert(rows, { onConflict: "id" });

      if (error) {
        console.error("[products API] image upsert error:", error);
        // Non-fatal — product was saved, just log it
      }
    }

    return NextResponse.json({ id });
  } catch (err) {
    console.error("[products API] error:", err);
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth();
    const { id } = await req.json();
    const admin = await createAdminClient();
    const { error } = await admin.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
