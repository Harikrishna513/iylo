-- =============================================================================
-- IYLO Bakehouse | FILE 01 of 06
-- 01-create-tables.sql
-- Run this FIRST in Supabase SQL Editor
-- Creates: extensions, enums, all tables, functions, triggers
-- =============================================================================
-- IYLO Bakehouse â€” extensions & enums
-- Supabase Postgres 15+

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- â”€â”€ Admin & auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TYPE public.admin_role AS ENUM ('superadmin', 'admin');

-- â”€â”€ Catalog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TYPE public.diet_type AS ENUM ('eggless', 'veg', 'egg', 'non_veg');
CREATE TYPE public.availability_type AS ENUM (
  'daily',
  'seasonal',
  'weekend',
  'pre_order',
  'limited'
);
CREATE TYPE public.product_image_type AS ENUM (
  'front',
  'side',
  'top',
  'packaging',
  'lifestyle',
  'other'
);

-- â”€â”€ Commerce â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TYPE public.fulfillment_type AS ENUM (
  'delivery',
  'pickup',
  'pan_india_shipping'
);
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'picked_up',
  'cancelled',
  'refunded'
);
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);
CREATE TYPE public.payment_method AS ENUM (
  'upi',
  'card',
  'debit_card',
  'netbanking',
  'cod',
  'wallet'
);
CREATE TYPE public.address_label AS ENUM ('home', 'work', 'other');

-- â”€â”€ Inventory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TYPE public.inventory_change_type AS ENUM (
  'restock',
  'sale',
  'adjustment',
  'return',
  'wastage'
);

-- â”€â”€ Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TYPE public.announcement_type AS ENUM (
  'popup',
  'banner',
  'closure',
  'event',
  'festival',
  'weekend_special',
  'launch'
);
CREATE TYPE public.gallery_media_type AS ENUM ('image', 'video');
CREATE TYPE public.gallery_span AS ENUM ('normal', 'wide', 'tall');
CREATE TYPE public.testimonial_source AS ENUM ('google', 'instagram', 'customer');
CREATE TYPE public.inquiry_status AS ENUM ('new', 'contacted', 'quoted', 'closed');
CREATE TYPE public.workshop_booking_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'attended'
);
CREATE TYPE public.recommendation_type AS ENUM (
  'related',
  'frequently_bought',
  'upsell'
);
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE public.delivery_partner AS ENUM (
  'shiprocket',
  'dunzo',
  'porter',
  'shadowfax',
  'other'
);

-- IYLO Bakehouse â€” users, profiles, admin

-- â”€â”€ profiles (extends auth.users â€” email login + verification via Supabase Auth) â”€â”€
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  phone           TEXT,                    -- optional; used at checkout, NOT for login
  avatar_url      TEXT,
  default_address_id UUID,                 -- FK added after addresses table
  marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_phone_format CHECK (
    phone IS NULL OR phone ~ '^\+?[0-9]{10,15}$'
  )
);

COMMENT ON TABLE public.profiles IS
  'Customer profile. Login is email-only via Supabase Auth. Phone is optional for orders.';

-- â”€â”€ admin_users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE public.admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.admin_role NOT NULL DEFAULT 'admin',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_users IS
  'superadmin: full access incl. admin management. admin: catalog, orders, content.';

-- â”€â”€ addresses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE public.addresses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label           public.address_label NOT NULL DEFAULT 'home',
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  line1           TEXT NOT NULL,
  line2           TEXT,
  city            TEXT NOT NULL DEFAULT 'Bangalore',
  state           TEXT NOT NULL DEFAULT 'Karnataka',
  pincode         TEXT NOT NULL,
  country         TEXT NOT NULL DEFAULT 'IN',
  latitude        NUMERIC(10, 7),
  longitude       NUMERIC(10, 7),
  delivery_notes  TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT addresses_pincode_in CHECK (pincode ~ '^[0-9]{6}$')
);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_default_address_fk
  FOREIGN KEY (default_address_id) REFERENCES public.addresses(id) ON DELETE SET NULL;

-- â”€â”€ updated_at trigger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup (email must be confirmed in app layer)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- â”€â”€ Helper: is admin? â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE OR REPLACE FUNCTION public.is_admin(check_role public.admin_role DEFAULT NULL)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.is_active = true
      AND (check_role IS NULL OR au.role = check_role)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT public.is_admin('superadmin'::public.admin_role);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- IYLO Bakehouse â€” catalog (categories, products, variants, media, bundles)

