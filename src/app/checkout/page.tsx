"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, ShoppingBag, Truck, Store, Banknote } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, getInitials } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { CartItem } from "@/types";

const DELIVERY_FEE = 100;
const FREE_DELIVERY_ABOVE = 1500;
const DELIVERY_AREAS = ["DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "Cantt", "Other"];

const checkoutSchema = z
  .object({
    fulfillmentType: z.enum(["DELIVERY", "PICKUP"]),
    customerName: z.string().min(2, "Name must be at least 2 characters"),
    customerPhone: z
      .string()
      .regex(/^(0|\+92)[0-9]{10}$/, "Enter a valid Pakistani number (e.g. 03001234567)"),
    customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    line1: z.string(),
    line2: z.string().optional(),
    area: z.string(),
    city: z.string().optional(),
    paymentMethod: z.enum(["CASH_ON_DELIVERY"]),
    notes: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.fulfillmentType === "DELIVERY") {
      if (!d.line1.trim()) {
        ctx.addIssue({ code: "custom", message: "Street address is required", path: ["line1"] });
      }
      if (!d.area.trim()) {
        ctx.addIssue({ code: "custom", message: "Area is required", path: ["area"] });
      }
    }
  });

type FormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillmentType: "DELIVERY",
      paymentMethod: "CASH_ON_DELIVERY",
      city: "Lahore",
    },
  });

  const fulfillmentType = watch("fulfillmentType");
  const deliveryFee = fulfillmentType === "DELIVERY"
    ? subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
    : 0;
  const total = subtotal + deliveryFee;

  async function onSubmit(data: FormValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPending(true);
    try {
      const payload = {
        fulfillmentType: data.fulfillmentType,
        paymentMethod: data.paymentMethod,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || undefined,
        notes: data.notes || undefined,
        deliveryAddress:
          data.fulfillmentType === "DELIVERY"
            ? { line1: data.line1, line2: data.line2, area: data.area, city: data.city ?? "Lahore" }
            : undefined,
        items: items.map((item: CartItem) => ({
          menuItemId: item.menuItemId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          addons: item.addons,
          notes: item.notes,
        })),
      };

      const { order } = await api.createOrder(payload, token ?? undefined);
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsPending(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#FFF8F5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8C1515]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-[#FFF8F5]">
        <div className="text-center flex flex-col items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF0F0]">
            <ShoppingBag className="h-9 w-9 text-[#8C1515]" />
          </div>
          <div>
            <p className="font-brand text-xl font-semibold text-[#1C1C1C]">Your cart is empty</p>
            <p className="mt-1.5 text-sm text-[#6B6B6B]">Add some items before checking out</p>
          </div>
          <Link href="/menu">
            <Button size="lg">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8F5] py-8 px-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-brand text-2xl font-semibold text-[#1C1C1C] mb-6">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Left — Form */}
            <div className="flex flex-col gap-5">
              {/* Fulfillment toggle */}
              <section className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
                <h2 className="font-brand text-base font-semibold text-[#1C1C1C] mb-4">
                  How would you like to receive your order?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {(["DELIVERY", "PICKUP"] as const).map((type) => {
                    const Icon = type === "DELIVERY" ? Truck : Store;
                    const label = type === "DELIVERY" ? "Delivery" : "Pickup";
                    const sub = type === "DELIVERY" ? "We bring it to you" : "Collect from our restaurant";
                    const isSelected = fulfillmentType === type;
                    return (
                      <label
                        key={type}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-[#8C1515] bg-[#FFF0F0]"
                            : "border-[#E8E0DF] bg-white hover:border-[#8C1515]/40"
                        }`}
                      >
                        <input
                          type="radio"
                          value={type}
                          {...register("fulfillmentType")}
                          className="sr-only"
                        />
                        <Icon className={`h-6 w-6 ${isSelected ? "text-[#8C1515]" : "text-[#6B6B6B]"}`} />
                        <div className="text-center">
                          <p className={`text-sm font-semibold ${isSelected ? "text-[#8C1515]" : "text-[#1C1C1C]"}`}>
                            {label}
                          </p>
                          <p className="text-xs text-[#6B6B6B] mt-0.5">{sub}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Customer details */}
              <section className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
                <h2 className="font-brand text-base font-semibold text-[#1C1C1C] mb-4">Your Details</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="customerName" className="text-sm font-medium text-[#1C1C1C]">
                      Full Name
                    </label>
                    <Input
                      id="customerName"
                      type="text"
                      placeholder="Ali Khan"
                      {...register("customerName")}
                      aria-invalid={!!errors.customerName}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-600">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="customerPhone" className="text-sm font-medium text-[#1C1C1C]">
                      Phone Number
                    </label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="03001234567"
                      {...register("customerPhone")}
                      aria-invalid={!!errors.customerPhone}
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-red-600">{errors.customerPhone.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="customerEmail" className="text-sm font-medium text-[#1C1C1C]">
                      Email{" "}
                      <span className="text-[#6B6B6B] font-normal">(optional)</span>
                    </label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="you@example.com"
                      {...register("customerEmail")}
                      aria-invalid={!!errors.customerEmail}
                    />
                    {errors.customerEmail && (
                      <p className="text-xs text-red-600">{errors.customerEmail.message}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Delivery address */}
              {fulfillmentType === "DELIVERY" && (
                <section className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
                  <h2 className="font-brand text-base font-semibold text-[#1C1C1C] mb-4">
                    Delivery Address
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="line1" className="text-sm font-medium text-[#1C1C1C]">
                        Street Address
                      </label>
                      <Input
                        id="line1"
                        type="text"
                        placeholder="House 12, Street 5"
                        {...register("line1")}
                        aria-invalid={!!errors.line1}
                      />
                      {errors.line1 && (
                        <p className="text-xs text-red-600">{errors.line1.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="line2" className="text-sm font-medium text-[#1C1C1C]">
                        Apartment / Block{" "}
                        <span className="text-[#6B6B6B] font-normal">(optional)</span>
                      </label>
                      <Input
                        id="line2"
                        type="text"
                        placeholder="Block B"
                        {...register("line2")}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="area" className="text-sm font-medium text-[#1C1C1C]">
                        Area
                      </label>
                      <select
                        id="area"
                        {...register("area")}
                        className="flex h-10 w-full rounded-xl border border-[#E8E0DF] bg-white px-3 py-2 text-sm text-[#1C1C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515] focus-visible:border-transparent transition-colors"
                        aria-invalid={!!errors.area}
                      >
                        <option value="">Select area…</option>
                        {DELIVERY_AREAS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      {errors.area && (
                        <p className="text-xs text-red-600">{errors.area.message}</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Payment method */}
              <section className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
                <h2 className="font-brand text-base font-semibold text-[#1C1C1C] mb-4">Payment</h2>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#8C1515] bg-[#FFF0F0] cursor-pointer">
                  <input
                    type="radio"
                    value="CASH_ON_DELIVERY"
                    {...register("paymentMethod")}
                    className="sr-only"
                    defaultChecked
                  />
                  <Banknote className="h-5 w-5 text-[#8C1515] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#8C1515]">Cash on Delivery</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">Pay when your order arrives</p>
                  </div>
                </label>
              </section>

              {/* Notes */}
              <section className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
                <h2 className="font-brand text-base font-semibold text-[#1C1C1C] mb-4">
                  Special Instructions{" "}
                  <span className="text-[#6B6B6B] font-normal text-sm">(optional)</span>
                </h2>
                <textarea
                  id="notes"
                  {...register("notes")}
                  rows={3}
                  placeholder="Any special requests or instructions for your order…"
                  className="flex w-full rounded-xl border border-[#E8E0DF] bg-white px-3 py-2.5 text-sm text-[#1C1C1C] placeholder:text-[#6B6B6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515] focus-visible:border-transparent transition-colors resize-none"
                />
              </section>
            </div>

            {/* Right — Order summary */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-[#E8E0DF] p-5 lg:sticky lg:top-24">
                <h2 className="font-brand text-base font-semibold text-[#1C1C1C] mb-4">
                  Order Summary
                </h2>

                <ul className="flex flex-col gap-3 mb-4">
                  {items.map((item: CartItem) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-[#FFF0F0] flex items-center justify-center">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <span className="font-brand text-sm font-semibold text-[#8C1515] uppercase">
                            {getInitials(item.name)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#1C1C1C] truncate">{item.name}</p>
                            {item.variantName && (
                              <p className="text-xs text-[#6B6B6B]">{item.variantName}</p>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-[#1C1C1C] shrink-0">
                            ×{item.quantity}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#8C1515] mt-0.5">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-[#E8E0DF] pt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B6B6B]">Subtotal</span>
                    <span className="font-medium text-[#1C1C1C]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B6B6B]">Delivery</span>
                    <span className="font-medium text-[#1C1C1C]">
                      {fulfillmentType === "PICKUP"
                        ? "—"
                        : deliveryFee === 0
                        ? "Free"
                        : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {fulfillmentType === "DELIVERY" && subtotal < FREE_DELIVERY_ABOVE && (
                    <p className="text-xs text-[#6B6B6B]">
                      Add{" "}
                      <span className="font-semibold text-[#1C1C1C]">
                        {formatPrice(FREE_DELIVERY_ABOVE - subtotal)}
                      </span>{" "}
                      more for free delivery
                    </p>
                  )}
                  <div className="flex items-center justify-between text-base font-bold border-t border-[#E8E0DF] pt-2 mt-1">
                    <span className="text-[#1C1C1C]">Total</span>
                    <span className="text-[#8C1515]">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-5"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      Place Order
                      <span className="ml-auto font-normal opacity-80">{formatPrice(total)}</span>
                    </>
                  )}
                </Button>

                <p className="mt-3 text-center text-xs text-[#6B6B6B]">
                  By placing your order you agree to our terms of service
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
