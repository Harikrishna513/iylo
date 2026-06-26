import Link from "next/link";
import { products, workshops, announcements, contactInfo } from "@/data/products";

export const metadata = {
  title: "Admin Dashboard | IYLO Bake House",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const todayOrders = 12;
  const upcomingPickups = 5;
  const upcomingDeliveries = 18;

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="editorial-heading text-4xl text-ivory">Dashboard</h1>
            <p className="mt-2 text-sm text-muted">IYLO Bakehouse · Jayanagar, Bangalore</p>
          </div>
          <Link href="/" className="text-xs uppercase tracking-widest text-gold hover:underline">
            ← Back to Site
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Today's Orders", value: todayOrders, color: "text-gold" },
            { label: "Upcoming Pickups", value: upcomingPickups, color: "text-ivory" },
            { label: "Upcoming Deliveries", value: upcomingDeliveries, color: "text-ivory" },
            { label: "Low Stock Items", value: 3, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="border border-ivory/10 p-6">
              <p className="text-xs uppercase tracking-widest text-muted">{stat.label}</p>
              <p className={`editorial-heading mt-2 text-4xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="border border-ivory/10 p-6">
            <h2 className="editorial-heading mb-6 text-2xl text-ivory">Inventory</h2>
            <ul className="space-y-3">
              {products.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ivory/80">{p.name}</span>
                  <span className={p.isAvailableToday ? "text-gold" : "text-muted"}>
                    {p.isAvailableToday ? "In Stock" : "Pre-Order"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-ivory/10 p-6">
            <h2 className="editorial-heading mb-6 text-2xl text-ivory">Announcements</h2>
            <ul className="space-y-4">
              {announcements.map((a) => (
                <li key={a.id} className="border-b border-ivory/10 pb-4">
                  <p className="text-sm text-ivory">{a.title}</p>
                  <p className="mt-1 text-xs text-muted">{a.tag} · {a.date}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-ivory/10 p-6">
            <h2 className="editorial-heading mb-6 text-2xl text-ivory">Upcoming Workshops</h2>
            <ul className="space-y-4">
              {workshops.map((w) => (
                <li key={w.id} className="flex justify-between text-sm">
                  <div>
                    <p className="text-ivory">{w.title}</p>
                    <p className="text-xs text-muted">{w.date}</p>
                  </div>
                  <span className="text-gold">{w.capacity - w.spots} spots left</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-ivory/10 p-6">
            <h2 className="editorial-heading mb-6 text-2xl text-ivory">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Coupons",
                "Gallery",
                "Videos",
                "Banners",
                "Corporate Enquiries",
                "Gift Enquiries",
                "Retail Shipping",
                "Google Reviews",
              ].map((action) => (
                <button
                  key={action}
                  className="border border-ivory/20 px-4 py-3 text-xs uppercase tracking-widest text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {action}
                </button>
              ))}
            </div>
          </section>
        </div>

        <p className="mt-12 text-center text-xs text-muted">
          Admin dashboard prototype · Connect Supabase for live data
        </p>
      </div>
    </div>
  );
}
