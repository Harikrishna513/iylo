import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/types";
import { catalogProducts } from "@/data/catalog-products";
import { ProductImages as img } from "@/lib/product-images";
import {
  inferProductVariants,
  mapDbVariants,
  productRequiresPreOrder,
} from "@/lib/product-variants";

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
  availability_type: string;
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
    display_order: number;
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
  const categorySlug = ((row.categories as unknown as { slug: string } | null)?.slug ??
    "viennoiserie") as Product["category"];
  const dbVariants = mapDbVariants(row.product_variants ?? []);
  const activeVariants =
    dbVariants.length > 0
      ? dbVariants
      : inferProductVariants({
          id: row.slug,
          name: row.name,
          description: row.short_description,
          longDescription: row.long_description ?? undefined,
          price: Number(row.base_price ?? 0),
          category: categorySlug,
          image: "",
        });
  const defaultVariant = activeVariants[0];
  const price = defaultVariant?.price ?? Number(row.offer_price ?? row.base_price ?? 0);

  const images = (row.product_images ?? [])
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => i.public_url);

  const fallbackImage = imageBySlug[row.slug] ?? img.butterCroissant;

  const product: Product & { dbId: string } = {
    id: row.slug,
    dbId: row.id,
    variantId: defaultVariant?.id,
    variantName: defaultVariant?.name,
    variants: activeVariants,
    name: row.name,
    description: row.short_description,
    longDescription: row.long_description ?? undefined,
    price,
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
    isPreOrder:
      row.availability_type === "pre_order" || categorySlug === "celebration-cakes",
    isAvailableToday: row.is_available_daily,
    shipsPanIndia: row.pan_india_shipping,
    preparationTime: row.preparation_time ?? undefined,
    ingredients: row.ingredients ?? undefined,
    allergens: row.allergens ?? undefined,
  };

  if (productRequiresPreOrder(product)) {
    product.isPreOrder = true;
  }

  return product;
}

const PRODUCT_SELECT = `
  id, slug, name, short_description, long_description, base_price, offer_price,
  diet_type, availability_type, is_available_daily, is_bestseller, is_seasonal, is_new, is_active,
  pickup_available, delivery_available, pan_india_shipping, preparation_time,
  ingredients, allergens,
  categories(slug, name),
  product_variants(id, name, price, offer_price, stock_quantity, is_active, display_order),
  product_images(public_url, is_primary, display_order)
`;

function enrichCatalogProduct(p: Product): Product & { dbId: string } {
  const variants = inferProductVariants(p);
  const defaultVariant = variants[0];
  return {
    ...p,
    dbId: p.id,
    variants,
    variantId: defaultVariant?.id,
    variantName: defaultVariant?.name,
    price: defaultVariant?.price ?? p.price,
    isPreOrder: productRequiresPreOrder(p),
  };
}

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
    let list = catalogProducts.map(enrichCatalogProduct);
    if (opts?.categorySlug) {
      list = list.filter((p) => p.category === opts.categorySlug);
    }
    if (opts?.limit) list = list.slice(0, opts.limit);
    return list;
  }

  return (data as unknown as DbProductRow[]).map(mapDbProductToFrontend);
}

export async function fetchProductBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<(Product & { variantId?: string; dbId: string }) | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    const fallback = catalogProducts.find((p) => p.id === slug);
    if (!fallback) return null;
    return enrichCatalogProduct(fallback);
  }

  return mapDbProductToFrontend(data as unknown as DbProductRow);
}

export async function fetchAllProductSlugs(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  if (error || !data?.length) {
    return catalogProducts.map((p) => p.id);
  }

  return data.map((r) => r.slug);
}

export async function fetchRelatedProducts(
  supabase: SupabaseClient,
  product: Product & { dbId?: string },
  limit = 4
): Promise<(Product & { variantId?: string; dbId: string })[]> {
  const pickUnique = (
    items: (Product & { variantId?: string; dbId: string })[],
    excludeId: string
  ) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (item.id === excludeId || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  if (product.relatedProductIds?.length) {
    const explicit = await Promise.all(
      product.relatedProductIds.map((id) => fetchProductBySlug(supabase, id))
    );
    const related = pickUnique(
      explicit.filter(Boolean) as (Product & { variantId?: string; dbId: string })[],
      product.id
    );
    if (related.length) return related.slice(0, limit);
  }

  if (product.dbId) {
    const { data: recs } = await supabase
      .from("product_recommendations")
      .select("recommended_product_id, display_order")
      .eq("product_id", product.dbId)
      .eq("recommendation_type", "related")
      .order("display_order", { ascending: true })
      .limit(limit);

    if (recs?.length) {
      const order = new Map(
        recs.map((r, i) => [r.recommended_product_id as string, i])
      );
      const ids = recs.map((r) => r.recommended_product_id);

      const { data } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .in("id", ids)
        .eq("is_active", true);

      if (data?.length) {
        const mapped = (data as unknown as DbProductRow[])
          .map(mapDbProductToFrontend)
          .sort(
            (a, b) =>
              (order.get(a.dbId) ?? 999) - (order.get(b.dbId) ?? 999)
          );
        const related = pickUnique(mapped, product.id);
        if (related.length) return related.slice(0, limit);
      }
    }
  }

  const categoryProducts = await fetchProducts(supabase, {
    categorySlug: product.category,
    limit: limit + 6,
  });
  let related = pickUnique(categoryProducts, product.id).slice(0, limit);

  if (related.length < limit) {
    const allProducts = await fetchProducts(supabase, { limit: limit + 12 });
    const extras = pickUnique(allProducts, product.id).filter(
      (item) => !related.some((r) => r.id === item.id)
    );
    related = [...related, ...extras].slice(0, limit);
  }

  return related;
}

export { slugify };
