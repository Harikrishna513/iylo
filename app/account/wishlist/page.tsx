"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";

export default function AccountWishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("wishlist")
      .select(
        `products(id, slug, name, short_description, base_price, offer_price,
         product_images(public_url, is_primary),
         product_variants(id, price, offer_price, is_active))`
      )
      .eq("user_id", user.id)
      .then(({ data }) => {
        const mapped = (data ?? []).map((row) => {
          const p = row.products as unknown as {
            slug: string;
            name: string;
            short_description: string;
            base_price: number | null;
            product_images: Array<{ public_url: string; is_primary: boolean }>;
            product_variants: Array<{ id: string; price: number; offer_price: number | null; is_active: boolean }>;
          };
          const variant = p.product_variants?.find((v) => v.is_active);
          const img = p.product_images?.find((i) => i.is_primary) ?? p.product_images?.[0];
          return {
            id: p.slug,
            variantId: variant?.id,
            name: p.name,
            description: p.short_description,
            price: Number(variant?.offer_price ?? variant?.price ?? p.base_price ?? 0),
            category: "viennoiserie" as const,
            image: img?.public_url ?? "/products/placeholder.jpg",
          };
        });
        setProducts(mapped);
      });
  }, [user]);

  return (
    <div>
      <h2 className="mb-6 text-lg text-ivory">Wishlist</h2>
      {products.length === 0 ? (
        <p className="text-muted">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((p) => (
            <li key={p.id} className="flex gap-4 border border-ivory/10 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${p.id}`} className="text-ivory hover:text-gold">
                  {p.name}
                </Link>
                <p className="text-sm text-gold">{formatPrice(p.price)}</p>
                <button
                  type="button"
                  onClick={() => addItem(p)}
                  className="mt-auto self-start text-xs uppercase tracking-widest text-gold hover:underline"
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
