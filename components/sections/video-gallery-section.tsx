"use client";

import Image from "next/image";
import { videoGallery } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";
import { Play } from "lucide-react";

export function VideoGallerySection() {
  return (
    <section id="video-gallery" className="section-padding bg-brown/10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Behind the Scenes</p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">Video Gallery</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/50">
            Step inside our Jayanagar kitchen — bread making, cake decoration, and the craft behind every bake.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {videoGallery.map((video, i) => (
            <div
              key={video.id}
              className="group relative aspect-video overflow-hidden bg-black"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/30 bg-black/50 backdrop-blur-sm transition-transform group-hover:scale-110">
                  <Play className="h-6 w-6 fill-ivory text-ivory" />
                </div>
                <p className="mt-4 text-sm uppercase tracking-widest text-ivory">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
