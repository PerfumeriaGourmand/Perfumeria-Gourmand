"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Product, ProductFilters } from "@/types";
import ProductCard from "@/components/catalog/ProductCard";
import { SlidersHorizontal, X, ChevronDown, ChevronRight } from "lucide-react";
import { cn, formatPrice, CATEGORY_LABELS, GENDER_LABELS, SEASON_LABELS, CONCENTRATION_LABELS } from "@/lib/utils";
import { useThemeStore } from "@/store/theme";
import Link from "next/link";

interface Props {
  initialProducts: Product[];
  initialFilters: ProductFilters;
  brands: string[];
}

export default function CatalogClient({ initialProducts, initialFilters, brands }: Props) {
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

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateFilter = (key: string, value: string | undefined) => updateFilters({ [key]: value });

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "gender", "season", "concentration", "brand", "search", "minPrice", "maxPrice"].forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
    setFiltersOpen(false);
  };

  // Price bounds derived from currently loaded products (before price filtering)
  const priceBounds = useMemo<[number, number]>(() => {
    const prices = initialProducts.flatMap((p) => (p.variants ?? []).map((v) => v.price));
    if (prices.length === 0) return [0, 100000];
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [initialProducts]);

  const getMinVariantPrice = (p: Product) => {
    const prices = (p.variants ?? []).map((v) => v.price);
    return prices.length ? Math.min(...prices) : 0;
  };

  const priceRange: [number, number] = [
    initialFilters.minPrice ?? priceBounds[0],
    initialFilters.maxPrice ?? priceBounds[1],
  ];

  const handlePriceChange = ([min, max]: [number, number]) => {
    updateFilters({
      minPrice: min > priceBounds[0] ? String(min) : undefined,
      maxPrice: max < priceBounds[1] ? String(max) : undefined,
    });
  };

  // Client-side search + price + sort
  const search = initialFilters.search ?? "";
  const { minPrice, maxPrice } = initialFilters;
  const products = useMemo(() => {
    let result = initialProducts;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      result = result.filter((p) => {
        const price = getMinVariantPrice(p);
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        return true;
      });
    }
    // Default: en stock alfabético primero, sin stock alfabético después
    if (!initialFilters.sort) {
      result = [...result].sort((a, b) => {
        const aHas = (a.variants ?? []).some((v) => v.is_active && v.stock > 0);
        const bHas = (b.variants ?? []).some((v) => v.is_active && v.stock > 0);
        if (aHas !== bHas) return aHas ? -1 : 1;
        return a.name.localeCompare(b.name, "es");
      });
    }
    return result;
  }, [initialProducts, search, minPrice, maxPrice, initialFilters.sort]);

  const hasPriceFilter = initialFilters.minPrice !== undefined || initialFilters.maxPrice !== undefined;

  const activeFilterCount = [
    initialFilters.category,
    initialFilters.gender,
    initialFilters.season,
    initialFilters.concentration,
    initialFilters.brand,
    hasPriceFilter ? "price" : undefined,
  ].filter(Boolean).length;

  const N = isNicho;

  return (
    <div className={cn("min-h-screen pt-[104px]", N ? "bg-obsidian text-cream" : "")}>
      {/* Page header */}
      <div className="px-6 max-w-7xl mx-auto pt-8 pb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6">
          <Link href="/" className={cn("font-sans text-xs transition-colors hover:text-gold", N ? "text-cream-dim/50" : "text-text-light")}>
            Inicio
          </Link>
          <ChevronRight size={11} strokeWidth={2} className={N ? "text-cream-dim/30" : "text-text-light/40"} />
          <Link href="/catalogo" className={cn("font-sans text-xs transition-colors hover:text-gold", N ? "text-cream-dim/50" : "text-text-light")}>
            Catálogo
          </Link>
          {initialFilters.category && (
            <>
              <ChevronRight size={11} strokeWidth={2} className={N ? "text-cream-dim/30" : "text-text-light/40"} />
              <span className={cn("font-sans text-xs font-medium", N ? "text-cream" : "text-text-dark")}>
                {CATEGORY_LABELS[initialFilters.category]}
              </span>
            </>
          )}
          {initialFilters.search && (
            <>
              <ChevronRight size={11} strokeWidth={2} className={N ? "text-cream-dim/30" : "text-text-light/40"} />
              <span className={cn("font-sans text-xs font-medium", N ? "text-cream" : "text-text-dark")}>
                &ldquo;{initialFilters.search}&rdquo;
              </span>
            </>
          )}
        </nav>

        <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">
          {initialFilters.category ? CATEGORY_LABELS[initialFilters.category] : "Colección completa"}
        </p>
        <h1 className={cn(
          "font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none",
          N ? "text-cream" : "text-text-dark"
        )}>
          {initialFilters.search
            ? `Resultados para "${initialFilters.search}"`
            : initialFilters.category
            ? ({ arabe: "Perfumes Árabes", disenador: "Perfumes de Diseñador", nicho: "Perfumes Nicho", kit: "Kits" } as Record<string, string>)[initialFilters.category] ?? CATEGORY_LABELS[initialFilters.category]
            : "Catálogo"}
        </h1>
      </div>

      <div className={N ? "border-b border-white/10" : "divider-light"} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full border font-sans text-sm font-medium transition-all duration-200 shrink-0",
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

            {/* Active filter chips — hidden on mobile, shown inline on sm+ */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
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
              {initialFilters.brand && (
                <FilterChip label={initialFilters.brand} onRemove={() => updateFilter("brand", undefined)} dark={N} />
              )}
              {hasPriceFilter && (
                <FilterChip
                  label={`${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                  onRemove={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                  dark={N}
                />
              )}
            </div>

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

          {/* Active filter chips — mobile only, scrollable row */}
          {activeFilterCount > 0 && (
            <div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-1 -mx-6 px-6">
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
              {initialFilters.brand && (
                <FilterChip label={initialFilters.brand} onRemove={() => updateFilter("brand", undefined)} dark={N} />
              )}
              {hasPriceFilter && (
                <FilterChip
                  label={`${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                  onRemove={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                  dark={N}
                />
              )}
            </div>
          )}
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
              <div className="divider-light" />
              <PriceRangeFilter
                min={priceBounds[0]}
                max={priceBounds[1]}
                value={priceRange}
                onChange={handlePriceChange}
              />
              {brands.length > 0 && (
                <>
                  <div className="divider-light" />
                  <BrandFilterGroup
                    brands={brands}
                    value={initialFilters.brand}
                    onChange={(v) => updateFilter("brand", v)}
                    dark={N}
                  />
                </>
              )}
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

function BrandFilterGroup({
  brands,
  value,
  onChange,
  dark,
}: {
  brands: string[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  dark?: boolean;
}) {
  return (
    <div>
      <p className="font-sans text-xs font-semibold text-text-dark tracking-widest uppercase mb-4">
        Marca
      </p>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onChange(value === brand ? undefined : brand)}
            className={cn(
              "px-4 py-2 rounded-full border font-sans text-sm transition-all duration-150",
              value === brand
                ? dark
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-text-dark bg-text-dark text-white"
                : "border-border-light text-text-mid hover:border-text-dark hover:text-text-dark"
            )}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}

function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}) {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value[0], value[1]]);

  const commit = (a: number, b: number) => onChange([a, b]);

  const range = max - min || 1;
  const minPct = ((localMin - min) / range) * 100;
  const maxPct = ((localMax - min) / range) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="font-sans text-xs font-semibold text-text-dark tracking-widest uppercase">
          Precio
        </p>
        <p className="font-sans text-xs text-text-mid">
          {formatPrice(localMin)} – {formatPrice(localMax)}
        </p>
      </div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-border-light" />
        <div
          className="absolute h-full rounded-full bg-text-dark"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), localMax - 1);
            setLocalMin(v);
          }}
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          onKeyUp={() => commit(localMin, localMax)}
          className="price-range-thumb absolute top-0 left-0 w-full h-1.5"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), localMin + 1);
            setLocalMax(v);
          }}
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          onKeyUp={() => commit(localMin, localMax)}
          className="price-range-thumb absolute top-0 left-0 w-full h-1.5"
        />
      </div>
    </div>
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
