"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  currentSortBy?: string;
  currentSortOrder?: string;
};

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest Arrivals" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "name:asc", label: "Name: A to Z" },
  { value: "name:desc", label: "Name: Z to A" },
  { value: "stockQuantity:desc", label: "Stock: High to Low" },
];

export default function ProductSortSelect({
  currentSortBy = "createdAt",
  currentSortOrder = "desc",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentValue = `${currentSortBy || "createdAt"}:${currentSortOrder || "desc"}`;

  const handleValueChange = (val: string | null) => {
    if (!val) return;
    const [sortBy, sortOrder] = val.split(":");
    const params = new URLSearchParams(searchParams.toString());

    if (sortBy === "createdAt" && sortOrder === "desc") {
      params.delete("sortBy");
      params.delete("sortOrder");
    } else {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }

    params.delete("page");
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products", { scroll: false });
  };

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger
        aria-label="Sort products by"
        className="h-10 min-w-44 rounded-xl border-line/90 bg-white text-xs font-semibold text-navy shadow-xs hover:border-blue/40 focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15"
      >
        <div className="flex items-center gap-2 truncate">
          <ArrowUpDown size={13} className="text-ink/50" />
          <SelectValue placeholder="Sort by" />
        </div>
      </SelectTrigger>

      <SelectContent
        align="end"
        className="rounded-xl border border-line bg-white shadow-lg"
      >
        {SORT_OPTIONS.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="cursor-pointer text-xs font-medium text-navy hover:bg-mist/70 focus:bg-mist focus:text-blue"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
