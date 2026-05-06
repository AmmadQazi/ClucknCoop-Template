"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string }[];
  selected: string;
  onChange: (slug: string) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const pills = [{ id: "all", name: "All", slug: "all" }, ...categories];

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1 -mx-1"
      role="tablist"
      aria-label="Filter menu by category"
    >
      {pills.map((cat) => {
        const isActive = selected === cat.slug;
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.slug)}
            className={cn(
              "shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515] focus-visible:ring-offset-1",
              isActive
                ? "bg-[#8C1515] text-white shadow-sm"
                : "bg-white text-[#8C1515] border-2 border-[#8C1515] hover:bg-[#FFF0F0]"
            )}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
