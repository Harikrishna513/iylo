"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { giftingOptions } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

export function GiftingSection() {
  return (
    <section id="gifting" className="section-padding bg-ivory text-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brown">
            Thoughtfully Curated
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-black md:text-6xl">
            Gifting Collection
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-black/50">
            Every gift tells a story. Our luxury hampers are designed to create
            lasting impressions.
          </p>
        </Reveal>

        <div className="space-y-8">
          {giftingOptions.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`grid items-center gap-8 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div
                className={`relative aspect-[16/10] overflow-hidden ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1 lg:text-right" : ""}>
                <span className="text-[10px] uppercase tracking-[0.3em] text-brown/60">
                  0{i + 1}
                </span>
                <h3 className="editorial-heading mt-2 text-3xl text-black md:text-5xl">
                  {option.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-black/60">
                  {option.description}
                </p>
                <Button
                  variant="brown"
                  size="sm"
                  className={`mt-8 ${i % 2 === 1 ? "lg:ml-auto" : ""}`}
                >
                  {option.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
