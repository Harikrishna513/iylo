"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Truck, MapPin, Clock } from "lucide-react";
import { getNextAvailableSlot } from "@/lib/preorder";
import { HeroBackgroundSlider } from "@/components/sections/hero-background-slider";
import {
  BUSINESS_DESCRIPTION,
  FREE_DELIVERY_ABOVE,
  MIN_ORDER_AMOUNT,
  PICKUP_MESSAGE,
  STORE_ADDRESS,
} from "@/data/site-content";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";
import { HERO_SLIDES } from "@/lib/hero-images";

const HERO_TEXT_SHADOW =
  "0 2px 20px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.45)";

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
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = HERO_SLIDES[0].src;
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-content",
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
      data-hero
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        marginTop: SITE_HEADER_OFFSET_PX,
        minHeight: `calc(100vh - ${SITE_HEADER_OFFSET_PX}px)`,
      }}
    >
      <div className="absolute inset-0 z-0">
        <HeroBackgroundSlider />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hero-badge absolute right-6 top-28 z-30 glass px-4 py-2 md:right-10 md:top-32"
      >
        <span
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          Eggless Speciality
        </span>
      </motion.div>

      <div className="hero-content relative z-30 mx-auto max-w-7xl px-6 pt-32 pb-28 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span
              className="hero-badge mb-6 inline-block text-[10px] uppercase tracking-[0.4em] text-gold"
              style={{ textShadow: HERO_TEXT_SHADOW }}
            >
              Jayanagar, Bangalore
            </span>
            <h1
              ref={headlineRef}
              className="editorial-heading text-5xl text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ textShadow: HERO_TEXT_SHADOW }}
            >
              Modern Baking, Made Eggless
            </h1>
            <p
              ref={subRef}
              className="mt-8 max-w-lg text-base leading-relaxed text-ivory md:text-lg"
              style={{ textShadow: HERO_TEXT_SHADOW }}
            >
              {BUSINESS_DESCRIPTION}
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
              {/* <Button
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
                  document.getElementById("gifting")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Gifting
              </Button> */}
            </div>
          </div>
          <div className="hidden h-[500px] lg:block" aria-hidden="true" />
        </div>

        {/* <div className="hero-info-bar mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass flex items-center gap-3 px-4 py-3">
            <Truck className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Delivery</p>
              <p className="text-xs text-ivory/80">Across Bangalore · min. ₹{MIN_ORDER_AMOUNT}</p>
            </div>
          </div>
          <div className="glass flex items-center gap-3 px-4 py-3">
            <MapPin className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Pickup</p>
              <p className="text-xs text-ivory/80">Jayanagar 4th Block</p>
            </div>
          </div>
          <div className="glass flex items-center gap-3 px-4 py-3">
            <Truck className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Free Delivery</p>
              <p className="text-xs text-ivory/80">On orders above ₹{FREE_DELIVERY_ABOVE}</p>
            </div>
          </div>
          <div className="glass flex items-center gap-3 px-4 py-3">
            <Clock className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Store Hours</p>
              <p className="text-xs text-ivory/80">Wed–Sun · closed Mon–Tue</p>
            </div>
          </div>
        </div> */}
        {/* {slotMessage && (
          <p
            className="mt-4 text-center text-xs text-ivory/70 lg:text-left"
            style={{ textShadow: HERO_TEXT_SHADOW }}
            suppressHydrationWarning
          >
            {slotMessage}
          </p>
        )}
        <p
          className="mt-3 text-center text-xs text-ivory/65 lg:text-left"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          {PICKUP_MESSAGE}
        </p>
        <p
          className="mt-1 text-center text-[10px] text-ivory/60 lg:text-left"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          {STORE_ADDRESS}
        </p> */}
      </div>

      <div className="scroll-indicator absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
        <ChevronDown className="h-6 w-6 animate-bounce text-ivory/60" />
      </div>
    </section>
  );
}
