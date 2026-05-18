import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistState {
  products: Product[];
  toggle: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  isWishlisted: (id: string) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      products: [],

      toggle: (product) =>
        set((state) => {
          const exists = state.products.some((p) => p.id === product.id);
          return {
            products: exists
              ? state.products.filter((p) => p.id !== product.id)
              : [...state.products, product],
          };
        }),

      remove: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      clear: () => set({ products: [] }),

      isWishlisted: (id) => get().products.some((p) => p.id === id),

      count: () => get().products.length,
    }),
    {
      name: "gourmand-wishlist",
      partialize: (state) => ({ products: state.products }),
    }
  )
);
