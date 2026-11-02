"use client";

import Link from "next/link";
import { Award, CheckCircle2, PackageCheck, X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Props = {
  inStock?: string;
  isFeatured?: string;
  inStockToggleHref: string;
  featuredToggleHref: string;
  resetHref: string;
};

export default function ProductStatusFilter({
  inStock,
  isFeatured,
  inStockToggleHref,
  featuredToggleHref,
  resetHref,
}: Props) {
  const isInStockActive = inStock === "true";
  const isFeaturedActive = isFeatured === "true";
  const hasActivePreferences = isInStockActive || isFeaturedActive;

  return (
    <div className="overflow-hidden rounded-2xl border border-line/90 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,51,78,0.06)] transition-all">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue/10 text-blue">
            <CheckCircle2 size={15} />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
            Availability & Status
          </h3>
        </div>

        {hasActivePreferences && (
          <Link
            href={resetHref}
            scroll={false}
            className="group inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-blue transition-colors hover:bg-blue/10 hover:text-deep"
          >
            <span>Clear</span>
            <X size={12} className="transition-transform group-hover:rotate-90" />
          </Link>
        )}
      </div>

      {/* Options List with shadcn Checkbox */}
      <div className="space-y-2">
        {/* In Stock Only */}
        <Link
          href={inStockToggleHref}
          scroll={false}
          className={cn(
            "group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
            isInStockActive
              ? "bg-gradient-to-r from-blue/10 via-blue/5 to-transparent font-semibold text-navy ring-1 ring-blue/20 shadow-xs"
              : "text-ink/75 hover:bg-mist/70 hover:text-navy",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                isInStockActive
                  ? "bg-blue text-white shadow-xs"
                  : "bg-mist/80 text-ink/60 group-hover:bg-blue/10 group-hover:text-blue",
              )}
            >
              <PackageCheck size={14} className="stroke-[2.2]" />
            </span>

            <span className="truncate">In Stock Only</span>
          </div>

          <Checkbox
            checked={isInStockActive}
            aria-hidden="true"
            className="pointer-events-none shrink-0"
          />
        </Link>

        {/* Featured Items */}
        <Link
          href={featuredToggleHref}
          scroll={false}
          className={cn(
            "group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
            isFeaturedActive
              ? "bg-gradient-to-r from-blue/10 via-blue/5 to-transparent font-semibold text-navy ring-1 ring-blue/20 shadow-xs"
              : "text-ink/75 hover:bg-mist/70 hover:text-navy",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                isFeaturedActive
                  ? "bg-blue text-white shadow-xs"
                  : "bg-mist/80 text-ink/60 group-hover:bg-blue/10 group-hover:text-blue",
              )}
            >
              <Award size={14} className="stroke-[2.2]" />
            </span>

            <span className="truncate">Featured Products</span>
          </div>

          <Checkbox
            checked={isFeaturedActive}
            aria-hidden="true"
            className="pointer-events-none shrink-0"
          />
        </Link>
      </div>
    </div>
  );
}
