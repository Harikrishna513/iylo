import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { createAdminProduct, getAdminCategories } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase";
import { slugifyProductName, uniquifySlug } from "@/lib/slug";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const categories = await getAdminCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const category_id = String(body.category_id ?? "").trim();

  if (!name || !category_id) {
    return NextResponse.json(
      { error: "Name and category are required" },
      { status: 400 }
    );
  }

  const baseSlug = slugifyProductName(String(body.slug ?? name));
  if (!baseSlug) {
    return NextResponse.json(
      { error: "Could not generate a product URL from the name" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data: existing } = await supabase.from("products").select("slug");
  const used = new Set((existing ?? []).map((p) => p.slug as string));
  const slug = uniquifySlug(baseSlug, used);

  try {
    const product = await createAdminProduct({
      name,
      slug,
      category_id,
      short_description: body.short_description
        ? String(body.short_description)
        : undefined,
      base_price:
        body.base_price !== undefined && body.base_price !== ""
          ? Number(body.base_price)
          : null,
      sku: body.sku ? String(body.sku) : undefined,
      is_active: body.is_active !== false,
    });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
