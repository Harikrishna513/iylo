import { create } from "zustand";
import { searchProducts, popularSearches } from "@/data/products";

interface SearchStore {
  isOpen: boolean;
  query: string;
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
  getResults: () => ReturnType<typeof searchProducts>;
  getPopularSearches: () => string[];
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  isOpen: false,
  query: "",

  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, query: "" }),
  setQuery: (query) => set({ query }),

  getResults: () => searchProducts(get().query),
  getPopularSearches: () => popularSearches,
}));
