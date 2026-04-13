import { createClient } from "@/lib/supabase/server";
import NichoSection from "@/components/nicho/NichoSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfumes Nicho",
  description:
    "Perfumería de autor. Pequeñas tiradas, materias primas extraordinarias, olfatos que no se olvidan.",
};

export const revalidate = 60;

export default async function NichoPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, images:product_images(*), variants:product_variants(*)")
    .eq("category", "nicho")
    .eq("is_active", true)
    .order("sort_order")
    .order("brand");

  // Group by brand
  const brands = [...new Set((products ?? []).map((p) => p.brand))];

  return <NichoSection products={products ?? []} brands={brands} />;
}
