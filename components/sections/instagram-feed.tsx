"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { instagramPosts, contactInfo } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";
import { InstagramIcon } from "@/components/icons/instagram-icon";

export function InstagramFeed() {
  return (
    <section className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          <InstagramIcon className="mb-4 h-8 w-8 text-gold" />
          <h2 className="editorial-heading text-4xl text-ivory md:text-5xl">
            {contactInfo.instagram}
          </h2>
          <p className="mt-4 text-sm text-ivory/50">
            Follow our daily bakes from Indiranagar
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((post, i) => (
            <motion.a
              key={post.id}
              href={`https://instagram.com/${contactInfo.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="200px"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
