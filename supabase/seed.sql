
INSERT INTO public.site_settings (key, value, description) VALUES
  ('brand', '{
    "name": "IYLO Bakehouse",
    "tagline": "Modern Baking, Made Eggless",
    "description": "A contemporary and premium bakehouse dedicated to modern baking and specialising in eggless creations, across sweet and savoury products.",
    "primary_color": "#5b3a29",
    "secondary_color": "#faf6f0",
    "accent_color": "#d4af37"
  }', 'Brand identity'),
  ('contact', '{
    "phone": "+918105760776",
    "whatsapp": "+918105760776",
    "email": "hello@iylobakehouse.com",
    "instagram": "https://instagram.com/iylobakehouse",
    "google_maps_url": "https://maps.app.goo.gl/yJ5Ypo7Tm168wiHr7",
    "google_review_url": "https://g.page/r/iylo-bakehouse/review",
    "address": "No. 476/65, 7th Main, 33rd Cross, 4th Block, Jayanagar, Bangalore - 560011",
    "landmark": "Next to Ajfan Dates and Nuts, Jayanagar, 4th Block"
  }', 'Contact & social'),
  ('delivery', '{
    "enabled": true,
    "radius_km": 15,
    "min_order_amount": 499,
    "free_delivery_above": 999,
    "cod_enabled": true,
    "cod_fee": 0,
    "partners": ["shiprocket", "dunzo", "porter", "shadowfax"]
  }', 'Delivery rules'),
  ('pickup', '{
    "enabled": true,
    "hours": "11:00 AM - 6:00 PM",
    "message": "We''d love to welcome you to our bakery and let you experience the aroma of our freshly baked creations."
  }', 'Store pickup'),
  ('preorder', '{
    "enabled": true,
    "min_lead_days": 1,
    "max_lead_days": 7,
    "default_cutoff_time": "18:00",
    "weekend_boxes": true,
    "festival_specials": true
  }', 'Pre-order settings'),
  ('payments', '{
    "razorpay_enabled": true,
    "methods": ["upi", "card", "debit_card", "netbanking", "cod"]
  }', 'Payment gateway'),
  ('corporate', '{
    "contact_name": "",
    "phone": "",
    "email": "",
    "gst_available": true
  }', 'B2B / corporate orders'),
  ('auth', '{
    "login_required_for_order": true,
    "email_verification_required": true,
    "allow_guest_browsing": true
  }', 'Auth policy')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.store_hours (day_of_week, open_time, close_time, is_closed, label) VALUES
  (0, '10:00', '20:00', false, 'Sunday'),
  (1, NULL, NULL, true, 'Monday'),
  (2, NULL, NULL, true, 'Tuesday'),
  (3, '11:00', '20:00', false, 'Wednesday'),
  (4, '11:00', '20:00', false, 'Thursday'),
  (5, '11:00', '20:00', false, 'Friday'),
  (6, '10:00', '20:00', false, 'Saturday')
ON CONFLICT (day_of_week) DO NOTHING;

INSERT INTO public.preorder_rules (name, fulfillment_type, cutoff_time, min_lead_days, max_lead_days) VALUES
  ('Default delivery cutoff', 'delivery', '18:00', 1, 7),
  ('Default pickup cutoff', 'pickup', '17:00', 0, 7),
  ('PAN India shipping', 'pan_india_shipping', '14:00', 2, 14);

