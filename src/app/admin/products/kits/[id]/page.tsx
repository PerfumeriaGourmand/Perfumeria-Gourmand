export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import KitForm from "@/components/admin/KitForm";

export default async function EditKitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const [kitRes, variantsRes] = await Promise.all([
    supabase
      .from("kits")
      .select("*, items:kit_items(*, variant:product_variants(*, product:products(name, brand)))")
      .eq("id", id)
      .single(),
    supabase
      .from("product_variants")
      .select("*, product:products(name, brand)")
      .eq("is_active", true)
      .order("product_id"),
  ]);

  if (!kitRes.data) notFound();

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl text-cream mb-1">Editar kit</h1>
        <p className="font-sans text-xs text-cream-dim">{kitRes.data.name}</p>
      </div>
      <KitForm kit={kitRes.data} variants={variantsRes.data ?? []} />
    </div>
  );
}
