import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import {
  getAdminProductById,
  updateAdminProduct,
  type AdminProductUpdateInput,
} from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase";
import { slugifyProductName } from "@/lib/slug";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const body = await request.json();

  const input: AdminProductUpdateInput = {};

  if (body.name !== undefined) input.name = String(body.name);
  if (body.slug !== undefined && String(body.slug).trim()) {
    input.slug = slugifyProductName(String(body.slug));
  } else if (body.name !== undefined) {
    input.slug = slugifyProductName(String(body.name));
  }
  if (body.category_id !== undefined) input.category_id = String(body.category_id);
  if (body.short_description !== undefined) {
    input.short_description = String(body.short_description);
  }
  if (body.long_description !== undefined) {
    input.long_description =
      body.long_description === null || body.long_description === ""
        ? null
        : String(body.long_description);
  }
  if (body.base_price !== undefined) {
    input.base_price =
      body.base_price === "" || body.base_price === null
        ? null
        : Number(body.base_price);
  }
  if (body.offer_price !== undefined) {
    input.offer_price =
      body.offer_price === "" || body.offer_price === null
        ? null
        : Number(body.offer_price);
  }
  if (body.diet_type !== undefined) input.diet_type = String(body.diet_type);
  if (body.availability_type !== undefined) {
    input.availability_type = String(body.availability_type);
  }
  if (body.is_bestseller !== undefined) input.is_bestseller = Boolean(body.is_bestseller);
  if (body.is_seasonal !== undefined) input.is_seasonal = Boolean(body.is_seasonal);
  if (body.is_new !== undefined) input.is_new = Boolean(body.is_new);
  if (body.is_featured !== undefined) input.is_featured = Boolean(body.is_featured);
  if (body.is_active !== undefined) input.is_active = Boolean(body.is_active);
  if (body.preparation_time !== undefined) {
    input.preparation_time =
      body.preparation_time === "" || body.preparation_time === null
        ? null
        : String(body.preparation_time);
  }
  if (body.shelf_life !== undefined) {
    input.shelf_life =
      body.shelf_life === "" || body.shelf_life === null
        ? null
        : String(body.shelf_life);
  }
  if (body.weight_label !== undefined) {
    input.weight_label =
      body.weight_label === "" || body.weight_label === null
        ? null
        : String(body.weight_label);
  }
  if (body.display_order !== undefined) {
    input.display_order = Number(body.display_order);
  }

  try {
    const product = await updateAdminProduct(id, input);
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
