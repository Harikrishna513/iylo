"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LIGHT } from "@/lib/page-theme";
import { useProductFly } from "@/hooks/use-product-fly";

export default function AccountWishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { flyAddToCart } = useProductFly();

  return (
    <div>
      <h2 className={cn(LIGHT.title, "mb-2 text-2xl")}>Wishlist</h2>
      <p className={cn("mb-6", LIGHT.subtitle)}>
        Items you&apos;ve saved — add them to your cart anytime.
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Heart className="mb-4 h-12 w-12 text-maroon/20" strokeWidth={1.25} />
          <p className={LIGHT.muted}>Your wishlist is empty.</p>
          <Button variant="brown" className="mt-8" asChild>
            <Link href="/products">Browse Menu</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((p) => (
            <li key={p.id} className={cn("flex gap-4 border p-4", LIGHT.border)}>
              <Link
                href={`/products/${p.id}`}
                data-fly-source
                className="relative h-20 w-20 shrink-0 overflow-hidden bg-maroon/5"
              >
                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="80px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/products/${p.id}`}
                  className="font-medium text-maroon hover:text-light-blue"
                >
                  {p.name}
                </Link>
                <p className="text-sm text-light-blue">{formatPrice(p.price)}</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      flyAddToCart(p, { event: e });
                      removeItem(p.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-light-blue hover:underline"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(p.id)}
                    className="text-xs uppercase tracking-widest text-maroon/40 hover:text-rosewood"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
