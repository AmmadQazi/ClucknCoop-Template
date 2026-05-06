"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatPrice, getInitials } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import type { MenuItemWithRelations } from "@/types";

interface AddToCartModalProps {
  item: MenuItemWithRelations;
  open: boolean;
  onClose: () => void;
}

export function AddToCartModal({ item, open, onClose }: AddToCartModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const defaultVariant = item.variants.find((v) => v.isDefault) ?? item.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    defaultVariant?.id
  );
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const selectedVariant = useMemo(
    () => item.variants.find((v) => v.id === selectedVariantId),
    [item.variants, selectedVariantId]
  );

  const unitPrice = useMemo(() => {
    const addonTotal = item.addons
      .filter((a) => selectedAddons.has(a.id))
      .reduce((sum, a) => sum + Number(a.price), 0);
    return Number(item.basePrice) + Number(selectedVariant?.priceExtra ?? 0) + addonTotal;
  }, [item.basePrice, item.addons, selectedVariant, selectedAddons]);

  const total = unitPrice * quantity;

  const toggleAddon = useCallback((addonId: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      next.has(addonId) ? next.delete(addonId) : next.add(addonId);
      return next;
    });
  }, []);

  const handleAdd = useCallback(() => {
    const addons = item.addons
      .filter((a) => selectedAddons.has(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: Number(a.price) }));

    addItem({
      menuItemId: item.id,
      name: item.name,
      imageUrl: item.imageUrl ?? null,
      basePrice: Number(item.basePrice),
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantExtra: Number(selectedVariant?.priceExtra ?? 0),
      addons,
      quantity,
      unitPrice,
      notes: notes.trim() || undefined,
    });
    toast.success(`${item.name} added to cart!`);
    onClose();
    setSelectedVariantId(defaultVariant?.id);
    setSelectedAddons(new Set());
    setQuantity(1);
    setNotes("");
  }, [item, selectedVariant, selectedAddons, quantity, unitPrice, notes, addItem, onClose, defaultVariant]);

  const availableAddons = useMemo(
    () => item.addons.filter((a) => a.isAvailable),
    [item.addons]
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl">
        <div className="relative h-44 bg-[#FFF0F0] flex items-center justify-center shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="448px"
            />
          ) : (
            <span className="font-brand text-6xl font-semibold text-[#8C1515] opacity-30 select-none uppercase">
              {getInitials(item.name)}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="font-brand text-xl font-semibold text-[#1C1C1C]">
              {item.name}
            </DialogTitle>
            {item.description && (
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.description}</p>
            )}
          </DialogHeader>

          {item.variants.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-[#1C1C1C] mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515] ${
                      selectedVariantId === v.id
                        ? "border-[#8C1515] bg-[#8C1515] text-white"
                        : "border-[#E8E0DF] text-[#1C1C1C] hover:border-[#8C1515] hover:bg-[#FFF0F0]"
                    }`}
                  >
                    {v.name}
                    {Number(v.priceExtra) > 0 && (
                      <span className="ml-1.5 opacity-75">
                        +{formatPrice(Number(v.priceExtra))}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableAddons.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-[#1C1C1C] mb-2">Add-ons</p>
              <div className="flex flex-col gap-2">
                {availableAddons.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAddons.has(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="h-4 w-4 rounded border-[#E8E0DF] accent-[#8C1515]"
                    />
                    <span className="flex-1 text-sm text-[#1C1C1C] group-hover:text-[#8C1515] transition-colors">
                      {addon.name}
                    </span>
                    {Number(addon.price) > 0 && (
                      <span className="text-sm text-[#6B6B6B]">
                        +{formatPrice(Number(addon.price))}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="item-notes"
              className="block text-sm font-semibold text-[#1C1C1C] mb-1.5"
            >
              Special instructions{" "}
              <span className="text-[#6B6B6B] font-normal">(optional)</span>
            </label>
            <textarea
              id="item-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra spicy, no onions…"
              rows={2}
              className="w-full rounded-xl border border-[#E8E0DF] px-3 py-2 text-sm text-[#1C1C1C] placeholder:text-[#6B6B6B] resize-none focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
            />
          </div>
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-[#E8E0DF] bg-white flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E0DF] text-[#1C1C1C] hover:border-[#8C1515] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-bold text-[#1C1C1C] tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8C1515] text-white hover:bg-[#A01A1A] transition-all"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button size="lg" className="flex-1" onClick={handleAdd}>
            Add to Cart · {formatPrice(total)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