CREATE TABLE public.categories (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              CITEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  description       TEXT,
  image_url         TEXT,
  parent_id         UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  display_order     INT NOT NULL DEFAULT 0,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  show_in_nav       BOOLEAN NOT NULL DEFAULT true,
  show_on_homepage  BOOLEAN NOT NULL DEFAULT false,
  meta_title        TEXT,
  meta_description  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku                 CITEXT NOT NULL UNIQUE,
  slug                CITEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  category_id         UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  short_description   TEXT NOT NULL,
  long_description    TEXT,
  base_price          NUMERIC(10, 2),          -- nullable if all pricing via variants
  offer_price         NUMERIC(10, 2),
  diet_type           public.diet_type NOT NULL DEFAULT 'eggless',
  availability_type   public.availability_type NOT NULL DEFAULT 'daily',
  is_available_daily  BOOLEAN NOT NULL DEFAULT true,
  is_bestseller       BOOLEAN NOT NULL DEFAULT false,
  is_seasonal         BOOLEAN NOT NULL DEFAULT false,
  is_new              BOOLEAN NOT NULL DEFAULT false,
  is_featured         BOOLEAN NOT NULL DEFAULT false,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  pickup_available    BOOLEAN NOT NULL DEFAULT true,
  delivery_available  BOOLEAN NOT NULL DEFAULT true,
  pan_india_shipping  BOOLEAN NOT NULL DEFAULT false,
  preparation_time    TEXT,
  shelf_life          TEXT,
  weight_label        TEXT,                    -- e.g. "350g", display when no variant
  ingredients         TEXT[] DEFAULT '{}',
  allergens           TEXT[] DEFAULT '{}',
  storage_instructions TEXT,
  display_order       INT NOT NULL DEFAULT 0,
  meta_title          TEXT,
  meta_description    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT products_base_price_nonneg CHECK (base_price IS NULL OR base_price >= 0),
  CONSTRAINT products_offer_price_valid CHECK (
    offer_price IS NULL OR base_price IS NULL OR offer_price <= base_price
  )
);

CREATE TABLE public.product_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku             CITEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,               -- e.g. "1 pc", "0.5 kg", "Pack of 10"
  price           NUMERIC(10, 2) NOT NULL,
  offer_price     NUMERIC(10, 2),
  stock_quantity  INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  min_order_qty   INT NOT NULL DEFAULT 1,
  max_order_qty   INT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_price_nonneg CHECK (price >= 0),
  CONSTRAINT product_variants_stock_nonneg CHECK (stock_quantity >= 0),
  CONSTRAINT product_variants_qty_range CHECK (
    max_order_qty IS NULL OR max_order_qty >= min_order_qty
  ),
  CONSTRAINT product_variants_offer_valid CHECK (
    offer_price IS NULL OR offer_price <= price
  )
);

CREATE TABLE public.product_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,
  public_url      TEXT NOT NULL,
  alt_text        TEXT,
  image_type      public.product_image_type NOT NULL DEFAULT 'front',
  display_order   INT NOT NULL DEFAULT 0,
  is_primary      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_videos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path    TEXT,
  public_url      TEXT NOT NULL,
  title           TEXT,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_recommendations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id              UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  recommended_product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  recommendation_type     public.recommendation_type NOT NULL DEFAULT 'related',
  display_order           INT NOT NULL DEFAULT 0,
  UNIQUE (product_id, recommended_product_id, recommendation_type),
  CONSTRAINT product_recommendations_no_self CHECK (product_id <> recommended_product_id)
);

CREATE TABLE public.bundles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            CITEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL,
  original_price  NUMERIC(10, 2),
  image_url       TEXT,
  badge           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  valid_from      TIMESTAMPTZ,
  valid_until     TIMESTAMPTZ,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bundles_price_nonneg CHECK (price >= 0)
);

CREATE TABLE public.bundle_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id           UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  product_variant_id  UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  quantity            INT NOT NULL DEFAULT 1,
  UNIQUE (bundle_id, product_variant_id),
  CONSTRAINT bundle_items_qty_positive CHECK (quantity > 0)
);

CREATE TABLE public.inventory_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id  UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  change_type         public.inventory_change_type NOT NULL,
  quantity_change     INT NOT NULL,            -- negative = deduction
  quantity_after      INT NOT NULL,
  reference_type      TEXT,                    -- 'order', 'manual', 'return'
  reference_id        UUID,
  notes               TEXT,
  created_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER bundles_updated_at BEFORE UPDATE ON public.bundles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- IYLO Bakehouse â€” commerce (cart, wishlist, orders, payments, slots, zones)

