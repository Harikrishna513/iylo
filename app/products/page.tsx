import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase";
import { fetchProducts } from "@/lib/products-server";
import { groupProductsByMenuCategory } from "@/lib/menu-categories";
import { AllProductsCatalogue } from "@/components/products/all-products-catalogue";
import { BRAND_NAME } from "@/data/site-content";

export const metadata: Metadata = {
  title: `Menu | ${BRAND_NAME}`,
  description:
    "Browse the full IYLO Bakehouse menu — celebration cakes, viennoiserie, breads, tarts, cookies, and more. Eggless artisan bakes from Jayanagar, Bangalore.",
};

export default async function ProductsMenuPage() {
  const supabase = createServiceClient();
  const products = await fetchProducts(supabase);
  const sections = groupProductsByMenuCategory(products);

  return <AllProductsCatalogue sections={sections} />;
}
