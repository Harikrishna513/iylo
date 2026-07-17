"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Filter, Loader2, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminCategoryRow, AdminDashboardStats } from "@/lib/admin";
import {
  DASHBOARD_PRESETS,
  dateRangeForPreset,
  describeDateRange,
  isoToLocalDateInput,
  localDateToIsoEndExclusive,
  localDateToIsoStart,
  type DashboardPreset,
} from "@/lib/domain/dashboard-presets";
import {
  AdminStatCard,
  adminCardClass,
  adminTableWrapClass,
  adminThClass,
  adminTdClass,
} from "@/components/admin/admin-ui";

const ALL_CATEGORIES = "__all__";

interface FilterState {
  preset: DashboardPreset;
  customFrom: string;
  customTo: string;
  categorySlug: string;
}

const INITIAL_FILTERS: FilterState = {
  preset: "month",
  customFrom: "",
  customTo: "",
  categorySlug: ALL_CATEGORIES,
};

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.preset === "custom") {
      const from = localDateToIsoStart(filters.customFrom);
      const to = localDateToIsoEndExclusive(filters.customTo);
      if (from) params.set("dateFrom", from);
      if (to) params.set("dateTo", to);
    } else {
      const range = dateRangeForPreset(filters.preset);
      if (range.dateFrom) params.set("dateFrom", range.dateFrom);
      if (range.dateTo) params.set("dateTo", range.dateTo);
    }
    if (filters.categorySlug !== ALL_CATEGORIES) {
      params.set("categorySlug", filters.categorySlug);
    }
    return params;
  }, [filters]);

  const friendlyRange = useMemo(() => {
    if (filters.preset === "all") return "All time";
    if (filters.preset === "custom") {
      return describeDateRange({
        dateFrom: localDateToIsoStart(filters.customFrom),
        dateTo: localDateToIsoEndExclusive(filters.customTo),
      });
    }
    return describeDateRange(dateRangeForPreset(filters.preset));
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setRefreshing(true);
    (async () => {
      try {
        const res = await fetch(`/api/admin/dashboard?${queryParams}`);
        const data = await res.json();
        if (!cancelled) {
          setStats(data.stats ?? null);
          setCategories(data.categories ?? []);
        }
      } finally {
        if (!cancelled) {
          setRefreshing(false);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryParams]);

  const setPreset = useCallback((preset: DashboardPreset) => {
    setFilters((prev) => {
      if (preset === "custom") {
        const r = dateRangeForPreset(prev.preset);
        return {
          ...prev,
          preset,
          customFrom: isoToLocalDateInput(r.dateFrom),
          customTo: isoToLocalDateInput(
            r.dateTo
              ? new Date(new Date(r.dateTo).getTime() - 86_400_000).toISOString()
              : null
          ),
        };
      }
      return { ...prev, preset };
    });
  }, []);

  const hasNonDefault =
    filters.preset !== INITIAL_FILTERS.preset ||
    filters.categorySlug !== INITIAL_FILTERS.categorySlug ||
    !!filters.customFrom ||
    !!filters.customTo;

  return (
    <div>
      <div className="mb-2">
        <h1 className="editorial-heading text-3xl text-maroon md:text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-maroon/55">
          Showing data for {friendlyRange.toLowerCase()}.
        </p>
      </div>

      <div className={`${adminCardClass} mb-6 mt-6`}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-maroon/55 sm:inline">
              <Calendar className="mr-1 inline h-3.5 w-3.5 -mt-0.5" />
              Period
            </span>
            {DASHBOARD_PRESETS.map((p) => {
              const active = filters.preset === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPreset(p.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-maroon bg-maroon text-white shadow-sm"
                      : "border-maroon/20 bg-white text-maroon/65 hover:border-maroon/40"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {filters.preset === "custom" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-maroon/55">
                From
              </span>
              <input
                type="date"
                value={filters.customFrom}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, customFrom: e.target.value }))
                }
                className="rounded-full border border-maroon/20 bg-white px-3 py-1.5 text-xs text-maroon outline-none focus:border-light-blue"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-maroon/55">
                To
              </span>
              <input
                type="date"
                value={filters.customTo}
                min={filters.customFrom || undefined}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, customTo: e.target.value }))
                }
                className="rounded-full border border-maroon/20 bg-white px-3 py-1.5 text-xs text-maroon outline-none focus:border-light-blue"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-maroon/55 sm:inline">
              <Filter className="mr-1 inline h-3.5 w-3.5 -mt-0.5" />
              Category
            </span>
            <select
              value={filters.categorySlug}
              onChange={(e) =>
                setFilters((f) => ({ ...f, categorySlug: e.target.value }))
              }
              className="min-w-[180px] rounded-full border border-maroon/20 bg-white px-3 py-1.5 text-xs font-medium text-maroon outline-none focus:border-light-blue"
            >
              <option value={ALL_CATEGORIES}>All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {hasNonDefault && (
              <button
                type="button"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-maroon/45 hover:text-maroon"
              >
                <X className="h-3 w-3" /> Reset
              </button>
            )}
            {refreshing && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-maroon/40" aria-label="Refreshing" />
            )}
          </div>
        </div>
      </div>

      {loading || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[112px] animate-pulse rounded-lg border border-maroon/10 bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Revenue" value={formatPrice(stats.filteredRevenue)} accent />
          <AdminStatCard
            label="Orders"
            value={stats.filteredOrderCount}
            hint={`${stats.pendingOrders} pending`}
          />
          <AdminStatCard
            label="Avg Order Value"
            value={formatPrice(stats.filteredAvgOrderValue)}
            hint={friendlyRange}
          />
          <AdminStatCard label="Customers" value={stats.totalCustomers} />
          <AdminStatCard
            label="Delivered / Picked up"
            value={stats.deliveredOrders}
            hint={`${stats.cancelledOrders} cancelled`}
          />
          <AdminStatCard
            label="Active Products"
            value={stats.activeProducts}
            hint={`${stats.totalProducts} total · ${stats.inactiveProducts} hidden`}
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
      )}

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
                {(stats?.recentOrders ?? []).slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-maroon/5 last:border-0">
                    <td className={`${adminTdClass} font-medium`}>{o.order_number}</td>
                    <td className={`${adminTdClass} text-maroon/70`}>{o.guest_name ?? "—"}</td>
                    <td className={`${adminTdClass} text-light-blue`}>
                      {formatPrice(o.total_amount)}
                    </td>
                    <td className={`${adminTdClass} capitalize text-maroon/70`}>
                      {o.status.replace(/_/g, " ")}
                    </td>
                  </tr>
                ))}
                {!stats?.recentOrders.length && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm text-maroon/50">
                      No orders in this period
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
            Live stock from catalogue · {stats?.outOfStockCount ?? 0} out of stock ·{" "}
            {stats?.lowStockCount ?? 0} low (per variant threshold)
          </p>
          <ul className="space-y-3">
            {[...(stats?.outOfStockItems ?? []), ...(stats?.lowStockItems ?? [])]
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
            {!stats?.outOfStockItems.length && !stats?.lowStockItems.length && (
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
