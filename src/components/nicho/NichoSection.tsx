"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

interface NichoSectionProps {
  products: Product[];
  brands: string[];
}

export default function NichoSection({ products, brands }: NichoSectionProps) {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const filteredProducts = activeBrand
    ? products.filter((p) => p.brand === activeBrand)
    : products;

  const scrollToBrand = (brand: string) => {
    setActiveBrand(brand);
    const el = sectionRefs.current.get(brand);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="nicho-section min-h-screen relative">
      {/* Floating particles background */}
      <NichoParticles />

      {/* Fixed side navigation */}
      {brands.length > 1 && (
        <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => scrollToBrand(brand)}
              className={`group flex items-center gap-3 text-right transition-all duration-300 ${
                activeBrand === brand ? "opacity-100" : "opacity-30 hover:opacity-70"
              }`}
            >
              <span className="font-sans text-[10px] tracking-widest uppercase text-gold hidden group-hover:inline transition-all">
                {brand}
              </span>
              <div
                className={`transition-all duration-300 ${
                  activeBrand === brand
                    ? "w-8 h-px bg-gold"
                    : "w-2 h-px bg-gold/60"
                }`}
              />
            </button>
          ))}
        </nav>
      )}

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end pb-24 px-8 md:px-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-gold/4 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <p className="font-sans text-xs tracking-[0.6em] uppercase text-gold mb-8 opacity-60">
            Perfumería de Autor
          </p>
          <h1
            className="font-display font-extralight text-[clamp(4rem,12vw,12rem)] leading-none text-cream tracking-[-0.02em]"
          >
            Nicho
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-gold to-transparent mt-8 mb-8" />
          <p className="font-sans text-sm text-cream/40 max-w-sm leading-relaxed tracking-wide">
            Pequeñas tiradas. Materias primas extraordinarias.
            Olfatos que no pasan inadvertidos.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="px-8 md:px-16 pb-32 space-y-40">
        {filteredProducts.map((product, index) => (
          <NichoProductCard
            key={product.id}
            product={product}
            index={index}
            ref={(el) => {
              if (el) sectionRefs.current.set(product.brand, el);
            }}
          />
        ))}

        {filteredProducts.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <p className="font-display text-3xl italic text-cream/20">
              Próximamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const NichoProductCard = ({
  product,
  index,
  ref,
}: {
  product: Product;
  index: number;
  ref?: React.Ref<HTMLElement>;
}) => {
  const isEven = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCartStore();

  const primaryImage =
    product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const activeVariants =
    product.variants?.filter((v) => v.is_active && v.stock > 0) ?? [];
  const cheapestVariant = activeVariants.sort((a, b) => a.price - b.price)[0];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleQuickAdd = () => {
    if (!cheapestVariant) return;
    addItem({
      id: cheapestVariant.id,
      type: "variant",
      name: product.name,
      brand: product.brand,
      size_ml: cheapestVariant.size_ml,
      price: cheapestVariant.price,
      image_url: primaryImage?.url,
      stock: cheapestVariant.stock,
    });
    toast.success(`${product.name} agregado`);
  };

  return (
    <article
      ref={(el) => {
        (cardRef as React.MutableRefObject<HTMLElement | null>).current = el;
        if (typeof ref === "function") ref(el as HTMLElement);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el as HTMLElement;
      }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center transition-all duration-1000 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      } ${isEven ? "" : "lg:direction-rtl"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className={`relative ${isEven ? "lg:order-1" : "lg:order-2"}`}
      >
        <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden group">
          {/* Glow backdrop */}
          <div
            className="absolute inset-0 blur-3xl scale-90 transition-all duration-700 rounded-full"
            style={{
              background: `radial-gradient(ellipse, rgba(201,169,110,0.08) 0%, transparent 70%)`,
              opacity: hovered ? 1 : 0.4,
            }}
          />

          {/* Frame */}
          <div
            className={`absolute inset-0 border transition-all duration-700 z-20 pointer-events-none ${
              hovered ? "border-gold/30" : "border-gold/08"
            }`}
          />

          {/* Image */}
          <div className="absolute inset-4 overflow-hidden bg-black/20">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-1000 ${
                  hovered ? "scale-105" : "scale-100"
                }`}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-[100px] text-gold/10 italic">
                  {product.brand.charAt(0)}
                </span>
              </div>
            )}

            {/* Hover overlay with quick info */}
            <div
              className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-all duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold">
                {product.concentration.toUpperCase()}
              </p>
              {cheapestVariant && (
                <p className="font-display text-3xl text-cream">
                  {formatPrice(cheapestVariant.price)}
                </p>
              )}
              <button
                onClick={handleQuickAdd}
                className="font-sans text-[10px] tracking-[0.4em] uppercase border border-gold/40 text-gold px-6 py-2.5 hover:bg-gold/10 transition-colors"
              >
                Agregar al carrito
              </button>
            </div>
          </div>

          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/20 z-20" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/20 z-20" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold/20 z-20" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/20 z-20" />
        </div>
      </div>

      {/* Text */}
      <div className={`${isEven ? "lg:order-2" : "lg:order-1"} space-y-6`}>
        {/* Brand */}
        <div>
          <p className="font-sans text-[10px] tracking-[0.6em] uppercase text-gold/50 mb-2">
            {product.brand}
          </p>
          <div className="h-px w-12 bg-gradient-to-r from-gold/30 to-transparent" />
        </div>

        {/* Name */}
        <h2
          className="font-display font-light text-[clamp(2.5rem,5vw,5rem)] text-cream leading-none tracking-[-0.02em]"
          style={{
            clipPath: visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition: "clip-path 1.2s ease",
            transitionDelay: "0.3s",
          }}
        >
          {product.name}
        </h2>

        {/* Short description */}
        {product.short_desc && (
          <p className="font-sans text-sm text-cream/35 leading-relaxed tracking-wide max-w-xs font-light italic">
            {product.short_desc}
          </p>
        )}

        {product.description && !product.short_desc && (
          <p className="font-sans text-sm text-cream/35 leading-relaxed tracking-wide max-w-xs font-light">
            {product.description.slice(0, 180)}
            {product.description.length > 180 ? "…" : ""}
          </p>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {product.variants
              .filter((v) => v.is_active)
              .sort((a, b) => a.size_ml - b.size_ml)
              .map((v) => (
                <div key={v.id} className="text-center">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-cream/25 mb-1">
                    {v.size_ml}ml
                  </p>
                  <p className="font-display text-lg text-gold">
                    {formatPrice(v.price)}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-6 pt-4">
          <Link
            href={`/perfumes/${product.id}`}
            className="group flex items-center gap-3 font-sans text-xs tracking-[0.4em] uppercase text-cream/40 hover:text-cream transition-all duration-300"
          >
            Ver detalle
            <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-14" />
          </Link>
          {cheapestVariant && (
            <button
              onClick={handleQuickAdd}
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold/40 hover:text-gold transition-colors duration-300"
            >
              + Carrito
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

function NichoParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gold animate-particle"
          style={{
            width: p.size + "px",
            height: p.size + "px",
            left: p.x + "%",
            top: p.y + "%",
            opacity: 0.15,
            "--duration": p.duration + "s",
            "--delay": p.delay + "s",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
