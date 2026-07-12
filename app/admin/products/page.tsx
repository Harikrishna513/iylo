import { getAdminProducts } from "@/lib/admin";
import { AdminProductsClient } from "@/components/admin/admin-products-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | IYLO Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  return <AdminProductsClient initialProducts={products} />;
}
