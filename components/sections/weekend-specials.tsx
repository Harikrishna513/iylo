"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { weekendSpecials } from "@/data/products";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/animations/reveal";

export function WeekendSpecials() {
  return (
    <section id="specials" className="relative overflow-hidden bg-brown/10">
      <div className="absolute inset-0 shimmer opacity-30" />
      <div className="section-padding relative mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-gold">
              <Clock className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-[0.3em]">
                Limited Availability
              </span>
            </div>
            <h2 className="editorial-heading text-4xl text-ivory md:text-6xl">
              Weekend Specials
            </h2>
            <p className="mt-4 max-w-md text-sm text-ivory/50">
              Available Friday through Sunday. Pre-order recommended — these
              sell out fast.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative h-32 w-full overflow-hidden md:h-40 md:w-72"
          >
            <Image
              src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80"
              alt="Weekend specials"
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-xs uppercase tracking-[0.3em] text-ivory">
                This Weekend
              </span>
            </div>
          </motion.div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {weekendSpecials.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
