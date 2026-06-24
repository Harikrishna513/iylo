"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Truck, MapPin, Clock } from "lucide-react";
import { getNextAvailableSlot } from "@/lib/preorder";
import { ProductImages as img } from "@/lib/product-images";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
);

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);

  useEffect(() => {
    setSlotMessage(getNextAvailableSlot().message);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 1.5 }
      )
        .fromTo(
          headlineRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          subRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current?.children || [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
          "-=0.4"
        )
        .fromTo(
          ".hero-badge",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6 },
          "-=0.6"
        )
        .fromTo(
          ".hero-info-bar > *",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          ".scroll-indicator",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.2"
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="hero-overlay absolute inset-0 z-0">
        <Image
          src={img.heroHome}
          alt="Artisan bakery in Indiranagar, Bangalore"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={img.heroHome}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-baker-kneading-dough-1576/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      </div>

      <HeroScene />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hero-badge absolute right-6 top-28 z-20 glass px-4 py-2 md:right-10 md:top-32"
      >
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          Fresh Today
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-28 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="hero-badge mb-6 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
              Est. 2018 · Indiranagar, Bangalore
            </span>
            <h1
              ref={headlineRef}
              className="editorial-heading text-5xl text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Handcrafted Bakes Worth Waiting For
            </h1>
            <p
              ref={subRef}
              className="mt-8 max-w-lg text-base leading-relaxed text-ivory/70 md:text-lg"
            >
              Freshly baked artisan breads, pastries, cakes and desserts — made
              with exceptional ingredients in the heart of Bangalore.
            </p>
            <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4">
              <Button
                variant="gold"
                size="lg"
                onClick={() =>
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Order Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Menu
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-ivory/20"
                onClick={() =>
                  document.getElementById("workshops")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Book Workshop
              </Button>
            </div>
          </div>
          <div className="hidden h-[500px] lg:block" aria-hidden="true" />
        </div>

        <div className="hero-info-bar mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass flex items-center gap-3 px-4 py-3">
            <Truck className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Delivery</p>
              <p className="text-xs text-ivory/80">Available across Bangalore</p>
            </div>
          </div>
          <div className="glass flex items-center gap-3 px-4 py-3">
            <MapPin className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Pickup</p>
              <p className="text-xs text-ivory/80">Available today · Indiranagar</p>
            </div>
          </div>
          <div className="glass flex items-center gap-3 px-4 py-3">
            <Truck className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Free Delivery</p>
              <p className="text-xs text-ivory/80">On orders above ₹2,000</p>
            </div>
          </div>
          <div className="glass flex items-center gap-3 px-4 py-3">
            <Clock className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Weekend Pre-order</p>
              <p className="text-xs text-ivory/80">Order by Friday 8 PM</p>
            </div>
          </div>
        </div>
        {slotMessage && (
          <p className="mt-4 text-center text-xs text-ivory/40 lg:text-left" suppressHydrationWarning>
            {slotMessage}
          </p>
        )}
      </div>

      <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <ChevronDown className="h-6 w-6 animate-bounce text-ivory/40" />
      </div>
    </section>
  );
}
