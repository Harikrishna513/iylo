"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/lib/admin";
import {
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams({ status });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [status]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch("/api/admin/orders/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, status: newStatus }),
    });
    loadOrders();
  };

  return (
    <div>
      <h1 className="editorial-heading mb-1 text-3xl text-maroon md:text-4xl">Orders</h1>
      <p className="mb-8 text-sm text-maroon/55">{orders.length} orders shown</p>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={adminSelectClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
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

      {loading ? (
        <p className="text-maroon/50">Loading…</p>
      ) : (
        <div className={adminTableWrapClass}>
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-maroon/10">
                <th className={adminThClass}>Order</th>
                <th className={adminThClass}>Customer</th>
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
