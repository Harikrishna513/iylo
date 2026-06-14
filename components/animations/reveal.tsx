"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  stagger?: number;
  as?: "div" | "section" | "article" | "span";
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 1.2,
  stagger = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from: gsap.TweenVars = { opacity: 0 };
    if (direction === "up") from.y = 60;
    if (direction === "down") from.y = -60;
    if (direction === "left") from.x = 60;
    if (direction === "right") from.x = -60;

    const targets = stagger > 0 ? el.children : el;

    gsap.fromTo(
      targets,
      from,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [delay, direction, duration, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function TextReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = text.split(" ");
    el.innerHTML = words
      .map((w) => `<span class="inline-block overflow-hidden"><span class="inline-block word">${w}&nbsp;</span></span>`)
      .join("");

    const wordEls = el.querySelectorAll(".word");

    gsap.fromTo(
      wordEls,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      }
    );
  }, [text]);

  return <div ref={ref} className={className} />;
}
