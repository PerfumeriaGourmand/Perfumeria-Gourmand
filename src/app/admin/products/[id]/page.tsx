export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const productRes = await supabase
    .from("products")
    .select("*, images:product_images(*), variants:product_variants(*)")
    .eq("id", id)
    .single();

  if (!productRes.data) notFound();

  const product = productRes.data;

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-2">Editar producto</h1>
      <p className="font-sans text-xs text-cream-dim mb-10 tracking-wide">
        {product.name} — {product.brand}
      </p>

      <ProductForm product={product} />
    </div>
  );
}
