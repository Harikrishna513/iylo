-- =============================================================================
-- IYLO Bakehouse | FILE 06 of 06
-- 06-create-admin.sql
-- Run this LAST — after you create a user in Supabase Auth
-- =============================================================================
--
-- STEPS:
-- 1. Supabase Dashboard → Authentication → Users → Add user (email + password)
-- 2. Confirm email (or toggle "Auto Confirm" for testing)
-- 3. Copy the user's UUID from the Users table
-- 4. Replace PASTE_YOUR_AUTH_USER_UUID below
-- 5. Run this file in SQL Editor
--
-- Roles:
--   superadmin = full access + can add other admins
--   admin      = manage products, orders, content (cannot manage admins)
-- =============================================================================

INSERT INTO public.admin_users (user_id, role, is_active)
VALUES (
  'PASTE_YOUR_AUTH_USER_UUID',  -- ← replace this
  'superadmin',
  true
)
ON CONFLICT (user_id) DO UPDATE
  SET role = 'superadmin', is_active = true;

-- Verify:
-- SELECT au.role, p.full_name, u.email
-- FROM public.admin_users au
-- JOIN auth.users u ON u.id = au.user_id
-- JOIN public.profiles p ON p.id = au.user_id;
