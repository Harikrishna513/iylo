import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { AdminStatCard, adminCardClass, adminTableWrapClass, adminThClass, adminTdClass } from "@/components/admin/admin-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | IYLO Bakehouse",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="editorial-heading text-3xl text-maroon md:text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-maroon/55">IYLO Bakehouse · Jayanagar, Bangalore</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Month Revenue" value={formatPrice(stats.monthRevenue)} accent />
        <AdminStatCard
          label="Orders Placed"
          value={stats.recentOrders.length}
          hint={`${stats.pendingOrders} pending`}
        />
        <AdminStatCard
          label="Avg Order Value"
          value={formatPrice(stats.avgOrderValue)}
          hint="Recent orders"
        />
        <AdminStatCard label="Customers" value={stats.totalCustomers} />
        <AdminStatCard
          label="Active Products"
          value={stats.activeProducts}
          hint={`${stats.totalProducts} total in catalogue`}
        />
        <AdminStatCard
          label="Hidden"
          value={stats.inactiveProducts}
          hint="Not visible on store"
        />
        <AdminStatCard
          label="Out of Stock"
          value={stats.outOfStockCount}
          hint="Variants at 0 pcs"
        />
        <AdminStatCard
          label="Low Stock"
          value={stats.lowStockCount}
          hint="Below 5 pcs per variant"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className={adminCardClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="editorial-heading text-xl text-maroon">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-light-blue hover:underline">
              View all
            </Link>
          </div>
          <div className={adminTableWrapClass}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-maroon/10">
                  <th className={adminThClass}>Order</th>
                  <th className={adminThClass}>Customer</th>
                  <th className={adminThClass}>Amount</th>
                  <th className={adminThClass}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-maroon/5 last:border-0">
                    <td className={`${adminTdClass} font-medium`}>{o.order_number}</td>
                    <td className={`${adminTdClass} text-maroon/70`}>
                      {o.guest_name ?? "—"}
                    </td>
                    <td className={`${adminTdClass} text-light-blue`}>
                      {formatPrice(o.total_amount)}
                    </td>
                    <td className={`${adminTdClass} capitalize text-maroon/70`}>
                      {o.status.replace(/_/g, " ")}
                    </td>
                  </tr>
                ))}
                {!stats.recentOrders.length && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm text-maroon/50">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={adminCardClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="editorial-heading text-xl text-maroon">Inventory Alerts</h2>
            <Link href="/admin/products" className="text-xs text-light-blue hover:underline">
              Manage
            </Link>
          </div>
          <p className="mb-4 text-xs text-maroon/50">
            {stats.outOfStockCount} out of stock · {stats.lowStockCount} low (&lt; 5 pcs)
          </p>
          <ul className="space-y-3">
            {[...stats.outOfStockItems, ...stats.lowStockItems]
              .slice(0, 8)
              .map((item, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-maroon/80">
                    {item.name}
                    <span className="text-maroon/45"> · {item.variant}</span>
                  </span>
                  <span
                    className={
                      item.stock === 0
                        ? "text-xs font-semibold uppercase text-rosewood"
                        : "text-xs text-maroon/55"
                    }
                  >
                    {item.stock} pcs
                  </span>
                </li>
              ))}
            {!stats.outOfStockItems.length && !stats.lowStockItems.length && (
              <li className="text-sm text-maroon/50">All items well stocked</li>
            )}
          </ul>
        </section>
      </div>

      <section className={`${adminCardClass} mt-6`}>
        <h2 className="editorial-heading mb-4 text-xl text-maroon">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/orders", label: "Manage Orders", desc: "Track and update orders" },
            { href: "/admin/products", label: "Manage Products", desc: "Edit catalogue & CSV import" },
            { href: "/admin/customers", label: "View Customers", desc: "Registered shoppers" },
            { href: "/admin/inquiries", label: "Enquiries", desc: "Corporate & custom requests" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-maroon/10 bg-mist-blue/40 p-4 transition-colors hover:bg-mist-blue"
            >
              <p className="font-medium text-maroon">{item.label}</p>
              <p className="mt-1 text-xs text-maroon/55">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
