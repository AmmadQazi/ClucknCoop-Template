"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import type { CategoryWithItems, MenuItemWithRelations } from "@/types";

interface MenuPageClientProps {
  categories: CategoryWithItems[];
}

export function MenuPageClient({ categories }: MenuPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");

  const allItems = useMemo(
    () => categories.flatMap((c) => c.items),
    [categories]
  );

  const filtered = useMemo(() => {
    let items = selectedCategory === "all"
      ? allItems
      : categories.find((c) => c.slug === selectedCategory)?.items ?? [];

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i: MenuItemWithRelations) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [selectedCategory, query, allItems, categories]);

  const grouped = useMemo(() => {
    if (selectedCategory !== "all" || query.trim()) {
      return [{ category: selectedCategory === "all" ? "Results" : (categories.find(c => c.slug === selectedCategory)?.name ?? "Results"), items: filtered }];
    }
    return categories
      .filter((c) => c.items.length > 0)
      .map((c) => ({ category: c.name, items: c.items }));
  }, [selectedCategory, query, filtered, categories]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Search + Filter bar */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B] pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu…"
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#E8E0DF] bg-white text-sm text-[#1C1C1C] placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1C1C1C] transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <span className="text-5xl">🍽️</span>
          <p className="text-lg font-semibold text-[#1C1C1C]">No items found</p>
          <p className="text-sm text-[#6B6B6B]">Try a different category or search term</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {grouped.map(({ category, items }) => (
            <section key={category}>
              <h2 className="font-brand text-2xl font-semibold text-[#1C1C1C] mb-5">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item: MenuItemWithRelations) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
