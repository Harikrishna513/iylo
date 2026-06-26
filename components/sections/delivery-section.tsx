"use client";

import { Truck, Store, Package, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { FREE_DELIVERY_ABOVE, MIN_ORDER_AMOUNT, PICKUP_HOURS } from "@/data/site-content";

const deliveryOptions = [
  {
    icon: Truck,
    title: "Home Delivery",
    description:
      "Fresh bakes delivered across Bangalore. Delivery charges are calculated based on distance. Minimum order ₹499.",
  },
  {
    icon: Store,
    title: "Store Pickup",
    description: `Order online and collect from our Jayanagar bakehouse. Pickup timings: ${PICKUP_HOURS}.`,
  },
  {
    icon: Package,
    title: "Gifting & Hampers",
    description:
      "Celebration cakes, cookies, and curated gift hampers for personal and corporate gifting across Bangalore.",
  },
];

export function DeliverySection() {
  return (
    <section id="delivery" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            How It Works
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Delivery Information
          </h2>
        </Reveal>

        <div className="mb-12 overflow-hidden border border-gold/30 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 p-8 text-center md:p-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <p className="editorial-heading text-2xl text-ivory md:text-3xl">
              Free Delivery on Orders Above ₹{FREE_DELIVERY_ABOVE}
            </p>
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <p className="mt-3 text-sm text-ivory/50">
            Minimum order ₹{MIN_ORDER_AMOUNT} · Pre-order 1–2 days ahead for select items
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {deliveryOptions.map((option, i) => (
            <Reveal key={option.title} delay={i * 0.1} className="group">
              <div className="border border-ivory/10 p-8 transition-colors hover:border-gold/30">
                <option.icon className="mb-6 h-8 w-8 text-gold transition-transform group-hover:scale-110" />
                <h3 className="editorial-heading text-xl text-ivory">
                  {option.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/50">
                  {option.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
