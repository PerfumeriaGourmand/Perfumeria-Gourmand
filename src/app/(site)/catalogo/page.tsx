import { createClient } from "@/lib/supabase/server";
import type { ProductFilters } from "@/types";
import CatalogClient from "./CatalogClient";

export const metadata = {
  title: "Catálogo",
  description: "Explorá nuestra selección completa de perfumes de nicho, árabe y diseñador.",
  alternates: { canonical: "/catalogo" },
};

export const revalidate = 60;

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
    default:
      query = query.order("sort_order").order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
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
