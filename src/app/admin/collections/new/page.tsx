import { createAdminClient } from "@/lib/supabase/server";
import CollectionForm from "@/components/admin/CollectionForm";

export default async function NewCollectionPage() {
  const supabase = await createAdminClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, brand")
    .order("name");

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">Nueva colección</h1>
      <CollectionForm allProducts={products ?? []} />
    </div>
  );
}
