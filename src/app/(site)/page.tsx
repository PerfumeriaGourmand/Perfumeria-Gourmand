import HeroSection from "@/components/home/HeroSection";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import NewArrivalsCarousel from "@/components/home/NewArrivalsCarousel";
import CategorySection from "@/components/home/CategorySection";
import BrandCarousel from "@/components/home/BrandCarousel";
import CategoryFeaturedSection from "@/components/home/CategoryFeaturedSection";
import RevealSection from "@/components/ui/RevealSection";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

async function getHomeData() {
  const supabase = await createClient();
  const [featuredRes, newRes, arabeRes, disenadorRes, nichoRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("is_active", true)
      .overlaps("seasons", ["otono", "invierno"])
      .order("sort_order")
      .limit(10),
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("is_new", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("category", "arabe")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order")
      .limit(8),
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("category", "disenador")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order")
      .limit(8),
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("category", "nicho")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order")
      .limit(8),
  ]);
  return {
    featured: featuredRes.data ?? [],
    newArrivals: newRes.data ?? [],
    arabeProducts: arabeRes.data ?? [],
    disenadorProducts: disenadorRes.data ?? [],
    nichoProducts: nichoRes.data ?? [],
  };
}

export default async function HomePage() {
  const { featured, newArrivals, arabeProducts, disenadorProducts, nichoProducts } =
    await getHomeData();
  return (
    <>
      <HeroSection />
      <BrandCarousel />
      <RevealSection>
        <FeaturedCarousel products={featured} />
      </RevealSection>
      <CategorySection />
      <RevealSection>
        <CategoryFeaturedSection
          title="Árabe — Destacados"
          eyebrow="Colección Árabe"
          href="/catalogo?category=arabe"
          products={arabeProducts}
        />
      </RevealSection>
      <RevealSection>
        <CategoryFeaturedSection
          title="Diseñador — Destacados"
          eyebrow="Colección Diseñador"
          href="/catalogo?category=disenador"
          products={disenadorProducts}
        />
      </RevealSection>
      <RevealSection>
        <CategoryFeaturedSection
          title="Nicho — Destacados"
          eyebrow="Colección Nicho"
          href="/catalogo/nicho"
          products={nichoProducts}
          dark
        />
      </RevealSection>
      <RevealSection>
        <NewArrivalsCarousel products={newArrivals} />
      </RevealSection>
    </>
  );
}
