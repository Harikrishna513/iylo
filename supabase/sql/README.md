# IYLO — Supabase SQL Setup (SQL Editor)

Run these files **in order** in your Supabase project SQL Editor.

Your `.env` is already configured:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key (website / browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key (admin API, webhooks) — **never expose in frontend** |

Project URL from your env: `https://mrhdxnnmwsaupboklxyh.supabase.co`

---

## Step-by-step

### Step 0 — Open SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Open project **mrhdxnnmwsaupboklxyh**
3. Left sidebar → **SQL Editor** → **New query**

---

### Step 1 — Create tables

**File:** `supabase/sql/01-create-tables.sql`

1. Open the file in your code editor
2. Select all → Copy
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Expect: `Success. No rows returned`

Creates: extensions, enums, all tables, functions, triggers.

---

### Step 2 — Apply RLS (security)

**File:** `supabase/sql/02-apply-rls.sql`

1. New query in SQL Editor
2. Paste entire file → **Run**

Enables Row Level Security on every table + guest/customer/admin policies.

---

### Step 3 — Create indexes

**File:** `supabase/sql/03-create-indexes.sql`

1. New query → Paste → **Run**

Adds performance indexes + product search index.

---

### Step 4 — Seed data

**File:** `supabase/sql/04-seed-data.sql`

1. New query → Paste → **Run**

> SQL Editor runs as `postgres` and bypasses RLS, so seed works even after step 2.

Inserts:
- Site settings (delivery, pickup, brand, contact)
- Store hours (Mon–Tue closed)
- 13 categories
- 8 sample viennoiserie products
- Delivery zones, gifting options, announcements

---

### Step 5 — Storage buckets (optional, later)

**File:** `supabase/sql/05-storage-buckets.sql`

Run when you move images to Supabase Storage (not required for first launch if using `/public` folder).

---

### Step 6 — Create superadmin

**File:** `supabase/sql/06-create-admin.sql`

1. **Authentication** → **Users** → **Add user**
   - Email + password
   - Enable email confirmation (recommended)
2. Copy the user's **UUID**
3. Open `06-create-admin.sql`, replace `PASTE_YOUR_AUTH_USER_UUID`
4. Run in SQL Editor

---

### Step 7 — Auth settings (Dashboard)

**Authentication** → **Providers** → **Email**

| Setting | Value |
|---------|-------|
| Enable Email provider | ON |
| Confirm email | ON |
| Enable phone | OFF |

**Authentication** → **URL configuration**

| Setting | Value |
|---------|-------|
| Site URL | `https://iylo.vercel.app` (or `http://localhost:3000` for dev) |
| Redirect URLs | `http://localhost:3000/**`, `https://iylo.vercel.app/**` |

---

## Verify setup

Run in SQL Editor:

```sql
-- Tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- Seed data
SELECT slug, name FROM public.categories ORDER BY display_order;

-- RLS enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;

-- Admin user
SELECT role, user_id FROM public.admin_users;
```

---

## File order summary

| Order | File | What it does |
|-------|------|----------------|
| 01 | `01-create-tables.sql` | Tables, enums, functions, triggers |
| 02 | `02-apply-rls.sql` | Row Level Security policies |
| 03 | `03-create-indexes.sql` | Indexes |
| 04 | `04-seed-data.sql` | Initial IYLO data |
| 05 | `05-storage-buckets.sql` | Storage (optional) |
| 06 | `06-create-admin.sql` | Your superadmin account |

---

## If something fails

| Error | Fix |
|-------|-----|
| `type already exists` | You ran 01 twice. Use a fresh project or drop types/tables first |
| `relation already exists` | Skip 01 or reset database (Settings → Database → Reset) |
| `function is_admin does not exist` | Run 01 before 02 |
| `policy already exists` | Drop policies or reset DB before re-running 02 |
| RLS blocks inserts in seed | Run 04 **before** 02, OR temporarily use service role — **recommended order above avoids this** |

**Important:** Run **04-seed-data** before **02-apply-rls** if seed fails due to RLS.  
Alternative safe order: `01 → 04 → 02 → 03 → 06`

For seed with RLS already on, site_settings has public read but admin write — INSERT might need service role. Let me check - site_settings only has SELECT for public and ALL for admin. Seed INSERT would fail after RLS!

I need to fix this - either:
1. Change recommended order to 01 → 04 → 02 → 03
2. Or add a policy for seed / use service role
3. Or seed runs as postgres in SQL editor which bypasses RLS!

In Supabase SQL Editor, queries run as `postgres` role which **bypasses RLS** by default. So order 01 → 02 → 03 → 04 is fine for SQL Editor.

I'll note in README that SQL Editor runs as superuser and bypasses RLS.

---

## Alternative: Supabase CLI

```bash
supabase link --project-ref mrhdxnnmwsaupboklxyh
supabase db push   # uses supabase/migrations/ folder
```

The `supabase/sql/` folder is for **manual SQL Editor** workflow (what you asked for).
