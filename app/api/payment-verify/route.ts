import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { finalizeRazorpayPayment } from "@/lib/payment-finalize";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const result = await finalizeRazorpayPayment({
      supabase,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      source: "verify",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("order_number")
      .eq("id", result.order_id!)
      .single();

    return NextResponse.json({
      success: true,
      order_id: result.order_id,
      order_number: order?.order_number,
    });
  } catch (err) {
    console.error("payment-verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
