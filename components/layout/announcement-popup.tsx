"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { announcements } from "@/data/products";

export function AnnouncementPopup() {
  const [open, setOpen] = useState(false);
  const popup = announcements.find((a) => a.type === "popup");

  useEffect(() => {
    const dismissed = sessionStorage.getItem("iylo-popup-dismissed");
    if (!dismissed && popup) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem("iylo-popup-dismissed", "1");
  };

  if (!popup) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 z-[120] w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-ivory/10 bg-black p-8"
          >
            <button onClick={dismiss} className="absolute right-4 top-4 text-ivory/60" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <div className="relative mb-6 aspect-video overflow-hidden">
              <Image src={popup.image} alt={popup.title} fill className="object-cover" sizes="400px" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gold">{popup.tag}</span>
            <h3 className="editorial-heading mt-2 text-2xl text-ivory">{popup.title}</h3>
            <p className="mt-3 text-sm text-ivory/60">{popup.description}</p>
            <button
              onClick={dismiss}
              className="mt-6 w-full bg-gold py-3 text-xs font-medium uppercase tracking-widest text-black"
            >
              Explore Collection
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
