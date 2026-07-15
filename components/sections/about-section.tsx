"use client";

import Image from "next/image";
import { founderMessage } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";
import { ProductImages as img } from "@/lib/product-images";
import { BRAND_STORY } from "@/data/site-content";

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="editorial-heading text-4xl text-ivory md:text-6xl">
              Our Story
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-ivory/60">
              {BRAND_STORY.intro}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60">
              {BRAND_STORY.founder}
            </p>
          </Reveal>

          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={img.bannerHomeDesktop}
                alt="Artisan baking process"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 hidden h-48 w-48 overflow-hidden border-4 border-black md:block">
              <Image
                src={img.sourdoughLoaf}
                alt="Fresh bread"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-2">
          <div className="border border-ivory/10 p-6 md:p-8">
            <h3 className="text-xs uppercase tracking-widest text-gold">Our Mission</h3>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60">
              {BRAND_STORY.mission}
            </p>
          </div>
          <div className="border border-ivory/10 p-6 md:p-8">
            <h3 className="text-xs uppercase tracking-widest text-gold">Our Vision</h3>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60">
              {BRAND_STORY.vision}
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-12 border-t border-ivory/10 pt-24 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="editorial-heading mb-6 text-2xl text-ivory">Founder&apos;s Message</h3>
            <blockquote className="editorial-heading text-xl leading-relaxed text-ivory/80 md:text-2xl">
              &ldquo;{founderMessage.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-sm text-gold">{founderMessage.name}</p>
            <p className="text-xs text-muted">{founderMessage.title}</p>
          </div>
          <div className="relative aspect-square overflow-hidden bg-[#FBF7F1]">
            <Image
              src={founderMessage.image}
              alt="IYLO Bakehouse storefront"
              fill
              className="object-contain p-4"
              sizes="400px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
