import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getAllProducts } from "@/data/products";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductSchema } from "@/lib/seo";
import { createServiceClient } from "@/lib/supabase";
import { fetchProductBySlug } from "@/lib/products-server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServiceClient();
  const dbProduct = await fetchProductBySlug(supabase, id);
  const product = dbProduct ?? getProductById(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | IYLO Bake House`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.image],
    },
    alternates: {
      canonical: `https://iylobakehouse.com/products/${product.id}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceClient();
  const dbProduct = await fetchProductBySlug(supabase, id);
  const product = dbProduct ?? getProductById(id);
  if (!product) notFound();

  const schema = getProductSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
