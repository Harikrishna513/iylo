"use client";

import { retailProducts } from "@/data/products";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/animations/reveal";
import { Truck } from "lucide-react";

export function RetailSection() {
  return (
    <section id="retail" className="section-padding bg-cream/5">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Ships Nationwide</p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">Retail Products</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/50">
            Shelf-stable artisan products delivered PAN India within 2–4 business days.
          </p>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 border border-gold/30 px-4 py-2 text-xs uppercase tracking-widest text-gold">
            <Truck className="h-4 w-4" />
            PAN India Shipping · ₹149 flat rate
          </div>
        </Reveal>
        <div id="category-retail" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-48">
          {retailProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
