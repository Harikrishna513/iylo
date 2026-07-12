/**
 * Seed Supabase from data/catalog-products.ts (with variants).
 * Run: npm run seed-products
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { catalogProducts } from "../data/catalog-products";
import { inferProductVariants } from "../lib/product-variants";

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
    // optional
  }
}

loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORIES = [
  { slug: "celebration-cakes", name: "Celebration Cakes", display_order: 1 },
  { slug: "cookies", name: "Cookies", display_order: 2 },
  { slug: "breads", name: "Breads", display_order: 3 },
  { slug: "viennoiserie", name: "Viennoiserie", display_order: 5 },
  { slug: "tarts", name: "Tarts", display_order: 6 },
  { slug: "cake-slices", name: "Cake Slices", display_order: 9 },
  { slug: "cheesecakes", name: "Cheesecakes", display_order: 10 },
];

async function seedFromCatalog() {
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
  for (const p of catalogProducts) {
    const categoryId = catMap.get(p.category);
    if (!categoryId) {
      console.warn(`Skip ${p.name}: category ${p.category} not found`);
      continue;
    }

    const sku = `IYLO-${p.id.slice(0, 12).toUpperCase()}-${String(order).padStart(3, "0")}`;
    const availabilityType =
      p.category === "celebration-cakes" || p.isPreOrder ? "pre_order" : "daily";

    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          sku,
          slug: p.id,
          name: p.name,
          category_id: categoryId,
          short_description: p.description,
          long_description: p.longDescription ?? null,
          base_price: p.price > 0 ? p.price : null,
          diet_type: "eggless",
          availability_type: availabilityType,
          is_available_daily: p.isAvailableToday ?? true,
          is_bestseller: p.isBestSeller ?? false,
          is_seasonal: p.isLimited ?? false,
          is_new: p.isNew ?? false,
          pickup_available: true,
          delivery_available: true,
          pan_india_shipping: p.shipsPanIndia ?? false,
          preparation_time: p.preparationTime ?? null,
          ingredients: p.ingredients ?? [],
          allergens: p.allergens ?? [],
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

    const variants = inferProductVariants(p);
    for (let vi = 0; vi < variants.length; vi++) {
      const v = variants[vi];
      const vSku = `${sku}-${v.name.replace(/[^a-z0-9]/gi, "").toUpperCase()}`;
      await supabase.from("product_variants").upsert(
        {
          product_id: product.id,
          sku: vSku,
          name: v.name,
          price: v.price,
          stock_quantity: 50,
          display_order: vi + 1,
          is_active: true,
        },
        { onConflict: "sku" }
      );
    }

    if (p.image) {
      await supabase.from("product_images").delete().eq("product_id", product.id);
      await supabase.from("product_images").insert({
        product_id: product.id,
        storage_path: p.image,
        public_url: p.image,
        alt_text: p.name,
        is_primary: true,
        display_order: 1,
      });
    }

    console.log(`✓ ${p.name} (${variants.length} variant${variants.length > 1 ? "s" : ""})`);
    order++;
  }

  console.log(`\nDone! Seeded ${catalogProducts.length} products from catalog.`);
}

async function main() {
  const csvPath = join(process.cwd(), "IYLO-Bakery-Products.csv");
  if (existsSync(csvPath)) {
    console.log("CSV found — run legacy CSV import separately if needed.");
  }
  await seedFromCatalog();
}

main().catch(console.error);
