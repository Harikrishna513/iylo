"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CATEGORY_CARDS } from "@/data/category-cards";

export function CategoryCardsSection() {
  return (
    <section id="categories" className="bg-cream pb-8 pt-4 sm:pb-10 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {CATEGORY_CARDS.map((cat, i) => (
            <motion.article
              key={cat.id}
              id={`category-${cat.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group h-full scroll-mt-52"
            >
              <Link
                href={cat.href}
                className="category-card-link block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown/40 focus-visible:ring-offset-2 focus-visible:rounded-[24px]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover brightness-[0.95] transition-all duration-300 ease-out group-hover:scale-105 group-hover:brightness-100"
                    loading={i < 4 ? "eager" : "lazy"}
                  />
                </div>

                <h3 className="mt-3 flex items-center gap-2 text-base font-light tracking-wide text-black/85 transition-colors duration-300 group-hover:text-brown sm:text-lg">
                  {cat.label}
                  <ArrowRight
                    className="h-4 w-4 shrink-0 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </h3>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
