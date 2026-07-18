"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { NAV_CATEGORIES, type NavCategoryId } from "@/data/nav-categories";
import { SITE_HEADER_OFFSET_PX, COLOR_MAROON } from "@/lib/brand";

const BRAND_ACCENT = COLOR_MAROON;
const STICKY_TOP_GAP_PX = 16;
const NAV_HEIGHT_PX = 64;
const PILL_MAX_WIDTH_PX = 960;

export function CategoryNav() {
  const [active, setActive] = useState<NavCategoryId>("celebration-cakes");
  const [isPinned, setIsPinned] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const stickyTop = SITE_HEADER_OFFSET_PX + STICKY_TOP_GAP_PX;

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
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    const sentinel = sentinelRef.current;
    if (!hero || !sentinel) return;

    const updateNavPosition = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const pastHero = heroBottom <= stickyTop;
      setIsPastHero(pastHero);

      if (!pastHero) {
        setIsPinned(false);
        return;
      }

      const sentinelTop = sentinel.getBoundingClientRect().top;
      setIsPinned(sentinelTop <= stickyTop);
    };

    updateNavPosition();
    window.addEventListener("scroll", updateNavPosition, { passive: true });
    window.addEventListener("resize", updateNavPosition);
    return () => {
      window.removeEventListener("scroll", updateNavPosition);
      window.removeEventListener("resize", updateNavPosition);
    };
  }, [stickyTop]);

  useEffect(() => {
    const sections = NAV_CATEGORIES.map((cat) =>
      document.getElementById(`category-${cat.id}`)
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });

        let bestId: NavCategoryId = "celebration-cakes";
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
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (id: NavCategoryId) => {
    const el = document.getElementById(`category-${id}`);
    if (!el) return;

    const offset = stickyTop + NAV_HEIGHT_PX + STICKY_TOP_GAP_PX;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: NavCategoryId, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToCategory(id);
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      const next = NAV_CATEGORIES[(index + delta + NAV_CATEGORIES.length) % NAV_CATEGORIES.length];
      tabRefs.current.get(next.id)?.focus();
    }
  };

  const isSticky = isPastHero && isPinned;

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />

      <div
        className={cn(
          "z-40 flex justify-center px-4 transition-all duration-300 sm:px-6",
          !isPastHero && "pointer-events-none invisible",
          isSticky ? "fixed left-0 right-0" : "relative py-4"
        )}
        style={{ top: isSticky ? stickyTop : undefined }}
      >
        <nav
          aria-label="Product categories"
          className="w-full"
          style={{ maxWidth: PILL_MAX_WIDTH_PX }}
        >
          <div
            className={cn(
              "relative flex h-16 items-center rounded-full border border-maroon/10 bg-mist-blue p-2",
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
                className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-light-blue/70 shadow-[0_2px_8px_rgba(69,21,25,0.08)] transition-all duration-300 ease-out"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.width > 0 ? 1 : 0,
                }}
              />

              {NAV_CATEGORIES.map((cat, index) => {
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
                    style={{ color: isActive ? BRAND_ACCENT : undefined }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {isSticky && (
        <div
          className="pointer-events-none"
          style={{ height: NAV_HEIGHT_PX + STICKY_TOP_GAP_PX }}
          aria-hidden
        />
      )}
    </>
  );
}