CREATE TABLE public.coupons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              CITEXT NOT NULL UNIQUE,
  description       TEXT,
  discount_type     public.discount_type NOT NULL,
  discount_value    NUMERIC(10, 2) NOT NULL,
  min_order_amount  NUMERIC(10, 2) DEFAULT 0,
  max_discount      NUMERIC(10, 2),
  usage_limit       INT,
  usage_count       INT NOT NULL DEFAULT 0,
  valid_from        TIMESTAMPTZ,
  valid_until       TIMESTAMPTZ,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coupons_discount_positive CHECK (discount_value > 0)
);

CREATE TABLE public.delivery_zones (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  pincodes            TEXT[] NOT NULL DEFAULT '{}',
  delivery_fee        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  estimated_minutes   INT,
  min_order_amount    NUMERIC(10, 2) DEFAULT 499,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.fulfillment_slots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date         DATE NOT NULL,
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  fulfillment_type  public.fulfillment_type NOT NULL,
  max_orders        INT NOT NULL DEFAULT 20,
  booked_count      INT NOT NULL DEFAULT 0,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fulfillment_slots_time_valid CHECK (end_time > start_time),
  CONSTRAINT fulfillment_slots_capacity CHECK (booked_count <= max_orders),
  UNIQUE (slot_date, start_time, end_time, fulfillment_type)
);

CREATE TABLE public.carts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id  TEXT UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT carts_owner_required CHECK (
    user_id IS NOT NULL OR session_id IS NOT NULL
  )
);

CREATE TABLE public.cart_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id             UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_variant_id  UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  quantity            INT NOT NULL DEFAULT 1,
  gift_wrap           BOOLEAN NOT NULL DEFAULT false,
  custom_message      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_variant_id),
  CONSTRAINT cart_items_qty_positive CHECK (quantity > 0)
);

CREATE TABLE public.wishlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE public.orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number          TEXT NOT NULL UNIQUE,
  user_id               UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- guest checkout (login required before payment; profile may exist)
  guest_name            TEXT,
  guest_email           CITEXT,
  guest_phone           TEXT,
  status                public.order_status NOT NULL DEFAULT 'pending',
  fulfillment_type      public.fulfillment_type NOT NULL,
  subtotal              NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_amount       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_fee          NUMERIC(10, 2) NOT NULL DEFAULT 0,
  cod_fee               NUMERIC(10, 2) NOT NULL DEFAULT 0,
  gift_wrap_fee         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_amount            NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount          NUMERIC(10, 2) NOT NULL DEFAULT 0,
  coupon_id             UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  coupon_code           TEXT,
  fulfillment_slot_id   UUID REFERENCES public.fulfillment_slots(id) ON DELETE SET NULL,
  scheduled_date        DATE,
  scheduled_slot_label  TEXT,
  address_snapshot      JSONB,               -- frozen copy at checkout
  pickup_message        TEXT,
  customer_notes        TEXT,
  is_corporate          BOOLEAN NOT NULL DEFAULT false,
  company_name          TEXT,
  gst_number            TEXT,
  delivery_partner      public.delivery_partner,
  tracking_number       TEXT,
  razorpay_order_id     TEXT,
  placed_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at          TIMESTAMPTZ,
  delivered_at          TIMESTAMPTZ,
  cancelled_at          TIMESTAMPTZ,
  cancellation_reason   TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT orders_total_nonneg CHECK (total_amount >= 0)
);

CREATE TABLE public.order_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_variant_id  UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  bundle_id           UUID REFERENCES public.bundles(id) ON DELETE SET NULL,
  product_name        TEXT NOT NULL,
  variant_name        TEXT,
  sku                 TEXT,
  quantity            INT NOT NULL,
  unit_price          NUMERIC(10, 2) NOT NULL,
  offer_price         NUMERIC(10, 2),
  line_total          NUMERIC(10, 2) NOT NULL,
  gift_wrap           BOOLEAN NOT NULL DEFAULT false,
  custom_message      TEXT,
  CONSTRAINT order_items_qty_positive CHECK (quantity > 0),
  CONSTRAINT order_items_source CHECK (
    product_variant_id IS NOT NULL OR bundle_id IS NOT NULL
  )
);

