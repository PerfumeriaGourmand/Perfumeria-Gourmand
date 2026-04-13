"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];

  const activeVariants = (product.variants ?? [])
    .filter((v) => v.is_active)
    .sort((a, b) => a.size_ml - b.size_ml);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    activeVariants.find((v) => v.stock > 0) ?? activeVariants[0] ?? null
  );
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant || selectedVariant.stock === 0) return;
    setAdding(true);
    addItem({
      id: selectedVariant.id,
      type: "variant",
      name: product.name,
      brand: product.brand,
      size_ml: selectedVariant.size_ml,
      price: selectedVariant.price,
      image_url: primaryImage?.url,
      stock: selectedVariant.stock,
    });
    toast.success(`${product.name} agregado al carrito`);
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted((v) => !v);
  };

  const handleVariantSelect = (e: React.MouseEvent, variant: ProductVariant) => {
    e.preventDefault();
    setSelectedVariant(variant);
  };

  const hasStock = selectedVariant ? selectedVariant.stock > 0 : false;

  return (
    <Link href={`/perfumes/${product.id}`} className="product-card block group" tabIndex={0}>
      {/* Image area */}
      <div className="relative bg-[#f5f4f0] rounded-t-2xl overflow-hidden aspect-[3/4]">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 300px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl italic text-text-light/30">
              {product.brand.charAt(0)}
            </span>
          </div>
        )}

        {/* Wishlist btn */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          aria-label={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            className={cn(
              "transition-colors duration-200",
              wishlisted ? "fill-gold stroke-gold" : "stroke-text-light"
            )}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_new && (
            <span className="font-sans text-[9px] font-semibold tracking-wider uppercase bg-gold text-white px-2 py-0.5 rounded-full">
              Nuevo
            </span>
          )}
          {product.category === "nicho" && !product.is_new && (
            <span className="font-sans text-[9px] font-medium tracking-wider uppercase bg-white/90 text-gold border border-gold/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Nicho
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 pt-3">
        {/* Brand */}
        <p className="font-sans text-xs font-semibold text-text-dark tracking-wide mb-0.5">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="font-body text-base text-text-mid leading-snug mb-3">
          {product.name}
        </h3>

        {/* Size swatches */}
        {activeVariants.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activeVariants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => handleVariantSelect(e, v)}
                className={cn(
                  "font-sans text-xs px-2.5 py-1 rounded-full border transition-all duration-150",
                  selectedVariant?.id === v.id
                    ? "border-text-dark bg-text-dark text-white"
                    : v.stock === 0
                    ? "border-border-light text-text-light line-through cursor-not-allowed"
                    : "border-border-light text-text-mid hover:border-text-dark hover:text-text-dark"
                )}
              >
                {v.size_ml}ml
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="font-sans text-base font-semibold text-text-dark mb-3">
          {selectedVariant ? formatPrice(selectedVariant.price) : "—"}
        </p>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!hasStock || adding}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-full border font-sans text-xs font-medium tracking-wide transition-all duration-200",
            hasStock
              ? "border-text-dark text-text-dark hover:bg-text-dark hover:text-white active:scale-[0.98]"
              : "border-border-light text-text-light cursor-not-allowed",
            adding && "bg-text-dark text-white"
          )}
        >
          <ShoppingBag size={13} strokeWidth={2} />
          {adding ? "Agregado ✓" : hasStock ? "Agregar al carrito" : "Sin stock"}
        </button>
      </div>
    </Link>
  );
}
