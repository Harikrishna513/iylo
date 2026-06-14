"use client";

import { Truck, Store, Package, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

const deliveryOptions = [
  {
    icon: Truck,
    title: "Home Delivery",
    description:
      "Fresh bakes delivered to your doorstep across Delhi NCR. Same-day delivery on orders before 2 PM.",
  },
  {
    icon: Store,
    title: "Store Pickup",
    description:
      "Order online and collect from our Hauz Khas bake house. Skip the queue, savor the aroma.",
  },
  {
    icon: Package,
    title: "PAN India Shipping",
    description:
      "Retail products — granola, cookies, preserves — shipped nationwide with temperature-controlled packaging.",
  },
];

export function DeliverySection() {
  return (
    <section className="section-padding bg-black">
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
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <p className="editorial-heading text-2xl text-ivory md:text-3xl">
              Free Delivery on Orders Above ₹2,000
            </p>
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <p className="mt-3 text-sm text-ivory/50">
            Use code <span className="text-gold">IYLOLOVE</span> for 10% off your first order
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