INSERT INTO public.categories (slug, name, display_order, show_on_homepage, show_in_nav) VALUES
  ('celebration-cakes', 'Celebration Cakes', 1, true, true),
  ('cookies', 'Cookies', 2, true, true),
  ('breads', 'Breads', 3, true, true),
  ('custom-cakes', 'Custom Cakes', 4, true, true),
  ('viennoiserie', 'Viennoiserie', 5, true, true),
  ('tarts', 'Tarts', 6, true, true),
  ('gourmet-desserts', 'Gourmet Desserts', 7, true, true),
  ('gifting', 'Gifting', 8, true, false),
  ('cake-slices', 'Cake Slices', 9, false, true),
  ('cheesecakes', 'Cheesecakes', 10, false, true),
  ('retail', 'Retail Products', 11, false, true),
  ('weekend-specials', 'Weekend Specials', 12, false, true),
  ('seasonal', 'Seasonal Specials', 13, false, true)
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM public.categories WHERE slug = 'viennoiserie')
INSERT INTO public.products (
  sku, slug, name, category_id, short_description, base_price,
  diet_type, is_available_daily, pickup_available, delivery_available, display_order
)
SELECT v.sku, v.slug, v.name, cat.id, v.desc, v.price, 'eggless', true, true, true, v.ord
FROM cat, (VALUES
  ('IYLO-VC-001', 'butter-croissant', 'Butter Croissant', 'Flaky and buttery pastry hand laminated to create beautiful melt in your mouth layers', 180, 1),
  ('IYLO-VC-002', 'pain-au-chocolat', 'Pain Au Chocolat', 'A French classic consisting of flaky buttery pastry layers, stuffed with 46.5% dark chocolate', 220, 2),
  ('IYLO-VC-003', 'almond-croissant', 'Almond Croissant', 'A twice baked butter croissant, filled with an almond frangipane and topped with sliced almonds', 220, 3),
  ('IYLO-VC-004', 'caramelised-onion-mushroom-pain-suisse', 'Caramelised Onion Mushroom Pain Suisse', 'Buttery pastry layers filled with caramelised onions and mushrooms with a hint of rosemary', 235, 4),
  ('IYLO-VC-005', 'romesco-supreme-croissant', 'Romesco Supreme Croissant', 'The viral supreme croissant, filled with a spicy romesco sauce, garnished with roasted almond slices', 235, 5),
  ('IYLO-VC-006', 'mango-lime-danish', 'Mango Lime Danish', 'Seasonal fresh mango and lime compote on pastry cream in flaky pastry layers', 235, 6),
  ('IYLO-VC-007', 'strawberry-mascarpone-croissant', 'Strawberry Mascarpone Croissant', 'Flaky croissant with mascarpone cream and zesty strawberry compote', 240, 7),
  ('IYLO-VC-008', 'roasted-sweet-potato-curry-leaf-danish', 'Roasted Sweet Potato Curry Leaf Danish', 'Croissant base with cream cheese, curry leaf pudi and roasted sweet potato', 240, 8)
) AS v(sku, slug, name, desc, price, ord)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id, sku, name, price, stock_quantity, display_order)
SELECT p.id, p.sku || '-1PC', '1 pc', p.base_price, 50, 1
FROM public.products p
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_variants pv WHERE pv.product_id = p.id
);

INSERT INTO public.delivery_zones (name, pincodes, delivery_fee, estimated_minutes, min_order_amount) VALUES
  ('Jayanagar & South Bangalore', ARRAY['560011','560041','560070','560078','560085'], 49, 45, 499),
  ('Central Bangalore', ARRAY['560001','560002','560025','560027','560038'], 79, 60, 499);

INSERT INTO public.gifting_options (title, description, cta_label, cta_link, is_preorder, display_order) VALUES
  ('Corporate Gifting', 'Curated hampers for teams and clients', 'Enquire', '/#corporate', true, 1),
  ('Festive Collections', 'Seasonal gift boxes for celebrations', 'Explore', '/#gifting', true, 2),
  ('Celebration Hampers', 'Premium boxes for birthdays & milestones', 'Order', '/#gifting', true, 3),
  ('Custom Packaging', 'Personalised messages and bespoke packing', 'Contact Us', '/#contact', true, 4);

INSERT INTO public.announcements (title, description, announcement_type, tag, is_active, display_order) VALUES
  ('Free delivery above Rs 999', 'Across Bangalore on eligible orders', 'banner', 'Delivery', true, 1),
  ('Pre-order weekend boxes', 'Order 1-2 days in advance', 'weekend_special', 'Weekend', true, 2);
