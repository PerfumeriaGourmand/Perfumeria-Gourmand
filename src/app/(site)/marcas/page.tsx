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

// Brand name (as stored in DB) → public logo path
const BRAND_LOGOS: Record<string, string> = {
  // Árabes
  "Afnan":           "/logos/arabes/logoAfnan.jpg",
  "Al Haramain":     "/logos/arabes/logoAlHaramain.png",
  "Armaf":           "/logos/arabes/logoArmaf.png",
  "Bharara":         "/logos/arabes/logoBharara.png",
  "Emper":           "/logos/arabes/logoEmper.png",
  "French Avenue":   "/logos/arabes/logoFrenchAvenue.png",
  "Lattafa":         "/logos/arabes/logoLattafa.png",
  "Maison Alhambra": "/logos/arabes/logoMaisonAlhambra.png",
  "Paris Corner":    "/logos/arabes/logoParisCorner.png",
  "Rasasi":          "/logos/arabes/logoRasasi.png",
  "Rayhaan":         "/logos/arabes/logoRayhaan.png",
  // Diseñador
  "Armani":             "/logos/disenador/logoArmani.png",
  "Giorgio Armani":     "/logos/disenador/logoArmani.png",
  "Azzaro":             "/logos/disenador/logoAzzaro.png",
  "Bvlgari":            "/logos/disenador/logoBvlgari.png",
  "Calvin Klein":       "/logos/disenador/logoCalvinKlein.png",
  "Carolina Herrera":   "/logos/disenador/logoCarolinaHerrera.png",
  "Dior":               "/logos/disenador/logoDior.png",
  "Christian Dior":     "/logos/disenador/logoDior.png",
  "Dolce&Gabbana":      "/logos/disenador/logoDolceGabanna.png",
  "Dolce & Gabbana":    "/logos/disenador/logoDolceGabanna.png",
  "Dolce&Gabanna":      "/logos/disenador/logoDolceGabanna.png",
  "Givenchy":           "/logos/disenador/logoGivenchy.png",
  "Halloween":          "/logos/disenador/logoHalloween.png",
  "Issey Miyake":       "/logos/disenador/logoIsseyMiyake.png",
  "Jean Paul Gaultier": "/logos/disenador/logoJPG.png",
  "Mercedes Benz":      "/logos/disenador/logoMercedesBenz.png",
  "Mercedes-Benz":      "/logos/disenador/logoMercedesBenz.png",
  "Paco Rabanne":       "/logos/disenador/logoPacoRabanne.png",
  "Versace":            "/logos/disenador/logoVersace.png",
  "Yves Saint Laurent": "/logos/disenador/logoYSL.png",
  "YSL":                "/logos/disenador/logoYSL.png",
  // Nicho
  "Amouage":             "/logos/nicho/Amouage.png",
  "Anfas":               "/logos/nicho/Anfas.png",
  "BDK Parfums":         "/logos/nicho/BDK Parfums.png",
  "Bond No 9":           "/logos/nicho/Bond No 9.png",
  "Bond No. 9":          "/logos/nicho/Bond No 9.png",
  "Bottega Veneta":      "/logos/nicho/Bottega Veneta.png",
  "Byredo":              "/logos/nicho/Byredo.png",
  "Creed":               "/logos/nicho/Creed.png",
  "Initio":              "/logos/nicho/Initio.png",
  "Juliette Has a Gun":  "/logos/nicho/Juliette Has a Gun.png",
  "Kilian":              "/logos/nicho/Kilian.png",
  "By Kilian":           "/logos/nicho/Kilian.png",
  "MFK":                 "/logos/nicho/MFK.png",
  "Maison Francis Kurkdjian": "/logos/nicho/MFK.png",
  "Nasomatto":           "/logos/nicho/Nasomatto.png",
  "Parfums de Marly":    "/logos/nicho/Parfums De Marly.png",
  "Parfums De Marly":    "/logos/nicho/Parfums De Marly.png",
  "Tom Ford":            "/logos/nicho/Tom Ford.png",
  "Xerjoff":             "/logos/nicho/Xerjoff.png",
  "Mancera":             "/logos/nicho/logoMancera.png",
  "Montale":             "/logos/nicho/logoMontale.png",
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
  const logo = BRAND_LOGOS[brand.name] ?? null;
  const initial = brand.name.charAt(0).toUpperCase();

  return (
    <Link
      href={`/catalogo?category=${brand.category}&brand=${encodeURIComponent(brand.name)}`}
      className="group flex flex-col border border-border-light rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-[0_8px_32px_rgba(164,133,76,0.10)] transition-all duration-300 bg-white"
    >
      {/* Logo area */}
      <div className="relative h-36 bg-[#f8f7f4] flex items-center justify-center overflow-hidden border-b border-border-light">
        {logo ? (
          <Image
            src={logo}
            alt={`Logo ${brand.name}`}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <span className="font-display text-6xl text-text-dark/10 group-hover:text-gold/15 transition-colors duration-300 italic select-none">
            {initial}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="relative p-5 flex-1 flex flex-col justify-between overflow-hidden">
        {/* Decorative initial background */}
        {!logo && (
          <span
            aria-hidden
            className="absolute -bottom-2 -right-1 font-display text-[4.5rem] leading-none text-text-dark/[0.04] group-hover:text-gold/[0.07] transition-colors duration-300 select-none pointer-events-none"
          >
            {initial}
          </span>
        )}

        <div>
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold mb-2">
            {CATEGORY_LABELS[brand.category]}
          </p>
          <h3 className="font-display text-lg leading-tight text-text-dark group-hover:text-gold transition-colors duration-200 mb-2 relative">
            {brand.name}
          </h3>
        </div>

        <p className="font-sans text-xs text-text-light relative">
          {brand.count} {brand.count === 1 ? "perfume" : "perfumes"}
        </p>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold group-hover:w-full transition-all duration-400" />
      </div>
    </Link>
  );
}
