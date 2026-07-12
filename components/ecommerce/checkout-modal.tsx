"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Truck,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Store,
  Package,
  CreditCard,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getDeliverySlots } from "@/lib/preorder";
import { getAmountForFreeDelivery } from "@/lib/delivery";
import { BAKERY_LOCATION } from "@/lib/delivery";
import { contactInfo } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import type { CheckoutStep } from "@/types";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "login", label: "Account" },
  { id: "method", label: "Method" },
  { id: "location", label: "Location" },
  { id: "date", label: "Schedule" },
  { id: "address", label: "Details" },
  { id: "coupon", label: "Offers" },
  { id: "payment", label: "Payment" },
];

export function CheckoutModal() {
  const { user } = useAuth();
  const {
    isCheckoutOpen,
    closeCheckout,
    items,
    subtotal,
    total,
    deliveryFee,
    clearCart,
    resetCheckout,
    checkoutStep,
    setCheckoutStep,
    checkoutForm,
    updateCheckoutForm,
    setLoggedIn,
    setDeliveryZone,
    deliveryZone,
    applyCoupon,
    couponDiscount,
    discountAmount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [locating, setLocating] = useState(false);
  const [paying, setPaying] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const slots = getDeliverySlots();
  const freeDeliveryRemaining = getAmountForFreeDelivery(subtotal());

  const loadRazorpayScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });
  }, []);

  const handleClose = () => {
    closeCheckout();
    resetCheckout();
  };

  const fulfillmentType = () => {
    if (checkoutForm.deliveryMethod === "pickup") return "pickup";
    if (checkoutForm.deliveryMethod === "retail-shipping") return "pan_india_shipping";
    return "delivery";
  };

  const handleSubmit = async () => {
    if (!items.length) return;

    const missingVariant = items.find((i) => !(i.variantId ?? i.product.variantId));
    if (missingVariant) {
      alert("Some items are missing product data. Please refresh and try again.");
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variant_id: i.variantId ?? i.product.variantId,
            quantity: i.quantity,
            gift_wrap: i.giftWrap ?? false,
          })),
          payment_method: "razorpay",
          fulfillment_type: fulfillmentType(),
          customer: {
            name: checkoutForm.name || user?.user_metadata?.full_name || "Customer",
            email: checkoutForm.email || user?.email || "",
            phone: checkoutForm.phone,
            line1: checkoutForm.address,
            city: checkoutForm.city,
            state: "Karnataka",
            pincode: checkoutForm.pincode,
          },
          user_id: user?.id ?? null,
          delivery_fee: deliveryFee(),
          discount_amount: discountAmount || subtotal() * couponDiscount,
          coupon_code: checkoutForm.coupon || null,
          scheduled_date: checkoutForm.deliveryDate || null,
          scheduled_slot_label: checkoutForm.deliverySlot || null,
          customer_notes: checkoutForm.notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Checkout failed");
        setPaying(false);
        return;
      }

      if (data.payment_method === "cod") {
        setOrderNumber(data.order_number);
        setCheckoutStep("confirmation");
        setTimeout(() => {
          clearCart();
        }, 3000);
        setPaying(false);
        return;
      }

      await loadRazorpayScript();

      const rzp = new window.Razorpay!({
        key: data.key,
        amount: Math.round(data.amount * 100),
        currency: "INR",
        name: "IYLO Bakehouse",
        description: `Order ${data.order_number}`,
        order_id: data.razorpay_order_id,
        prefill: data.customer,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payment-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setOrderNumber(verifyData.order_number ?? data.order_number);
            setCheckoutStep("confirmation");
            setTimeout(() => clearCart(), 3000);
          } else {
            alert(verifyData.error ?? "Payment verification failed");
          }
          setPaying(false);
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      rzp.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  };

  const detectLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setDeliveryZone("560038");
        updateCheckoutForm({ pincode: "560038", city: "Bangalore" });
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const checkPincode = (pincode: string) => {
    updateCheckoutForm({ pincode });
    setDeliveryZone(pincode);
  };

  const renderStep = () => {
    switch (checkoutStep) {
      case "login":
        return (
          <div className="space-y-6">
            {user ? (
              <>
                <p className="text-sm text-ivory/60">
                  Signed in as <span className="text-gold">{user.email}</span>
                </p>
                <Button variant="gold" className="w-full" onClick={() => setCheckoutStep("method")}>
                  Continue
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-ivory/60">
                  Sign in to save your order history, or continue as guest.
                </p>
                <Link href="/auth/signin">
                  <Button variant="gold" className="w-full">Sign In</Button>
                </Link>
                <p className="text-center text-sm text-ivory/60">
                  New to IYLO Bake House?{" "}
                  <Link href="/auth/signup" className="text-gold hover:underline">
                    Create an account
                  </Link>
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setLoggedIn(true);
                    setCheckoutStep("method");
                  }}
                >
                  Continue as Guest
                </Button>
              </>
            )}
          </div>
        );

      case "method":
        return (
          <div className="space-y-4">
            {[
              { value: "delivery" as const, icon: Truck, label: "Home Delivery", desc: "Across Bangalore" },
              { value: "pickup" as const, icon: Store, label: "Store Pickup", desc: "Jayanagar bakehouse" },
              { value: "retail-shipping" as const, icon: Package, label: "PAN India Shipping", desc: "Retail products only" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  updateCheckoutForm({ deliveryMethod: opt.value });
                  setCheckoutStep(opt.value === "pickup" ? "date" : "location");
                }}
                className={cn(
                  "flex w-full items-center gap-4 border p-4 text-left transition-colors",
                  checkoutForm.deliveryMethod === opt.value
                    ? "border-gold bg-gold/5"
                    : "border-ivory/20 hover:border-ivory/40"
                )}
              >
                <opt.icon className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm text-ivory">{opt.label}</p>
                  <p className="text-xs text-muted">{opt.desc}</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-ivory/40" />
              </button>
            ))}
          </div>
        );

      case "location":
        return (
          <div className="space-y-6">
            <Button variant="outline" className="w-full" onClick={detectLocation} disabled={locating}>
              <MapPin className="h-4 w-4" />
              {locating ? "Detecting..." : "Use My Location"}
            </Button>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={checkoutForm.pincode}
                onChange={(e) => checkPincode(e.target.value)}
                placeholder="e.g. 560038"
                className="w-full border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
              />
            </div>
            {checkoutForm.pincode.length === 6 && (
              <div className={cn("p-4", deliveryZone ? "border border-gold/30 bg-gold/5" : "border border-ivory/20")}>
                {deliveryZone ? (
                  <>
                    <p className="text-sm text-gold">Delivery available in {deliveryZone.name}</p>
                    <p className="mt-1 text-xs text-ivory/60">
                      Est. {deliveryZone.estimatedMinutes} min · Fee {formatPrice(deliveryZone.fee)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-ivory">Delivery unavailable for this pincode</p>
                    <p className="mt-2 text-xs text-ivory/60">
                      We&apos;d love to welcome you for pickup at our Jayanagar bakery, or choose PAN India shipping for retail products.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { updateCheckoutForm({ deliveryMethod: "pickup" }); setCheckoutStep("date"); }}>
                        Pickup
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => {}}>
                        Notify Me
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            {deliveryZone && (
              <Button variant="gold" className="w-full" onClick={() => setCheckoutStep("date")}>
                Continue
              </Button>
            )}
          </div>
        );

      case "date":
        return (
          <div className="space-y-6">
            {checkoutForm.deliveryMethod === "pickup" && (
              <div className="border border-gold/20 bg-gold/5 p-4 text-sm text-ivory/80">
                We would love to welcome you to our bakery and let you experience the aroma of our fresh bakes.
              </div>
            )}
            <div className="space-y-4">
              {slots.slice(0, 5).map((day) => (
                <div key={day.date}>
                  <p className="mb-2 text-xs uppercase tracking-widest text-gold">{day.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {day.slots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => {
                          updateCheckoutForm({ deliveryDate: day.date, deliverySlot: slot.id });
                        }}
                        className={cn(
                          "border px-3 py-2 text-xs transition-colors",
                          !slot.available && "opacity-30 cursor-not-allowed",
                          checkoutForm.deliveryDate === day.date && checkoutForm.deliverySlot === slot.id
                            ? "border-gold text-gold"
                            : "border-ivory/20 text-ivory/70 hover:border-ivory/40"
                        )}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {checkoutForm.deliveryDate && checkoutForm.deliverySlot && (
              <Button variant="gold" className="w-full" onClick={() => setCheckoutStep("address")}>
                Continue
              </Button>
            )}
          </div>
        );

      case "address":
        return (
          <div className="space-y-4">
            {checkoutForm.deliveryMethod === "pickup" ? (
              <div className="space-y-4">
                <p className="text-sm text-ivory/70">{contactInfo.address}</p>
                <p className="text-xs text-muted">Parking: {BAKERY_LOCATION.parking}</p>
                <p className="text-xs text-muted">Hours: {contactInfo.timings.weekdays}</p>
                <a href={BAKERY_LOCATION.directions} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline">
                  Get Directions →
                </a>
                <iframe
                  src={contactInfo.mapEmbed}
                  className="h-40 w-full border-0 grayscale"
                  loading="lazy"
                  title="IYLO Bake House location"
                />
              </div>
            ) : (
              <>
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="mb-2 block text-xs uppercase tracking-widest text-muted">{field}</label>
                    <input
                      required
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={checkoutForm[field as keyof typeof checkoutForm] as string}
                      onChange={(e) => updateCheckoutForm({ [field]: e.target.value })}
                      className="w-full border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Address</label>
                  <textarea
                    rows={3}
                    value={checkoutForm.address}
                    onChange={(e) => updateCheckoutForm({ address: e.target.value })}
                    className="w-full resize-none border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
                  />
                </div>
              </>
            )}
            <Button variant="gold" className="w-full" onClick={() => setCheckoutStep("coupon")}>
              Continue
            </Button>
          </div>
        );

      case "coupon":
        return (
          <div className="space-y-6">
            {freeDeliveryRemaining > 0 && (
              <div className="border border-gold/30 bg-gold/5 p-4 text-sm text-ivory">
                Spend {formatPrice(freeDeliveryRemaining)} more for free delivery across Bangalore.
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
              />
              <Button
                variant="outline"
                onClick={async () => {
                  const ok = await applyCoupon(couponInput);
                  setCouponError(ok ? "" : "Invalid coupon code");
                }}
              >
                Apply
              </Button>
            </div>
            {couponError && <p className="text-xs text-red-400">{couponError}</p>}
            {couponDiscount > 0 && (
              <p className="text-sm text-gold">
                Discount applied — {formatPrice(discountAmount || subtotal() * couponDiscount)} off
              </p>
            )}
            <p className="text-xs text-muted">Try: IYLOLOVE or BANGALORE10</p>
            <Button variant="gold" className="w-full" onClick={() => setCheckoutStep("payment")}>
              Continue to Payment
            </Button>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div className="space-y-2 border border-ivory/10 p-4 text-sm">
              <div className="flex justify-between text-ivory/60">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              <div className="flex justify-between text-ivory/60">
                <span>Delivery</span>
                <span>{deliveryFee() === 0 ? "Free" : formatPrice(deliveryFee())}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Discount</span>
                  <span>-{formatPrice(subtotal() * couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-ivory/10 pt-2 text-lg text-gold">
                <span>Total</span>
                <span>{formatPrice(total())}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border border-ivory/20 p-4">
              <CreditCard className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm text-ivory">UPI / Card / Net Banking</p>
                <p className="text-xs text-muted">Secure payment via Razorpay</p>
              </div>
            </div>
            <Button variant="gold" className="w-full" onClick={handleSubmit} disabled={paying}>
              {paying ? "Processing…" : `Place Order — ${formatPrice(total())}`}
            </Button>
          </div>
        );

      case "confirmation":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-12 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <Check className="h-8 w-8 text-gold" />
            </div>
            <p className="editorial-heading text-2xl text-ivory">Thank You</p>
            {orderNumber && (
              <p className="mt-2 text-sm text-gold">Order {orderNumber}</p>
            )}
            <p className="mt-3 max-w-sm text-sm text-ivory/60">
              Your order has been received. We&apos;ll send confirmation to {checkoutForm.email || "your email"} shortly.
            </p>
            {checkoutForm.deliveryMethod === "pickup" && (
              <p className="mt-4 text-xs text-gold">See you at our Jayanagar bakehouse!</p>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === checkoutStep);

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[100] max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-ivory/10 bg-black"
          >
            <div className="sticky top-0 z-10 border-b border-ivory/10 bg-black p-6">
              <div className="flex items-center justify-between">
                <h2 className="editorial-heading text-2xl text-ivory">
                  {checkoutStep === "confirmation" ? "Order Placed" : "Checkout"}
                </h2>
                <button onClick={handleClose} aria-label="Close checkout">
                  <X className="h-5 w-5 text-ivory/60" />
                </button>
              </div>
              {checkoutStep !== "confirmation" && (
                <div className="mt-4 flex gap-1">
                  {STEPS.map((step, i) => (
                    <div
                      key={step.id}
                      className={cn(
                        "h-1 flex-1 transition-colors",
                        i <= currentStepIndex ? "bg-gold" : "bg-ivory/10"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              {checkoutStep !== "confirmation" && checkoutStep !== "login" && (
                <button
                  onClick={() => {
                    const prev = STEPS[currentStepIndex - 1];
                    if (prev) setCheckoutStep(prev.id);
                  }}
                  className="mb-4 flex items-center gap-1 text-xs text-muted hover:text-ivory"
                >
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>
              )}
              {renderStep()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
