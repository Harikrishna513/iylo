"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Loader2, Mail, Phone, Users as UsersIcon, IndianRupee } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminCustomer } from "@/lib/admin";
import {
  adminCardClass,
  adminInputClass,
  adminTableWrapClass,
  adminThClass,
  adminTdClass,
} from "@/components/admin/admin-ui";

export default function AdminCustomersPage() {
  const [rows, setRows] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setRows(data.customers ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.email.toLowerCase().includes(q) ||
        (r.full_name ?? "").toLowerCase().includes(q) ||
        (r.phone ?? "").includes(q)
    );
  }, [rows, search]);

  const totalSpent = filtered.reduce((s, r) => s + r.total_spent, 0);
  const activeCount = rows.filter((r) => r.is_active && r.order_count > 0).length;

  return (
    <div>
      <h1 className="editorial-heading text-3xl text-maroon md:text-4xl">Customers</h1>
      <p className="mt-1 mb-6 text-sm text-maroon/55">
        {rows.length} registered shopper{rows.length === 1 ? "" : "s"}
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          icon={UsersIcon}
          label="Customers"
          value={rows.length.toString()}
        />
        <Stat
          icon={IndianRupee}
          label="Total Lifetime Spend"
          value={formatPrice(totalSpent)}
          accent
        />
        <Stat
          icon={Mail}
          label="Active"
          value={activeCount.toString()}
          hint="With at least one order"
        />
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className={`${adminInputClass} pl-10`}
        />
      </div>

      <div className={adminTableWrapClass}>
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-maroon/10">
              <th className={adminThClass}>Customer</th>
              <th className={adminThClass}>Contact</th>
              <th className={adminThClass}>Orders</th>
              <th className={adminThClass}>Lifetime Spend</th>
              <th className={adminThClass}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-maroon/40" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm text-maroon/50">
                  {search ? "No matching customers" : "No customers yet"}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-maroon/5 last:border-0">
                  <td className={adminTdClass}>
                    <p className="font-semibold text-maroon">{c.full_name ?? "—"}</p>
                    <p className="font-mono text-xs text-maroon/45">{c.id.slice(0, 8)}…</p>
                  </td>
                  <td className={adminTdClass}>
                    <p className="flex items-center gap-1.5 text-sm text-maroon/80">
                      <Mail className="h-3.5 w-3.5 text-maroon/40" />
                      {c.email || "—"}
                    </p>
                    {c.phone && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-maroon/55">
                        <Phone className="h-3 w-3 text-maroon/40" />
                        {c.phone}
                      </p>
                    )}
                  </td>
                  <td className={`${adminTdClass} font-semibold`}>{c.order_count}</td>
                  <td className={`${adminTdClass} font-bold text-light-blue`}>
                    {formatPrice(c.total_spent)}
                  </td>
                  <td className={`${adminTdClass} text-xs text-maroon/55`}>
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={adminCardClass}>
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-mist-blue text-maroon">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-maroon/50">
        {label}
      </p>
      <p className={`editorial-heading mt-1 text-2xl ${accent ? "text-light-blue" : "text-maroon"}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-maroon/45">{hint}</p>}
    </div>
  );
}
