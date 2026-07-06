-- =============================================================================
-- IYLO Bakehouse | FILE 03 of 06
-- 03-create-indexes.sql
-- Run this THIRD (after 02-apply-rls.sql)
-- Performance indexes + full-text search
-- =============================================================================
-- IYLO Bakehouse â€” indexes

-- Catalog
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_active_order ON public.categories(is_active, display_order);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active_order ON public.products(is_active, display_order);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_flags ON public.products(is_bestseller, is_seasonal, is_featured)
  WHERE is_active = true;
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_active ON public.product_variants(product_id, is_active);
CREATE INDEX idx_product_images_product ON public.product_images(product_id, display_order);
CREATE INDEX idx_product_videos_product ON public.product_videos(product_id);
CREATE INDEX idx_inventory_logs_variant ON public.inventory_logs(product_variant_id, created_at DESC);

-- Commerce
CREATE INDEX idx_carts_user ON public.carts(user_id);
CREATE INDEX idx_carts_session ON public.carts(session_id);
CREATE INDEX idx_cart_items_cart ON public.cart_items(cart_id);
CREATE INDEX idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX idx_orders_user ON public.orders(user_id, placed_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status, placed_at DESC);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_scheduled ON public.orders(scheduled_date, fulfillment_type);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_razorpay ON public.payment_transactions(razorpay_payment_id);
CREATE INDEX idx_fulfillment_slots_date ON public.fulfillment_slots(slot_date, fulfillment_type)
  WHERE is_active = true;
CREATE INDEX idx_delivery_zones_pincodes ON public.delivery_zones USING GIN(pincodes);

-- Content
CREATE INDEX idx_announcements_active ON public.announcements(is_active, starts_at, ends_at);
CREATE INDEX idx_gallery_active_order ON public.gallery_items(is_active, display_order);
CREATE INDEX idx_testimonials_featured ON public.testimonials(is_featured, display_order)
  WHERE is_active = true;
CREATE INDEX idx_workshops_date ON public.workshops(workshop_date) WHERE is_active = true;
CREATE INDEX idx_corporate_inquiries_status ON public.corporate_inquiries(status, created_at DESC);

-- Admin
CREATE INDEX idx_admin_users_user ON public.admin_users(user_id) WHERE is_active = true;
CREATE INDEX idx_addresses_user ON public.addresses(user_id);
CREATE INDEX idx_audit_log_entity ON public.admin_audit_log(entity_type, entity_id, created_at DESC);

-- Full-text search on products
CREATE INDEX idx_products_search ON public.products
  USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(short_description, '')));

-- One primary image per product (constraint-style partial unique index)
CREATE UNIQUE INDEX product_images_one_primary
  ON public.product_images (product_id)
  WHERE is_primary = true;
