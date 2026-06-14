"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "featured" | "compact";
}

export function ProductCard({
  product,
  index = 0,
  variant = "default",
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openQuickView = useCartStore((s) => s.openQuickView);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col",
        variant === "featured" && "md:col-span-2 md:row-span-2"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-brown/20",
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {product.badge && (
          <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-black">
            {product.badge}
          </span>
        )}

        {product.isPreOrder && (
          <span className="absolute right-4 top-4 glass px-3 py-1 text-[10px] uppercase tracking-widest text-ivory">
            Pre-Order
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex translate-y-4 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => addItem(product)}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => openQuickView(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
          {product.category.replace("-", " ")}
        </p>
        <h3 className="editorial-heading text-xl text-ivory transition-colors group-hover:text-gold md:text-2xl">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-ivory/60">{product.description}</p>
        <p className="text-lg font-light tracking-wide text-gold">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.article>
  );
}
