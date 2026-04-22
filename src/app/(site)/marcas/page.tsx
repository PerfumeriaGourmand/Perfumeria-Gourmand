import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
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
  imageUrl: string | null;
}

export default async function MarcasPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("brand, category, images:product_images(url, is_primary)")
    .eq("is_active", true);

  // Aggregate brands
  const brandMap = new Map<string, BrandData>();

  for (const p of products ?? []) {
    const key = p.brand;
    const existing = brandMap.get(key);

    const images = (p.images ?? []) as { url: string; is_primary: boolean }[];
    const primaryImg = images.find((i) => i.is_primary) ?? images[0];

    if (existing) {
      existing.count += 1;
      if (!existing.imageUrl && primaryImg) existing.imageUrl = primaryImg.url;
    } else {
      brandMap.set(key, {
        name: p.brand,
        category: p.category as ProductCategory,
        count: 1,
        imageUrl: primaryImg?.url ?? null,
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
  const initials = brand.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/catalogo?category=${brand.category}&brand=${encodeURIComponent(brand.name)}`}
      className="group block border border-border-light rounded-2xl overflow-hidden hover:shadow-card hover:border-gold/30 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-[#f5f4f0] overflow-hidden">
        {brand.imageUrl ? (
          <Image
            src={brand.imageUrl}
            alt={brand.name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl text-text-light/30 italic">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gold mb-1">
          {CATEGORY_LABELS[brand.category]}
        </p>
        <h3 className="font-display text-base text-text-dark leading-tight mb-1 group-hover:text-gold transition-colors duration-200">
          {brand.name}
        </h3>
        <p className="font-sans text-xs text-text-light">
          {brand.count} {brand.count === 1 ? "perfume" : "perfumes"}
        </p>
      </div>
    </Link>
  );
}
