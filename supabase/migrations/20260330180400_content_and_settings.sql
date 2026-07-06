-- IYLO Bakehouse — site settings, content, workshops, corporate, audit

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
  label       TEXT,                          -- e.g. "Wednesday – Friday"
  UNIQUE (day_of_week)
);

CREATE TABLE public.preorder_rules (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  fulfillment_type    public.fulfillment_type,
  category_id         UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  cutoff_time         TIME NOT NULL DEFAULT '18:00',   -- orders after → next day
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
