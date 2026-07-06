-- IYLO Bakehouse — Row Level Security (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorder_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- ── profiles ────────────────────────────────────────────────────
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── admin_users (superadmin manages, admins read self) ──────────
CREATE POLICY "admin_users_select"
  ON public.admin_users FOR SELECT
  USING (public.is_admin());

CREATE POLICY "admin_users_insert_superadmin"
  ON public.admin_users FOR INSERT
  WITH CHECK (public.is_superadmin());

CREATE POLICY "admin_users_update_superadmin"
  ON public.admin_users FOR UPDATE
  USING (public.is_superadmin());

CREATE POLICY "admin_users_delete_superadmin"
  ON public.admin_users FOR DELETE
  USING (public.is_superadmin());

-- ── addresses ───────────────────────────────────────────────────
CREATE POLICY "addresses_select_own"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "addresses_insert_own"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "addresses_update_own"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "addresses_delete_own"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- ── Public catalog read ─────────────────────────────────────────
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "categories_admin_write"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "products_admin_write"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "product_variants_public_read"
  ON public.product_variants FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "product_variants_admin_write"
  ON public.product_variants FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "product_images_public_read"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "product_images_admin_write"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "product_videos_public_read"
  ON public.product_videos FOR SELECT
  USING (true);

CREATE POLICY "product_videos_admin_write"
  ON public.product_videos FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "product_recommendations_public_read"
  ON public.product_recommendations FOR SELECT
  USING (true);

CREATE POLICY "product_recommendations_admin_write"
  ON public.product_recommendations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "bundles_public_read"
  ON public.bundles FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "bundles_admin_write"
  ON public.bundles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "bundle_items_public_read"
  ON public.bundle_items FOR SELECT
  USING (true);

CREATE POLICY "bundle_items_admin_write"
  ON public.bundle_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── inventory (admin only) ──────────────────────────────────────
CREATE POLICY "inventory_logs_admin"
  ON public.inventory_logs FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── coupons ─────────────────────────────────────────────────────
CREATE POLICY "coupons_public_active_read"
  ON public.coupons FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "coupons_admin_write"
  ON public.coupons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── delivery & slots (public read) ──────────────────────────────
CREATE POLICY "delivery_zones_public_read"
  ON public.delivery_zones FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "delivery_zones_admin_write"
  ON public.delivery_zones FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "fulfillment_slots_public_read"
  ON public.fulfillment_slots FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "fulfillment_slots_admin_write"
  ON public.fulfillment_slots FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── cart (own or guest session — use service role for session merge) ──
CREATE POLICY "carts_select_own"
  ON public.carts FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "carts_insert_own"
  ON public.carts FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "carts_update_own"
  ON public.carts FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "carts_delete_own"
  ON public.carts FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "cart_items_via_cart"
  ON public.cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id AND (c.user_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id AND (c.user_id = auth.uid() OR public.is_admin())
    )
  );

-- ── wishlist ────────────────────────────────────────────────────
CREATE POLICY "wishlist_own"
  ON public.wishlist FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── orders ──────────────────────────────────────────────────────
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert_authenticated"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "order_items_select"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_admin"
  ON public.order_items FOR ALL
  USING (public.is_admin());

-- ── payments ────────────────────────────────────────────────────
CREATE POLICY "payments_select_own"
  ON public.payment_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "payments_insert_service"
  ON public.payment_transactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "payments_update_admin"
  ON public.payment_transactions FOR UPDATE
  USING (public.is_admin());

-- ── preorder notifications ──────────────────────────────────────
CREATE POLICY "preorder_notify_insert"
  ON public.preorder_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "preorder_notify_select_own"
  ON public.preorder_notifications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- ── site content (public read) ──────────────────────────────────
CREATE POLICY "site_settings_public_read"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "site_settings_admin_write"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "store_hours_public_read"
  ON public.store_hours FOR SELECT
  USING (true);

CREATE POLICY "store_hours_admin_write"
  ON public.store_hours FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "preorder_rules_public_read"
  ON public.preorder_rules FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "preorder_rules_admin_write"
  ON public.preorder_rules FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "announcements_public_read"
  ON public.announcements FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "announcements_admin_write"
  ON public.announcements FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "gallery_public_read"
  ON public.gallery_items FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "gallery_admin_write"
  ON public.gallery_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "testimonials_public_read"
  ON public.testimonials FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "testimonials_admin_write"
  ON public.testimonials FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "gifting_public_read"
  ON public.gifting_options FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "gifting_admin_write"
  ON public.gifting_options FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── corporate inquiries (anyone insert, admin read) ─────────────
CREATE POLICY "corporate_insert_public"
  ON public.corporate_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "corporate_admin"
  ON public.corporate_inquiries FOR SELECT
  USING (public.is_admin());

CREATE POLICY "corporate_admin_update"
  ON public.corporate_inquiries FOR UPDATE
  USING (public.is_admin());

-- ── workshops ───────────────────────────────────────────────────
CREATE POLICY "workshops_public_read"
  ON public.workshops FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "workshops_admin_write"
  ON public.workshops FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "workshop_bookings_own"
  ON public.workshop_bookings FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "workshop_bookings_insert"
  ON public.workshop_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workshop_bookings_admin_update"
  ON public.workshop_bookings FOR UPDATE
  USING (public.is_admin());

-- ── audit log (admin read only) ─────────────────────────────────
CREATE POLICY "audit_log_admin"
  ON public.admin_audit_log FOR SELECT
  USING (public.is_admin());

CREATE POLICY "audit_log_insert"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (public.is_admin());
