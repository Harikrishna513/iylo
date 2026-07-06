import { supabase } from "@/lib/supabase";

const SESSION_KEY = "iylo_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export interface CartLine {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  giftWrap: boolean;
  image: string;
}

export async function getOrCreateCart(userId?: string | null) {
  if (userId) {
    const { data: existing } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) return existing.id;

    const { data: created, error } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    if (error) throw error;
    return created.id;
  }

  const sessionId = getSessionId();
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ session_id: sessionId })
    .select("id")
    .single();
  if (error) throw error;
  return created.id;
}

export async function fetchCartItems(userId?: string | null): Promise<CartLine[]> {
  const cartId = await getOrCreateCart(userId);
  const { data } = await supabase
    .from("cart_items")
    .select(
      `id, quantity, gift_wrap, product_variant_id,
       product_variants(id, name, price, offer_price, product_id,
         products(id, slug, name, product_images(public_url, is_primary)))`
    )
    .eq("cart_id", cartId);

  if (!data?.length) return [];

  return data.map((row) => {
    const variant = row.product_variants as unknown as {
      id: string;
      name: string;
      price: number;
      offer_price: number | null;
      products: {
        id: string;
        slug: string;
        name: string;
        product_images: Array<{ public_url: string; is_primary: boolean }>;
      };
    };
    const images = variant.products.product_images ?? [];
    const primary = images.find((i) => i.is_primary) ?? images[0];

    return {
      variantId: variant.id,
      productId: variant.products.id,
      productSlug: variant.products.slug,
      productName: variant.products.name,
      variantName: variant.name,
      price: Number(variant.offer_price ?? variant.price),
      quantity: row.quantity,
      giftWrap: row.gift_wrap,
      image: primary?.public_url ?? "",
    };
  });
}

export async function upsertCartItem(
  userId: string | null | undefined,
  variantId: string,
  quantity: number,
  giftWrap = false
) {
  const cartId = await getOrCreateCart(userId);
  const { error } = await supabase.from("cart_items").upsert(
    {
      cart_id: cartId,
      product_variant_id: variantId,
      quantity,
      gift_wrap: giftWrap,
    },
    { onConflict: "cart_id,product_variant_id" }
  );
  if (error) throw error;
}

export async function removeCartItem(
  userId: string | null | undefined,
  variantId: string
) {
  const cartId = await getOrCreateCart(userId);
  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId)
    .eq("product_variant_id", variantId);
}

export async function clearCartDb(userId?: string | null) {
  const cartId = await getOrCreateCart(userId);
  await supabase.from("cart_items").delete().eq("cart_id", cartId);
}

export async function mergeGuestCart(userId: string) {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return;

  const { data: guestCart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (!guestCart) return;

  const userCartId = await getOrCreateCart(userId);
  const { data: guestItems } = await supabase
    .from("cart_items")
    .select("product_variant_id, quantity, gift_wrap")
    .eq("cart_id", guestCart.id);

  for (const item of guestItems ?? []) {
    await supabase.from("cart_items").upsert(
      {
        cart_id: userCartId,
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        gift_wrap: item.gift_wrap,
      },
      { onConflict: "cart_id,product_variant_id" }
    );
  }

  await supabase.from("carts").delete().eq("id", guestCart.id);
}
