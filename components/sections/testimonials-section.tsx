"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="reviews" className="section-padding bg-mist-blue text-maroon">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brown">
            Kind Words
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-maroon md:text-6xl">
            Google Reviews
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-maroon/50">
            Loved by food lovers, event planners, and families across Bangalore
          </p>
        </Reveal>

        <div className="relative">
          <Quote className="absolute -top-4 left-0 h-12 w-12 text-brown/10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: testimonials[current].rating }).map(
                  (_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  )
                )}
              </div>
              <blockquote className="editorial-heading text-2xl leading-relaxed text-maroon md:text-4xl">
                &ldquo;{testimonials[current].content}&rdquo;
              </blockquote>
              <div className="mt-10 flex items-center justify-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
                  <Image
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-medium text-maroon">
                    {testimonials[current].name}
                  </p>
                  <p className="text-sm text-maroon/50">
                    {testimonials[current].role}
                  </p>
                  {testimonials[current].source === "google" && (
                    <p className="text-[10px] uppercase tracking-widest text-brown/60">Google Review</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center border border-black/20 transition-colors hover:border-brown hover:text-brown"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 transition-all duration-300 ${
                    i === current ? "w-8 bg-brown" : "w-1.5 bg-maroon/20"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center border border-black/20 transition-colors hover:border-brown hover:text-brown"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
