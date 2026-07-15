"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackgroundSlider } from "@/components/sections/hero-background-slider";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";
import { HERO_SLIDES } from "@/lib/hero-images";

const HERO_TEXT_SHADOW =
  "0 2px 20px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.45)";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

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
      gsap.fromTo(
        ".hero-content",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-item",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.35,
        }
      );

      gsap.fromTo(
        ".scroll-indicator",
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.9,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-hero
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        marginTop: SITE_HEADER_OFFSET_PX,
        minHeight: `calc(100vh - ${SITE_HEADER_OFFSET_PX}px)`,
      }}
    >
      <div className="absolute inset-0 z-0">
        <HeroBackgroundSlider />
      </div>

      <div className="hero-content relative z-30 mx-auto w-full max-w-4xl px-6 pt-20 pb-28 text-center lg:px-10">
        <h1
          className="hero-item editorial-heading mb-10 text-[clamp(2rem,6vw,4.5rem)] leading-[1.15] tracking-[0.08em] text-ivory opacity-0"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          served with intent
        </h1>

        <div className="hero-item flex flex-wrap items-center justify-center gap-4 opacity-0">
          <Button variant="gold" size="lg" asChild>
            <Link href="/products">Order Now</Link>
          </Button>
        </div>
      </div>

      <div className="scroll-indicator absolute bottom-8 left-1/2 z-30 -translate-x-1/2 opacity-0">
        <ChevronDown className="h-6 w-6 animate-bounce text-ivory/60" />
      </div>
    </section>
  );
}
