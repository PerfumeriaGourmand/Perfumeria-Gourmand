import type { Product } from "@/types";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

export default function FeaturedCarousel({ products }: { products: Product[] }) {
  return (
    <section style={{ background: "#f8f7f4", padding: "68px 0 76px" }}>
      <div style={{ padding: "0 80px", marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p className="font-sans uppercase text-gold" style={{ fontSize: 9, letterSpacing: "0.5em", marginBottom: 10 }}>
            Selección
          </p>
          <h2 className="font-display text-text-dark" style={{ fontSize: 40, lineHeight: 1.05 }}>
            Destacados
          </h2>
        </div>
        <Link
          href="/catalogo"
          className="hidden md:inline font-sans text-text-mid hover:text-gold transition-colors"
          style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase" }}
        >
          Ver todos →
        </Link>
      </div>

      {products.length > 0 ? (
        <div style={{ padding: "4px 80px 8px", position: "relative" }}>
          <ProductCarousel products={products} autoplay />
        </div>
      ) : (
        <div className="flex items-center justify-center py-20 border border-border-light mx-20">
          <p className="font-sans text-sm text-text-light italic">
            Los productos destacados aparecerán aquí
          </p>
        </div>
      )}
    </section>
  );
}
