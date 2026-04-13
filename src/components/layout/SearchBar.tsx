"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { cn, formatPrice } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  images: { url: string; is_primary: boolean }[] | null;
  variants: { price: number }[] | null;
}

export default function SearchBar({ dark, className }: { dark?: boolean; className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search — 300ms
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, name, brand, images:product_images(url, is_primary), variants:product_variants(price)")
        .or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`)
        .eq("is_active", true)
        .limit(6);

      setResults(data ?? []);
      setOpen(true);
      setLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const q = query.trim();
      if (q) {
        router.push(`/catalogo?search=${encodeURIComponent(q)}`);
        setQuery("");
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [query, router]
  );

  const handleResultClick = () => {
    setQuery("");
    setOpen(false);
  };

  const inputClass = dark
    ? "bg-white/5 border-white/10 text-cream placeholder:text-cream-dim/50 focus:border-gold/40 focus:bg-white/10"
    : "bg-surface-2 border-border-light text-text-dark placeholder:text-text-light focus:border-gold/50 focus:bg-white";

  const hasQuery = query.trim().length >= 2;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <Search
          size={15}
          strokeWidth={1.5}
          className={cn(
            "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none",
            dark ? "text-cream-dim/50" : "text-text-light"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hasQuery && setOpen(true)}
          placeholder="Buscar perfumes, marcas..."
          className={cn(
            "w-full border rounded-full pl-10 pr-9 py-2.5 font-sans text-sm focus:outline-none transition-all duration-200",
            inputClass
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(false); }}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
              dark ? "text-cream-dim/50 hover:text-cream" : "text-text-light hover:text-text-dark"
            )}
          >
            <X size={13} strokeWidth={2} />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border-light rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden z-[60]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <>
              <ul>
                {results.map((result) => {
                  const primaryImg =
                    result.images?.find((i) => i.is_primary) ?? result.images?.[0];
                  const prices = result.variants?.map((v) => v.price) ?? [];
                  const minPrice = prices.length ? Math.min(...prices) : null;

                  return (
                    <li key={result.id}>
                      <Link
                        href={`/perfumes/${result.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors"
                      >
                        <div className="relative w-10 h-12 bg-surface-2 rounded-lg overflow-hidden flex-shrink-0 border border-border-light">
                          {primaryImg ? (
                            <Image
                              src={primaryImg.url}
                              alt={result.name}
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-display text-base text-text-light/30">
                                {result.brand.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[10px] font-semibold tracking-wide text-text-light mb-0.5">
                            {result.brand}
                          </p>
                          <p className="font-sans text-sm font-medium text-text-dark truncate">
                            {result.name}
                          </p>
                        </div>

                        {minPrice !== null && (
                          <p className="font-sans text-sm font-semibold text-gold flex-shrink-0">
                            {formatPrice(minPrice)}
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="px-4 py-2.5 border-t border-border-light bg-surface-2/50">
                <button
                  onClick={() => handleSubmit()}
                  className="font-sans text-xs text-text-light hover:text-text-dark transition-colors flex items-center gap-1"
                >
                  Ver todos los resultados para &ldquo;{query.trim()}&rdquo;
                  <span className="text-gold">→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="font-sans text-sm text-text-mid font-medium mb-1">Sin resultados</p>
              <p className="font-sans text-xs text-text-light">
                No encontramos productos para &ldquo;{query.trim()}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
