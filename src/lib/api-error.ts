import { NextResponse } from "next/server";

// requireAdmin() throws deliberate, safe messages ("Unauthorized"/"Forbidden")
// — those are fine to pass through as-is. Anything else (raw Postgres/Supabase
// errors, unexpected exceptions) can leak schema/constraint details, so it
// gets logged server-side and replaced with a generic message instead.
export function apiError(err: unknown, context: string, fallback = "Error interno") {
  if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message === "Forbidden" ? 403 : 401 }
    );
  }

  console.error(`[${context}]`, err);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
