"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  ShoppingBag,
  Heart,
  Share2,
  Gift,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { Product } from "@/types";
import { getProductById } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/cards/product-card";
import { getNextAvailableSlot } from "@/lib/preorder";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const images = product.images ?? [product.image];
  const related = (product.relatedProductIds ?? [])
    .map((id) => getProductById(id))
    .filter(Boolean) as Product[];
  const boughtTogether = (product.frequentlyBoughtWith ?? [])
    .map((id) => getProductById(id))
    .filter(Boolean) as Product[];
  const [preorderMessage, setPreorderMessage] = useState<string | null>(null);

  useEffect(() => {
    if (product.isPreOrder) {
      setPreorderMessage(getNextAvailableSlot().message);
    }
  }, [product.isPreOrder]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    openCart();
  };

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 lg:px-10">
        <nav className="mb-8 flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ivory">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/#menu" className="hover:text-ivory capitalize">{product.category.replace("-", " ")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ivory/60">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden bg-brown/20">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badge && (
                <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] uppercase tracking-widest text-black">
                  {product.badge}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-20 overflow-hidden border-2 transition-colors",
                      selectedImage === i ? "border-gold" : "border-transparent"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6 flex items-center justify-center border border-dashed border-ivory/20 p-8 text-center text-xs text-muted">
              360° Preview — Coming Soon
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold capitalize">
              {product.category.replace("-", " ")}
            </p>
            <h1 className="editorial-heading mt-2 text-4xl text-ivory md:text-5xl">{product.name}</h1>

            {product.rating && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating!) ? "fill-gold text-gold" : "text-ivory/20"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-ivory/60">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            <p className="mt-6 text-2xl text-gold">{formatPrice(product.price)}</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">
              {product.longDescription ?? product.description}
            </p>

            {product.preparationTime && (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Clock className="h-4 w-4" />
                {product.preparationTime}
              </p>
            )}

            <div className="mt-4 space-y-2 text-sm">
              {product.isAvailableToday && (
                <p className="text-gold">Available for pickup and delivery today</p>
              )}
              {product.isPreOrder && preorderMessage && (
                <p className="text-ivory/60">{preorderMessage}</p>
              )}
              {product.shipsPanIndia && (
                <p className="text-ivory/60">Ships PAN India in 2–4 business days</p>
              )}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-ivory/20">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-12 w-12 items-center justify-center hover:text-gold" aria-label="Decrease">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex h-12 w-12 items-center justify-center hover:text-gold" aria-label="Increase">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button variant="gold" size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => toggleWishlist(product)}
                className="flex flex-1 items-center justify-center gap-2 border border-ivory/20 py-3 text-xs uppercase tracking-widest transition-colors hover:border-gold hover:text-gold"
              >
                <Heart className={cn("h-4 w-4", isInWishlist && "fill-gold text-gold")} />
                Wishlist
              </button>
              <button
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                className="flex flex-1 items-center justify-center gap-2 border border-ivory/20 py-3 text-xs uppercase tracking-widest transition-colors hover:border-gold hover:text-gold"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={() => setGiftWrap(!giftWrap)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 border py-3 text-xs uppercase tracking-widest transition-colors",
                  giftWrap ? "border-gold text-gold" : "border-ivory/20 hover:border-gold"
                )}
              >
                <Gift className="h-4 w-4" />
                Gift Wrap +₹99
              </button>
            </div>

            {product.ingredients && (
              <div className="mt-10 border-t border-ivory/10 pt-8">
                <h3 className="text-xs uppercase tracking-widest text-gold">Ingredients</h3>
                <p className="mt-3 text-sm text-ivory/60">{product.ingredients.join(", ")}</p>
              </div>
            )}
            {product.allergens && (
              <div className="mt-6">
                <h3 className="text-xs uppercase tracking-widest text-gold">Allergens</h3>
                <p className="mt-3 text-sm text-ivory/60">{product.allergens.join(", ")}</p>
              </div>
            )}
            {product.storageInstructions && (
              <div className="mt-6">
                <h3 className="text-xs uppercase tracking-widest text-gold">Storage</h3>
                <p className="mt-3 text-sm text-ivory/60">{product.storageInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {boughtTogether.length > 0 && (
          <section className="mt-24 border-t border-ivory/10 pt-16">
            <h2 className="editorial-heading mb-8 text-3xl text-ivory">Frequently Bought Together</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {boughtTogether.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-24 border-t border-ivory/10 pt-16">
            <h2 className="editorial-heading mb-8 text-3xl text-ivory">You May Also Like</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-ivory/10 bg-black/95 p-4 backdrop-blur-xl lg:hidden"
      >
        <div className="flex items-center gap-4">
          <p className="text-lg text-gold">{formatPrice(product.price * quantity)}</p>
          <Button variant="gold" className="flex-1" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
