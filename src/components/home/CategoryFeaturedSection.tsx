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
    <section
      style={{
        background: dark ? "#0a0a0a" : "#f8f7f4",
        padding: "68px 0 76px",
        borderTop: dark ? "1px solid rgba(164,133,76,0.08)" : "none",
      }}
    >
      <div style={{ padding: "0 80px", marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p className="font-sans uppercase text-gold" style={{ fontSize: 9, letterSpacing: "0.5em", marginBottom: 10 }}>
            {eyebrow}
          </p>
          <h2
            className="font-display"
            style={{ fontSize: 40, lineHeight: 1.05, color: dark ? "#f5f0e8" : "#1c1917" }}
          >
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="hidden md:inline font-sans transition-colors duration-200"
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: dark ? "rgba(164,133,76,0.6)" : "#57534e",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a4854c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = dark ? "rgba(164,133,76,0.6)" : "#57534e")}
        >
          Ver colección →
        </Link>
      </div>
      <div style={{ padding: "4px 80px 8px", position: "relative" }}>
        <ProductCarousel products={products} dark={dark} />
      </div>
    </section>
  );
}
