import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
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

    const warnings: string[] = [];

    // Upsert variants — single query instead of N sequential updates
    if ((variants as Record<string, unknown>[]).length > 0) {
      const rows = (variants as Record<string, unknown>[]).map((v) => ({
        ...v,
        product_id: id,
      }));
      const { error } = await admin
        .from("product_variants")
        .upsert(rows, { onConflict: "id" });
      if (error) {
        console.error("[products API] variants upsert:", error);
        warnings.push("No se pudieron guardar los tamaños/precios. Volvé a intentar.");
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
        warnings.push("No se pudieron guardar las imágenes. Volvé a intentar.");
      }
    }

    return NextResponse.json({ id, warnings });
  } catch (err) {
    return apiError(err, "products POST", "No se pudo guardar el producto");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    const admin = await createAdminClient();
    const { error } = await admin.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err, "products DELETE", "No se pudo eliminar el producto");
  }
}
