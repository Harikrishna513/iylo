"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { orderStatusBadgeClasses, paymentStatusBadgeClasses } from "@/lib/domain";

interface OrderRow {
  id: string;
  order_number: string;
  placed_at: string;
  status: string;
  fulfillment_type: string;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  gift_wrap_fee: number;
  total_amount: number;
  scheduled_date: string | null;
  scheduled_slot_label: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  address_snapshot: {
    full_name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  } | null;
}

interface OrderItem {
  id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("—");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .or(`user_id.eq.${user.id},guest_email.eq.${user.email}`)
      .maybeSingle();

    if (!orderData) {
      setLoading(false);
      return;
    }
    setOrder(orderData as OrderRow);

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("id, product_name, variant_name, quantity, unit_price, line_total")
      .eq("order_id", orderId);
    setItems((itemsData ?? []) as OrderItem[]);

    const { data: txn } = await supabase
      .from("payment_transactions")
      .select("status, payment_method")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setPaymentStatus(txn?.status ?? "pending");
    setPaymentMethod(txn?.payment_method ?? "—");
    setLoading(false);
  }, [user, orderId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-muted">Loading order…</p>;
  }

  if (!order) {
    return (
      <div>
        <p className="text-muted">Order not found.</p>
        <Link href="/account/orders" className="mt-4 inline-block text-sm text-gold hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const addr = order.address_snapshot;

  return (
    <div>
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-gold"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="editorial-heading text-2xl text-ivory">{order.order_number}</h2>
          <p className="mt-1 text-sm text-muted">
            Placed{" "}
            {new Date(order.placed_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
              orderStatusBadgeClasses(order.status)
            )}
          >
            {order.status.replace(/_/g, " ")}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
              paymentStatusBadgeClasses(paymentStatus)
            )}
          >
            {paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="border border-ivory/10 p-5">
          <h3 className="text-xs uppercase tracking-widest text-gold">Fulfillment</h3>
          <p className="mt-3 text-sm capitalize text-ivory/80">
            {order.fulfillment_type.replace(/_/g, " ")}
          </p>
          {order.scheduled_date && (
            <p className="mt-2 text-sm text-ivory/70">
              {new Date(order.scheduled_date).toLocaleDateString("en-IN")}
              {order.scheduled_slot_label && ` · ${order.scheduled_slot_label}`}
            </p>
          )}
        </section>

        <section className="border border-ivory/10 p-5">
          <h3 className="text-xs uppercase tracking-widest text-gold">Payment</h3>
          <p className="mt-3 text-sm text-ivory/80">{paymentMethod}</p>
          <p className="mt-1 text-lg text-gold">{formatPrice(Number(order.total_amount))}</p>
        </section>
      </div>

      {addr && (
        <section className="mt-6 border border-ivory/10 p-5">
          <h3 className="text-xs uppercase tracking-widest text-gold">Delivery Address</h3>
          <p className="mt-3 text-sm leading-relaxed text-ivory/70">
            {addr.full_name ?? order.guest_name}
            <br />
            {addr.line1}
            {addr.line2 && `, ${addr.line2}`}
            <br />
            {addr.city}, {addr.state} - {addr.pincode}
            <br />
            Phone: {addr.phone ?? order.guest_phone}
          </p>
        </section>
      )}

      <section className="mt-6 border border-ivory/10">
        <h3 className="border-b border-ivory/10 px-5 py-3 text-xs uppercase tracking-widest text-gold">
          Items
        </h3>
        <ul className="divide-y divide-ivory/10">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-ivory">{item.product_name}</p>
                {item.variant_name && (
                  <p className="text-xs text-muted">{item.variant_name}</p>
                )}
                <p className="text-xs text-muted">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm text-gold">{formatPrice(Number(item.line_total))}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-ivory/10 px-5 py-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-muted">
              <span>Discount</span>
              <span>-{formatPrice(Number(order.discount_amount))}</span>
            </div>
          )}
          {Number(order.delivery_fee) > 0 && (
            <div className="flex justify-between text-muted">
              <span>Delivery</span>
              <span>{formatPrice(Number(order.delivery_fee))}</span>
            </div>
          )}
          {Number(order.gift_wrap_fee) > 0 && (
            <div className="flex justify-between text-muted">
              <span>Gift wrap</span>
              <span>{formatPrice(Number(order.gift_wrap_fee))}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-ivory/10 pt-2 text-ivory">
            <span className="font-semibold">Total</span>
            <span className="text-gold">{formatPrice(Number(order.total_amount))}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
