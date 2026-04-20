import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 401 });
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

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
