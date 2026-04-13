import { create } from "zustand";

interface ThemeState {
  isNichoProduct: boolean;
  setIsNichoProduct: (v: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isNichoProduct: false,
  setIsNichoProduct: (v) => set({ isNichoProduct: v }),
}));
