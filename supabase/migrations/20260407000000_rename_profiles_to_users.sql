-- Rename profiles → users (cozynest-style naming) and add notification prefs

ALTER TABLE public.profiles RENAME TO users;

ALTER TABLE public.users RENAME COLUMN full_name TO name;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email CITEXT,
  ADD COLUMN IF NOT EXISTS notification_email BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notification_sms BOOLEAN NOT NULL DEFAULT false;

-- Backfill email from auth.users
UPDATE public.users u
SET email = au.email
FROM auth.users au
WHERE u.id = au.id AND u.email IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.users IS
  'Customer profile. Login via Supabase Auth email. Phone required at checkout.';

-- Allow client upsert on own row (signup / notifications)
CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
