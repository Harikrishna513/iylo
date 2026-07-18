import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { slugifyProductName, uniquifySlug } from "@/lib/slug";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

type CatRow = { id: string; slug: string; name: string };

function resolveCategory(categories: CatRow[], raw: string): CatRow | undefined {
  const value = raw.trim().toLowerCase();
  if (!value) return undefined;
  const asSlug = slugifyProductName(raw);
  return categories.find(
    (c) =>
      c.slug.toLowerCase() === value ||
      c.name.toLowerCase() === value ||
      c.slug === asSlug ||
      slugifyProductName(c.name) === asSlug
  );
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "CSV file required" }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return NextResponse.json(
      { error: "CSV must include header and at least one row" },
      { status: 400 }
    );
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  if (!header.includes("name")) {
    return NextResponse.json({ error: "Missing column: name" }, { status: 400 });
  }
  if (!header.includes("category") && !header.includes("category_slug")) {
    return NextResponse.json(
      { error: "Missing column: category (or category_slug)" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data: categories } = await supabase.from("categories").select("id, slug, name");
  const catRows = (categories ?? []) as CatRow[];

  const { data: existingProducts } = await supabase.from("products").select("id, slug");
  const slugToId = new Map((existingProducts ?? []).map((p) => [p.slug, p.id as string]));
  const usedSlugs = new Set((existingProducts ?? []).map((p) => p.slug as string));

  let imported = 0;
  let updated = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim();
    });

    const name = row.name;
    if (!name) {
      errors.push(`Row ${i + 1}: name is required`);
      continue;
    }

    const categoryRaw = row.category || row.category_slug || "";
    const category = resolveCategory(catRows, categoryRaw);
    if (!category) {
      errors.push(
        `Row ${i + 1}: unknown category "${categoryRaw}". Use a catalogue category name (e.g. Celebration Cakes).`
      );
      continue;
    }

    const baseSlug = slugifyProductName(row.slug || name);
    if (!baseSlug) {
      errors.push(`Row ${i + 1}: could not generate a slug from the product name`);
      continue;
    }

    // Prefer matching an existing product by explicit slug, else by auto slug from name
    const existingId =
      (row.slug && slugToId.get(slugifyProductName(row.slug))) ||
      slugToId.get(baseSlug) ||
      null;

    let slug = baseSlug;
    if (!existingId) {
      slug = uniquifySlug(baseSlug, usedSlugs);
      usedSlugs.add(slug);
    } else if (row.slug) {
      slug = slugifyProductName(row.slug);
    }

    const payload: Record<string, unknown> = {
      slug,
      name,
      category_id: category.id,
      short_description: row.short_description || name,
      base_price: row.base_price ? Number(row.base_price) : null,
      is_active: row.is_active ? row.is_active.toLowerCase() !== "false" : true,
      display_order: row.display_order ? Number(row.display_order) : i,
    };
    if (row.sku) payload.sku = row.sku;

    if (existingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", existingId);
      if (error) errors.push(`Row ${i + 1}: ${error.message}`);
      else {
        updated++;
        slugToId.set(slug, existingId);
      }
    } else {
      if (!payload.sku) {
        payload.sku = `IYLO-${slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 24)}-${i}`;
      }
      const { data: created, error } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (error) errors.push(`Row ${i + 1}: ${error.message}`);
      else {
        imported++;
        if (created?.id) slugToId.set(slug, created.id);
      }
    }
  }

  return NextResponse.json({ imported, updated, errors });
}
