"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { inferProductVariants } from "@/lib/product-variants";

interface RelatedProductCardProps {
  product: Product;
  index?: number;
}

function getPriceLabel(product: Product): { from: boolean; label: string } {
  const variants = product.variants ?? inferProductVariants(product);
  const prices = variants.map((v) => v.price).filter((p) => p > 0);

  if (prices.length > 1) {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min !== max) {
      return { from: true, label: formatPrice(min) };
    }
  }

  const price = prices[0] ?? product.price;
  return { from: false, label: formatPrice(price) };
}

export function RelatedProductCard({ product, index = 0 }: RelatedProductCardProps) {
  const { from, label } = getPriceLabel(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-maroon/5">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </div>
        <div className="mt-0 bg-mist-blue/50 px-4 py-4 transition-colors group-hover:bg-mist-blue">
          <h3 className="text-sm leading-snug text-maroon transition-colors group-hover:text-rosewood">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-light-blue">
            {from ? `From ${label}` : label}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
