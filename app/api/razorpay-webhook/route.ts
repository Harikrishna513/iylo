import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { finalizeRazorpayPayment } from "@/lib/payment-finalize";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const supabase = createServiceClient();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      await finalizeRazorpayPayment({
        supabase,
        razorpay_order_id: payment.order_id,
        razorpay_payment_id: payment.id,
        source: "webhook",
      });
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("razorpay_order_id", payment.order_id)
        .maybeSingle();

      if (order) {
        await supabase
          .from("payment_transactions")
          .update({ status: "failed", failure_reason: payment.error_description })
          .eq("order_id", order.id)
          .eq("razorpay_order_id", payment.order_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
