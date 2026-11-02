"use client";

import { useEffect, useState } from "react";
import { ListOrdered, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type TocItem = {
  id: string;
  title: string;
  level?: 2 | 3;
};

export default function ArticleTableOfContents({
  items,
}: {
  items: TocItem[];
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top distance to pick the topmost visible section
          const topEntry = visibleEntries.reduce((prev, current) =>
            prev.boundingClientRect.top < current.boundingClientRect.top
              ? prev
              : current,
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: "-90px 0% -65% 0%",
        threshold: [0, 0.2, 0.5],
      },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  return (
    <div>
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden mb-8 rounded-2xl border border-line bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between text-left font-semibold text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          aria-expanded={isOpen}
          aria-controls="mobile-toc-list"
        >
          <span className="flex items-center gap-2.5 text-sm font-bold">
            <ListOrdered className="h-4 w-4 text-blue" aria-hidden="true" />
            Table of Contents
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-500 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <nav id="mobile-toc-list" aria-label="Table of contents" className="mt-4 border-t border-line/60 pt-3">
            <ul className="space-y-1.5 text-sm">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className={cn(
                        "block w-full text-left py-1.5 text-xs transition-colors rounded-md px-2",
                        item.level === 3 && "pl-5",
                        isActive
                          ? "bg-blue/10 font-bold text-blue"
                          : "text-slate-600 hover:bg-slate-50 hover:text-navy",
                      )}
                    >
                      {item.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop Sticky TOC */}
      <div className="hidden lg:block">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-line pb-3.5">
            <ListOrdered className="h-4 w-4 text-blue" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
              Table of Contents
            </h3>
          </div>
          <nav aria-label="Article Table of Contents" className="mt-3.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className={cn(
                        "group relative flex w-full items-start text-left text-xs leading-relaxed transition-all rounded-lg py-1.5 px-2.5",
                        item.level === 3 && "pl-6",
                        isActive
                          ? "bg-blue/10 font-bold text-blue"
                          : "text-slate-600 hover:bg-slate-50 hover:text-navy",
                      )}
                    >
                      <span
                        className={cn(
                          "mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                          isActive
                            ? "bg-blue"
                            : "bg-slate-300 group-hover:bg-slate-400",
                        )}
                        aria-hidden="true"
                      />
                      <span>{item.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
