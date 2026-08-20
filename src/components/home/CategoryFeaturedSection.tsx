import type { Product } from "@/types";
import ProductCarousel from "./ProductCarousel";
import Link from "next/link";

interface Props {
  title: string;
  href: string;
  products: Product[];
  dark?: boolean;
}

export default function CategoryFeaturedSection({ title, href, products, dark }: Props) {
  if (products.length === 0) return null;

  return (
    <section
      className="py-16 lg:py-20"
      style={{
        background: dark ? "#0a0a0a" : "#f8f7f4",
        borderTop: dark ? "1px solid rgba(164,133,76,0.08)" : "none",
      }}
    >
      <div className="px-5 sm:px-8 lg:px-20 mb-9 flex justify-between items-end">
        <div>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.05, color: dark ? "#f5f0e8" : "#1c1917" }}
          >
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className={`hidden md:inline font-sans transition-colors duration-200 hover:text-gold ${
            dark ? "text-gold/60" : "text-stone-600"
          }`}
          style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase" }}
        >
          Ver colección →
        </Link>
      </div>
      <div className="px-5 sm:px-8 lg:px-20 pt-1 pb-2 relative">
        <ProductCarousel products={products} dark={dark} />
      </div>
    </section>
  );
}
