"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: string | React.ReactNode;
};

export default function WaterproofingFaqAccordion({
  faqs,
}: {
  faqs: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default for immediate preview
  const reduce = useReducedMotion();

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="my-10 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3 border-b border-line pb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue">
            Frequently Asked Questions
          </span>
          <h3 className="text-xl font-extrabold text-navy sm:text-2xl">
            Roof Waterproofing in Bangladesh — FAQs
          </h3>
        </div>
      </div>

      <div className="mt-6 divide-y divide-line/70">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-btn-${index}`;
          const panelId = `faq-panel-${index}`;

          return (
            <div key={index} className="py-4 first:pt-0 last:pb-0">
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start justify-between gap-4 text-left font-bold text-navy transition-colors hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 rounded-lg py-1"
              >
                <span className="text-base sm:text-lg leading-snug">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200",
                    isOpen && "rotate-180 bg-blue/10 text-blue",
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
