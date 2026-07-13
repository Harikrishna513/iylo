"use client";

import { useCallback } from "react";
import type { Product } from "@/types";
import {
  getFlySourceRect,
  getFlyTargetRect,
  resolveFlySource,
  type FlyTarget,
} from "@/lib/fly-animation";
import { useFlyAnimationStore } from "@/store/fly-animation-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function useProductFly() {
  const spawn = useFlyAnimationStore((s) => s.spawn);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  const flyTo = useCallback(
    (
      target: FlyTarget,
      image: string,
      onComplete: () => void,
      source?: HTMLElement | null
    ) => {
      const to = getFlyTargetRect(target);
      if (!to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onComplete();
        return;
      }

      spawn({
        image,
        from: getFlySourceRect(source),
        to,
        target,
        onComplete,
      });
    },
    [spawn]
  );

  const flyAddToCart = useCallback(
    (
      product: Product,
      opts?: {
        quantity?: number;
        source?: HTMLElement | null;
        event?: React.MouseEvent;
        openDrawer?: boolean;
      }
    ) => {
      const source = resolveFlySource(opts?.source, opts?.event);
      flyTo(
        "cart",
        product.image,
        () => {
          addItem(product, opts?.quantity ?? 1);
          if (opts?.openDrawer !== false) openCart();
        },
        source
      );
    },
    [flyTo, addItem, openCart]
  );

  const flyToggleWishlist = useCallback(
    (
      product: Product,
      opts?: { source?: HTMLElement | null; event?: React.MouseEvent }
    ) => {
      if (isInWishlist(product.id)) {
        toggleWishlist(product);
        return;
      }

      const source = resolveFlySource(opts?.source, opts?.event);
      flyTo(
        "wishlist",
        product.image,
        () => {
          toggleWishlist(product);
        },
        source
      );
    },
    [flyTo, toggleWishlist, isInWishlist]
  );

  return { flyAddToCart, flyToggleWishlist };
}
