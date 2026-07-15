"use client";

import type { Product } from "@/types";
import type { NavCategoryId } from "@/data/nav-categories";
import { ProductCard } from "@/components/cards/product-card";
import { MenuStickyNav } from "@/components/products/menu-sticky-nav";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";

export type MenuSection = {
  id: NavCategoryId;
  label: string;
  products: Product[];
};

export function AllProductsCatalogue({ sections }: { sections: MenuSection[] }) {
  const tabs = sections.map((s) => ({ id: s.id, label: s.label }));

  return (
    <div
      className="min-h-screen bg-cream"
      style={{ paddingTop: SITE_HEADER_OFFSET_PX }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-maroon/50">
          Full Catalogue
        </p>
        <h1 className="editorial-heading mt-3 text-4xl text-maroon md:text-5xl">
          Menu
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-maroon/55">
          All eggless artisan bakes in one place. Use the category bar to jump
          between collections.
        </p>
      </div>

      <MenuStickyNav categories={tabs} />

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
        {sections.map((section) => (
          <section
            key={section.id}
            id={`category-${section.id}`}
            role="tabpanel"
            aria-labelledby={`category-tab-${section.id}`}
            className="mb-16 scroll-mt-48 last:mb-0 sm:mb-20"
          >
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-maroon/10 pb-4">
              <h2 className="editorial-heading text-3xl text-maroon md:text-4xl">
                {section.label}
              </h2>
              <p className="shrink-0 text-xs uppercase tracking-wider text-maroon/45">
                {section.products.length}{" "}
                {section.products.length === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  theme="light"
                />
              ))}
            </div>
          </section>
        ))}

        {sections.length === 0 && (
          <p className="py-20 text-center text-sm text-maroon/50">
            Products will be listed here soon.
          </p>
        )}
      </div>
    </div>
  );
}
