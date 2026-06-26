"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { googleBusiness, googleReviews } from "@/data/google-reviews";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            i < Math.floor(rating)
              ? "fill-[#FBBC05] text-[#FBBC05]"
              : "fill-black/10 text-black/10"
          )}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ReviewCard({
  review,
  index,
}: {
  review: (typeof googleReviews)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 140;
  const displayText =
    expanded || !isLong ? review.text : `${review.text.slice(0, 140)}…`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="flex h-full w-[320px] shrink-0 flex-col border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:w-[360px]"
    >
      <div className="flex items-start gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brown/10 text-sm font-medium text-brown">
          {review.profilePhotoUrl ? (
            <Image
              src={review.profilePhotoUrl}
              alt={review.authorName}
              fill
              className="object-cover"
              sizes="44px"
            />
          ) : (
            <span aria-hidden="true">{getInitials(review.authorName)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-black">{review.authorName}</p>
          <p className="text-xs text-black/40">{review.relativeTime}</p>
        </div>
        <GoogleLogo className="h-5 w-5 shrink-0" />
      </div>

      <div className="mt-4">
        <StarRating rating={review.rating} />
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-black/70">
        {displayText}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 self-start text-xs font-medium text-brown hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </motion.article>
  );
}

export function GoogleReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { rating, totalReviews, ratingDistribution, reviewUrl, mapsUrl } =
    googleBusiness;

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -380 : 380;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const maxCount = Math.max(...Object.values(ratingDistribution));

  return (
    <section id="reviews" className="section-padding bg-ivory text-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12">
          <h2 className="editorial-heading text-4xl text-black md:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 max-w-lg text-sm text-black/50">
            Real reviews from Google — loved by families, food lovers, and
            corporate clients across Bangalore.
          </p>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          {/* Rating summary badge — Cakeday-style */}
          <Reveal delay={0.1}>
            <div className="border border-black/10 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-black/10">
                  <Image
                    src={googleBusiness.profileImage!}
                    alt={googleBusiness.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-medium text-black">{googleBusiness.name}</p>
                  <p className="text-xs text-black/40">Jayanagar, Bangalore</p>
                </div>
              </div>

              <div className="mt-6 flex items-end gap-3">
                <span className="editorial-heading text-5xl text-black">
                  {rating.toFixed(1)}
                </span>
                <div className="mb-1">
                  <StarRating rating={rating} size="lg" />
                  <p className="mt-1 text-xs text-black/50">
                    {totalReviews} Google reviews
                  </p>
                </div>
              </div>

              {/* Rating histogram */}
              <div className="mt-6 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count =
                    ratingDistribution[stars as keyof typeof ratingDistribution];
                  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-black/50">{stars}</span>
                      <Star className="h-3 w-3 fill-[#FBBC05] text-[#FBBC05]" />
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5">
                        <div
                          className="h-full rounded-full bg-[#FBBC05] transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-black/40">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gold px-4 py-3 text-xs font-medium uppercase tracking-widest text-black transition-opacity hover:opacity-90"
                >
                  <GoogleLogo className="h-4 w-4" />
                  Write a Review
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-black/20 px-4 py-3 text-xs uppercase tracking-widest text-black/70 transition-colors hover:border-brown hover:text-brown"
                >
                  View on Google Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Reviews carousel */}
          <div className="relative min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-black/40">
                Recent Google Reviews
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="flex h-9 w-9 items-center justify-center border border-black/20 transition-colors hover:border-brown hover:text-brown"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="flex h-9 w-9 items-center justify-center border border-black/20 transition-colors hover:border-brown hover:text-brown"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="hide-scrollbar flex gap-4 overflow-x-auto pb-4"
            >
              {googleReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>

            <p className="mt-4 text-center text-xs text-black/40 lg:text-left">
              Reviews sourced from{" "}
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brown hover:underline"
              >
                Google
                <GoogleLogo className="inline h-3.5 w-3.5" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
