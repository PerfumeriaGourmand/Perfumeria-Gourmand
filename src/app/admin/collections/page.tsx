export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import CollectionsClient from "./CollectionsClient";

export default async function AdminCollectionsPage() {
  const supabase = await createAdminClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*, collection_products(id)")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Colecciones</h1>
          <p className="font-sans text-xs text-cream-dim">
            {collections?.length ?? 0} colecciones
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-5 py-3 hover:bg-gold-light transition-colors"
        >
          <Plus size={14} strokeWidth={2} />
          Nueva colección
        </Link>
      </div>

      <CollectionsClient collections={collections ?? []} />
    </div>
  );
}
