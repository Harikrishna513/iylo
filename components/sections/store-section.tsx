"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { contactInfo } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

export function StoreSection() {
  return (
    <section className="section-padding bg-brown/10">
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
              We would love to meet you and have you experience the smells of
              our fresh bakes.
            </p>
            <div className="mt-8 space-y-4 text-sm text-ivory/50">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p>Mon–Fri: {contactInfo.timings.weekdays}</p>
                  <p>Sat–Sun: {contactInfo.timings.weekends}</p>
                </div>
              </div>
            </div>
            <Button variant="gold" size="sm" className="mt-8">
              Get Directions
            </Button>
          </Reveal>

          <Reveal direction="left" className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-155691122-e4b2c8b5d516?w=600&q=80"
                alt="Bakery interior"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600326145552-327f74bfc560?w=600&q=80"
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
