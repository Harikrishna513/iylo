"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  HERO_BG_BLUR_PX,
  HERO_BG_DIM_OPACITY,
  HERO_FADE_DURATION_MS,
  HERO_SLIDE_INTERVAL_MS,
  HERO_SLIDES,
} from "@/lib/hero-images";

export function HeroBackgroundSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    HERO_SLIDES.forEach((slide, i) => {
      if (i === 0) return;
      const img = new window.Image();
      img.src = slide.src;
    });
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(advance, HERO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, advance]);

  return (
    <div className="absolute inset-0" aria-hidden>
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 will-change-[opacity]",
            i === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"
          )}
          style={{
            transition: `opacity ${HERO_FADE_DURATION_MS}ms ease-in-out`,
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
            style={{
              filter: HERO_BG_BLUR_PX > 0 ? `blur(${HERO_BG_BLUR_PX}px)` : undefined,
            }}
          />
        </div>
      ))}
      {HERO_BG_DIM_OPACITY > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-maroon"
          style={{ opacity: HERO_BG_DIM_OPACITY }}
          aria-hidden
        />
      )}
    </div>
  );
}
