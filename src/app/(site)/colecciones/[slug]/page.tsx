import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Product } from "@/types";
import ProductCard from "@/components/catalog/ProductCard";
import GoldDivider from "@/components/ui/GoldDivider";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 60;

async function getCollection(slug: string) {
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!collection) return null;

  const { data: links } = await supabase
    .from("collection_products")
    .select("product_id, sort_order")
    .eq("collection_id", collection.id)
    .order("sort_order", { ascending: true });

  const productIds = (links ?? []).map((l) => l.product_id);
  if (productIds.length === 0) return { collection, products: [] as Product[] };

  const { data: products } = await supabase
    .from("products")
    .select("*, images:product_images(*), variants:product_variants(*)")
    .in("id", productIds)
    .eq("is_active", true);

  const order = new Map(productIds.map((id, i) => [id, i]));
  const sorted = [...(products ?? [])].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
  );

  return { collection, products: sorted as Product[] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) return {};
  return {
    title: data.collection.name,
    description: data.collection.description ?? `Colección ${data.collection.name} en Gourmand.`,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) notFound();

  const { collection, products } = data;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-4 pb-12">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Colecciones", href: "/colecciones" },
              { label: collection.name },
            ]}
          />
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-4">Colección</p>
          <h1 className="font-display font-light text-5xl text-text-dark mb-4">{collection.name}</h1>
          {collection.description && (
            <p className="font-sans text-sm text-text-light max-w-xl">{collection.description}</p>
          )}
        </div>

        <GoldDivider className="mb-12" />

        {products.length === 0 ? (
          <p className="font-sans text-sm text-text-light italic py-12 text-center">
            Todavía no hay productos en esta colección.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
