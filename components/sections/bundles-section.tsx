"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { bundles } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function BundlesSection() {
  const openCart = useCartStore((s) => s.openCart);

  return (
    <section id="bundles" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Curated for You
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Bundles & Offers
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {bundles.map((bundle, i) => (
            <motion.article
              key={bundle.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative overflow-hidden border border-ivory/10 bg-cream/5 transition-colors hover:border-gold/30"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {bundle.badge && (
                    <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] uppercase tracking-widest text-black">
                      {bundle.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-center p-8">
                  <h3 className="editorial-heading text-2xl text-ivory md:text-3xl">
                    {bundle.name}
                  </h3>
                  <p className="mt-3 text-sm text-ivory/50">{bundle.description}</p>
                  <ul className="mt-4 space-y-1">
                    {bundle.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs text-ivory/40"
                      >
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="text-xl text-gold">
                      {formatPrice(bundle.price)}
                    </span>
                    {bundle.originalPrice && (
                      <span className="text-sm text-ivory/30 line-through">
                        {formatPrice(bundle.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6 w-fit"
                    onClick={openCart}
                  >
                    Add Bundle
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
