import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export interface CartLineInput {
  variant_id: string;
  quantity: number;
}

export interface InventoryResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
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

/**
 * Deduct stock for a paid/COD order. Idempotent — safe to call from
 * payment-verify, webhook, and COD checkout (same as CozyNest).
 */
export async function deductOrderInventory(
  supabase: SupabaseClient,
  orderId: string
): Promise<InventoryResult> {
  const { data, error } = await supabase.rpc("deduct_order_inventory", {
    p_order_id: orderId,
  });

  if (!error && data) {
    const result = data as { success?: boolean; skipped?: boolean; reason?: string };
    if (result.skipped) {
      return { ok: true, skipped: true, reason: result.reason };
    }
    return { ok: true };
  }

  if (error) {
    if (error.message.includes("INSUFFICIENT_STOCK")) {
      return { ok: false, error: "Insufficient stock at deduction" };
    }
    // Function not deployed yet — use TypeScript fallback with claim flags
    const missingFn =
      error.message.includes("Could not find the function") ||
      error.message.includes("deduct_order_inventory") ||
      error.code === "PGRST202";
    if (!missingFn) {
      return { ok: false, error: error.message };
    }
  }

  return deductOrderInventoryFallback(supabase, orderId);
}

async function deductOrderInventoryFallback(
  supabase: SupabaseClient,
  orderId: string
): Promise<InventoryResult> {
  const { data: order } = await supabase
    .from("orders")
    .select("id, inventory_deducted")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return { ok: false, error: "Order not found" };
  if (order.inventory_deducted) {
    return { ok: true, skipped: true, reason: "already_deducted" };
  }

  const { data: claimed } = await supabase
    .from("orders")
    .update({ inventory_deducted: true })
    .eq("id", orderId)
    .eq("inventory_deducted", false)
    .select("id")
    .maybeSingle();

  if (!claimed) {
    return { ok: true, skipped: true, reason: "already_deducted" };
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_variant_id, quantity, product_name, variant_name")
    .eq("order_id", orderId);

  if (!items?.length) return { ok: true };

  for (const item of items) {
    if (!item.product_variant_id) continue;

    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", item.product_variant_id)
      .single();

    if (!variant || variant.stock_quantity < item.quantity) {
      await supabase
        .from("orders")
        .update({ inventory_deducted: false })
        .eq("id", orderId);
      return { ok: false, error: "Insufficient stock at deduction" };
    }

    const expected = variant.stock_quantity;
    const newQty = expected - item.quantity;
    const { data: updated, error: updErr } = await supabase
      .from("product_variants")
      .update({ stock_quantity: newQty })
      .eq("id", item.product_variant_id)
      .eq("stock_quantity", expected)
      .select("id")
      .maybeSingle();

    if (updErr || !updated) {
      await supabase
        .from("orders")
        .update({ inventory_deducted: false })
        .eq("id", orderId);
      return { ok: false, error: updErr?.message ?? "Stock race — please retry" };
    }

    await supabase.from("inventory_logs").insert({
      product_variant_id: item.product_variant_id,
      change_type: "sale",
      quantity_change: -item.quantity,
      quantity_after: newQty,
      reference_type: "order",
      reference_id: orderId,
      notes: `Order sale: ${item.product_name} — ${item.variant_name ?? ""}`,
    });
  }

  return { ok: true };
}

/**
 * Restore stock on cancel. Only runs if inventory was deducted and not yet restored.
 */
export async function restoreOrderInventory(
  supabase: SupabaseClient,
  orderId: string
): Promise<InventoryResult> {
  const { data, error } = await supabase.rpc("restore_order_inventory", {
    p_order_id: orderId,
  });

  if (!error && data) {
    const result = data as { success?: boolean; skipped?: boolean; reason?: string };
    if (result.skipped) {
      return { ok: true, skipped: true, reason: result.reason };
    }
    return { ok: true };
  }

  if (error) {
    const missingFn =
      error.message.includes("Could not find the function") ||
      error.message.includes("restore_order_inventory") ||
      error.code === "PGRST202";
    if (!missingFn) {
      return { ok: false, error: error.message };
    }
  }

  return restoreOrderInventoryFallback(supabase, orderId);
}

async function restoreOrderInventoryFallback(
  supabase: SupabaseClient,
  orderId: string
): Promise<InventoryResult> {
  const { data: order } = await supabase
    .from("orders")
    .select("id, inventory_deducted, inventory_restored")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return { ok: false, error: "Order not found" };
  if (!order.inventory_deducted) {
    return { ok: true, skipped: true, reason: "not_deducted" };
  }
  if (order.inventory_restored) {
    return { ok: true, skipped: true, reason: "already_restored" };
  }

  const { data: claimed } = await supabase
    .from("orders")
    .update({ inventory_restored: true })
    .eq("id", orderId)
    .eq("inventory_deducted", true)
    .eq("inventory_restored", false)
    .select("id")
    .maybeSingle();

  if (!claimed) {
    return { ok: true, skipped: true, reason: "already_restored" };
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("product_variant_id, quantity, product_name, variant_name")
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
      notes: `Order cancel restore: ${item.product_name} — ${item.variant_name ?? ""}`,
    });
  }

  return { ok: true };
}

/** Log a manual admin stock adjustment (live edit in product editor). */
export async function logAdminStockAdjustment(
  supabase: SupabaseClient,
  opts: {
    variantId: string;
    previousQty: number;
    nextQty: number;
    adminUserId?: string | null;
  }
): Promise<void> {
  const delta = opts.nextQty - opts.previousQty;
  if (delta === 0) return;

  await supabase.from("inventory_logs").insert({
    product_variant_id: opts.variantId,
    change_type: delta > 0 ? "restock" : "adjustment",
    quantity_change: delta,
    quantity_after: opts.nextQty,
    reference_type: "manual",
    notes: "Admin catalogue stock update",
    created_by: opts.adminUserId ?? null,
  });
}
