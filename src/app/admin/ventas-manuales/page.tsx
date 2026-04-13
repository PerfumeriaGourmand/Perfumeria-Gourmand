export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import ManualSaleForm from "./ManualSaleForm";

export type ProductOption = {
  id: string;
  name: string;
  brand: string;
  variants: Array<{
    id: string;
    size_ml: number;
    price: number;
    stock: number;
    is_active: boolean;
  }>;
};

export default async function ManualSalePage() {
  const supabase = await createAdminClient();

  const { data: raw } = await supabase
    .from("products")
    .select(
      "id, name, brand, variants:product_variants(id, size_ml, price, stock, is_active)"
    )
    .eq("is_active", true)
    .order("brand", { ascending: true })
    .order("name", { ascending: true });

  const products: ProductOption[] = (raw ?? [])
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      variants: (
        (p.variants as ProductOption["variants"]) ?? []
      ).filter((v) => v.is_active),
    }))
    .filter((p) => p.variants.length > 0);

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl text-cream mb-1">Venta Manual</h1>
        <p className="font-sans text-xs text-cream-dim">
          Registrá ventas realizadas fuera del sitio (WhatsApp, mostrador, etc.)
        </p>
      </div>
      <ManualSaleForm products={products} />
    </div>
  );
}
