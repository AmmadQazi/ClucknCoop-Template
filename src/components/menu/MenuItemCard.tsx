"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Flame, Star, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, getInitials } from "@/lib/utils";
import { AddToCartModal } from "@/components/menu/AddToCartModal";
import { toast } from "sonner";
import type { MenuItemWithRelations } from "@/types";

const TAG_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  spicy: {
    label: "Spicy",
    icon: <Flame className="h-2.5 w-2.5" />,
    className: "bg-orange-100 text-orange-700",
  },
  bestseller: {
    label: "Bestseller",
    icon: <Star className="h-2.5 w-2.5" />,
    className: "bg-[#FFF0F0] text-[#8C1515]",
  },
  new: {
    label: "New",
    icon: <Sparkles className="h-2.5 w-2.5" />,
    className: "bg-green-100 text-green-700",
  },
  value: {
    label: "Value",
    icon: null,
    className: "bg-[#F5C518]/20 text-amber-700",
  },
};

function TagBadges({ tags }: { tags: string[] }) {
  return (
    <>
      {tags.map((tag) => {
        const cfg = TAG_CONFIG[tag];
        if (!cfg) return null;
        return (
          <span
            key={tag}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${cfg.className}`}
          >
            {cfg.icon}{cfg.label}
          </span>
        );
      })}
    </>
  );
}

function ItemImage({ imageUrl, name, className }: { imageUrl: string | null; name: string; className?: string }) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        fill
        className={`object-cover ${className ?? ""}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    );
  }
  return (
    <span className="font-brand text-5xl font-semibold text-[#8C1515] uppercase opacity-20 select-none">
      {getInitials(name)}
    </span>
  );
}

interface MenuItemCardProps {
  item: MenuItemWithRelations;
  layout?: "grid" | "list";
}

export function MenuItemCard({ item, layout = "grid" }: MenuItemCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const hasOptions = item.variants.length > 0 || item.addons.length > 0;

  const handleAddClick = useCallback(() => {
    if (hasOptions) {
      setModalOpen(true);
    } else {
      addItem({
        menuItemId: item.id,
        name: item.name,
        imageUrl: item.imageUrl ?? null,
        basePrice: Number(item.basePrice),
        variantExtra: 0,
        addons: [],
        quantity: 1,
        unitPrice: Number(item.basePrice),
      });
      toast.success(`${item.name} added to cart!`);
    }
  }, [hasOptions, addItem, item]);

  if (layout === "list") {
    return (
      <>
        <div className="flex gap-3 p-4 bg-white rounded-2xl border border-[#E8E0DF] hover:border-[#8C1515]/30 hover:shadow-[0_4px_12px_0_rgba(140,21,21,0.08)] transition-all duration-200">
          <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[#FFF0F0] flex items-center justify-center">
            <ItemImage imageUrl={item.imageUrl ?? null} name={item.name} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
            <div>
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="font-semibold text-sm text-[#1C1C1C] leading-tight">{item.name}</h3>
                <TagBadges tags={item.tags} />
              </div>
              {item.description && (
                <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#8C1515]">
                {formatPrice(Number(item.basePrice))}
                {item.variants.length > 0 && <span className="text-xs font-normal text-[#6B6B6B] ml-1">from</span>}
              </span>
              <button
                onClick={handleAddClick}
                disabled={!item.isAvailable}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8C1515] text-white text-xs font-semibold hover:bg-[#A01A1A] active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
          </div>
        </div>
        <AddToCartModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl border border-[#E8E0DF] overflow-hidden hover:border-[#8C1515]/30 hover:shadow-[0_4px_16px_0_rgba(140,21,21,0.10)] transition-all duration-200 group">
        <div className="relative h-44 bg-[#FFF0F0] flex items-center justify-center overflow-hidden">
          <ItemImage
            imageUrl={item.imageUrl ?? null}
            name={item.name}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          {item.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
              <TagBadges tags={item.tags} />
            </div>
          )}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <span className="px-3 py-1 rounded-full bg-[#1C1C1C] text-white text-xs font-semibold">
                Unavailable
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-[#1C1C1C] leading-snug line-clamp-2">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-[#8C1515]">
                {formatPrice(Number(item.basePrice))}
              </span>
              {item.variants.length > 0 && (
                <span className="ml-1 text-xs text-[#6B6B6B]">from</span>
              )}
            </div>
            <button
              onClick={handleAddClick}
              disabled={!item.isAvailable}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C1515] text-white text-sm font-semibold hover:bg-[#A01A1A] active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515] focus-visible:ring-offset-2"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </div>
      <AddToCartModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
