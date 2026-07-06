import { supabase } from "@/lib/supabase";

const LOCAL_KEY = "iylo_wishlist";

export function getLocalWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function setLocalWishlist(slugs: string[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(slugs));
}

export async function fetchWishlistSlugs(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("wishlist")
    .select("products(slug)")
    .eq("user_id", userId);

  return (data ?? [])
    .map((r) => (r.products as unknown as { slug: string } | null)?.slug)
    .filter(Boolean) as string[];
}

export async function addToWishlistDb(userId: string, productId: string) {
  await supabase
    .from("wishlist")
    .upsert({ user_id: userId, product_id: productId }, { onConflict: "user_id,product_id" });
}

export async function removeFromWishlistDb(userId: string, productId: string) {
  await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function mergeLocalWishlist(userId: string) {
  const slugs = getLocalWishlist();
  if (!slugs.length) return;

  const { data: products } = await supabase
    .from("products")
    .select("id, slug")
    .in("slug", slugs);

  for (const p of products ?? []) {
    await addToWishlistDb(userId, p.id);
  }
  localStorage.removeItem(LOCAL_KEY);
}

export async function getProductIdBySlug(slug: string): Promise<string | null> {
  const { data } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return data?.id ?? null;
}
