"use client";

import { useWishlistStore } from "@/store/wishlist";
import ProductCard from "@/components/catalog/ProductCard";
import GoldDivider from "@/components/ui/GoldDivider";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavoritosPage() {
  const { products, count } = useWishlistStore();
  const total = count();

  return (
    <div className="min-h-screen pt-24 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="py-12">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-4">
            Tu selección
          </p>
          <h1 className="font-display font-light text-5xl text-text-dark">Favoritos</h1>
        </div>

        <GoldDivider className="mb-10" />

        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
              <Heart size={28} strokeWidth={1} className="text-text-light" />
            </div>
            <div>
              <p className="font-display text-2xl text-text-dark mb-2">Sin favoritos todavía</p>
              <p className="font-sans text-sm text-text-light">
                Guardá los perfumes que te gusten tocando el corazón en cada producto.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="px-8 py-3 border border-text-dark text-text-dark rounded-full font-sans text-sm hover:bg-text-dark hover:text-white transition-colors"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <>
            <p className="font-sans text-xs text-text-light mb-8">
              {total} {total === 1 ? "perfume guardado" : "perfumes guardados"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
