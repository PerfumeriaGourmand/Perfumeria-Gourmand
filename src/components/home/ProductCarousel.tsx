"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import ProductCard from "@/components/catalog/ProductCard";

interface ProductCarouselProps {
  products: Product[];
  autoplay?: boolean;
}

export default function ProductCarousel({ products, autoplay = false }: ProductCarouselProps) {
  const plugins = autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", containScroll: "trimSnaps", dragFree: true },
    plugins
  );

  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevDisabled(!emblaApi.canScrollPrev());
    setNextDisabled(!emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  if (!products.length) return null;

  return (
    <div className="relative">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container gap-4">
          {products.map((product) => (
            <div key={product.id} className="embla__slide w-[230px] md:w-[260px] lg:w-[280px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={onPrev}
        disabled={prevDisabled}
        className={cn(
          "absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-border-light rounded-full flex items-center justify-center text-text-mid shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-text-dark hover:text-text-dark z-10",
          prevDisabled && "opacity-30 cursor-not-allowed"
        )}
        aria-label="Anterior"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-border-light rounded-full flex items-center justify-center text-text-mid shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-text-dark hover:text-text-dark z-10",
          nextDisabled && "opacity-30 cursor-not-allowed"
        )}
        aria-label="Siguiente"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

      {/* Dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-5 h-1.5 bg-gold"
                  : "w-1.5 h-1.5 bg-border-light hover:bg-text-light"
              )}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
