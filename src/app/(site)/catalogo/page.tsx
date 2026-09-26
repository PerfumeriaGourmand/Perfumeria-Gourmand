import { createClient } from "@/lib/supabase/server";
import type { ProductFilters } from "@/types";
import CatalogClient from "./CatalogClient";

export const metadata = {
  title: "Catálogo",
  description: "Explorá nuestra selección completa de perfumes de nicho, árabe y diseñador.",
  alternates: { canonical: "/catalogo" },
};

export const revalidate = 60;

// Unidades vendidas por producto, en base a ventas aprobadas reales
// (online y manuales comparten payment_status = "approved").
async function getSoldQuantitiesByProduct(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Map<string, number>> {
  const { data: approvedOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_status", "approved");

  const orderIds = (approvedOrders ?? []).map((o) => o.id);
  if (orderIds.length === 0) return new Map();

  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, variant:product_variants(product_id)")
    .in("order_id", orderIds)
    .not("variant_id", "is", null);

  const sold = new Map<string, number>();
  for (const item of items ?? []) {
    const variant = Array.isArray(item.variant) ? item.variant[0] : item.variant;
    const productId = (variant as { product_id: string } | null)?.product_id;
    if (!productId) continue;
    sold.set(productId, (sold.get(productId) ?? 0) + item.quantity);
  }
  return sold;
}

async function getProducts(filters: ProductFilters) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, images:product_images(*), variants:product_variants(*)")
    .eq("is_active", true);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.gender) query = query.eq("gender", filters.gender);
  if (filters.concentration) query = query.eq("concentration", filters.concentration);
  if (filters.season) query = query.contains("seasons", [filters.season]);
  if (filters.brand) query = query.eq("brand", filters.brand);

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Sort
  switch (filters.sort) {
    case "price_asc":
      break; // handled client-side via variant prices
    case "price_desc":
      break;
    case "newest":
      query = query.eq("is_new", true).order("created_at", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name");
      break;
    case "popular":
      break; // se ordena después según unidades vendidas reales
    default:
      query = query.order("sort_order").order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  let products = data ?? [];

  if (filters.sort === "popular") {
    const soldByProduct = await getSoldQuantitiesByProduct(supabase);
    products = products
      .filter((p) => (soldByProduct.get(p.id) ?? 0) > 0)
      .sort((a, b) => (soldByProduct.get(b.id) ?? 0) - (soldByProduct.get(a.id) ?? 0))
      .slice(0, 8);
  }

  return products;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const filters: ProductFilters = {
    category: params.category as ProductFilters["category"],
    gender: params.gender as ProductFilters["gender"],
    season: params.season as ProductFilters["season"],
    concentration: params.concentration as ProductFilters["concentration"],
    brand: params.brand,
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sort: (params.sort as ProductFilters["sort"]) ?? undefined,
  };

  const supabase = await createClient();
  let brandsQuery = supabase.from("products").select("brand").eq("is_active", true);
  if (filters.category) brandsQuery = brandsQuery.eq("category", filters.category);

  const [products, brandRows] = await Promise.all([
    getProducts(filters),
    brandsQuery,
  ]);

  const brands = [...new Set((brandRows.data ?? []).map((r) => r.brand as string))]
    .filter(Boolean)
    .sort();

  return <CatalogClient initialProducts={products} initialFilters={filters} brands={brands} />;
}
