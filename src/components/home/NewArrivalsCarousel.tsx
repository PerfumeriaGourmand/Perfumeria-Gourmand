import type { Product } from "@/types";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

export default function NewArrivalsCarousel({ products }: { products: Product[] }) {
  return (
    <section className="py-16 lg:py-20" style={{ background: "#f8f7f4" }}>
      <div className="px-5 sm:px-8 lg:px-20 mb-9 flex justify-between items-end">
        <div>
          <p className="font-sans uppercase text-gold" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.32em", marginBottom: 10 }}>
            Recién llegado
          </p>
          <h2 className="font-display text-text-dark" style={{ fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.05 }}>
            Novedades
          </h2>
        </div>
        <Link
          href="/catalogo?sort=newest"
          className="hidden md:inline font-sans text-text-mid hover:text-gold transition-colors"
          style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase" }}
        >
          Ver todos →
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="px-5 sm:px-8 lg:px-20 pt-1 pb-2 relative">
          <ProductCarousel products={products} />
        </div>
      ) : (
        <div className="flex items-center justify-center py-20 border border-border-light mx-5 sm:mx-20">
          <p className="font-sans text-sm text-text-light italic">Las novedades aparecerán aquí</p>
        </div>
      )}
    </section>
  );
}
