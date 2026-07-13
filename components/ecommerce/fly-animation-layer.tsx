"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFlyAnimationStore } from "@/store/fly-animation-store";

export function FlyAnimationLayer() {
  const items = useFlyAnimationStore((s) => s.items);
  const remove = useFlyAnimationStore((s) => s.remove);
  const pulse = useFlyAnimationStore((s) => s.pulse);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <AnimatePresence>
        {items.map((fly) => (
          <motion.div
            key={fly.id}
            className="fixed overflow-hidden rounded-full shadow-2xl ring-2 ring-white/80"
            style={{
              left: fly.from.x,
              top: fly.from.y,
              width: fly.from.width,
              height: fly.from.height,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              left: [fly.from.x, fly.from.x + (fly.to.x - fly.from.x) * 0.45, fly.to.x],
              top: [fly.from.y, fly.from.y - 72, fly.to.y],
              width: [fly.from.width, fly.from.width * 0.55, fly.to.width],
              height: [fly.from.height, fly.from.height * 0.55, fly.to.height],
              opacity: [1, 1, 0.15, 0],
              scale: [1, 0.85, 0.35],
            }}
            transition={{
              duration: 0.65,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.45, 0.85, 1],
            }}
            onAnimationComplete={() => {
              pulse(fly.target);
              fly.onComplete?.();
              remove(fly.id);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fly.image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
