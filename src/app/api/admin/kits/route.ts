import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createAdminClient();
  const body = await req.json();
  const { items, ...kitData } = body;

  const { data: kit, error } = await supabase
    .from("kits")
    .insert({ ...kitData })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (items?.length > 0) {
    const kitItems = items.map((item: { variant_id: string; quantity: number }) => ({
      kit_id: kit.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
    }));
    await supabase.from("kit_items").insert(kitItems);
  }

  return NextResponse.json(kit);
}

export async function PUT(req: NextRequest) {
  const supabase = await createAdminClient();
  const body = await req.json();
  const { id, items, ...kitData } = body;

  const { error } = await supabase.from("kits").update(kitData).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Replace items
  await supabase.from("kit_items").delete().eq("kit_id", id);
  if (items?.length > 0) {
    const kitItems = items.map((item: { variant_id: string; quantity: number }) => ({
      kit_id: id,
      variant_id: item.variant_id,
      quantity: item.quantity,
    }));
    await supabase.from("kit_items").insert(kitItems);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createAdminClient();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await supabase.from("kit_items").delete().eq("kit_id", id);
  const { error } = await supabase.from("kits").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
