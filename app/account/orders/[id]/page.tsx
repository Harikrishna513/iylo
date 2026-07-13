"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { orderStatusBadgeClasses, paymentStatusBadgeClasses } from "@/lib/domain";
import { LIGHT } from "@/lib/page-theme";

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
    return <p className={LIGHT.muted}>Loading order…</p>;
  }

  if (!order) {
    return (
      <div>
        <p className={LIGHT.muted}>Order not found.</p>
        <Link href="/account/orders" className="mt-4 inline-block text-sm text-light-blue hover:underline">
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
        className="mb-6 inline-flex items-center gap-2 text-sm text-maroon/50 hover:text-light-blue"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className={cn(LIGHT.title, "text-2xl")}>{order.order_number}</h2>
          <p className={cn("mt-1", LIGHT.subtitle)}>
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
        <section className={cn("border p-5", LIGHT.border)}>
          <h3 className="text-xs uppercase tracking-widest text-light-blue">Fulfillment</h3>
          <p className={cn("mt-3 capitalize", LIGHT.body)}>
            {order.fulfillment_type.replace(/_/g, " ")}
          </p>
          {order.scheduled_date && (
            <p className={cn("mt-2", LIGHT.body)}>
              {new Date(order.scheduled_date).toLocaleDateString("en-IN")}
              {order.scheduled_slot_label && ` · ${order.scheduled_slot_label}`}
            </p>
          )}
        </section>

        <section className={cn("border p-5", LIGHT.border)}>
          <h3 className="text-xs uppercase tracking-widest text-light-blue">Payment</h3>
          <p className={cn("mt-3", LIGHT.body)}>{paymentMethod}</p>
          <p className="mt-1 text-lg text-light-blue">{formatPrice(Number(order.total_amount))}</p>
        </section>
      </div>

      {addr && (
        <section className={cn("mt-6 border p-5", LIGHT.border)}>
          <h3 className="text-xs uppercase tracking-widest text-light-blue">Delivery Address</h3>
          <p className={cn("mt-3 leading-relaxed", LIGHT.body)}>
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

      <section className={cn("mt-6 border", LIGHT.border)}>
        <h3 className={cn("border-b px-5 py-3 text-xs uppercase tracking-widest text-light-blue", LIGHT.border)}>
          Items
        </h3>
        <ul className="divide-y divide-maroon/10">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-maroon">{item.product_name}</p>
                {item.variant_name && (
                  <p className={cn("text-xs", LIGHT.muted)}>{item.variant_name}</p>
                )}
                <p className={cn("text-xs", LIGHT.muted)}>Qty: {item.quantity}</p>
              </div>
              <p className="text-sm text-light-blue">{formatPrice(Number(item.line_total))}</p>
            </li>
          ))}
        </ul>
        <div className={cn("space-y-2 border-t px-5 py-4 text-sm", LIGHT.border)}>
          <div className={cn("flex justify-between", LIGHT.muted)}>
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className={cn("flex justify-between", LIGHT.muted)}>
              <span>Discount</span>
              <span>-{formatPrice(Number(order.discount_amount))}</span>
            </div>
          )}
          {Number(order.delivery_fee) > 0 && (
            <div className={cn("flex justify-between", LIGHT.muted)}>
              <span>Delivery</span>
              <span>{formatPrice(Number(order.delivery_fee))}</span>
            </div>
          )}
          {Number(order.gift_wrap_fee) > 0 && (
            <div className={cn("flex justify-between", LIGHT.muted)}>
              <span>Gift wrap</span>
              <span>{formatPrice(Number(order.gift_wrap_fee))}</span>
            </div>
          )}
          <div className={cn("flex justify-between border-t pt-2 text-maroon", LIGHT.border)}>
            <span className="font-semibold">Total</span>
            <span className="text-light-blue">{formatPrice(Number(order.total_amount))}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
