-- IYLO Bakehouse — catalog (categories, products, variants, media, bundles)

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

-- Only one primary image per product
CREATE UNIQUE INDEX product_images_one_primary
  ON public.product_images (product_id)
  WHERE is_primary = true;
