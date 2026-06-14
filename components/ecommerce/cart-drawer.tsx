"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal, openCheckout } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-black border-l border-ivory/10"
          >
            <div className="flex items-center justify-between border-b border-ivory/10 p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="editorial-heading text-2xl text-ivory">Your Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="text-ivory/60 transition-colors hover:text-ivory"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-ivory/20" />
                  <p className="text-ivory/50">Your cart is empty</p>
                  <Button variant="outline" className="mt-6" onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-brown/20">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <h3 className="text-sm font-medium text-ivory">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gold">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="mt-auto flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center border border-ivory/20 text-ivory hover:border-gold"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm text-ivory">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center border border-ivory/20 text-ivory hover:border-gold"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto text-xs text-ivory/40 hover:text-ivory"
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

            {items.length > 0 && (
              <div className="border-t border-ivory/10 p-6">
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-ivory/60">Subtotal</span>
                  <span className="text-lg text-gold">{formatPrice(subtotal())}</span>
                </div>
                <p className="mb-6 text-xs text-ivory/40">
                  Delivery calculated at checkout. Free delivery on orders above ₹2,000.
                </p>
                <Button
                  variant="gold"
                  className="w-full"
                  onClick={openCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
