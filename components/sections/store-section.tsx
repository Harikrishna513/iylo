"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { BAKERY_LOCATION } from "@/lib/delivery";
import { contactInfo } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { ProductImages as img } from "@/lib/product-images";

export function StoreSection() {
  return (
    <section id="store" className="section-padding bg-brown/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
              Visit Us
            </p>
            <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-5xl">
              Store Experience
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ivory/70">
              {contactInfo.pickupMessage}
            </p>
            <div className="mt-8 space-y-4 text-sm text-ivory/50">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p>{contactInfo.address}</p>
                  {contactInfo.landmark && (
                    <p className="mt-1 text-xs text-muted">Landmark: {contactInfo.landmark}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted">Store Hours</p>
                  {contactInfo.storeHours.map((row) => (
                    <p key={row.label} className="mt-1">
                      {row.label}: {row.value}
                    </p>
                  ))}
                  <p className="mt-3 text-[10px] uppercase tracking-widest text-muted">Pickup</p>
                  <p>{contactInfo.pickupHours}</p>
                </div>
              </div>
              <p className="text-xs text-muted">Parking: {BAKERY_LOCATION.parking}</p>
            </div>
            <Button variant="gold" size="sm" className="mt-8" asChild>
              <a href={BAKERY_LOCATION.directions} target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </Button>
          </Reveal>

          <Reveal direction="left" className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={img.bannerDesktopHorizontal}
                alt="IYLO Bakehouse store"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden">
              <Image
                src={img.butterCroissant}
                alt="Fresh pastries display"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
