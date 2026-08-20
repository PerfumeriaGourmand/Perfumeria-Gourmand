import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import GoldDivider from "@/components/ui/GoldDivider";
import Breadcrumb from "@/components/ui/Breadcrumb";
import type { Metadata } from "next";
import type { Collection } from "@/types";

export const metadata: Metadata = {
  title: "Colecciones",
  description: "Explorá nuestras colecciones de perfumes en Gourmand.",
  alternates: { canonical: "/colecciones" },
};

export const revalidate = 60;

export default async function ColeccionesPage() {
  const supabase = await createClient();

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-4 pb-12">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Colecciones" }]} />
          <h1 className="font-display font-light text-5xl text-text-dark">Colecciones</h1>
        </div>

        <GoldDivider className="mb-16" />

        {(collections ?? []).length === 0 ? (
          <p className="font-sans text-sm text-text-light italic py-12 text-center">
            Todavía no hay colecciones disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(collections as Collection[]).map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/colecciones/${collection.slug}`}
      className="group flex flex-col border border-border-light rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-[0_8px_32px_rgba(164,133,76,0.10)] transition-all duration-300 bg-white"
    >
      <div className="relative h-56 bg-[#f5f4f0] overflow-hidden">
        {collection.image_url ? (
          <Image
            src={collection.image_url}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl italic text-text-light/20">
              {collection.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-body text-2xl text-text-dark group-hover:text-gold transition-colors duration-200 mb-2">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="font-sans text-sm text-text-light line-clamp-2">{collection.description}</p>
        )}
      </div>
    </Link>
  );
}
