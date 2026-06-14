"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { galleryItems } from "@/data/products";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";

export function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="gallery" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Visual Diary
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Gallery
          </h2>
        </Reveal>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {galleryItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              onClick={() => setLightbox(item.src)}
              className={cn(
                "group relative mb-4 block w-full overflow-hidden break-inside-avoid",
                item.span === "tall" && "sm:row-span-2",
                item.span === "wide" && "sm:col-span-2"
              )}
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden",
                  item.span === "tall" ? "aspect-[3/4]" : "aspect-square"
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                  <ZoomIn className="h-8 w-8 text-ivory opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-6 top-6 text-ivory/60 hover:text-ivory"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox}
                alt="Gallery image"
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
