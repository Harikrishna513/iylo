"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { announcements } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";

export function AnnouncementsSection() {
  return (
    <section className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            What&apos;s New
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Announcements
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {announcements.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer overflow-hidden border border-ivory/10 transition-colors hover:border-gold/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 glass px-3 py-1 text-[10px] uppercase tracking-widest">
                  {item.tag}
                </span>
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-widest text-gold">
                  {item.date}
                </p>
                <h3 className="editorial-heading mt-2 text-xl text-ivory">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-ivory/50">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
