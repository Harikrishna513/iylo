import { getAdminCustomers } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import {
  AdminStatCard,
  adminTableWrapClass,
  adminThClass,
  adminTdClass,
} from "@/components/admin/admin-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customers | IYLO Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h1 className="editorial-heading mb-8 text-3xl text-maroon md:text-4xl">Customers</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total" value={customers.length} />
        <AdminStatCard
          label="With Orders"
          value={customers.filter((c) => c.order_count > 0).length}
        />
        <AdminStatCard
          label="Lifetime Spend"
          value={formatPrice(customers.reduce((s, c) => s + c.total_spent, 0))}
          accent
        />
      </div>

      <div className={adminTableWrapClass}>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-maroon/10">
              <th className={adminThClass}>Name</th>
              <th className={adminThClass}>Email</th>
              <th className={adminThClass}>Phone</th>
              <th className={adminThClass}>Orders</th>
              <th className={adminThClass}>Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-maroon/5 last:border-0">
                <td className={`${adminTdClass} font-medium`}>{c.full_name ?? "—"}</td>
                <td className={`${adminTdClass} text-maroon/70`}>{c.email}</td>
                <td className={`${adminTdClass} text-maroon/70`}>{c.phone ?? "—"}</td>
                <td className={`${adminTdClass} text-maroon/70`}>{c.order_count}</td>
                <td className={`${adminTdClass} text-light-blue`}>
                  {formatPrice(c.total_spent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!customers.length && (
          <p className="p-8 text-center text-sm text-maroon/50">No customers yet</p>
        )}
      </div>
    </div>
  );
}
