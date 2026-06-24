"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { announcements } from "@/data/products";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const banner = announcements.find((a) => a.type === "banner");

  if (dismissed || !banner) return null;

  return (
    <div className="relative z-[60] bg-gold px-4 py-2.5 text-center text-black">
      <p className="text-xs tracking-wide md:text-sm">
        <span className="font-medium">{banner.title}</span>
        <span className="mx-2 hidden sm:inline">·</span>
        <span className="hidden sm:inline opacity-80">{banner.description}</span>
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
