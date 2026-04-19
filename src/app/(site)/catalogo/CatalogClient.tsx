"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Product, ProductFilters } from "@/types";
import ProductCard from "@/components/catalog/ProductCard";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn, CATEGORY_LABELS, GENDER_LABELS, SEASON_LABELS, CONCENTRATION_LABELS } from "@/lib/utils";
import { useThemeStore } from "@/store/theme";

interface Props {
  initialProducts: Product[];
  initialFilters: ProductFilters;
}

export default function CatalogClient({ initialProducts, initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { setIsNichoProduct } = useThemeStore();
  const isNicho = initialFilters.category === "nicho";

  // Sync nicho state with global theme store
  useEffect(() => {
    if (isNicho) setIsNichoProduct(true);
    return () => setIsNichoProduct(false);
  }, [isNicho, setIsNichoProduct]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "gender", "season", "concentration", "search"].forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
    setFiltersOpen(false);
  };

  // Client-side search
  const search = initialFilters.search ?? "";
  const products = useMemo(() => {
    if (!search.trim()) return initialProducts;
    const q = search.toLowerCase();
    return initialProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [initialProducts, search]);

  const activeFilterCount = [
    initialFilters.category,
    initialFilters.gender,
    initialFilters.season,
    initialFilters.concentration,
  ].filter(Boolean).length;

  const N = isNicho;

  return (
    <div className={cn("min-h-screen pt-[104px]", N ? "bg-obsidian text-cream" : "")}>
      {/* Page header */}
      <div className="px-6 max-w-7xl mx-auto py-10">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">
          {initialFilters.category ? CATEGORY_LABELS[initialFilters.category] : "Colección completa"}
        </p>
        <h1 className={cn(
          "font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none",
          N ? "text-cream" : "text-text-dark"
        )}>
          {initialFilters.category
            ? `Perfumes ${CATEGORY_LABELS[initialFilters.category]}s`
            : "Catálogo"}
        </h1>
      </div>

      <div className={N ? "border-b border-white/10" : "divider-light"} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFiltersOpen(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full border font-sans text-sm font-medium transition-all duration-200",
              activeFilterCount > 0
                ? N
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-text-dark bg-text-dark text-white"
                : N
                ? "border-white/20 text-cream-dim hover:border-gold/60 hover:text-gold"
                : "border-border-light text-text-mid hover:border-text-dark hover:text-text-dark bg-white"
            )}
          >
            <SlidersHorizontal size={14} strokeWidth={2} />
            Filtrar
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-text-dark text-[10px] flex items-center justify-center font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active filter chips */}
          {initialFilters.category && (
            <FilterChip label={CATEGORY_LABELS[initialFilters.category]} onRemove={() => updateFilter("category", undefined)} dark={N} />
          )}
          {initialFilters.gender && (
            <FilterChip label={GENDER_LABELS[initialFilters.gender]} onRemove={() => updateFilter("gender", undefined)} dark={N} />
          )}
          {initialFilters.season && (
            <FilterChip label={SEASON_LABELS[initialFilters.season]} onRemove={() => updateFilter("season", undefined)} dark={N} />
          )}
          {initialFilters.concentration && (
            <FilterChip label={CONCENTRATION_LABELS[initialFilters.concentration]} onRemove={() => updateFilter("concentration", undefined)} dark={N} />
          )}

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <label className={cn("font-sans text-xs hidden sm:block", N ? "text-cream-dim" : "text-text-light")}>Ordenar:</label>
            <div className="relative">
              <select
                value={initialFilters.sort ?? ""}
                onChange={(e) => updateFilter("sort", e.target.value || undefined)}
                className={cn(
                  "appearance-none border font-sans text-sm pl-3 pr-8 py-2 rounded-full focus:outline-none transition-colors cursor-pointer",
                  N
                    ? "bg-obsidian border-white/10 text-cream-dim focus:border-gold/40"
                    : "bg-white border-border-light text-text-mid focus:border-gold/50"
                )}
              >
                <option value="">Relevancia</option>
                <option value="newest">Más nuevos</option>
                <option value="name_asc">Nombre A-Z</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className={cn("font-sans text-xs mb-6", N ? "text-cream-dim" : "text-text-light")}>
          {products.length} {products.length === 1 ? "perfume" : "perfumes"}
        </p>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className={cn("font-display text-2xl font-bold mb-2", N ? "text-cream" : "text-text-dark")}>Sin resultados</p>
            <p className={cn("font-sans text-sm mb-6", N ? "text-cream-dim" : "text-text-light")}>Intentá con otros filtros</p>
            <button
              onClick={clearFilters}
              className={cn(
                "px-6 py-2.5 rounded-full border font-sans text-sm font-medium transition-colors",
                N
                  ? "border-gold/40 text-gold hover:bg-gold/10"
                  : "border-text-dark text-text-dark hover:bg-text-dark hover:text-white"
              )}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} dark={N} />
            ))}
          </div>
        )}
      </div>

      {/* ——— Filter Modal ——— */}
      {filtersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="filter-backdrop"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div className="fixed bottom-0 left-0 right-0 md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-xl md:w-full z-50 bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-4px_40px_rgba(0,0,0,0.15)] md:shadow-card-hover overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
              <div className="flex items-center gap-3">
                <h2 className="font-sans text-base font-semibold text-text-dark">Filtros</h2>
                {activeFilterCount > 0 && (
                  <span className="font-sans text-xs text-white bg-text-dark px-2 py-0.5 rounded-full">
                    {activeFilterCount} activos
                  </span>
                )}
              </div>
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-text-light hover:text-text-dark rounded-full hover:bg-surface-2 transition-colors"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <ModalFilterGroup
                label="Categoría"
                options={CATEGORY_LABELS}
                value={initialFilters.category}
                onChange={(v) => updateFilter("category", v)}
              />
              <div className="divider-light" />
              <ModalFilterGroup
                label="Género"
                options={GENDER_LABELS}
                value={initialFilters.gender}
                onChange={(v) => updateFilter("gender", v)}
              />
              <div className="divider-light" />
              <ModalFilterGroup
                label="Estación"
                options={SEASON_LABELS}
                value={initialFilters.season}
                onChange={(v) => updateFilter("season", v)}
              />
              <div className="divider-light" />
              <ModalFilterGroup
                label="Concentración"
                options={CONCENTRATION_LABELS}
                value={initialFilters.concentration}
                onChange={(v) => updateFilter("concentration", v)}
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-border-light bg-white">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 rounded-full border border-border-light text-text-mid font-sans text-sm font-medium hover:border-text-dark hover:text-text-dark transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-1 py-3 rounded-full bg-text-dark text-white font-sans text-sm font-medium hover:bg-text-mid transition-colors"
              >
                Ver {products.length} resultados
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove, dark }: { label: string; onRemove: () => void; dark?: boolean }) {
  return (
    <span className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-sans text-xs",
      dark
        ? "bg-white/5 border-white/10 text-cream-dim"
        : "bg-surface-2 border-border-light text-text-mid"
    )}>
      {label}
      <button onClick={onRemove} className={cn("transition-colors", dark ? "text-cream-dim/50 hover:text-cream" : "text-text-light hover:text-text-dark")}>
        <X size={11} strokeWidth={2.5} />
      </button>
    </span>
  );
}

function ModalFilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Record<string, string>;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div>
      <p className="font-sans text-xs font-semibold text-text-dark tracking-widest uppercase mb-4">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([key, lbl]) => (
          <button
            key={key}
            onClick={() => onChange(value === key ? undefined : key)}
            className={cn(
              "px-4 py-2 rounded-full border font-sans text-sm transition-all duration-150",
              value === key
                ? "border-text-dark bg-text-dark text-white"
                : "border-border-light text-text-mid hover:border-text-dark hover:text-text-dark"
            )}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}
