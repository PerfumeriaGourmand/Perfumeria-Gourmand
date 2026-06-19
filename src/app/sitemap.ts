import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.perfumeriagourmand.com.ar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .eq("is_active", true);

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/perfumes/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                   priority: 1.0, changeFrequency: "daily"   as const, lastModified: now },
    { url: `${BASE_URL}/catalogo`,                     priority: 0.9, changeFrequency: "daily"   as const, lastModified: now },
    { url: `${BASE_URL}/catalogo/nicho`,               priority: 0.8, changeFrequency: "weekly"  as const, lastModified: now },
    { url: `${BASE_URL}/catalogo?category=arabe`,      priority: 0.8, changeFrequency: "weekly"  as const, lastModified: now },
    { url: `${BASE_URL}/catalogo?category=disenador`,  priority: 0.8, changeFrequency: "weekly"  as const, lastModified: now },
    { url: `${BASE_URL}/marcas`,                       priority: 0.7, changeFrequency: "weekly"  as const, lastModified: now },
    { url: `${BASE_URL}/encontrar-mi-perfume`,         priority: 0.6, changeFrequency: "monthly" as const, lastModified: now },
    { url: `${BASE_URL}/contacto`,                     priority: 0.5, changeFrequency: "monthly" as const, lastModified: now },
    { url: `${BASE_URL}/envios`,                       priority: 0.4, changeFrequency: "monthly" as const, lastModified: now },
    { url: `${BASE_URL}/preguntas-frecuentes`,         priority: 0.4, changeFrequency: "monthly" as const, lastModified: now },
  ];

  return [...staticPages, ...productUrls];
}
