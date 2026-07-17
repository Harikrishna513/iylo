"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore, FREE_DELIVERY_THRESHOLD } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { getAmountForFreeDelivery } from "@/lib/delivery";
import { Button } from "@/components/ui/button";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";
import { LIGHT } from "@/lib/page-theme";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, openCheckout } = useCartStore();
  const freeDeliveryRemaining = getAmountForFreeDelivery(subtotal());
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className={LIGHT.bg} style={{ paddingTop: SITE_HEADER_OFFSET_PX }}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-10">
        <p className={LIGHT.label}>Checkout</p>
        <h1 className={cn(LIGHT.title, "mt-2 text-4xl md:text-5xl")}>Your Cart</h1>
        <p className={cn("mt-2", LIGHT.subtitle)}>
          {count === 0
            ? "No items yet — browse the menu to get started."
            : `${count} ${count === 1 ? "item" : "items"} in your bag`}
        </p>

        {items.length === 0 ? (
          <div className={cn(LIGHT.card, "mt-10 flex flex-col items-center px-6 py-16 text-center")}>
            <ShoppingBag className="mb-4 h-12 w-12 text-maroon/20" strokeWidth={1.25} />
            <p className={LIGHT.muted}>Your cart is empty</p>
            <Button variant="brown" className="mt-8" asChild>
              <Link href="/products">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.variantId ?? ""}`}
                  className={cn(LIGHT.card, "flex gap-4 p-4 sm:p-5")}
                >
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden bg-maroon/5 sm:h-28 sm:w-28"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-medium text-maroon hover:text-light-blue"
                        >
                          {item.product.name}
                        </Link>
                        {item.product.variantName && (
                          <p className="mt-0.5 text-xs text-maroon/45">
                            {item.product.variantName}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-light-blue">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="rounded-full p-2 text-maroon/40 transition-colors hover:bg-rosewood/10 hover:text-rosewood"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center border border-maroon/15 text-maroon hover:border-maroon/35"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm text-maroon">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center border border-maroon/15 text-maroon hover:border-maroon/35"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-maroon">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className={cn(LIGHT.card, "h-fit p-6 lg:sticky lg:top-36")}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-maroon">
                Order summary
              </h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-maroon/55">Subtotal</span>
                <span className="text-maroon">{formatPrice(subtotal())}</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-maroon/45">
                Delivery is calculated at checkout. Free delivery on orders above{" "}
                {formatPrice(FREE_DELIVERY_THRESHOLD)}.
              </p>
              {freeDeliveryRemaining > 0 && (
                <p className="mt-3 border border-light-blue/40 bg-mist-blue/50 px-3 py-2 text-xs text-maroon">
                  Spend {formatPrice(freeDeliveryRemaining)} more for free delivery
                  across Bangalore.
                </p>
              )}
              <Button
                variant="brown"
                className="mt-6 w-full"
                onClick={openCheckout}
              >
                Proceed to Checkout
              </Button>
              <Link
                href="/products"
                className="mt-4 block text-center text-xs uppercase tracking-widest text-maroon/50 hover:text-maroon"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
