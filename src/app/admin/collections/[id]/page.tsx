import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CollectionForm from "@/components/admin/CollectionForm";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const [{ data: collection }, { data: products }, { data: assigned }] = await Promise.all([
    supabase.from("collections").select("*").eq("id", id).single(),
    supabase.from("products").select("id, name, brand").order("name"),
    supabase.from("collection_products").select("product_id").eq("collection_id", id),
  ]);

  if (!collection) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">Editar colección</h1>
      <CollectionForm
        collection={collection}
        allProducts={products ?? []}
        initialProductIds={(assigned ?? []).map((a) => a.product_id)}
      />
    </div>
  );
}
