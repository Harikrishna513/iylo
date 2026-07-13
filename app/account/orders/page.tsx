"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { cn, formatPrice } from "@/lib/utils";
import { orderStatusBadgeClasses } from "@/lib/domain";
import { LIGHT } from "@/lib/page-theme";

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  placed_at: string;
  fulfillment_type: string;
}

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, order_number, status, total_amount, placed_at, fulfillment_type")
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className={LIGHT.muted}>Loading orders…</p>;

  return (
    <div>
      <h2 className={cn(LIGHT.title, "mb-6 text-2xl")}>Order History</h2>
      {orders.length === 0 ? (
        <p className={LIGHT.muted}>No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/account/orders/${o.id}`}
                className={cn(
                  "flex items-center justify-between border p-4 transition-colors hover:border-light-blue/40 hover:bg-mist-blue/50",
                  LIGHT.border
                )}
              >
                <div>
                  <p className="font-medium text-maroon">{o.order_number}</p>
                  <p className={cn("text-xs", LIGHT.muted)}>
                    {new Date(o.placed_at).toLocaleDateString("en-IN")} ·{" "}
                    {o.fulfillment_type.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-light-blue">{formatPrice(o.total_amount)}</p>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        orderStatusBadgeClasses(o.status)
                      )}
                    >
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-maroon/40" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/" className="mt-8 inline-block text-sm text-light-blue hover:underline">
        Continue Shopping →
      </Link>
    </div>
  );
}
