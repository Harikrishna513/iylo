import { getAdminCustomers } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Customers | IYLO Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <h1 className="editorial-heading mb-8 text-4xl text-ivory">Customers</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-ivory/10 p-4">
          <p className="text-xs uppercase tracking-widest text-muted">Total</p>
          <p className="editorial-heading text-3xl text-gold">{customers.length}</p>
        </div>
        <div className="border border-ivory/10 p-4">
          <p className="text-xs uppercase tracking-widest text-muted">With Orders</p>
          <p className="editorial-heading text-3xl text-ivory">
            {customers.filter((c) => c.order_count > 0).length}
          </p>
        </div>
        <div className="border border-ivory/10 p-4">
          <p className="text-xs uppercase tracking-widest text-muted">Lifetime Spend</p>
          <p className="editorial-heading text-3xl text-ivory">
            {formatPrice(customers.reduce((s, c) => s + c.total_spent, 0))}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-ivory/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-muted">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-ivory/5">
                <td className="p-4 text-ivory">{c.full_name ?? "—"}</td>
                <td className="p-4 text-ivory/80">{c.email}</td>
                <td className="p-4 text-ivory/80">{c.phone ?? "—"}</td>
                <td className="p-4 text-ivory/80">{c.order_count}</td>
                <td className="p-4 text-gold">{formatPrice(c.total_spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!customers.length && (
          <p className="p-8 text-center text-muted">No customers yet</p>
        )}
      </div>
    </div>
  );
}
