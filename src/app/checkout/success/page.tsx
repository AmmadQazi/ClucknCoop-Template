"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, ShoppingBag, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Order } from "@/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
      return;
    }
    api.getOrder(orderId, token ?? undefined)
      .then((o) => {
        if (!o) { router.replace("/"); return; }
        setOrder(o);
      })
      .finally(() => setLoading(false));
  }, [orderId, token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#8C1515]" />
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.subtotal;
  const deliveryFee = order.deliveryFee;
  const total = order.total;

  return (
    <div className="mx-auto max-w-lg">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="font-brand text-3xl font-semibold text-[#1C1C1C]">Order Placed!</h1>
        <p className="mt-2 text-[#6B6B6B]">
          Thank you for your order. We&apos;ll get started right away.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8E0DF]">
          <span className="text-xs text-[#6B6B6B]">Order</span>
          <span className="font-brand text-base font-semibold text-[#8C1515]">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Order card */}
      <div className="bg-white rounded-2xl border border-[#E8E0DF] overflow-hidden">
        {/* Status row */}
        <div className="px-5 py-4 border-b border-[#E8E0DF] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6B6B6B] uppercase tracking-wider font-medium">Status</p>
            <div className="mt-1">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#6B6B6B] uppercase tracking-wider font-medium">
              {order.fulfillmentType === "DELIVERY" ? "Delivery" : "Pickup"}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1C1C1C]">
              {order.fulfillmentType === "DELIVERY" ? "To your address" : "At our restaurant"}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="px-5 py-4 border-b border-[#E8E0DF]">
          <p className="text-xs text-[#6B6B6B] uppercase tracking-wider font-medium mb-3">Items</p>
          <ul className="flex flex-col gap-2.5">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1C]">
                    {item.quantity}× {item.menuItem.name}
                  </p>
                  {Array.isArray(item.addons) && item.addons.length > 0 && (
                    <p className="text-xs text-[#6B6B6B] mt-0.5">
                      + {item.addons.map((a) => a.name).join(", ")}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-[#1C1C1C] shrink-0">
                  {formatPrice(item.totalPrice)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals */}
        <div className="px-5 py-4 border-b border-[#E8E0DF] flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B6B6B]">Subtotal</span>
            <span className="font-medium text-[#1C1C1C]">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B6B6B]">Delivery</span>
            <span className="font-medium text-[#1C1C1C]">
              {deliveryFee === 0 ? (order.fulfillmentType === "PICKUP" ? "—" : "Free") : formatPrice(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-[#E8E0DF] pt-2 mt-1">
            <span className="text-[#1C1C1C]">Total</span>
            <span className="text-[#8C1515]">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="px-5 py-4">
          <p className="text-xs text-[#6B6B6B] uppercase tracking-wider font-medium mb-1">Payment</p>
          <p className="text-sm font-medium text-[#1C1C1C]">
            {order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : order.paymentMethod}
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href={`/orders/${order.id}`} className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            <ClipboardList className="h-4 w-4" />
            Track Order
          </Button>
        </Link>
        <Link href="/menu" className="flex-1">
          <Button size="lg" className="w-full">
            <ShoppingBag className="h-4 w-4" />
            Back to Menu
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8F5] py-10 px-4">
      <Suspense fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-[#8C1515]" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
