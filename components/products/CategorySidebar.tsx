import Link from "next/link";
import { Check, ChevronRight, LayoutGrid, Tag, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ICategory } from "@/types/category.type";

type Props = {
  categories: ICategory[];
  activeCategoryId: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  inStock?: string;
  isFeatured?: string;
  sortBy?: string;
  sortOrder?: string;
  hasError?: boolean;
};

export default function CategorySidebar({
  categories,
  activeCategoryId,
  minPrice,
  maxPrice,
  search,
  inStock,
  isFeatured,
  sortBy,
  sortOrder,
  hasError = false,
}: Props) {
  const allItems = [
    { _id: "", name: "All Products", isAll: true },
    ...categories.map((c) => ({ ...c, isAll: false })),
  ];

  const hasActiveCategory = Boolean(activeCategoryId);

  const buildHref = (categoryId: string) => {
    const qs = new URLSearchParams();
    if (search?.trim()) qs.set("search", search.trim());
    if (categoryId) qs.set("categoryId", categoryId);
    if (minPrice) qs.set("minPrice", minPrice);
    if (maxPrice) qs.set("maxPrice", maxPrice);
    if (inStock) qs.set("inStock", inStock);
    if (isFeatured) qs.set("isFeatured", isFeatured);
    if (sortBy) qs.set("sortBy", sortBy);
    if (sortOrder) qs.set("sortOrder", sortOrder);
    const query = qs.toString();
    return query ? `/products?${query}` : "/products";
  };

  const resetHref = buildHref("");

  return (
    <div className="overflow-hidden rounded-2xl border border-line/90 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,51,78,0.06)] transition-all">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue/10 text-blue">
            <LayoutGrid size={15} />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
            Categories
          </h3>
        </div>

        {hasActiveCategory && (
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

      {/* Categories List */}
      <ul className="space-y-1.5" role="list">
        {allItems.map((item) => {
          const isActive = item._id === activeCategoryId;
          const Icon = item.isAll ? LayoutGrid : Tag;

          return (
            <li key={item._id || "all-side"}>
              <Link
                href={buildHref(item._id)}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue/10 via-blue/5 to-transparent font-semibold text-navy ring-1 ring-blue/20 shadow-xs"
                    : "text-ink/75 hover:bg-mist/70 hover:text-navy hover:pl-3.5",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-blue text-white shadow-xs"
                        : "bg-mist/80 text-ink/60 group-hover:bg-blue/10 group-hover:text-blue",
                    )}
                  >
                    <Icon size={14} className="stroke-[2.2]" />
                  </span>

                  <span className="truncate">{item.name}</span>
                </div>

                {isActive ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue/15 text-blue">
                    <Check size={12} className="stroke-[3]" />
                  </span>
                ) : (
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-ink/30 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {hasError && (
        <p role="status" className="mt-3 text-xs text-amber-800">
          Categories could not be loaded.
        </p>
      )}
    </div>
  );
}

