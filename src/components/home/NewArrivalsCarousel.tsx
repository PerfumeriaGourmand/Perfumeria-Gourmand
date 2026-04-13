import type { Product } from "@/types";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

export default function NewArrivalsCarousel({ products }: { products: Product[] }) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-3">
            Recién llegado
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-text-dark leading-tight">
            Novedades
          </h2>
        </div>
        <Link
          href="/catalogo?sort=newest"
          className="hidden md:inline font-sans text-sm text-text-mid hover:text-text-dark transition-colors border-b border-border-light pb-0.5 hover:border-text-dark"
        >
          Ver todos →
        </Link>
      </div>

      {products.length > 0 ? (
        <ProductCarousel products={products} />
      ) : (
        <div className="flex items-center justify-center py-20 border border-border-light rounded-2xl">
          <p className="font-sans text-sm text-text-light italic">Las novedades aparecerán aquí</p>
        </div>
      )}
    </section>
  );
}
