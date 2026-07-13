"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart, Star, Clock, Minus, Plus } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useProductFly } from "@/hooks/use-product-fly";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "featured" | "compact";
  /** Use "light" on cream/ivory page backgrounds */
  theme?: "dark" | "light";
}

export function ProductCard({
  product,
  index = 0,
  variant = "default",
  theme = "dark",
}: ProductCardProps) {
  const isLight = theme === "light";
  const openQuickView = useCartStore((s) => s.openQuickView);
  const { flyAddToCart, flyToggleWishlist } = useProductFly();
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col",
        variant === "featured" && "md:col-span-2 md:row-span-2"
      )}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div
          data-fly-source
          className={cn(
            "relative overflow-hidden bg-brown/20 shadow-lg shadow-black/20 transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-black/30",
            variant === "featured" ? "aspect-[4/5]" : "aspect-[3/4]"
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.badge && (
              <span className="bg-gold px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-black">
                {product.badge}
              </span>
            )}
            {product.isNew && !product.badge && (
              <span className="bg-ivory px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-black">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                Best Seller
              </span>
            )}
          </div>

          <div className="absolute right-4 top-4 flex flex-col gap-2">
            {product.isAvailableToday && (
              <span className="glass px-3 py-1 text-[10px] uppercase tracking-widest text-ivory">
                Available Today
              </span>
            )}
            {product.isPreOrder && (
              <span className="border border-gold/50 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                Pre-Order
              </span>
            )}
            {product.shipsPanIndia && (
              <span className="bg-brown px-3 py-1 text-[10px] uppercase tracking-widest text-ivory">
                PAN India
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              flyToggleWishlist(product, { event: e });
            }}
            className="absolute right-4 bottom-20 flex h-9 w-9 items-center justify-center glass opacity-0 transition-all duration-300 group-hover:opacity-100"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isInWishlist ? "fill-gold text-gold" : "text-ivory"
              )}
            />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex translate-y-4 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                flyAddToCart(product, { event: e });
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                openQuickView(product);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      <div className="mt-5 space-y-2 px-1">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-[10px] uppercase tracking-[0.2em]",
              isLight ? "text-maroon/50" : "text-muted"
            )}
          >
            {product.category.replace("-", " ")}
          </p>
          {product.rating && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                isLight ? "text-maroon/50" : "text-ivory/60"
              )}
            >
              <Star className="h-3 w-3 fill-light-blue text-light-blue" />
              {product.rating}
              {product.reviewCount && (
                <span className={isLight ? "text-maroon/40" : "text-muted"}>
                  ({product.reviewCount})
                </span>
              )}
            </span>
          )}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3
            className={cn(
              "editorial-heading text-xl transition-colors md:text-2xl",
              isLight
                ? "text-maroon hover:text-rosewood"
                : "text-ivory hover:text-gold"
            )}
          >
            {product.name}
          </h3>
        </Link>
        <p
          className={cn(
            "line-clamp-2 text-sm",
            isLight ? "text-maroon/60" : "text-ivory/60"
          )}
        >
          {product.description}
        </p>
        {product.preparationTime && (
          <p
            className={cn(
              "flex items-center gap-1.5 text-xs",
              isLight ? "text-maroon/45" : "text-muted"
            )}
          >
            <Clock className="h-3 w-3" />
            {product.preparationTime}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <p
            className={cn(
              "text-lg font-light tracking-wide",
              isLight ? "text-light-blue" : "text-gold"
            )}
          >
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => flyAddToCart(product, { event: e })}
              className={cn(
                "flex h-8 w-8 items-center justify-center border transition-colors",
                isLight
                  ? "border-maroon/20 text-maroon/50 hover:border-light-blue hover:text-light-blue"
                  : "border-ivory/20 text-ivory/60 hover:border-gold hover:text-gold"
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span
              className={cn(
                "w-6 text-center text-sm",
                isLight ? "text-maroon" : "text-ivory"
              )}
            >
              1
            </span>
            <button
              onClick={(e) => flyAddToCart(product, { event: e })}
              className={cn(
                "flex h-8 w-8 items-center justify-center border transition-colors",
                isLight
                  ? "border-maroon/20 text-maroon/50 hover:border-light-blue hover:text-light-blue"
                  : "border-ivory/20 text-ivory/60 hover:border-gold hover:text-gold"
              )}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
