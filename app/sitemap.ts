import type { MetadataRoute } from "next";
import { getAllProducts } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://iylobakehouse.com";
  const products = getAllProducts().map((p) => ({
    url: `${base}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...products,
  ];
}
