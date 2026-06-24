import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  isOpen: boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      toggleItem: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        if (exists) get().removeItem(product.id);
        else get().addItem(product);
      },

      isInWishlist: (productId) =>
        get().items.some((i) => i.id === productId),

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
    }),
    { name: "iylo-wishlist" }
  )
);
