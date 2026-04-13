"use client";

import type { Kit } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

export default function KitsGrid({ kits }: { kits: Kit[] }) {
  const { addItem } = useCartStore();

  if (kits.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-display text-2xl italic text-cream-muted">
          Próximamente
        </p>
      </div>
    );
  }

  const handleAdd = (kit: Kit) => {
    addItem({
      id: kit.id,
      type: "kit",
      name: kit.name,
      price: kit.price,
      image_url: kit.image_url ?? undefined,
      stock: kit.stock,
    });
    toast.success(`${kit.name} agregado al carrito`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {kits.map((kit) => (
        <article key={kit.id} className="product-card group">
          <div className="relative aspect-[4/3] overflow-hidden bg-obsidian-mid">
            {kit.image_url ? (
              <Image
                src={kit.image_url}
                alt={kit.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-5xl italic text-cream/10">Kit</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            {kit.is_featured && (
              <span className="absolute top-3 left-3 font-sans text-[9px] tracking-widest uppercase bg-gold text-obsidian px-2 py-0.5">
                Destacado
              </span>
            )}
          </div>
          <div className="p-6">
            <h2 className="font-display text-xl text-cream mb-2 group-hover:text-gold transition-colors duration-300">
              {kit.name}
            </h2>
            {kit.description && (
              <p className="font-sans text-xs text-cream-dim leading-relaxed mb-4 line-clamp-3">
                {kit.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <p className="font-display text-xl text-gold">{formatPrice(kit.price)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAdd(kit)}
                  disabled={kit.stock === 0}
                  className="font-sans text-[10px] tracking-widest uppercase bg-gold text-obsidian px-4 py-2 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {kit.stock === 0 ? "Sin stock" : "Agregar"}
                </button>
                <Link
                  href={`/kits/${kit.id}`}
                  className="font-sans text-[10px] tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 hover:border-gold/60 transition-colors"
                >
                  Ver
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
