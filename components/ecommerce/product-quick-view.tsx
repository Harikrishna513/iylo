"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function ProductQuickView() {
  const {
    selectedProduct,
    isQuickViewOpen,
    closeQuickView,
    addItem,
    openCart,
  } = useCartStore();

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct);
      closeQuickView();
      openCart();
    }
  };

  return (
    <Dialog open={isQuickViewOpen} onOpenChange={(open) => !open && closeQuickView()}>
      <DialogContent className="max-w-3xl border-ivory/10 bg-black p-0 overflow-hidden">
        {selectedProduct && (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square bg-brown/20">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {selectedProduct.badge && (
                <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] uppercase tracking-widest text-black">
                  {selectedProduct.badge}
                </span>
              )}
            </div>
            <div className="flex flex-col p-8">
              <DialogHeader>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                  {selectedProduct.category.replace("-", " ")}
                </p>
                <DialogTitle className="text-3xl">{selectedProduct.name}</DialogTitle>
              </DialogHeader>

              {selectedProduct.rating && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(selectedProduct.rating!)
                            ? "fill-gold text-gold"
                            : "text-ivory/20"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-ivory/50">
                    {selectedProduct.rating} ({selectedProduct.reviewCount} reviews)
                  </span>
                </div>
              )}

              <p className="mt-6 flex-1 text-sm leading-relaxed text-ivory/60">
                {selectedProduct.longDescription || selectedProduct.description}
              </p>

              <p className="mt-6 text-2xl text-gold">
                {formatPrice(selectedProduct.price)}
              </p>

              <Button variant="gold" className="mt-6 w-full" onClick={handleAddToCart}>
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </Button>
              <Link
                href={`/products/${selectedProduct.id}`}
                onClick={closeQuickView}
                className="mt-3 text-center text-xs uppercase tracking-widest text-ivory/50 transition-colors hover:text-gold"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
