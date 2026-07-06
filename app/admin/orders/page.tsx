"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/lib/admin";

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
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <h1 className="editorial-heading mb-8 text-4xl text-ivory">Orders</h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-ivory/20 bg-transparent px-4 py-2 text-sm text-ivory"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-black">
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Search orders…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadOrders()}
          className="border border-ivory/20 bg-transparent px-4 py-2 text-sm text-ivory"
        />
        <button
          type="button"
          onClick={loadOrders}
          className="border border-gold px-4 py-2 text-xs uppercase tracking-widest text-gold"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-ivory/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-muted">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ivory/5">
                  <td className="p-4 text-ivory">{o.order_number}</td>
                  <td className="p-4 text-ivory/80">
                    {o.guest_name ?? "—"}
                    <br />
                    <span className="text-xs text-muted">{o.guest_email}</span>
                  </td>
                  <td className="p-4 text-gold">{formatPrice(o.total_amount)}</td>
                  <td className="p-4 capitalize text-ivory/80">{o.status.replace(/_/g, " ")}</td>
                  <td className="p-4 text-ivory/80">{o.payment_status}</td>
                  <td className="p-4">
                    <select
                      defaultValue={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border border-ivory/20 bg-black px-2 py-1 text-xs text-ivory"
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
            <p className="p-8 text-center text-muted">No orders found</p>
          )}
        </div>
      )}
    </div>
  );
}
