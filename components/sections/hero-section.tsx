"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
);

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-overlay", { opacity: 0, duration: 1.5 })
        .from(
          headlineRef.current,
          { y: 80, opacity: 0, duration: 1.2 },
          "-=0.8"
        )
        .from(subRef.current, { y: 40, opacity: 0, duration: 1 }, "-=0.6")
        .from(ctaRef.current?.children || [], {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
        }, "-=0.4")
        .from(".hero-badge", { scale: 0, opacity: 0, duration: 0.6 }, "-=0.6")
        .from(".scroll-indicator", { opacity: 0, y: -10, duration: 0.8 }, "-=0.2");
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
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80"
          alt="Artisan bakery"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      </div>

      <HeroScene />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="hero-badge mb-6 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
              Est. 2018 · New Delhi
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
              Freshly baked artisan breads, pastries, cakes and desserts made
              with exceptional ingredients and delivered with care.
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
            </div>
          </div>
          <div className="hidden h-[500px] lg:block" aria-hidden="true" />
        </div>
      </div>

      <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <ChevronDown className="h-6 w-6 animate-bounce text-ivory/40" />
      </div>
    </section>
  );
}
