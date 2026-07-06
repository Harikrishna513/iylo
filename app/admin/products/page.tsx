import { getAdminProducts } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Products | IYLO Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <h1 className="editorial-heading mb-8 text-4xl text-ivory">Products</h1>

      <div className="overflow-x-auto border border-ivory/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-muted">
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Variants</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ivory/5">
                <td className="p-4 text-ivory">{p.name}</td>
                <td className="p-4 text-ivory/80">{p.category_name}</td>
                <td className="p-4 text-gold">
                  {p.base_price ? formatPrice(p.base_price) : "Enquiry"}
                </td>
                <td className="p-4 text-ivory/80">{p.variant_count}</td>
                <td className="p-4 text-ivory/80">{p.stock_total}</td>
                <td className="p-4">
                  <span
                    className={
                      p.is_active ? "text-gold" : "text-muted"
                    }
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length && (
          <p className="p-8 text-center text-muted">
            No products in database. Run the seed script to import catalog.
          </p>
        )}
      </div>
    </div>
  );
}
