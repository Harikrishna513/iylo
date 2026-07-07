"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackgroundSlider } from "@/components/sections/hero-background-slider";
import { BUSINESS_DESCRIPTION } from "@/data/site-content";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";
import { HERO_SLIDES } from "@/lib/hero-images";

const HERO_TEXT_SHADOW =
  "0 2px 20px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.45)";

const TEXT1 = "Modern Baking,";
const TEXT2 = "Made Eggless";
const CHAR_MS = 55;
const LINE1_START_MS = 400;
const LINE2_START_MS = LINE1_START_MS + TEXT1.length * CHAR_MS + 220;

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

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
    let t1Ref: ReturnType<typeof setInterval> | null = null;
    let t2Ref: ReturnType<typeof setInterval> | null = null;

    const start1 = setTimeout(() => {
      let i = 0;
      t1Ref = setInterval(() => {
        i++;
        setLine1(TEXT1.slice(0, i));
        if (i >= TEXT1.length && t1Ref) clearInterval(t1Ref);
      }, CHAR_MS);
    }, LINE1_START_MS);

    const start2 = setTimeout(() => {
      let i = 0;
      t2Ref = setInterval(() => {
        i++;
        setLine2(TEXT2.slice(0, i));
        if (i >= TEXT2.length && t2Ref) clearInterval(t2Ref);
      }, CHAR_MS);
    }, LINE2_START_MS);

    return () => {
      clearTimeout(start1);
      clearTimeout(start2);
      if (t1Ref) clearInterval(t1Ref);
      if (t2Ref) clearInterval(t2Ref);
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
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: LINE2_START_MS / 1000 + 0.3,
        }
      );

      gsap.fromTo(
        ".scroll-indicator",
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: LINE2_START_MS / 1000 + 0.8,
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
        {/* <span
          className="hero-item mb-6 inline-block text-[10px] uppercase tracking-[0.4em] text-gold opacity-0"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          Jayanagar, Bangalore
        </span> */}

        <h1
          className="editorial-heading mb-6 min-h-[2.1em] text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.05] tracking-tight text-ivory"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          <span>{line1}</span>
          <br />
          <span className="text-gold">{line2}</span>
        </h1>

        <p
          className="hero-item mx-auto mb-10 max-w-2xl text-base leading-relaxed text-ivory/85 opacity-0 md:text-lg"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          {BUSINESS_DESCRIPTION}
        </p>

        <div className="hero-item flex flex-wrap items-center justify-center gap-4 opacity-0">
          <Button
            variant="gold"
            size="lg"
            onClick={() =>
              document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Order Now
          </Button>
        </div>
      </div>

      <div className="scroll-indicator absolute bottom-8 left-1/2 z-30 -translate-x-1/2 opacity-0">
        <ChevronDown className="h-6 w-6 animate-bounce text-ivory/60" />
      </div>
    </section>
  );
}
