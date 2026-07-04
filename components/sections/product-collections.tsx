"use client";

import { todaysSpecials, getProductsByCategory, products } from "@/data/products";
import {
  NAV_CATEGORY_ORDER,
  CATEGORY_SECTION_LABELS,
  type NavCategoryId,
} from "@/data/nav-categories";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/animations/reveal";

export function TodaysSpecials() {
  const specials = todaysSpecials;

  return (
    <section id="specials" className="section-padding bg-cream/5">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Fresh from the Oven</p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">Today&apos;s Specials</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/50">
            Baked fresh in our Jayanagar kitchen. Limited portions — order before they&apos;re gone.
          </p>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {specials.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function RegularCollection() {
  return (
    <section id="menu" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Our Collection</p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">Regular Collection</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/50">
            Each creation is handcrafted in small batches using the finest ingredients sourced from trusted artisans across Karnataka.
          </p>
        </Reveal>

        {NAV_CATEGORY_ORDER.map((cat) => {
          const catProducts = getProductsByCategory(cat);
          if (catProducts.length === 0) return null;
          return (
            <div
              key={cat}
              id={`category-${cat}`}
              role="tabpanel"
              aria-labelledby={`category-tab-${cat}`}
              className="mb-20 scroll-mt-52"
            >
              <h3 className="editorial-heading mb-8 text-3xl text-ivory">
                {CATEGORY_SECTION_LABELS[cat as NavCategoryId]}
              </h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {catProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SeasonalCollection() {
  const seasonal = products.filter((p) => p.badge === "Seasonal" || p.isLimited);

  return (
    <section id="seasonal" className="section-padding bg-brown/10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Seasonal</p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">Seasonal Collection</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/50">
            Inspired by Bangalore&apos;s monsoons, festivals, and the rhythm of the seasons.
          </p>
        </Reveal>
        <div id="category-seasonal" className="grid scroll-mt-52 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {seasonal.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} variant={i === 0 ? "featured" : "default"} />
          ))}
        </div>
      </div>
    </section>
  );
}
