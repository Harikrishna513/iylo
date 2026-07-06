import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon" });
    }

    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return NextResponse.json({ valid: false, error: "Coupon not yet active" });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json({ valid: false, error: "Coupon expired" });
    }
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
    }
    if (subtotal < Number(coupon.min_order_amount ?? 0)) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order ₹${coupon.min_order_amount} required`,
      });
    }

    let discount = 0;
    if (coupon.discount_type === "percentage") {
      discount = (subtotal * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount) {
        discount = Math.min(discount, Number(coupon.max_discount));
      }
    } else {
      discount = Number(coupon.discount_value);
    }

    return NextResponse.json({
      valid: true,
      discount: Math.round(discount),
      code: coupon.code,
    });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
