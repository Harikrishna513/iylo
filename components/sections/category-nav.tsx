"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";

export function CategoryNav() {
  const [active, setActive] = useState("cakes");
  const scrollRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 250;
      for (const cat of categories) {
        if (cat.id === "workshops") {
          const el = document.getElementById("workshops");
          if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
            setActive("workshops");
            return;
          }
          continue;
        }
        const el = document.getElementById(`category-${cat.id}`);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActive(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const btn = buttonsRef.current.get(active);
    const indicator = indicatorRef.current;
    if (btn && indicator && scrollRef.current) {
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.transform = `translateX(${btn.offsetLeft - scrollRef.current.scrollLeft}px)`;
    }
  }, [active]);

  const scrollToCategory = (id: string) => {
    if (id === "workshops") {
      document.getElementById("workshops")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const el =
      document.getElementById(`category-${id}`) ||
      document.getElementById("menu");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-[72px] z-40 border-b border-ivory/10 bg-black/90 backdrop-blur-xl">
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={scrollRef}
          className="hide-scrollbar flex gap-1 overflow-x-auto px-6 py-4 lg:justify-center lg:px-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              ref={(el) => {
                if (el) buttonsRef.current.set(cat.id, el);
              }}
              onClick={() => scrollToCategory(cat.id)}
              className={cn(
                "relative z-10 shrink-0 px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors duration-300",
                active === cat.id ? "text-black" : "text-ivory/60 hover:text-ivory"
              )}
            >
              {cat.label}
            </button>
          ))}
          <div
            ref={indicatorRef}
            className="pointer-events-none absolute bottom-4 left-6 h-[calc(100%-2rem)] bg-gold transition-all duration-500 ease-out"
            style={{ width: 0 }}
          />
        </div>
      </div>
    </nav>
  );
}
