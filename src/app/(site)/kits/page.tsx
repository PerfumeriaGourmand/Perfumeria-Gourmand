import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import KitsGrid from "./KitsGrid";

export const metadata: Metadata = {
  title: "Kits",
  description: "Conjuntos exclusivos de fragancias Gourmand.",
};

export const revalidate = 60;

export default async function KitsPage() {
  const supabase = await createClient();
  const { data: kits } = await supabase
    .from("kits")
    .select("*, items:kit_items(*, variant:product_variants(*, product:products(*)))")
    .eq("is_active", true)
    .order("is_featured", { ascending: false });

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-14">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-4">Conjuntos</p>
          <h1 className="font-display font-light text-[clamp(2.5rem,5vw,5rem)] text-cream">
            Kits exclusivos
          </h1>
        </div>
        <div className="gold-line mb-12" />
        <KitsGrid kits={kits ?? []} />
      </div>
    </div>
  );
}
