/**
 * Import all products from IYLO-Bakery-Products.csv into Supabase.
 * Run: npx tsx scripts/seed-products.ts
 */
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  try {
    const envPath = join(process.cwd(), ".env");
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env optional when vars already set
  }
}

loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_MAP: Record<string, string> = {
  Viennoiserie: "viennoiserie",
  "Cake Slices": "cake-slices",
  Breads: "breads",
  Tarts: "tarts",
  Cookies: "cookies",
  "Celebration Cakes": "celebration-cakes",
};

interface CsvRow {
  name: string;
  category: string;
  price: number | null;
  sizes: string;
  description: string;
  diet: string;
}

const CATEGORIES = [
  { slug: "celebration-cakes", name: "Celebration Cakes", display_order: 1 },
  { slug: "cookies", name: "Cookies", display_order: 2 },
  { slug: "breads", name: "Breads", display_order: 3 },
  { slug: "viennoiserie", name: "Viennoiserie", display_order: 5 },
  { slug: "tarts", name: "Tarts", display_order: 6 },
  { slug: "cake-slices", name: "Cake Slices", display_order: 9 },
];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split("\n");
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 6) continue;

    const name = cols[0]?.trim();
    const category = cols[1]?.trim();
    const priceStr = cols[2]?.trim();
    const sizes = cols[4]?.trim() || "1 pc";
    const description = cols[5]?.trim() || "";
    const diet = cols[9]?.trim() || "Eggless";

    if (!name) continue;

    rows.push({
      name,
      category,
      price: priceStr ? parseFloat(priceStr) : null,
      sizes,
      description,
      diet: diet.toLowerCase().includes("eggless") ? "eggless" : "veg",
    });
  }

  return rows;
}

function parseSizes(sizes: string, basePrice: number | null): Array<{ name: string; price: number }> {
  if (sizes.includes("0.5kg")) {
    const prices = basePrice
      ? [basePrice, Math.round(basePrice * 1.8), Math.round(basePrice * 3.2)]
      : [0, 0, 0];
    return [
      { name: "0.5 kg", price: prices[0] },
      { name: "1 kg", price: prices[1] },
      { name: "2 kg", price: prices[2] },
    ];
  }
  if (sizes.includes("pack of 10")) {
    const unit = basePrice ?? 0;
    return [
      { name: "Individual", price: unit || 0 },
      { name: "Pack of 10", price: unit ? unit * 9 : 0 },
      { name: "Pack of 20", price: unit ? unit * 17 : 0 },
    ];
  }
  if (sizes.includes("1-5")) {
    return [{ name: "1 pc", price: basePrice ?? 0 }];
  }
  if (sizes.includes("1-4")) {
    return [{ name: "1 pc", price: basePrice ?? 0 }];
  }
  return [{ name: "1 pc", price: basePrice ?? 0 }];
}

async function main() {
  const csvPath = join(process.cwd(), "IYLO-Bakery-Products.csv");
  const content = readFileSync(csvPath, "utf-8");
  const products = parseCsv(content);

  // Ensure categories exist
  for (const cat of CATEGORIES) {
    await supabase.from("categories").upsert(
      {
        slug: cat.slug,
        name: cat.name,
        display_order: cat.display_order,
        is_active: true,
        show_in_nav: true,
        show_on_homepage: true,
      },
      { onConflict: "slug" }
    );
  }

  const { data: categories } = await supabase.from("categories").select("id, slug");
  const catMap = new Map((categories ?? []).map((c) => [c.slug, c.id]));

  let order = 1;
  for (const p of products) {
    const catSlug = CATEGORY_MAP[p.category] ?? "viennoiserie";
    const categoryId = catMap.get(catSlug);
    if (!categoryId) {
      console.warn(`Skip ${p.name}: category ${catSlug} not found`);
      continue;
    }

    const slug = slugify(p.name);
    const sku = `IYLO-${slug.slice(0, 8).toUpperCase()}-${String(order).padStart(3, "0")}`;

    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          sku,
          slug,
          name: p.name,
          category_id: categoryId,
          short_description: p.description || p.name,
          base_price: p.price,
          diet_type: p.diet as "eggless" | "veg",
          is_available_daily: true,
          pickup_available: true,
          delivery_available: true,
          is_active: true,
          display_order: order,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error || !product) {
      console.error(`Failed ${p.name}:`, error?.message);
      continue;
    }

    const variants = parseSizes(p.sizes, p.price);
    for (let vi = 0; vi < variants.length; vi++) {
      const v = variants[vi];
      const vSku = `${sku}-${v.name.replace(/\s+/g, "").toUpperCase()}`;
      await supabase.from("product_variants").upsert(
        {
          product_id: product.id,
          sku: vSku,
          name: v.name,
          price: v.price || p.price || 0,
          stock_quantity: 50,
          display_order: vi + 1,
          is_active: true,
        },
        { onConflict: "sku" }
      );
    }

    console.log(`✓ ${p.name} (${variants.length} variants)`);
    order++;
  }

  // Seed default coupons
  await supabase.from("coupons").upsert(
    [
      {
        code: "IYLOLOVE",
        description: "10% off your order",
        discount_type: "percentage",
        discount_value: 10,
        min_order_amount: 499,
        is_active: true,
      },
      {
        code: "BANGALORE10",
        description: "10% off Bangalore delivery",
        discount_type: "percentage",
        discount_value: 10,
        min_order_amount: 499,
        is_active: true,
      },
    ],
    { onConflict: "code" }
  );

  console.log("\nDone! Imported", products.length, "products.");
}

main().catch(console.error);
