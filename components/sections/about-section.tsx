"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timelineEvents } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".timeline-item");
    gsap.fromTo(
      items,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
        },
      }
    );
  }, []);

  return (
    <section id="about" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
              Our Story
            </p>
            <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
              About IYLO
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-ivory/60">
              IYLO began with a simple belief: that bread, when made with
              patience and purpose, can be transformative. What started as a
              home kitchen experiment has grown into one of Delhi&apos;s most
              beloved artisan bake houses.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60">
              Founded by pastry chef Ananya Iyer, IYLO combines French
              technique with Indian sensibilities — sourcing local grains,
              celebrating seasonal produce, and honoring the slow craft of
              fermentation.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ivory/10 pt-10">
              {[
                { value: "48hr", label: "Sourdough Ferment" },
                { value: "100%", label: "Natural Ingredients" },
                { value: "12yr", label: "Starter Heritage" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="editorial-heading text-3xl text-gold md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                alt="Artisan baking process"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 hidden h-48 w-48 overflow-hidden border-4 border-black md:block">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"
                alt="Fresh bread"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div ref={timelineRef} className="mt-24 border-t border-ivory/10 pt-24">
          <h3 className="editorial-heading mb-12 text-center text-3xl text-ivory">
            Our Journey
          </h3>
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-ivory/10 md:block" />
            <div className="grid gap-8 md:grid-cols-5">
              {timelineEvents.map((event) => (
                <div key={event.year} className="timeline-item relative text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-black">
                    <span className="text-xs text-gold">{event.year.slice(2)}</span>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-gold">
                    {event.year}
                  </p>
                  <h4 className="mt-2 font-medium text-ivory">{event.title}</h4>
                  <p className="mt-2 text-xs text-ivory/40">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
