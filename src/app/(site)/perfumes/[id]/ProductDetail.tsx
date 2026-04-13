"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ChevronLeft, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, ProductVariant } from "@/types";
import {
  cn,
  formatPrice,
  CATEGORY_LABELS,
  CONCENTRATION_LABELS,
  SEASON_LABELS,
  GENDER_LABELS,
} from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useThemeStore } from "@/store/theme";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import toast from "react-hot-toast";

export default function ProductDetail({ product }: { product: Product }) {
  const images = product.images ?? [];
  const variants = (product.variants ?? []).filter((v) => v.is_active);
  const [selectedImage, setSelectedImage] = useState(
    images.find((i) => i.is_primary)?.url ?? images[0]?.url ?? null
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.find((v) => v.stock > 0) ?? null
  );
  const [qty, setQty] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { addItem } = useCartStore();
  const { setIsNichoProduct } = useThemeStore();

  const openLightbox = useCallback(() => {
    if (selectedImage) setLightboxOpen(true);
  }, [selectedImage]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // Close lightbox on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    if (lightboxOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  useEffect(() => {
    setIsNichoProduct(product.category === "nicho");
    return () => setIsNichoProduct(false);
  }, [product.category, setIsNichoProduct]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      type: "variant",
      name: product.name,
      brand: product.brand,
      size_ml: selectedVariant.size_ml,
      price: selectedVariant.price,
      image_url: selectedImage ?? undefined,
      stock: selectedVariant.stock,
      quantity: qty,
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  const isNicho = product.category === "nicho";

  return (
    <div className={cn("min-h-screen pt-24 pb-24", isNicho ? "bg-obsidian" : "bg-page-bg")}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-12">
          <Link
            href="/catalogo"
            className={cn(
              "flex items-center gap-1 font-sans text-xs transition-colors duration-200",
              isNicho
                ? "text-cream-dim hover:text-gold"
                : "text-text-mid hover:text-gold"
            )}
          >
            <ChevronLeft size={12} strokeWidth={2} />
            Catálogo
          </Link>
          <span className={cn("text-xs", isNicho ? "text-cream-dim/40" : "text-text-light/60")}>/</span>
          <Link
            href={`/catalogo?category=${product.category}`}
            className={cn(
              "font-sans text-xs transition-colors duration-200",
              isNicho ? "text-cream-dim hover:text-gold" : "text-text-mid hover:text-gold"
            )}
          >
            {CATEGORY_LABELS[product.category]}
          </Link>
          <span className={cn("text-xs", isNicho ? "text-cream-dim/40" : "text-text-light/60")}>/</span>
          <span className={cn(
            "font-sans text-xs font-medium truncate max-w-[180px] sm:max-w-none",
            isNicho ? "text-cream" : "text-text-dark"
          )}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* ——— Images ——— */}
          <div className="space-y-4">
            {/* Main image with hover zoom */}
            <div
              className={cn(
                "relative h-[420px] sm:h-[520px] lg:h-[600px] overflow-hidden group",
                selectedImage && "cursor-zoom-in"
              )}
              onClick={openLightbox}
            >
              {selectedImage ? (
                <>
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Zoom hint */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                      <ZoomIn size={16} className="text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className={cn(
                    "font-display text-[80px] italic",
                    isNicho ? "text-cream-dim/10" : "text-text-light/20"
                  )}>
                    {product.brand.charAt(0)}
                  </p>
                </div>
              )}
              {/* Category badge */}
              <div className="absolute top-5 left-5">
                <span className="font-sans text-[10px] tracking-widest uppercase text-gold border border-gold/30 bg-obsidian/70 backdrop-blur-sm px-3 py-1.5">
                  {CATEGORY_LABELS[product.category]}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={cn(
                      "relative w-20 h-24 flex-shrink-0 overflow-hidden transition-all duration-200",
                      selectedImage === img.url
                        ? "border border-gold/60"
                        : "border border-gold/10 opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ——— Lightbox ——— */}
          <AnimatePresence>
            {lightboxOpen && selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={closeLightbox}
              >
                {/* Close button */}
                <button
                  className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                  onClick={closeLightbox}
                >
                  <X size={20} strokeWidth={1.5} />
                </button>

                {/* Image container — stops propagation so clicking image doesn't close */}
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative max-w-3xl max-h-[90vh] w-full h-full"
                  onClick={(e) => e.stopPropagation()}
                  style={{ touchAction: "pinch-zoom" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                    style={{ touchAction: "pinch-zoom" }}
                  />
                </motion.div>

                {/* Thumbnail strip inside lightbox */}
                {images.length > 1 && (
                  <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(img.url)}
                        className={cn(
                          "relative w-12 h-14 overflow-hidden rounded transition-all duration-200 border",
                          selectedImage === img.url
                            ? "border-gold opacity-100"
                            : "border-white/20 opacity-50 hover:opacity-80"
                        )}
                      >
                        <Image src={img.url} alt="" fill className="object-cover" sizes="48px" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ——— Info ——— */}
          <div className="flex flex-col">
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-3">
              {product.brand}
            </p>
            <h1 className={cn(
              "font-display font-light text-[clamp(2.5rem,5vw,4.5rem)] leading-none mb-4",
              isNicho ? "text-cream" : "text-text-dark"
            )}>
              {product.name}
            </h1>
            <p className={cn(
              "font-sans text-xs tracking-wide mb-8",
              isNicho ? "text-cream-dim" : "text-text-light"
            )}>
              {CONCENTRATION_LABELS[product.concentration]} ·{" "}
              {GENDER_LABELS[product.gender]}
            </p>

            <GoldDivider className="mb-8" />

            {/* Description */}
            {product.description && (
              <p className={cn(
                "font-sans text-sm leading-relaxed mb-10 max-w-md",
                isNicho ? "text-cream-muted" : "text-text-mid"
              )}>
                {product.description}
              </p>
            )}

            {/* Seasons */}
            {product.seasons.length > 0 && (
              <div className="mb-8">
                <p className={cn(
                  "font-sans text-[10px] tracking-widest uppercase mb-3",
                  isNicho ? "text-cream-dim" : "text-text-light"
                )}>
                  Ideal para
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.seasons.map((s) => (
                    <span
                      key={s}
                      className={cn(
                        "font-sans text-xs px-3 py-1 tracking-wide border",
                        isNicho
                          ? "border-gold/20 text-gold/70"
                          : "border-border-light text-text-mid"
                      )}
                    >
                      {SEASON_LABELS[s]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variant selector */}
            <div className="mb-8">
              <p className={cn(
                "font-sans text-[10px] tracking-widest uppercase mb-4",
                isNicho ? "text-cream-dim" : "text-text-light"
              )}>
                Tamaño
              </p>
              <div className="flex flex-wrap gap-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                    className={cn(
                      "relative px-5 py-3 font-sans text-sm transition-all duration-200 border rounded-full",
                      isNicho
                        ? selectedVariant?.id === v.id
                          ? "border-gold bg-gold/10 text-gold"
                          : v.stock === 0
                          ? "border-gold/10 text-cream-dim/30 cursor-not-allowed"
                          : "border-gold/20 text-cream-muted hover:border-gold/50 hover:text-cream"
                        : selectedVariant?.id === v.id
                        ? "border-text-dark bg-text-dark text-white"
                        : v.stock === 0
                        ? "border-border-light text-text-light/40 cursor-not-allowed"
                        : "border-border-light text-text-mid hover:border-text-dark hover:text-text-dark"
                    )}
                  >
                    {v.size_ml}ml
                    {v.stock === 0 && (
                      <span className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className={cn(
                          "text-[8px] tracking-wider",
                          isNicho ? "text-cream-dim/40" : "text-text-light/50"
                        )}>SIN STOCK</span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & quantity */}
            {selectedVariant && (
              <>
                <div className="flex items-center gap-6 mb-8">
                  <p className="font-display text-3xl text-gold">
                    {formatPrice(selectedVariant.price)}
                  </p>
                  {/* Quantity */}
                  <div className={cn(
                    "flex items-center border",
                    isNicho ? "border-gold/20" : "border-border-light rounded-full overflow-hidden"
                  )}>
                    <button
                      className={cn(
                        "px-3 py-2 transition-colors",
                        isNicho
                          ? "text-cream-muted hover:text-cream"
                          : "text-text-mid hover:text-text-dark hover:bg-surface-2"
                      )}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span className={cn(
                      "px-4 py-2 font-sans text-sm min-w-[3rem] text-center",
                      isNicho ? "" : "text-text-dark"
                    )}>
                      {qty}
                    </span>
                    <button
                      className={cn(
                        "px-3 py-2 transition-colors",
                        isNicho
                          ? "text-cream-muted hover:text-cream"
                          : "text-text-mid hover:text-text-dark hover:bg-surface-2"
                      )}
                      onClick={() =>
                        setQty((q) => Math.min(selectedVariant.stock, q + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className={cn(
                    "font-sans text-xs",
                    isNicho ? "text-cream-dim" : "text-text-light"
                  )}>
                    {selectedVariant.stock} disponibles
                  </p>
                </div>

                {isNicho ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    className="w-full justify-center mb-4"
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Agregar al carrito
                  </Button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2.5 py-4 border border-text-dark text-text-dark rounded-full font-sans text-sm font-medium hover:bg-text-dark hover:text-white transition-colors duration-300 mb-4"
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Agregar al carrito
                  </button>
                )}
              </>
            )}

            {variants.length === 0 && (
              <p className={cn(
                "font-sans text-sm italic py-4",
                isNicho ? "text-cream-dim" : "text-text-light"
              )}>
                Sin stock disponible en este momento
              </p>
            )}

            <GoldDivider className="mt-8" />

            {/* Meta */}
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-sans">
              {[
                ["Categoría", CATEGORY_LABELS[product.category]],
                ["Concentración", CONCENTRATION_LABELS[product.concentration]],
                ["Género", GENDER_LABELS[product.gender]],
                ["Marca", product.brand],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className={cn(
                    "tracking-widest uppercase text-[10px] mb-1",
                    isNicho ? "text-cream-dim" : "text-text-light"
                  )}>{label}</dt>
                  <dd className={isNicho ? "text-cream-muted" : "text-text-mid"}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
