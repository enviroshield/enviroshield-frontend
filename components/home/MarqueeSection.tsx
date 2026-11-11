"use client";

import { motion, useReducedMotion } from "motion/react";

const MARQUEE_TEXT = "NUMBER 1 WATERPROOFING BRAND IN BANGLADESH AND AUSTRALIA";
const REPEAT_COUNT = 6;

function StarburstIcon({ className = "size-4 text-blue fill-current shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12,2 13.8,5.2 17,3.3 16.9,7.1 20.7,7 18.8,10.2 22,12 18.8,13.8 20.7,17 16.9,17 17,20.7 13.8,18.8 12,22 10.2,18.8 7,20.7 7.1,17 3.3,17 5.2,13.8 2,12 5.2,10.2 3.3,7 7.1,7.1 7,3.3 10.2,5.2" />
    </svg>
  );
}

export default function MarqueeSection() {
  const shouldReduceMotion = useReducedMotion();
  const items = Array.from({ length: REPEAT_COUNT });

  return (
    <section
      aria-label="Brand Announcement"
      className="relative z-10 w-full overflow-hidden bg-blue py-1.5 sm:py-2 select-none border-y border-blue/40"
    >
      {/* Accessible screen-reader text */}
      <span className="sr-only">{MARQUEE_TEXT}</span>

      {/* Inner White Stripe Line */}
      <div className="w-full bg-white py-2.5 sm:py-3 shadow-inner">
        <div className="flex w-max" aria-hidden="true">
          <motion.div
            className="flex shrink-0 items-center"
            animate={
              shouldReduceMotion
                ? undefined
                : { x: ["0%", "-50%"] }
            }
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 38,
                ease: "linear",
              },
            }}
          >
            {/* Sequence 1 */}
            <div className="flex shrink-0 items-center">
              {items.map((_, idx) => (
                <div key={`seq1-${idx}`} className="flex shrink-0 items-center">
                  <span className="shrink-0 text-xs sm:text-[13px] md:text-sm font-extrabold uppercase tracking-[0.14em] text-blue whitespace-nowrap">
                    {MARQUEE_TEXT}
                  </span>
                  <StarburstIcon className="mx-6 sm:mx-8 size-3.5 sm:size-4 text-blue fill-current shrink-0" />
                </div>
              ))}
            </div>

            {/* Sequence 2 (identical duplicate for continuous seamless infinite loop) */}
            <div className="flex shrink-0 items-center">
              {items.map((_, idx) => (
                <div key={`seq2-${idx}`} className="flex shrink-0 items-center">
                  <span className="shrink-0 text-xs sm:text-[13px] md:text-sm font-extrabold uppercase tracking-[0.14em] text-blue whitespace-nowrap">
                    {MARQUEE_TEXT}
                  </span>
                  <StarburstIcon className="mx-6 sm:mx-8 size-3.5 sm:size-4 text-blue fill-current shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
