-- IYLO Bakehouse — users, profiles, admin

-- ── profiles (extends auth.users — email login + verification via Supabase Auth) ──
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

-- ── admin_users ───────────────────────────────────────────────
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

-- ── addresses ─────────────────────────────────────────────────
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

-- ── updated_at trigger ────────────────────────────────────────
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

-- ── Helper: is admin? ───────────────────────────────────────────
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
