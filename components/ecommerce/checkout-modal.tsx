"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, subtotal, clearCart } =
    useCartStore();
  const [step, setStep] = useState<"details" | "success">("details");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    delivery: "home",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    setTimeout(() => {
      clearCart();
      closeCheckout();
      setStep("details");
      setForm({ name: "", email: "", phone: "", address: "", delivery: "home" });
    }, 3000);
  };

  const deliveryFee = subtotal() >= 2000 ? 0 : 99;
  const total = subtotal() + deliveryFee;

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCheckout}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[100] max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-ivory/10 bg-black p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="editorial-heading text-3xl text-ivory">
                {step === "success" ? "Order Placed" : "Checkout"}
              </h2>
              <button
                onClick={closeCheckout}
                className="text-ivory/60 hover:text-ivory"
                aria-label="Close checkout"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-12 text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
                  <Check className="h-8 w-8 text-gold" />
                </div>
                <p className="editorial-heading text-2xl text-ivory">
                  Thank You
                </p>
                <p className="mt-3 max-w-sm text-sm text-ivory/60">
                  Your order has been received. We&apos;ll send a confirmation to your
                  email shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: "name", label: "Full Name", type: "text" },
                    { key: "email", label: "Email", type: "email" },
                    { key: "phone", label: "Phone", type: "tel" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        className="w-full border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
                      Delivery Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="w-full resize-none border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs uppercase tracking-widest text-muted">
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "home", label: "Home Delivery" },
                      { value: "pickup", label: "Store Pickup" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, delivery: opt.value })
                        }
                        className={`border px-4 py-3 text-xs uppercase tracking-widest transition-colors ${
                          form.delivery === opt.value
                            ? "border-gold text-gold"
                            : "border-ivory/20 text-ivory/60 hover:border-ivory/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-ivory/10 pt-4 text-sm">
                  <div className="flex justify-between text-ivory/60">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-ivory/60">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      Delivery
                    </span>
                    <span>
                      {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-lg text-gold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button type="submit" variant="gold" className="w-full">
                  Place Order — {formatPrice(total)}
                </Button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
