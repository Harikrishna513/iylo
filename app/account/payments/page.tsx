"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { CreditCard, ChevronRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { paymentStatusBadgeClasses } from "@/lib/domain";
import { LIGHT } from "@/lib/page-theme";

interface PaymentRow {
  id: string;
  placed_at: string;
  total_amount: number;
  order_number: string;
  payment_status: string;
  payment_method: string;
  razorpay_payment_id: string | null;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;

    const { data: orders } = await supabase
      .from("orders")
      .select("id, order_number, placed_at, total_amount, guest_email")
      .or(`user_id.eq.${user.id},guest_email.eq.${user.email}`)
      .order("placed_at", { ascending: false });

    const rows: PaymentRow[] = [];

    for (const order of orders ?? []) {
      const { data: txn } = await supabase
        .from("payment_transactions")
        .select("status, payment_method, razorpay_payment_id")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      rows.push({
        id: order.id,
        order_number: order.order_number,
        placed_at: order.placed_at,
        total_amount: Number(order.total_amount),
        payment_status: txn?.status ?? "pending",
        payment_method: txn?.payment_method ?? "—",
        razorpay_payment_id: txn?.razorpay_payment_id ?? null,
      });
    }

    setPayments(rows);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6">
        <h2 className={cn(LIGHT.title, "text-2xl")}>Payments</h2>
        <p className={cn("mt-1", LIGHT.subtitle)}>Your Razorpay and COD payment history.</p>
      </div>

      {loading ? (
        <p className={cn("py-10 text-center", LIGHT.muted)}>Loading…</p>
      ) : payments.length === 0 ? (
        <div className="py-12 text-center">
          <CreditCard size={48} className="mx-auto mb-3 text-maroon/15" />
          <p className={LIGHT.muted}>No payment history yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <Link
              key={p.id}
              href={`/account/orders/${p.id}`}
              className={cn(
                "block border p-5 transition-colors hover:border-light-blue/40 hover:bg-mist-blue/50",
                LIGHT.border
              )}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-[200px] flex-1">
                  <p className="text-lg text-light-blue">{formatPrice(p.total_amount)}</p>
                  <p className={cn("mt-0.5 text-xs", LIGHT.muted)}>
                    {new Date(p.placed_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" · "}
                    {p.order_number}
                  </p>
                  {p.razorpay_payment_id && (
                    <p className="mt-0.5 truncate font-mono text-[10px] text-maroon/40">
                      {p.razorpay_payment_id}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-mist-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-maroon/70">
                  {p.payment_method}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                    paymentStatusBadgeClasses(p.payment_status)
                  )}
                >
                  {p.payment_status}
                </span>
                <ChevronRight size={18} className="text-maroon/40" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
