"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";
import { LIGHT } from "@/lib/page-theme";
import { useProductFly } from "@/hooks/use-product-fly";

export default function AccountWishlistPage() {
  const { user } = useAuth();
  const { flyAddToCart } = useProductFly();
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
      <h2 className={cn(LIGHT.title, "mb-6 text-2xl")}>Wishlist</h2>
      {products.length === 0 ? (
        <p className={LIGHT.muted}>Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((p) => (
            <li key={p.id} className={cn("flex gap-4 border p-4", LIGHT.border)}>
              <div data-fly-source className="relative h-20 w-20 shrink-0 overflow-hidden bg-maroon/5">
                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${p.id}`} className="font-medium text-maroon hover:text-light-blue">
                  {p.name}
                </Link>
                <p className="text-sm text-light-blue">{formatPrice(p.price)}</p>
                <button
                  type="button"
                  onClick={(e) => flyAddToCart(p, { event: e })}
                  className="mt-auto self-start text-xs uppercase tracking-widest text-light-blue hover:underline"
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
