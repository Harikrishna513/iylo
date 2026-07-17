-- IYLO Bakehouse — live inventory (CozyNest-style)
-- Idempotent deduct on payment / COD, restore on cancel.
-- Run this in Supabase SQL editor if migrations are applied manually.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS inventory_deducted BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS inventory_restored BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.orders.inventory_deducted IS
  'TRUE when variant stock has been decremented for this order. Atomic claim lease against double-deduction.';

COMMENT ON COLUMN public.orders.inventory_restored IS
  'TRUE when deducted stock has been returned after cancel. Atomic claim lease against double-restore.';

CREATE INDEX IF NOT EXISTS idx_orders_pending_no_deduct
  ON public.orders (placed_at)
  WHERE inventory_deducted = false AND status = 'pending';

CREATE INDEX IF NOT EXISTS idx_orders_deducted_not_restored
  ON public.orders (placed_at)
  WHERE inventory_deducted = true AND inventory_restored = false;

-- ── Deduct stock (sale) ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.deduct_order_inventory(p_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_claimed boolean;
  v_item record;
  v_new_stock int;
BEGIN
  UPDATE public.orders
     SET inventory_deducted = true
   WHERE id = p_order_id
     AND inventory_deducted = false
  RETURNING true INTO v_claimed;

  IF v_claimed IS NULL THEN
    RETURN jsonb_build_object('skipped', true, 'reason', 'already_deducted');
  END IF;

  FOR v_item IN
    SELECT product_variant_id, quantity, product_name, variant_name
      FROM public.order_items
     WHERE order_id = p_order_id
       AND product_variant_id IS NOT NULL
  LOOP
    UPDATE public.product_variants
       SET stock_quantity = stock_quantity - v_item.quantity
     WHERE id = v_item.product_variant_id
       AND stock_quantity >= v_item.quantity
    RETURNING stock_quantity INTO v_new_stock;

    IF v_new_stock IS NULL THEN
      UPDATE public.orders
         SET inventory_deducted = false
       WHERE id = p_order_id;

      RAISE EXCEPTION 'INSUFFICIENT_STOCK_AT_DEDUCTION'
        USING DETAIL = format(
          'variant_id=%s requested=%s',
          v_item.product_variant_id, v_item.quantity
        );
    END IF;

    INSERT INTO public.inventory_logs (
      product_variant_id,
      change_type,
      quantity_change,
      quantity_after,
      reference_type,
      reference_id,
      notes
    ) VALUES (
      v_item.product_variant_id,
      'sale',
      -v_item.quantity,
      v_new_stock,
      'order',
      p_order_id,
      format('Order sale: %s — %s', v_item.product_name, COALESCE(v_item.variant_name, ''))
    );
  END LOOP;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.deduct_order_inventory(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_order_inventory(uuid) TO service_role;

-- ── Restore stock (cancel / return) ──────────────────────────────
CREATE OR REPLACE FUNCTION public.restore_order_inventory(p_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deducted boolean;
  v_already boolean;
  v_claimed boolean;
  v_item record;
  v_new_stock int;
BEGIN
  SELECT inventory_deducted, inventory_restored
    INTO v_deducted, v_already
    FROM public.orders
   WHERE id = p_order_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('skipped', true, 'reason', 'order_not_found');
  END IF;

  IF v_deducted IS DISTINCT FROM true THEN
    RETURN jsonb_build_object('skipped', true, 'reason', 'not_deducted');
  END IF;

  IF v_already = true THEN
    RETURN jsonb_build_object('skipped', true, 'reason', 'already_restored');
  END IF;

  UPDATE public.orders
     SET inventory_restored = true
   WHERE id = p_order_id
     AND inventory_deducted = true
     AND inventory_restored = false
  RETURNING true INTO v_claimed;

  IF v_claimed IS NULL THEN
    RETURN jsonb_build_object('skipped', true, 'reason', 'already_restored');
  END IF;

  FOR v_item IN
    SELECT product_variant_id, quantity, product_name, variant_name
      FROM public.order_items
     WHERE order_id = p_order_id
       AND product_variant_id IS NOT NULL
  LOOP
    UPDATE public.product_variants
       SET stock_quantity = stock_quantity + v_item.quantity
     WHERE id = v_item.product_variant_id
    RETURNING stock_quantity INTO v_new_stock;

    INSERT INTO public.inventory_logs (
      product_variant_id,
      change_type,
      quantity_change,
      quantity_after,
      reference_type,
      reference_id,
      notes
    ) VALUES (
      v_item.product_variant_id,
      'return',
      v_item.quantity,
      COALESCE(v_new_stock, 0),
      'order',
      p_order_id,
      format('Order cancel restore: %s — %s', v_item.product_name, COALESCE(v_item.variant_name, ''))
    );
  END LOOP;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.restore_order_inventory(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restore_order_inventory(uuid) TO service_role;
