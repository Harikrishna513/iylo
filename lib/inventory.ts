import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export interface CartLineInput {
  variant_id: string;
  quantity: number;
}

export async function validateCartStock(
  supabase: SupabaseClient,
  items: CartLineInput[]
): Promise<{ ok: boolean; error?: string }> {
  for (const item of items) {
    const { data: variant } = await supabase
      .from("product_variants")
      .select("id, name, stock_quantity, is_active, products(name)")
      .eq("id", item.variant_id)
      .maybeSingle();

    if (!variant || !variant.is_active) {
      return { ok: false, error: "A product in your cart is no longer available" };
    }

    if (variant.stock_quantity < item.quantity) {
      const productName =
        (variant.products as unknown as { name?: string } | null)?.name ?? "Item";
      return {
        ok: false,
        error: `${productName} (${variant.name}) — only ${variant.stock_quantity} left`,
      };
    }
  }
  return { ok: true };
}

export async function deductOrderInventory(
  supabase: SupabaseClient,
  orderId: string
): Promise<{ ok: boolean; skipped?: boolean }> {
  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_variant_id, quantity")
    .eq("order_id", orderId);

  if (!items?.length) return { ok: true };

  for (const item of items) {
    if (!item.product_variant_id) continue;

    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", item.product_variant_id)
      .single();

    if (!variant) continue;

    const newQty = Math.max(0, variant.stock_quantity - item.quantity);

    await supabase
      .from("product_variants")
      .update({ stock_quantity: newQty })
      .eq("id", item.product_variant_id);

    await supabase.from("inventory_logs").insert({
      product_variant_id: item.product_variant_id,
      change_type: "sale",
      quantity_change: -item.quantity,
      quantity_after: newQty,
      reference_type: "order",
      reference_id: orderId,
    });
  }

  return { ok: true };
}

export async function restoreOrderInventory(
  supabase: SupabaseClient,
  orderId: string
): Promise<void> {
  const { data: items } = await supabase
    .from("order_items")
    .select("product_variant_id, quantity")
    .eq("order_id", orderId);

  if (!items?.length) return;

  for (const item of items) {
    if (!item.product_variant_id) continue;

    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", item.product_variant_id)
      .single();

    if (!variant) continue;

    const newQty = variant.stock_quantity + item.quantity;

    await supabase
      .from("product_variants")
      .update({ stock_quantity: newQty })
      .eq("id", item.product_variant_id);

    await supabase.from("inventory_logs").insert({
      product_variant_id: item.product_variant_id,
      change_type: "return",
      quantity_change: item.quantity,
      quantity_after: newQty,
      reference_type: "order",
      reference_id: orderId,
    });
  }
}
