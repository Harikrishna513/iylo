"use client";

import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileBottomNav() {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-ivory/10 bg-black/95 backdrop-blur-xl p-4 lg:hidden"
        >
          <button
            onClick={openCart}
            className="flex w-full items-center justify-between bg-gold px-6 py-4 text-black"
          >
            <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
              <ShoppingBag className="h-4 w-4" />
              View Cart ({count})
            </span>
            <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
