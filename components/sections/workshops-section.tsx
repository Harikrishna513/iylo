"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { workshops } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

export function WorkshopsSection() {
  return (
    <section id="workshops" className="section-padding bg-brown/10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Learn With Us
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Workshops & Events
          </h2>
          <p className="mt-4 max-w-md text-sm text-ivory/50">
            Join our masterclasses and discover the art of artisan baking in our
            studio kitchen.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          {workshops.map((workshop, i) => (
            <motion.article
              key={workshop.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="group overflow-hidden border border-ivory/10 bg-black/50 transition-colors hover:border-gold/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={workshop.image}
                  alt={workshop.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-lg text-gold">{formatPrice(workshop.price)}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="editorial-heading text-xl text-ivory">
                  {workshop.title}
                </h3>
                <p className="mt-3 text-sm text-ivory/50">{workshop.description}</p>
                <div className="mt-6 space-y-2 text-xs text-ivory/40">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gold" />
                    {workshop.date} · {workshop.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    {workshop.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-gold" />
                    {workshop.spots} spots remaining
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-6 w-full">
                  Book Your Spot
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
