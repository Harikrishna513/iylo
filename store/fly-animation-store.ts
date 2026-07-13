import { create } from "zustand";
import type { FlyAnimationItem, FlyTarget } from "@/lib/fly-animation";

interface FlyAnimationStore {
  items: FlyAnimationItem[];
  pulseTarget: FlyTarget | null;
  spawn: (item: Omit<FlyAnimationItem, "id">) => void;
  remove: (id: string) => void;
  pulse: (target: FlyTarget) => void;
  clearPulse: () => void;
}

let flyId = 0;

export const useFlyAnimationStore = create<FlyAnimationStore>((set) => ({
  items: [],
  pulseTarget: null,

  spawn: (item) => {
    const id = `fly-${++flyId}`;
    set((state) => ({
      items: [...state.items, { ...item, id }],
    }));
  },

  remove: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  pulse: (target) => {
    set({ pulseTarget: target });
    window.setTimeout(() => {
      set((state) =>
        state.pulseTarget === target ? { pulseTarget: null } : state
      );
    }, 450);
  },

  clearPulse: () => set({ pulseTarget: null }),
}));
