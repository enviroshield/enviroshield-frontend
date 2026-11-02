"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/Button";
import { Input } from "@/components/ui/input";

type Props = {
  initialSearch?: string;
};

export default function ProductSearch({ initialSearch = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearch);

  useEffect(() => {
    setValue(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    params.delete("page");
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products", { scroll: false });
  };

  const handleClear = () => {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products", { scroll: false });
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full items-center gap-2.5"
    >
      <div className="relative flex-1">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-ink/40">
          <Search size={16} />
        </div>

        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search products by name, SKU, or keywords..."
          aria-label="Search products"
          className="h-12 w-full rounded-2xl border-line/90 bg-white pl-10 pr-9 text-sm text-ink placeholder:text-ink/40 shadow-xs focus-visible:border-blue focus-visible:ring-blue/20"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-ink/40 transition hover:bg-mist hover:text-navy"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <Button type="submit" className="shrink-0 !min-h-12">
        Search
      </Button>
    </form>
  );
}
