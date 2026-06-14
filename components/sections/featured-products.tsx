"use client";

import { products } from "@/data/products";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/animations/reveal";

export function FeaturedProducts() {
  const featured = products.slice(0, 8);

  return (
    <section id="menu" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Our Collection
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Featured Products
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/50">
            Each creation is handcrafted in small batches using the finest
            ingredients sourced from trusted artisans.
          </p>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense">
          {featured.map((product, i) => (
            <div key={product.id} id={i === 0 ? `category-${product.category}` : undefined}>
              <ProductCard product={product} index={i} variant={i === 0 ? "featured" : "default"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
