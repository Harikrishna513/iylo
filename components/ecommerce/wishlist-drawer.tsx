"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useProductFly } from "@/hooks/use-product-fly";

export function WishlistDrawer() {
  const { isOpen, closeWishlist, items, removeItem } = useWishlistStore();
  const { flyAddToCart } = useProductFly();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-ivory/10 bg-black"
          >
            <div className="flex items-center justify-between border-b border-ivory/10 p-6">
              <h2 className="editorial-heading flex items-center gap-2 text-2xl text-ivory">
                <Heart className="h-5 w-5 text-gold" />
                Wishlist
              </h2>
              <button onClick={closeWishlist} aria-label="Close wishlist">
                <X className="h-5 w-5 text-ivory/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Heart className="mb-4 h-12 w-12 text-ivory/20" />
                  <p className="text-ivory/50">Your wishlist is empty</p>
                  <p className="mt-2 text-xs text-muted">Save items you love — they&apos;ll sync when you sign in</p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((product) => (
                    <li key={product.id} className="flex gap-4">
                      <Link
                        href={`/products/${product.id}`}
                        onClick={closeWishlist}
                        data-fly-source
                        className="relative h-20 w-20 shrink-0 overflow-hidden"
                      >
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
                      </Link>
                      <div className="flex-1">
                        <Link href={`/products/${product.id}`} onClick={closeWishlist}>
                          <h3 className="text-sm text-ivory hover:text-gold">{product.name}</h3>
                        </Link>
                        <p className="mt-1 text-sm text-gold">{formatPrice(product.price)}</p>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="gold"
                            onClick={(e) => {
                              flyAddToCart(product, {
                                event: e,
                                openDrawer: true,
                              });
                              removeItem(product.id);
                            }}
                          >
                            <ShoppingBag className="h-3 w-3" />
                            Add to Cart
                          </Button>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-xs text-muted hover:text-ivory"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