CREATE TABLE public.payment_transactions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  razorpay_order_id     TEXT,
  razorpay_payment_id   TEXT UNIQUE,
  razorpay_signature    TEXT,
  amount                NUMERIC(10, 2) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'INR',
  payment_method        public.payment_method,
  status                public.payment_status NOT NULL DEFAULT 'pending',
  gateway_response      JSONB DEFAULT '{}',
  failure_reason        TEXT,
  paid_at               TIMESTAMPTZ,
  refunded_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.preorder_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email       CITEXT,
  phone       TEXT,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  notify_type TEXT NOT NULL DEFAULT 'weekend_box',  -- weekend_box, festival, back_in_stock
  is_sent     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT preorder_notify_contact CHECK (
    user_id IS NOT NULL OR email IS NOT NULL OR phone IS NOT NULL
  )
);

-- Triggers
CREATE TRIGGER carts_updated_at BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER cart_items_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER delivery_zones_updated_at BEFORE UPDATE ON public.delivery_zones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Order number generator
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  seq INT;
BEGIN
  SELECT COUNT(*) + 1 INTO seq FROM public.orders
  WHERE placed_at::date = CURRENT_DATE;
  RETURN 'IYLO-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(seq::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.orders_set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_before_insert
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.orders_set_order_number();

-- IYLO Bakehouse â€” site settings, content, workshops, corporate, audit

CREATE TABLE public.site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.store_hours (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sun
  open_time   TIME,
  close_time  TIME,
  is_closed   BOOLEAN NOT NULL DEFAULT false,
  label       TEXT,                          -- e.g. "Wednesday â€“ Friday"
  UNIQUE (day_of_week)
);

CREATE TABLE public.preorder_rules (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  fulfillment_type    public.fulfillment_type,
  category_id         UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  cutoff_time         TIME NOT NULL DEFAULT '18:00',   -- orders after â†’ next day
  min_lead_days       INT NOT NULL DEFAULT 1,
  max_lead_days       INT NOT NULL DEFAULT 7,
  applies_weekends    BOOLEAN NOT NULL DEFAULT true,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.announcements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  announcement_type public.announcement_type NOT NULL DEFAULT 'banner',
  image_url       TEXT,
  link_url        TEXT,
  tag             TEXT,
  starts_at       TIMESTAMPTZ,
  ends_at         TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type      public.gallery_media_type NOT NULL DEFAULT 'image',
  storage_path    TEXT,
  public_url      TEXT NOT NULL,
  alt_text        TEXT,
  span            public.gallery_span NOT NULL DEFAULT 'normal',
  category_tag    TEXT,                      -- kitchen, bread, cake, events
  display_order   INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.testimonials (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name       TEXT NOT NULL,
  role_label          TEXT,
  content             TEXT NOT NULL,
  rating              NUMERIC(2, 1) CHECK (rating >= 1 AND rating <= 5),
  image_url           TEXT,
  source              public.testimonial_source NOT NULL DEFAULT 'customer',
  google_review_url   TEXT,
  is_featured         BOOLEAN NOT NULL DEFAULT false,
  display_order       INT NOT NULL DEFAULT 0,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.gifting_options (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  image_url       TEXT,
  cta_label       TEXT NOT NULL DEFAULT 'Enquire',
  cta_link        TEXT,
  is_preorder     BOOLEAN NOT NULL DEFAULT true,
  display_order   INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.corporate_inquiries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name    TEXT NOT NULL,
  company_name    TEXT,
  phone           TEXT NOT NULL,
  email           CITEXT NOT NULL,
  message         TEXT,
  gst_required    BOOLEAN NOT NULL DEFAULT false,
  estimated_qty   TEXT,
  status          public.inquiry_status NOT NULL DEFAULT 'new',
  assigned_to     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.workshops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            CITEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT,
  workshop_date   DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME,
  location        TEXT NOT NULL DEFAULT 'IYLO Bakehouse, Jayanagar',
  price           NUMERIC(10, 2) NOT NULL DEFAULT 0,
  capacity        INT NOT NULL,
  spots_remaining INT NOT NULL,
  image_url       TEXT,
  booking_required BOOLEAN NOT NULL DEFAULT true,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT workshops_capacity CHECK (spots_remaining >= 0 AND spots_remaining <= capacity)
);

CREATE TABLE public.workshop_bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id     UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guests_count    INT NOT NULL DEFAULT 1,
  status          public.workshop_booking_status NOT NULL DEFAULT 'pending',
  payment_transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT workshop_bookings_guests_positive CHECK (guests_count > 0)
);

CREATE TABLE public.admin_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER gifting_options_updated_at BEFORE UPDATE ON public.gifting_options
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER corporate_inquiries_updated_at BEFORE UPDATE ON public.corporate_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER workshops_updated_at BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER workshop_bookings_updated_at BEFORE UPDATE ON public.workshop_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

