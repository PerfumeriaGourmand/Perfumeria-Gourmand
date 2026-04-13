import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createAdminClient();
  const body = await req.json();

  const { error } = await supabase
    .from("site_settings")
    .upsert(body, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
