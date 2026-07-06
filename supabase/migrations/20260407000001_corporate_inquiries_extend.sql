-- Extend corporate_inquiries for custom vs corporate gifting enquiries

ALTER TABLE public.corporate_inquiries
  ADD COLUMN IF NOT EXISTS inquiry_type TEXT NOT NULL DEFAULT 'corporate',
  ADD COLUMN IF NOT EXISTS delivery_date DATE,
  ADD COLUMN IF NOT EXISTS budget TEXT;

ALTER TABLE public.corporate_inquiries
  DROP CONSTRAINT IF EXISTS corporate_inquiries_type_check;

ALTER TABLE public.corporate_inquiries
  ADD CONSTRAINT corporate_inquiries_type_check
  CHECK (inquiry_type IN ('corporate', 'custom'));

COMMENT ON COLUMN public.corporate_inquiries.inquiry_type IS
  'corporate = B2B bulk; custom = personalised packaging / hampers';
