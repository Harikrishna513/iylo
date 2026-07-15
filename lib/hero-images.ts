/** Hero background slider — order is fixed */
export const HERO_SLIDES = [
  {
    src: "/hero/viennoiserie.webp",
    alt: "Fresh viennoiserie pastries at IYLO Bakehouse",
  },
  {
    src: "/hero/cake-slices.webp",
    alt: "Artisan cake slices at IYLO Bakehouse",
  },
  {
    src: "/hero/breads-tarts-cookies.webp",
    alt: "Breads, tarts and cookies at IYLO Bakehouse",
  },
  {
    src: "/hero/celebration-cakes.webp",
    alt: "Celebration cakes at IYLO Bakehouse",
  },
  {
    src: "/hero/cakes1.webp",
    alt: "Handcrafted eggless cakes at IYLO Bakehouse",
  },
  {
    src: "/hero/baked-cheesecakes.webp",
    alt: "Baked cheesecakes at IYLO Bakehouse",
  },
] as const;

export const HERO_SLIDE_INTERVAL_MS = 10_000;
export const HERO_FADE_DURATION_MS = 900;

/**
 * Hero background blur — change this value to adjust softness.
 * File: lib/hero-images.ts
 *
 * Guide:
 *   0  = no blur (sharp image)
 *   2–4 = subtle (recommended start)
 *   6–8 = medium
 *   10+ = heavy blur
 */
export const HERO_BG_BLUR_PX = 0;

/**
 * Optional dark tint over slides (0–1). Helps text readability.
 * Set to 0 to disable. Try 0.1–0.25 if text is still hard to read.
 */
export const HERO_BG_DIM_OPACITY = 0.15;
