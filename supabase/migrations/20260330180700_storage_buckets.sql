-- IYLO Bakehouse — Supabase Storage buckets (optional; enable when using Storage)
-- See docs/database/STORAGE.md

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('products', 'products', true, 52428800, ARRAY['image/webp','image/jpeg','image/png','video/mp4']),
  ('categories', 'categories', true, 10485760, ARRAY['image/webp','image/jpeg','image/png']),
  ('gallery', 'gallery', true, 52428800, ARRAY['image/webp','image/jpeg','image/png','video/mp4']),
  ('hero', 'hero', true, 20971520, ARRAY['image/webp','image/jpeg','image/png']),
  ('gifting', 'gifting', true, 20971520, ARRAY['image/webp','image/jpeg','image/png']),
  ('brand', 'brand', true, 5242880, ARRAY['image/webp','image/jpeg','image/png','image/svg+xml']),
  ('marketing', 'marketing', true, 20971520, ARRAY['image/webp','image/jpeg','image/png']),
  ('workshops', 'workshops', true, 20971520, ARRAY['image/webp','image/jpeg','image/png']),
  ('announcements', 'announcements', true, 10485760, ARRAY['image/webp','image/jpeg','image/png']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/webp','image/jpeg','image/png'])
ON CONFLICT (id) DO NOTHING;

-- Public read for all public buckets
CREATE POLICY "storage_public_read"
ON storage.objects FOR SELECT
USING (bucket_id IN (
  'products','categories','gallery','hero','gifting',
  'brand','marketing','workshops','announcements','avatars'
));

-- Admin upload/update/delete on content buckets
CREATE POLICY "storage_admin_write"
ON storage.objects FOR ALL
USING (
  bucket_id IN (
    'products','categories','gallery','hero','gifting',
    'brand','marketing','workshops','announcements'
  )
  AND public.is_admin()
)
WITH CHECK (
  bucket_id IN (
    'products','categories','gallery','hero','gifting',
    'brand','marketing','workshops','announcements'
  )
  AND public.is_admin()
);

-- Users upload own avatar
CREATE POLICY "storage_avatar_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "storage_avatar_own_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
