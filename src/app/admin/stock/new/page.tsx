export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import StockLotForm from "@/components/admin/StockLotForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewStockLotPage() {
  const supabase = await createAdminClient();

  // Cargar todos los productos activos con sus variantes
  const { data: products } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("is_active", true)
    .order("brand", { ascending: true })
    .order("name", { ascending: true });

  const activeProducts = (products ?? []).map((p) => ({
    ...p,
    variants: (p.variants ?? []).filter((v: { is_active: boolean }) => v.is_active),
  }));

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/admin/stock"
        className="flex items-center gap-1.5 font-sans text-xs text-cream-dim hover:text-cream transition-colors mb-8"
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
        Gestión de Stock
      </Link>

      <div className="mb-10">
        <h1 className="font-display text-3xl text-cream mb-2">
          Ingresar nuevo lote
        </h1>
        <p className="font-sans text-xs text-cream-dim tracking-wide">
          El stock del producto se actualizará automáticamente al guardar.
        </p>
      </div>

      <StockLotForm products={activeProducts} />
    </div>
  );
}
