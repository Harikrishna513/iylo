"use client";

import Image from "next/image";
import { Building2, Gift, UtensilsCrossed } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Gift,
    title: "Bulk Gifting",
    description: "Custom hampers for teams, clients, and partners with branded packaging.",
  },
  {
    icon: Building2,
    title: "Corporate Hampers",
    description: "Festive and year-round gifting programs tailored to your brand.",
  },
  {
    icon: UtensilsCrossed,
    title: "Event Catering",
    description: "Artisan bread baskets, dessert tables, and bespoke menus for events.",
  },
];

export function CorporateSection() {
  return (
    <section id="corporate" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1513885535751-8b9238b07123?w=1920&q=80"
          alt="Corporate gifting"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="section-padding relative mx-auto max-w-7xl">
        <Reveal className="mb-16 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            For Business
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Corporate Orders
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ivory/60">
            Elevate your corporate gifting and events with IYLO&apos;s artisan
            collections. From Diwali hampers to boardroom catering, we deliver
            excellence at scale.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.1}>
              <div className="glass p-8 transition-colors hover:border-gold/30">
                <service.icon className="mb-4 h-7 w-7 text-gold" />
                <h3 className="editorial-heading text-xl text-ivory">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm text-ivory/50">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <Button variant="gold" size="lg">
            Enquire Now
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
