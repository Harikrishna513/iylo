"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Truck, ShieldCheck, Star, CreditCard, Heart, Gift, Croissant, type LucideIcon, } from "lucide-react";
import { ANNOUNCEMENT_BAR_HEIGHT_PX, COLOR_LIGHT_BLUE, COLOR_MAROON, SITE_CONTENT_CLASS } from "@/lib/brand";
import { CONTACT_PHONE } from "@/data/site-content";

const MESSAGES: { icon: LucideIcon; text: string }[] = [
  { icon: Truck, text: "Free Delivery on Orders Above ₹999" },
  { icon: Sparkles, text: "Freshly Baked Every Day" },
  { icon: Star, text: "Made with Premium Ingredients" },
  { icon: ShieldCheck, text: "Cash on Delivery Across Bengaluru" },
  { icon: ShieldCheck, text: `CALL OR WHATSAPP ${CONTACT_PHONE} TO CUSTOMIZE OR BULK ORDER`, },
  { icon: CreditCard, text: "100% Secure Payments" },
  { icon: Heart, text: "Handcrafted with Love Since 2026" },
  { icon: Gift, text: "Perfect Cakes for Every Celebration" },
];

const ROTATE_MS = 3200;
const BG_PRIMARY = COLOR_MAROON;
const TEXT_PRIMARY = "#F7F2EA";
const ACCENT = COLOR_LIGHT_BLUE;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const goTo = useCallback((i: number) => setIndex(i), []);

  const Current = MESSAGES[index].icon;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] flex items-center border-b"
      style={{
        height: ANNOUNCEMENT_BAR_HEIGHT_PX,
        backgroundColor: BG_PRIMARY,
        borderColor: `${ACCENT}33`,
      }}
      role="region"
      aria-label="Site announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`${SITE_CONTENT_CLASS} flex h-full items-center`}>
        {/* pinned brand mark */}
        <div
          className="flex shrink-0 items-center gap-1.5 border-r pr-3 sm:pr-4"
          style={{ borderColor: "rgba(247,238,221,0.15)" }}
        >
          <Croissant size={13} style={{ color: ACCENT }} aria-hidden />
          <span
            className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest sm:inline"
            style={{ color: TEXT_PRIMARY, opacity: 0.8 }}
          >
            Fresh Today
          </span>
        </div>

        {/* rotating message */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3">
          <div
            key={index}
            className="announcement-slide flex items-center gap-2"
            aria-live="polite"
          >
            <Current size={13} style={{ color: ACCENT }} aria-hidden />
            <span
              className="whitespace-nowrap text-[11px] font-medium tracking-wide sm:text-xs"
              style={{ color: TEXT_PRIMARY }}
            >
              {MESSAGES[index].text}
            </span>
          </div>
        </div>

        {/* progress dots */}
        <div
          className="hidden shrink-0 items-center gap-1.5 border-l pl-4 sm:flex"
          style={{ borderColor: "rgba(247,238,221,0.15)" }}
        >
          {MESSAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Show announcement ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? "14px" : "5px",
                backgroundColor: i === index ? ACCENT : "rgba(247,238,221,0.35)",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes announcement-slide-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .announcement-slide {
          animation: announcement-slide-in 0.35s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .announcement-slide { animation: none; }
        }
      `}</style>
    </div>
  );
}
