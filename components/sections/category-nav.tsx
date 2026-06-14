"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";

export function CategoryNav() {
  const [active, setActive] = useState("cakes");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new IntersectionObserver(
      () => {},
      { rootMargin: "-50% 0px -50% 0px" }
    );

    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const cat of categories) {
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
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`category-${id}`) || document.getElementById("menu");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-[72px] z-40 border-b border-ivory/10 bg-black/90 backdrop-blur-xl"
    >
      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-1 overflow-x-auto px-6 py-4 lg:justify-center lg:px-10"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToCategory(cat.id)}
            className={cn(
              "shrink-0 px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition-all duration-300",
              active === cat.id
                ? "bg-gold text-black"
                : "text-ivory/60 hover:text-ivory"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
