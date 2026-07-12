import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/cards/product-card";
import {
  BROWSABLE_CATEGORY_CARDS,
  CATEGORY_CARD_LABELS,
  getCategoryCard,
  type CategoryCardId,
} from "@/data/category-cards";
import { createServiceClient } from "@/lib/supabase";
import { fetchProducts } from "@/lib/products-server";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BROWSABLE_CATEGORY_CARDS.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = CATEGORY_CARD_LABELS[slug as CategoryCardId];
  if (!label) return { title: "Category | IYLO Bakehouse" };
  return {
    title: `${label} | IYLO Bakehouse`,
    description: `Browse our ${label.toLowerCase()} — eggless artisan bakes from IYLO Bakehouse, Jayanagar.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const card = getCategoryCard(slug);

  if (!card || !card.productCategory) notFound();

  const label = card.label;
  const supabase = createServiceClient();
  const categoryProducts = await fetchProducts(supabase, {
    categorySlug: card.productCategory,
  });

  return (
    <div className="min-h-screen bg-cream pt-[128px]">
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <Link
          href="/#categories"
          className="mb-8 inline-flex text-xs uppercase tracking-[0.2em] text-brown/70 transition-colors hover:text-brown"
        >
          ← All categories
        </Link>

        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brown/70">
            Collection
          </p>
          <h1 className="editorial-heading mt-3 text-4xl text-black md:text-5xl">
            {label}
          </h1>
          {categoryProducts.length > 0 && (
            <p className="mt-3 text-sm text-black/55">
              {categoryProducts.length} items available
            </p>
          )}
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-black/45">
            Products for this category will be listed soon.
          </p>
        )}
      </div>
    </div>
  );
}
