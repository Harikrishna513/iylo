import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Admin Dashboard | IYLO Bakehouse",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="mb-12">
        <h1 className="editorial-heading text-4xl text-ivory">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">IYLO Bakehouse · Jayanagar, Bangalore</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today's Orders", value: stats.todayOrders },
          { label: "Week Revenue", value: formatPrice(stats.weekRevenue) },
          { label: "Month Revenue", value: formatPrice(stats.monthRevenue) },
          { label: "Customers", value: stats.totalCustomers },
          { label: "Pending Orders", value: stats.pendingOrders },
          { label: "Low Stock", value: stats.lowStockCount },
        ].map((stat) => (
          <div key={stat.label} className="border border-ivory/10 p-6">
            <p className="text-xs uppercase tracking-widest text-muted">{stat.label}</p>
            <p className="editorial-heading mt-2 text-3xl text-gold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="border border-ivory/10 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="editorial-heading text-2xl text-ivory">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {stats.recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-ivory">{o.order_number}</span>
                  <span className="ml-2 text-muted">{o.guest_name ?? o.guest_email}</span>
                </div>
                <div className="text-right">
                  <span className="text-gold">{formatPrice(o.total_amount)}</span>
                  <span className="ml-2 text-xs text-muted">{o.status}</span>
                </div>
              </li>
            ))}
            {!stats.recentOrders.length && (
              <li className="text-sm text-muted">No orders yet</li>
            )}
          </ul>
        </section>

        <section className="border border-ivory/10 p-6">
          <h2 className="editorial-heading mb-6 text-2xl text-ivory">Low Stock</h2>
          <ul className="space-y-3">
            {stats.lowStockItems.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-ivory/80">
                  {item.name} ({item.variant})
                </span>
                <span className="text-red-400">{item.stock} left</span>
              </li>
            ))}
            {!stats.lowStockItems.length && (
              <li className="text-sm text-muted">All items well stocked</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
