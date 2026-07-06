import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { deductOrderInventory } from "@/lib/inventory";
import { sendOrderEmails } from "@/lib/email";

export interface FinalizeOptions {
  supabase: SupabaseClient;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string | null;
  source: "verify" | "webhook" | "reconcile";
}

export interface FinalizeResult {
  ok: boolean;
  order_id?: string;
  already_paid?: boolean;
  emails_sent?: boolean;
  error?: string;
}

export async function finalizeRazorpayPayment(
  opts: FinalizeOptions
): Promise<FinalizeResult> {
  const { supabase, razorpay_order_id, razorpay_payment_id, source } = opts;

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, status, total_amount, guest_email, guest_name, order_number")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();

  if (orderErr) {
    return { ok: false, error: orderErr.message };
  }
  if (!order) {
    return { ok: false, error: "Order not found" };
  }

  const { data: existingTxn } = await supabase
    .from("payment_transactions")
    .select("id, status")
    .eq("razorpay_payment_id", razorpay_payment_id)
    .maybeSingle();

  const alreadyPaid = existingTxn?.status === "completed";

  if (!alreadyPaid) {
    const { error: txnErr } = await supabase.from("payment_transactions").insert({
      order_id: order.id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: opts.razorpay_signature ?? null,
      amount: order.total_amount,
      currency: "INR",
      payment_method: "upi",
      status: "completed",
      paid_at: new Date().toISOString(),
      gateway_response: { source },
    });

    if (txnErr && !txnErr.message.includes("duplicate")) {
      return { ok: false, error: txnErr.message };
    }

    if (order.status === "pending") {
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", order.id);
    }
  }

  await deductOrderInventory(supabase, order.id);

  if (!alreadyPaid) {
    try {
      await sendOrderEmails(supabase, order.id);
      return { ok: true, order_id: order.id, emails_sent: true };
    } catch {
      return { ok: true, order_id: order.id, emails_sent: false };
    }
  }

  return { ok: true, order_id: order.id, already_paid: true };
}
