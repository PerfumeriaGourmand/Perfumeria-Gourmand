import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return apiError(err, "admin/settings auth");
  }

  const supabase = await createAdminClient();
  const body = await req.json();

  // Never allow overwriting mp_access_token with an empty value from the client.
  // If the token field is absent or empty string, remove it from the payload so
  // the existing value in the DB is preserved.
  if (!body.mp_access_token) {
    delete body.mp_access_token;
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert(body, { onConflict: "id" });

  if (error) {
    console.error("[admin/settings] upsert error:", error);
    return NextResponse.json({ error: "No se pudo guardar la configuración" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
