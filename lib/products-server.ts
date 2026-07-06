import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/types";
import { catalogProducts } from "@/data/catalog-products";
import { ProductImages as img } from "@/lib/product-images";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const imageBySlug: Record<string, string> = {};
for (const p of catalogProducts) {
  imageBySlug[p.id] = p.image;
}

export interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string | null;
  base_price: number | null;
  offer_price: number | null;
  diet_type: string;
  is_available_daily: boolean;
  is_bestseller: boolean;
  is_seasonal: boolean;
  is_new: boolean;
  is_active: boolean;
  pickup_available: boolean;
  delivery_available: boolean;
  pan_india_shipping: boolean;
  preparation_time: string | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  categories: { slug: string; name: string } | null;
  product_variants: Array<{
    id: string;
    name: string;
    price: number;
    offer_price: number | null;
    stock_quantity: number;
    is_active: boolean;
  }>;
  product_images: Array<{
    public_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

export function mapDbProductToFrontend(row: DbProductRow): Product & {
  variantId?: string;
  dbId: string;
} {
  const categorySlug = ((row.categories as unknown as { slug: string } | null)?.slug ?? "viennoiserie") as Product["category"];
  const activeVariants = (row.product_variants ?? []).filter((v) => v.is_active);
  const defaultVariant = activeVariants[0];
  const price =
    defaultVariant?.offer_price ??
    defaultVariant?.price ??
    row.offer_price ??
    row.base_price ??
    0;

  const images = (row.product_images ?? [])
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => i.public_url);

  const fallbackImage = imageBySlug[row.slug] ?? img.butterCroissant;

  return {
    id: row.slug,
    dbId: row.id,
    variantId: defaultVariant?.id,
    name: row.name,
    description: row.short_description,
    longDescription: row.long_description ?? undefined,
    price: Number(price),
    category: categorySlug,
    image: images[0] ?? fallbackImage,
    images: images.length ? images : [fallbackImage],
    badge: row.is_bestseller
      ? "Bestseller"
      : row.is_seasonal
        ? "Seasonal"
        : row.is_new
          ? "New"
          : undefined,
    isBestSeller: row.is_bestseller,
    isNew: row.is_new,
    isAvailableToday: row.is_available_daily,
    shipsPanIndia: row.pan_india_shipping,
    preparationTime: row.preparation_time ?? undefined,
    ingredients: row.ingredients ?? undefined,
    allergens: row.allergens ?? undefined,
  };
}

const PRODUCT_SELECT = `
  id, slug, name, short_description, long_description, base_price, offer_price,
  diet_type, is_available_daily, is_bestseller, is_seasonal, is_new, is_active,
  pickup_available, delivery_available, pan_india_shipping, preparation_time,
  ingredients, allergens,
  categories(slug, name),
  product_variants(id, name, price, offer_price, stock_quantity, is_active),
  product_images(public_url, is_primary, display_order)
`;

export async function fetchProducts(
  supabase: SupabaseClient,
  opts?: { categorySlug?: string; limit?: number }
): Promise<(Product & { variantId?: string; dbId: string })[]> {
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (opts?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .maybeSingle();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;

  if (error || !data?.length) {
    return catalogProducts.map((p) => ({
      ...p,
      dbId: p.id,
      variantId: undefined,
    }));
  }

  return (data as unknown as DbProductRow[]).map(mapDbProductToFrontend);
}

export async function fetchProductBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<(Product & { variantId?: string; dbId: string; variants?: DbProductRow["product_variants"] }) | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    const fallback = catalogProducts.find((p) => p.id === slug);
    if (!fallback) return null;
    return { ...fallback, dbId: fallback.id };
  }

  const row = data as unknown as DbProductRow;
  const mapped = mapDbProductToFrontend(row);
  return {
    ...mapped,
    variants: row.product_variants?.filter((v) => v.is_active),
  };
}

export { slugify };
