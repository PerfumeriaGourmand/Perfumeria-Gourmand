export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import KitForm from "@/components/admin/KitForm";

export default async function NewKitPage() {
  const supabase = await createAdminClient();
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*, product:products(name, brand)")
    .eq("is_active", true)
    .order("product_id");

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl text-cream mb-1">Nuevo kit</h1>
        <p className="font-sans text-xs text-cream-dim">Creá un conjunto de productos</p>
      </div>
      <KitForm variants={variants ?? []} />
    </div>
  );
}
