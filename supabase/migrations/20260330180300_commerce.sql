-- IYLO Bakehouse — commerce (cart, wishlist, orders, payments, slots, zones)

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
