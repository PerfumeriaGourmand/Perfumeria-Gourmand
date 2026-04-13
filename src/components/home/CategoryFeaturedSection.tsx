import type { Product } from "@/types";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

interface Props {
  title: string;
  eyebrow: string;
  href: string;
  products: Product[];
  dark?: boolean;
}

export default function CategoryFeaturedSection({ title, eyebrow, href, products, dark }: Props) {
  if (products.length === 0) return null;

  return (
    <section className={dark ? "py-20 bg-obsidian" : "py-20 bg-page-bg"}>
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-3">
              {eyebrow}
            </p>
            <h2
              className={`font-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold leading-tight ${
                dark ? "text-cream" : "text-text-dark"
              }`}
            >
              {title}
            </h2>
          </div>
          <Link
            href={href}
            className={`hidden md:inline font-sans text-sm transition-colors border-b pb-0.5 ${
              dark
                ? "text-gold/60 hover:text-gold border-gold/20 hover:border-gold/60"
                : "text-text-mid hover:text-text-dark border-border-light hover:border-text-dark"
            }`}
          >
            Ver colección →
          </Link>
        </div>
        <ProductCarousel products={products} />
      </div>
    </section>
  );
}
