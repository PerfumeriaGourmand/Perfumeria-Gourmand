import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import GoldDivider from "@/components/ui/GoldDivider";
import type { Metadata } from "next";
import type { ProductCategory } from "@/types";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Explorá todas las marcas disponibles en Gourmand.",
};

export const revalidate = 60;

const CATEGORY_ORDER: ProductCategory[] = ["arabe", "disenador", "nicho"];
const CATEGORY_LABELS: Record<ProductCategory, string> = {
  arabe: "Árabe",
  disenador: "Diseñador",
  nicho: "Nicho",
  kit: "Kits",
};

interface BrandData {
  name: string;
  category: ProductCategory;
  count: number;
}

export default async function MarcasPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("brand, category")
    .eq("is_active", true);

  // Aggregate brands
  const brandMap = new Map<string, BrandData>();

  for (const p of products ?? []) {
    const existing = brandMap.get(p.brand);
    if (existing) {
      existing.count += 1;
    } else {
      brandMap.set(p.brand, {
        name: p.brand,
        category: p.category as ProductCategory,
        count: 1,
      });
    }
  }

  const brands = [...brandMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  const byCategory = CATEGORY_ORDER.reduce<Record<string, BrandData[]>>(
    (acc, cat) => {
      acc[cat] = brands.filter((b) => b.category === cat);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen pt-24 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="py-12">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-4">
            Colección completa
          </p>
          <h1 className="font-display font-light text-5xl text-text-dark">Marcas</h1>
        </div>

        <GoldDivider className="mb-16" />

        <div className="space-y-20">
          {CATEGORY_ORDER.map((cat) => {
            const catBrands = byCategory[cat];
            if (!catBrands || catBrands.length === 0) return null;

            return (
              <section key={cat}>
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-2">
                      Categoría
                    </p>
                    <h2 className="font-display text-3xl text-text-dark">
                      {CATEGORY_LABELS[cat]}
                    </h2>
                  </div>
                  <Link
                    href={`/catalogo?category=${cat}`}
                    className="hidden sm:block font-sans text-xs tracking-widest uppercase text-text-light hover:text-gold transition-colors"
                  >
                    Ver colección →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {catBrands.map((brand) => (
                    <BrandCard key={brand.name} brand={brand} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BrandCard({ brand }: { brand: BrandData }) {
  const initial = brand.name.charAt(0).toUpperCase();

  return (
    <Link
      href={`/catalogo?category=${brand.category}&brand=${encodeURIComponent(brand.name)}`}
      className="group relative flex flex-col justify-between border border-border-light rounded-2xl p-5 hover:border-gold/40 hover:shadow-[0_4px_24px_rgba(164,133,76,0.08)] transition-all duration-300 overflow-hidden bg-white"
    >
      {/* Decorative initial — background */}
      <span
        aria-hidden
        className="absolute -bottom-3 -right-2 font-display text-[5rem] leading-none text-text-dark/[0.04] group-hover:text-gold/[0.07] transition-colors duration-300 select-none pointer-events-none"
      >
        {initial}
      </span>

      {/* Category pill */}
      <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold mb-4">
        {CATEGORY_LABELS[brand.category]}
      </p>

      {/* Brand name */}
      <h3 className="font-display text-xl leading-tight text-text-dark group-hover:text-gold transition-colors duration-200 mb-3 relative">
        {brand.name}
      </h3>

      {/* Count */}
      <p className="font-sans text-xs text-text-light relative">
        {brand.count} {brand.count === 1 ? "perfume" : "perfumes"}
      </p>

      {/* Bottom gold line on hover */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold group-hover:w-full transition-all duration-400" />
    </Link>
  );
}
