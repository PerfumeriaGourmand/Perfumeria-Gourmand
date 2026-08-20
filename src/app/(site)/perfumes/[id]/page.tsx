import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Product, ProductReview } from "@/types";
import ProductDetail from "./ProductDetail";
import { CONCENTRATION_LABELS, CATEGORY_LABELS } from "@/lib/utils";

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.perfumeriagourmand.com.ar";

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, images:product_images(*), variants:product_variants(*)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data;
}

async function getReviews(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Perfume no encontrado" };

  const primaryImage = product.images?.find((i: { is_primary: boolean }) => i.is_primary) ?? product.images?.[0];
  const minPrice = product.variants?.reduce(
    (min: number, v: { price: number; is_active: boolean }) => (v.is_active && v.price < min ? v.price : min),
    Infinity
  );

  const title = `${product.name} — ${product.brand}`;
  const description =
    product.description ??
    `${CONCENTRATION_LABELS[product.concentration]} de ${product.brand}. ${CATEGORY_LABELS[product.category]}. Comprá online con envío a todo Argentina y 12 cuotas sin interés.`;

  return {
    title,
    description,
    alternates: { canonical: `/perfumes/${id}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/perfumes/${id}`,
      type: "website",
      images: primaryImage
        ? [{ url: primaryImage.url, width: 800, height: 800, alt: `${product.name} — ${product.brand}` }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage.url] : [],
    },
    other: minPrice !== Infinity ? { "product:price:amount": String(minPrice), "product:price:currency": "ARS" } : {},
  };
}

function buildProductJsonLd(product: Product, reviews: ProductReview[]) {
  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const activeVariants = (product.variants ?? []).filter((v) => v.is_active && v.stock > 0);
  const minPrice = activeVariants.reduce((min, v) => (v.price < min ? v.price : min), activeVariants[0]?.price ?? 0);
  const maxPrice = activeVariants.reduce((max, v) => (v.price > max ? v.price : max), activeVariants[0]?.price ?? 0);

  // Fallback price for the OutOfStock branch below — Google requires "price"
  // on every offer, even ones with no stock, so we fall back to any variant
  // (active or not) instead of leaving the offer priceless.
  const allVariants = product.variants ?? [];
  const fallbackPrice = allVariants.reduce(
    (min, v) => (v.price < min ? v.price : min),
    allVariants[0]?.price ?? 0
  );

  // Política real publicada en /cambios-y-devoluciones: 30 días desde
  // recepción, el costo de envío del cambio lo paga el comprador.
  const hasMerchantReturnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "AR",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnShippingFees",
  };

  // Zonas/tiempos/costos reales publicados en /envios (tarifa sin el
  // descuento por envío gratis, que es una promoción, no la tarifa base).
  const shippingDetails = [
    {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 2500, currency: "ARS" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "AR", addressRegion: "Ciudad Autónoma de Buenos Aires" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 1, unitCode: "DAY" },
      },
    },
    {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 3500, currency: "ARS" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "AR", addressRegion: "Buenos Aires" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
      },
    },
    {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 4500, currency: "ARS" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "AR" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "DAY" },
      },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description:
      product.description ??
      `${CONCENTRATION_LABELS[product.concentration]} de ${product.brand}. ${CATEGORY_LABELS[product.category]}.`,
    image: primaryImage ? [primaryImage.url] : [],
    url: `${BASE_URL}/perfumes/${product.id}`,
    offers:
      activeVariants.length > 0
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "ARS",
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: activeVariants.length,
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "Gourmand Perfumería" },
            hasMerchantReturnPolicy,
            shippingDetails,
          }
        : {
            "@type": "Offer",
            availability: "https://schema.org/OutOfStock",
            priceCurrency: "ARS",
            price: fallbackPrice,
            seller: { "@type": "Organization", name: "Gourmand Perfumería" },
            hasMerchantReturnPolicy,
            shippingDetails,
          },
    // Solo se declara si hay reseñas reales de compradores verificados —
    // Google penaliza aggregateRating/review sin datos genuinos detrás.
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.customer_name },
            datePublished: r.created_at,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            ...(r.comment ? { reviewBody: r.comment } : {}),
          })),
        }
      : {}),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const supabase = await createClient();

  // Track page view (fire-and-forget)
  supabase.from("page_views").insert({ path: `/perfumes/${id}`, product_id: id }).then(() => {});

  const [relatedBySeason, relatedByBrand, reviews] = await Promise.all([
    product.seasons.length > 0
      ? supabase
          .from("products")
          .select("*, images:product_images(*), variants:product_variants(*)")
          .eq("is_active", true)
          .overlaps("seasons", product.seasons)
          .neq("id", id)
          .limit(10)
          .then(({ data }) => (data ?? []) as Product[])
      : Promise.resolve([] as Product[]),
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("is_active", true)
      .eq("brand", product.brand)
      .neq("id", id)
      .limit(8)
      .then(({ data }) => (data ?? []) as Product[]),
    getReviews(id),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product, reviews)) }}
      />
      <ProductDetail product={product} relatedBySeason={relatedBySeason} relatedByBrand={relatedByBrand} />
    </>
  );
}
