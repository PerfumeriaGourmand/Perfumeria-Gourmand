import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const MAX_LENGTH = 200;

async function guard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > MAX_LENGTH) {
    return NextResponse.json({ error: "Texto inválido" }, { status: 400 });
  }

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("admin_todos")
    .insert({ text })
    .select("id, text, done, created_at")
    .single();

  if (error) {
    console.error("[todos POST]", error);
    return NextResponse.json({ error: "No se pudo crear la tarea" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string" || typeof body?.done !== "boolean") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const admin = await createAdminClient();
  const { error } = await admin
    .from("admin_todos")
    .update({ done: body.done })
    .eq("id", body.id);

  if (error) {
    console.error("[todos PATCH]", error);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const admin = await createAdminClient();

  // { id } borra una tarea; { completed: true } limpia todas las hechas
  const query = admin.from("admin_todos").delete();
  const { error } =
    typeof body?.id === "string"
      ? await query.eq("id", body.id)
      : body?.completed === true
        ? await query.eq("done", true)
        : { error: { message: "Datos inválidos" } };

  if (error) {
    console.error("[todos DELETE]", error);
    return NextResponse.json({ error: "No se pudo borrar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
