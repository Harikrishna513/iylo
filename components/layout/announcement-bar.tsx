"use client";

import React from "react";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  Star,
  CreditCard,
  Heart,
  Gift,
} from "lucide-react";

const MESSAGES: { icon: React.ElementType; text: string }[] = [
  { icon: Truck, text: "Free Delivery on Orders Above ₹999" },
  { icon: Sparkles, text: "Freshly Baked Every Day" },
  { icon: Star, text: "Made with Premium Ingredients" },
  { icon: ShieldCheck, text: "Cash on Delivery Available Across Bangalore" },
  { icon: CreditCard, text: "100% Secure Payments" },
  { icon: Heart, text: "Handcrafted with Love Since 2025" },
  { icon: Gift, text: "Perfect Cakes for Every Celebration" },
];

const SCROLL_DURATION_S = 40;
const BG_PRIMARY = "#4A2132";
const TEXT_PRIMARY = "#F8FAFC";
const ICON_ACCENT = "#FBF7F3";
const SEPARATOR_COLOR = "#FBF7F3";
const SEPARATOR_OPACITY = 0.45;

export function AnnouncementBar() {
  const renderTrack = (variant: "a" | "b") => (
    <ul
      className="flex shrink-0 items-center"
      role="list"
      aria-hidden={variant === "b" || undefined}
    >
      {MESSAGES.map((item, i) => {
        const Icon = item.icon;
        return (
          <li
            key={`${variant}-${i}`}
            className="flex items-center gap-2.5 pl-8 sm:pl-12"
          >
            <span
              className="inline-block h-1 w-1 shrink-0 rounded-full"
              style={{
                backgroundColor: SEPARATOR_COLOR,
                opacity: SEPARATOR_OPACITY,
              }}
              aria-hidden
            />

            <Icon
              size={14}
              className="shrink-0"
              style={{ color: ICON_ACCENT, opacity: 0.9 }}
              aria-hidden
            />

            <span
              className="whitespace-nowrap text-[11px] font-medium tracking-wide sm:text-xs"
              style={{ color: TEXT_PRIMARY, opacity: 0.95 }}
            >
              {item.text}
            </span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] flex h-9 items-center overflow-hidden"
      style={{
        backgroundColor: BG_PRIMARY,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      }}
      role="region"
      aria-label="Site announcements"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 sm:w-20"
        style={{
          background: `linear-gradient(to right, ${BG_PRIMARY}, transparent)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 sm:w-20"
        style={{
          background: `linear-gradient(to left, ${BG_PRIMARY}, transparent)`,
        }}
        aria-hidden
      />

      <div className="announcement-marquee-track flex h-full w-max items-center">
        {renderTrack("a")}
        {renderTrack("b")}
      </div>

      <style>{`
        @keyframes announcement-marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }

        .announcement-marquee-track {
          animation: announcement-marquee-scroll ${SCROLL_DURATION_S}s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }

        @media (hover: hover) and (pointer: fine) {
          .announcement-marquee-track:hover {
            animation-play-state: paused;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-marquee-track {
            animation: none !important;
            transform: translate3d(0, 0, 0);
          }
        }

        .announcement-marquee-track {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}
