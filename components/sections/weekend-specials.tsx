"use client";

import { weekendSpecials } from "@/data/products";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/animations/reveal";

export function WeekendSpecials() {
  return (
    <section id="weekend-boxes" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Weekend Only</p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">Weekend Boxes</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/50">
            Pre-order by Friday 8 PM for Saturday pickup or Sunday delivery across Bangalore.
          </p>
        </Reveal>
        <div id="category-weekend-boxes" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-48">
          {weekendSpecials.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
