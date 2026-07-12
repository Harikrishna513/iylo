import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { createServiceClient } from "@/lib/supabase";

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
    return NextResponse.json({ error: "CSV must include header and at least one row" }, { status: 400 });
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const required = ["slug", "name", "category_slug"];
  for (const col of required) {
    if (!header.includes(col)) {
      return NextResponse.json({ error: `Missing column: ${col}` }, { status: 400 });
    }
  }

  const supabase = createServiceClient();
  const { data: categories } = await supabase.from("categories").select("id, slug");
  const catBySlug = new Map((categories ?? []).map((c) => [c.slug, c.id]));

  let imported = 0;
  let updated = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim();
    });

    const slug = row.slug;
    const name = row.name;
    const categorySlug = row.category_slug;
    if (!slug || !name || !categorySlug) {
      errors.push(`Row ${i + 1}: slug, name, and category_slug are required`);
      continue;
    }

    const categoryId = catBySlug.get(categorySlug);
    if (!categoryId) {
      errors.push(`Row ${i + 1}: unknown category "${categorySlug}"`);
      continue;
    }

    const payload = {
      slug,
      name,
      category_id: categoryId,
      short_description: row.short_description || name,
      base_price: row.base_price ? Number(row.base_price) : null,
      is_active: row.is_active ? row.is_active.toLowerCase() !== "false" : true,
      display_order: row.display_order ? Number(row.display_order) : i,
    };

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
      if (error) errors.push(`Row ${i + 1}: ${error.message}`);
      else updated++;
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) errors.push(`Row ${i + 1}: ${error.message}`);
      else imported++;
    }
  }

  return NextResponse.json({ imported, updated, errors });
}
