"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Loader2, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/lib/admin";
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
  adminInputClass,
  adminSelectClass,
  adminTableWrapClass,
  adminThClass,
  adminTdClass,
} from "@/components/admin/admin-ui";

const STATUSES = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "picked_up",
  "cancelled",
];

interface PeriodState {
  preset: DashboardPreset;
  customFrom: string;
  customTo: string;
}

const INITIAL_PERIOD: PeriodState = {
  preset: "month",
  customFrom: "",
  customTo: "",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<PeriodState>(INITIAL_PERIOD);
  const [loading, setLoading] = useState(true);

  const dateParams = useMemo(() => {
    if (period.preset === "custom") {
      return {
        dateFrom: localDateToIsoStart(period.customFrom),
        dateTo: localDateToIsoEndExclusive(period.customTo),
      };
    }
    return dateRangeForPreset(period.preset);
  }, [period]);

  const friendlyRange = useMemo(() => {
    if (period.preset === "all") return "All time";
    if (period.preset === "custom") {
      return describeDateRange({
        dateFrom: dateParams.dateFrom,
        dateTo: dateParams.dateTo,
      });
    }
    return describeDateRange(dateRangeForPreset(period.preset));
  }, [period, dateParams]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status });
    if (search.trim()) params.set("search", search.trim());
    if (dateParams.dateFrom) params.set("dateFrom", dateParams.dateFrom);
    if (dateParams.dateTo) params.set("dateTo", dateParams.dateTo);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [status, search, dateParams]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const setPreset = (preset: DashboardPreset) => {
    setPeriod((prev) => {
      if (preset === "custom") {
        const r = dateRangeForPreset(prev.preset);
        return {
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
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch("/api/admin/orders/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, status: newStatus }),
    });
    loadOrders();
  };

  const pending = orders.filter((o) => o.status === "pending").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const delivered = orders.filter(
    (o) => o.status === "delivered" || o.status === "picked_up"
  ).length;

  return (
    <div>
      <h1 className="editorial-heading mb-1 text-3xl text-maroon md:text-4xl">Orders</h1>
      <p className="mb-6 text-sm text-maroon/55">
        {orders.length} orders · {friendlyRange}
      </p>

      <div className={`${adminCardClass} mb-6`}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-maroon/55 sm:inline">
              <Calendar className="mr-1 inline h-3.5 w-3.5 -mt-0.5" />
              Period
            </span>
            {DASHBOARD_PRESETS.map((p) => {
              const active = period.preset === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPreset(p.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-maroon bg-maroon text-white"
                      : "border-maroon/20 bg-white text-maroon/65 hover:border-maroon/40"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
            {period.preset !== INITIAL_PERIOD.preset && (
              <button
                type="button"
                onClick={() => setPeriod(INITIAL_PERIOD)}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-maroon/45"
              >
                <X className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {period.preset === "custom" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-maroon/55">
                From
              </span>
              <input
                type="date"
                value={period.customFrom}
                onChange={(e) =>
                  setPeriod((p) => ({ ...p, customFrom: e.target.value }))
                }
                className="rounded-full border border-maroon/20 bg-white px-3 py-1.5 text-xs text-maroon"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-maroon/55">
                To
              </span>
              <input
                type="date"
                value={period.customTo}
                min={period.customFrom || undefined}
                onChange={(e) =>
                  setPeriod((p) => ({ ...p, customTo: e.target.value }))
                }
                className="rounded-full border border-maroon/20 bg-white px-3 py-1.5 text-xs text-maroon"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={adminSelectClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <input
              type="search"
              placeholder="Search by name, email, or order ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadOrders()}
              className={`${adminInputClass} max-w-xs`}
            />
            <button
              type="button"
              onClick={loadOrders}
              className="bg-maroon px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-rosewood"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <AdminStatCard label="Shown" value={orders.length} />
        <AdminStatCard label="Pending" value={pending} />
        <AdminStatCard label="Confirmed" value={confirmed} />
        <AdminStatCard label="Delivered" value={delivered} accent />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-maroon/40" />
        </div>
      ) : (
        <div className={adminTableWrapClass}>
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-maroon/10">
                <th className={adminThClass}>Order</th>
                <th className={adminThClass}>Customer</th>
                <th className={adminThClass}>Date</th>
                <th className={adminThClass}>Total</th>
                <th className={adminThClass}>Status</th>
                <th className={adminThClass}>Payment</th>
                <th className={adminThClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-maroon/5 last:border-0">
                  <td className={`${adminTdClass} font-medium`}>{o.order_number}</td>
                  <td className={`${adminTdClass} text-maroon/70`}>
                    {o.guest_name ?? "—"}
                    <br />
                    <span className="text-xs text-maroon/45">{o.guest_email}</span>
                  </td>
                  <td className={`${adminTdClass} text-xs text-maroon/55`}>
                    {new Date(o.placed_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className={`${adminTdClass} text-light-blue`}>
                    {formatPrice(o.total_amount)}
                  </td>
                  <td className={`${adminTdClass} capitalize text-maroon/70`}>
                    {o.status.replace(/_/g, " ")}
                  </td>
                  <td className={`${adminTdClass} text-maroon/70`}>{o.payment_status}</td>
                  <td className={adminTdClass}>
                    <select
                      defaultValue={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`${adminSelectClass} py-1.5 text-xs`}
                    >
                      {STATUSES.filter((s) => s !== "all").map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && (
            <p className="p-8 text-center text-sm text-maroon/50">No orders found</p>
          )}
        </div>
      )}
    </div>
  );
}
