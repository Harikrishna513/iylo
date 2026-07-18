"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Admin uses native scroll so modals / tables work with the mouse wheel
    if (isAdmin) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isAdmin]);

  return <>{children}</>;
}
