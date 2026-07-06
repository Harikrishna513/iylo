import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/data/products";
import { ProductCard } from "@/components/cards/product-card";
import {
  BROWSABLE_CATEGORY_CARDS,
  CATEGORY_CARD_LABELS,
  getCategoryCard,
  type CategoryCardId,
} from "@/data/category-cards";
import Image from "next/image";
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
  const categoryProducts = getProductsByCategory(card.productCategory);

  return (
    <div className="min-h-screen bg-cream pt-[128px]">
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <Link
          href="/#categories"
          className="mb-8 inline-flex text-xs uppercase tracking-[0.2em] text-brown/70 transition-colors hover:text-brown"
        >
          ← All categories
        </Link>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] lg:max-w-none">
            <Image
              src={card.image}
              alt={label}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-brown/70">
              Collection
            </p>
            <h1 className="editorial-heading mt-3 text-4xl text-black md:text-5xl lg:text-6xl">
              {label}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-black/55">
              Handcrafted eggless creations, baked fresh in our Jayanagar kitchen.
              {categoryProducts.length > 0
                ? ` ${categoryProducts.length} items available.`
                : " New items coming soon."}
            </p>
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-sm text-black/45">
            Products for this category will be listed soon.
          </p>
        )}
      </div>
    </div>
  );
}
