import { NextRequest, NextResponse } from "next/server";
import { getRazorpay, getRazorpayPublicKey } from "@/lib/razorpay";
import { createServiceClient } from "@/lib/supabase";
import { sendOrderEmails } from "@/lib/email";
import { validateCartStock, deductOrderInventory } from "@/lib/inventory";
import { GIFT_WRAP_FEE } from "@/lib/config";

interface CheckoutItem {
  variant_id: string;
  quantity: number;
  gift_wrap?: boolean;
}

interface CheckoutBody {
  items: CheckoutItem[];
  payment_method: "razorpay" | "cod";
  fulfillment_type: "delivery" | "pickup" | "pan_india_shipping";
  customer: {
    name: string;
    email: string;
    phone: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  user_id?: string | null;
  delivery_fee?: number;
  discount_amount?: number;
  coupon_code?: string | null;
  scheduled_date?: string | null;
  scheduled_slot_label?: string | null;
  customer_notes?: string | null;
  company_name?: string | null;
  gst_number?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const {
      items,
      payment_method,
      fulfillment_type,
      customer,
      user_id,
      delivery_fee = 0,
      discount_amount = 0,
      coupon_code,
      scheduled_date,
      scheduled_slot_label,
      customer_notes,
      company_name,
      gst_number,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json({ error: "Customer details required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const stockCheck = await validateCartStock(
      supabase,
      items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity }))
    );
    if (!stockCheck.ok) {
      return NextResponse.json({ error: stockCheck.error }, { status: 400 });
    }

    let subtotal = 0;
    let giftWrapFee = 0;
    const orderItems: Array<{
      product_variant_id: string;
      product_name: string;
      variant_name: string;
      sku: string;
      quantity: number;
      unit_price: number;
      line_total: number;
      gift_wrap: boolean;
    }> = [];

    for (const item of items) {
      const { data: variant } = await supabase
        .from("product_variants")
        .select("id, name, sku, price, offer_price, products(name)")
        .eq("id", item.variant_id)
        .single();

      if (!variant) {
        return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
      }

      const unitPrice = Number(variant.offer_price ?? variant.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      if (item.gift_wrap) giftWrapFee += GIFT_WRAP_FEE;

      orderItems.push({
        product_variant_id: variant.id,
        product_name: (variant.products as unknown as { name: string }).name,
        variant_name: variant.name,
        sku: variant.sku,
        quantity: item.quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
        gift_wrap: item.gift_wrap ?? false,
      });
    }

    const total = Math.max(
      0,
      subtotal - discount_amount + delivery_fee + giftWrapFee
    );

    const addressSnapshot =
      fulfillment_type === "pickup"
        ? null
        : {
            line1: customer.line1,
            line2: customer.line2,
            city: customer.city ?? "Bangalore",
            state: customer.state ?? "Karnataka",
            pincode: customer.pincode,
          };

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user_id ?? null,
        guest_name: customer.name,
        guest_email: customer.email,
        guest_phone: customer.phone,
        status: "pending",
        fulfillment_type,
        subtotal,
        discount_amount,
        delivery_fee,
        gift_wrap_fee: giftWrapFee,
        total_amount: total,
        coupon_code: coupon_code ?? null,
        scheduled_date: scheduled_date ?? null,
        scheduled_slot_label: scheduled_slot_label ?? null,
        address_snapshot: addressSnapshot,
        customer_notes: customer_notes ?? null,
        is_corporate: Boolean(company_name),
        company_name: company_name ?? null,
        gst_number: gst_number ?? null,
      })
      .select("id, order_number")
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: orderErr?.message ?? "Failed to create order" },
        { status: 500 }
      );
    }

    await supabase.from("order_items").insert(
      orderItems.map((i) => ({ ...i, order_id: order.id }))
    );

    if (payment_method === "cod") {
      await supabase.from("payment_transactions").insert({
        order_id: order.id,
        amount: total,
        payment_method: "cod",
        status: "completed",
        paid_at: new Date().toISOString(),
      });

      await supabase
        .from("orders")
        .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
        .eq("id", order.id);

      await deductOrderInventory(supabase, order.id);
      await sendOrderEmails(supabase, order.id);

      return NextResponse.json({
        success: true,
        order_id: order.id,
        order_number: order.order_number,
        payment_method: "cod",
      });
    }

    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: order.order_number,
      notes: { order_id: order.id },
    });

    await supabase
      .from("orders")
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", order.id);

    await supabase.from("payment_transactions").insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: total,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
      razorpay_order_id: razorpayOrder.id,
      amount: total,
      key: getRazorpayPublicKey(),
      customer: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
    });
  } catch (err) {
    console.error("checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
