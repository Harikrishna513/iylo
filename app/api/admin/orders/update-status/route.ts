import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { sendOrderStatusEmail } from "@/lib/email";
import { restoreOrderInventory } from "@/lib/inventory";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { order_id, status, reason } = await req.json();
  if (!order_id || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (status === "cancelled") {
    await restoreOrderInventory(supabase, order_id);
  }

  const update: Record<string, unknown> = { status };
  if (status === "cancelled") {
    update.cancelled_at = new Date().toISOString();
    update.cancellation_reason = reason ?? null;
  }
  if (status === "delivered" || status === "picked_up") {
    update.delivered_at = new Date().toISOString();
  }

  const { error } = await supabase.from("orders").update(update).eq("id", order_id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendOrderStatusEmail(supabase, order_id, status);
  } catch {
    // non-fatal
  }

  return NextResponse.json({ success: true });
}
