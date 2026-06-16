"use client";

import { useWishlistStore } from "@/store/wishlist";
import ProductCard from "@/components/catalog/ProductCard";
import GoldDivider from "@/components/ui/GoldDivider";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

export default function FavoritosPage() {
  const { products, count, clear } = useWishlistStore();
  const total = count();

  return (
    <div className="min-h-screen pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Favoritos" }]} className="pt-4" />
        {/* Header */}
        <div className="pb-12 flex items-end justify-between">
          <div>
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-4">
              Tu selección
            </p>
            <h1 className="font-display font-light text-5xl text-text-dark flex items-baseline gap-4">
              Favoritos
              {total > 0 && (
                <span className="font-sans text-lg font-normal text-text-light">
                  {total} {total === 1 ? "perfume" : "perfumes"}
                </span>
              )}
            </h1>
          </div>
          {total > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-2 font-sans text-xs text-text-light hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Limpiar todo
            </button>
          )}
        </div>

        <GoldDivider className="mb-10" />

        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
              <Heart size={28} strokeWidth={1} className="text-text-light" />
            </div>
            <div>
              <p className="font-display text-2xl text-text-dark mb-2">Sin favoritos todavía</p>
              <p className="font-sans text-sm text-text-light max-w-xs">
                Guardá los perfumes que te gusten tocando el corazón en cada producto.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/catalogo"
                className="px-8 py-3 border border-text-dark text-text-dark rounded-full font-sans text-sm hover:bg-text-dark hover:text-white transition-colors"
              >
                Explorar catálogo
              </Link>
              <Link
                href="/catalogo/nicho"
                className="px-8 py-3 border border-gold/40 text-gold rounded-full font-sans text-sm hover:bg-gold/5 transition-colors"
              >
                Ver Nicho
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
