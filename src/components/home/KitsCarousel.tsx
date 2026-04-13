import type { Kit } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function KitsCarousel({ kits }: { kits: Kit[] }) {
  return (
    <section className="py-20 bg-surface-2">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-3">
              Conjuntos
            </p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-text-dark leading-tight">
              Kits exclusivos
            </h2>
          </div>
          <Link
            href="/kits"
            className="hidden md:inline font-sans text-sm text-text-mid hover:text-text-dark transition-colors border-b border-border-light pb-0.5 hover:border-text-dark"
          >
            Ver todos →
          </Link>
        </div>

        {kits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="font-sans text-sm text-text-light italic">Los kits aparecerán aquí</p>
          </div>
        )}
      </div>
    </section>
  );
}

function KitCard({ kit }: { kit: Kit }) {
  return (
    <Link href={`/kits/${kit.id}`} className="product-card block group">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ede6] rounded-t-2xl">
        {kit.image_url ? (
          <Image
            src={kit.image_url}
            alt={kit.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display text-4xl text-text-light/30 italic">Kit</p>
          </div>
        )}
        {kit.is_featured && (
          <span className="absolute top-3 left-3 font-sans text-[9px] font-semibold tracking-wider uppercase bg-gold text-white px-2 py-0.5 rounded-full">
            Destacado
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-text-dark mb-1 group-hover:text-gold transition-colors duration-300">
          {kit.name}
        </h3>
        {kit.description && (
          <p className="font-sans text-xs text-text-light leading-relaxed mb-3 line-clamp-2">
            {kit.description}
          </p>
        )}
        <p className="font-sans text-base font-semibold text-text-dark">{formatPrice(kit.price)}</p>
      </div>
    </Link>
  );
}
