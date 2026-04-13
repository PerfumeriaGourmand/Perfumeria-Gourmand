import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
  try { await requireAuth(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string | null) ?? "product-images";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop() ?? "jpg";
  const baseName = file.name.replace(`.${rawExt}`, "");
  const safeName = sanitizeFilename(baseName);
  const path = `${Date.now()}-${safeName}.${rawExt}`;

  const adminSupabase = await createAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await adminSupabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[upload] Storage error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = adminSupabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ path, publicUrl: urlData.publicUrl });
}

export async function DELETE(req: NextRequest) {
  try { await requireAuth(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, imageId, bucket = "product-images" } = await req.json();
  const admin = await createAdminClient();

  // Extract storage path from public URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/{bucket}/{path}
  let storagePath: string | null = null;
  if (url) {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      storagePath = url.slice(idx + marker.length).split("?")[0]; // strip query params
    }
  }

  if (storagePath) {
    const { error } = await admin.storage.from(bucket).remove([storagePath]);
    if (error) console.error("[upload DELETE] storage remove error:", error);
    else console.log("[upload DELETE] deleted from storage:", storagePath);
  }

  // Delete from product_images table — if row doesn't exist it's a no-op
  if (imageId) {
    const { error } = await admin.from("product_images").delete().eq("id", imageId);
    if (error) console.error("[upload DELETE] db delete error:", error);
  }

  return NextResponse.json({ ok: true });
}
