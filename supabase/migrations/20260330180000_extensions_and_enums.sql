-- IYLO Bakehouse — extensions & enums
-- Supabase Postgres 15+

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ── Admin & auth ──────────────────────────────────────────────
CREATE TYPE public.admin_role AS ENUM ('superadmin', 'admin');

-- ── Catalog ───────────────────────────────────────────────────
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

-- ── Commerce ──────────────────────────────────────────────────
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

-- ── Inventory ─────────────────────────────────────────────────
CREATE TYPE public.inventory_change_type AS ENUM (
  'restock',
  'sale',
  'adjustment',
  'return',
  'wastage'
);

-- ── Content ───────────────────────────────────────────────────
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
