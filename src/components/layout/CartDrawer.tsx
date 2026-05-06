"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatPrice, getInitials } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CartDrawerProps {
  children?: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItems = useCartStore((s) => s.totalItems());
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children ?? (
          <button
            className="relative flex items-center justify-center h-10 w-10 rounded-xl text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515]"
            aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#8C1515] text-white text-[10px] font-bold leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-[#E8E0DF]">
          <SheetTitle className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-[#8C1515]" />
            Your Cart
            {totalItems > 0 && (
              <span className="ml-auto text-sm font-normal text-[#6B6B6B]">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF0F0]">
                <ShoppingBag className="h-9 w-9 text-[#8C1515]" />
              </div>
              <div>
                <p className="font-brand text-xl font-semibold text-[#1C1C1C]">
                  Your cart is empty
                </p>
                <p className="mt-1.5 text-sm text-[#6B6B6B]">
                  Add some delicious items to get started!
                </p>
              </div>
              <Link href="/menu">
                <Button size="lg" className="mt-1">
                  Start Ordering
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#E8E0DF]">
              {items.map((item: CartItem) => (
                <li key={item.id} className="p-4 flex gap-3">
                  <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#FFF0F0] flex items-center justify-center">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="font-brand text-xl font-semibold text-[#8C1515] uppercase">
                        {getInitials(item.name)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1C1C1C] truncate">
                          {item.name}
                        </p>
                        {item.variantName && (
                          <p className="text-xs text-[#6B6B6B] mt-0.5">{item.variantName}</p>
                        )}
                        {item.addons.length > 0 && (
                          <p className="text-xs text-[#6B6B6B] mt-0.5">
                            + {item.addons.map((a) => a.name).join(", ")}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-[#6B6B6B] mt-0.5 italic">
                            &ldquo;{item.notes}&rdquo;
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-[#6B6B6B] hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-sm font-bold text-[#8C1515]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E0DF] bg-white text-[#1C1C1C] hover:border-[#8C1515] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-[#1C1C1C] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#8C1515] bg-[#8C1515] text-white hover:bg-[#A01A1A] transition-all duration-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="px-5 py-4 border-t border-[#E8E0DF] bg-white">
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B6B6B]">Subtotal</span>
                <span className="text-base font-bold text-[#1C1C1C]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-[#6B6B6B] -mt-1">
                Delivery fee calculated at checkout
              </p>
              <SheetClose asChild>
                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                    <span className="ml-auto font-normal opacity-80">
                      {formatPrice(subtotal)}
                    </span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { SheetTrigger as CartDrawerTrigger };
