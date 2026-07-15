"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { NavCategoryId } from "@/data/nav-categories";
import { SITE_HEADER_OFFSET_PX, COLOR_MAROON } from "@/lib/brand";

const NAV_HEIGHT_PX = 64;
const STICKY_GAP_PX = 12;
const PILL_MAX_WIDTH_PX = 960;

type CategoryTab = { id: NavCategoryId; label: string };

export function MenuStickyNav({ categories }: { categories: CategoryTab[] }) {
  const [active, setActive] = useState<NavCategoryId>(categories[0]?.id ?? "celebration-cakes");
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const stickyTop = SITE_HEADER_OFFSET_PX + STICKY_GAP_PX;
  const scrollOffset = stickyTop + NAV_HEIGHT_PX + STICKY_GAP_PX;

  const updateIndicator = useCallback(() => {
    const btn = tabRefs.current.get(active);
    const list = tabListRef.current;
    if (!btn || !list) return;
    setIndicator({
      left: btn.offsetLeft - list.scrollLeft,
      width: btn.offsetWidth,
    });
  }, [active]);

  useEffect(() => {
    updateIndicator();
    const btn = tabRefs.current.get(active);
    btn?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator, active]);

  // Deep-link: /products#category-cookies
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("category-")) return;
    const id = hash.replace("category-", "") as NavCategoryId;
    if (!categories.some((c) => c.id === id)) return;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
      window.scrollTo({ top, behavior: "smooth" });
      setActive(id);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [categories, scrollOffset]);

  useEffect(() => {
    if (categories.length === 0) return;

    const sections = categories
      .map((cat) => document.getElementById(`category-${cat.id}`))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });

        let bestId = categories[0].id;
        let bestRatio = 0;
        ratios.forEach((ratio, sectionId) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = sectionId.replace("category-", "") as NavCategoryId;
          }
        });

        if (bestRatio > 0) setActive(bestId);
      },
      {
        rootMargin: `-${scrollOffset}px 0px -45% 0px`,
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories, scrollOffset]);

  const scrollToCategory = (id: NavCategoryId) => {
    const el = document.getElementById(`category-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    id: NavCategoryId,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToCategory(id);
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      const next = categories[(index + delta + categories.length) % categories.length];
      tabRefs.current.get(next.id)?.focus();
    }
  };

  if (categories.length === 0) return null;

  return (
    <>
      <div
        className="fixed left-0 right-0 z-40 flex justify-center px-4 sm:px-6"
        style={{ top: stickyTop }}
      >
        <nav
          aria-label="Product categories"
          className="w-full"
          style={{ maxWidth: PILL_MAX_WIDTH_PX }}
        >
          <div
            className={cn(
              "relative flex h-16 items-center rounded-full border border-maroon/10 bg-white p-2",
              "shadow-[0_4px_24px_rgba(69,21,25,0.1)]"
            )}
          >
            <div
              ref={tabListRef}
              className="hide-scrollbar relative flex h-full w-full items-center gap-1 overflow-x-auto"
              role="tablist"
              onScroll={updateIndicator}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-mist-blue/80 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.width > 0 ? 1 : 0,
                }}
              />

              {categories.map((cat, index) => {
                const isActive = active === cat.id;
                return (
                  <button
                    key={cat.id}
                    ref={(el) => {
                      if (el) tabRefs.current.set(cat.id, el);
                    }}
                    type="button"
                    role="tab"
                    id={`category-tab-${cat.id}`}
                    aria-selected={isActive}
                    aria-controls={`category-${cat.id}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => scrollToCategory(cat.id)}
                    onKeyDown={(e) => handleKeyDown(e, cat.id, index)}
                    className={cn(
                      "relative z-10 shrink-0 rounded-full px-3 py-2.5 text-xs font-medium transition-colors duration-300 sm:px-4 sm:text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2",
                      isActive
                        ? "font-semibold text-maroon"
                        : "text-maroon/50 hover:text-maroon/80"
                    )}
                    style={{ color: isActive ? COLOR_MAROON : undefined }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer so content clears fixed sticky nav */}
      <div
        style={{ height: NAV_HEIGHT_PX + STICKY_GAP_PX * 2 }}
        aria-hidden
      />
    </>
  );
}
