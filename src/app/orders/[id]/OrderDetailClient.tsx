"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Banknote, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED"];

export default function OrderDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    api.getOrder(params.id, token ?? undefined)
      .then((o) => {
        if (!o) { router.replace("/orders"); return; }
        setOrder(o);
      })
      .finally(() => setFetching(false));
  }, [isLoading, user, token, params.id, router]);

  if (isLoading || fetching) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#FFF8F5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8C1515]" />
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.subtotal;
  const deliveryFee = order.deliveryFee;
  const total = order.total;
  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8F5] py-8 px-4">
      <div className="mx-auto max-w-lg">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#8C1515] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          My Orders
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-brand text-2xl font-semibold text-[#1C1C1C]">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-1">
              {new Date(order.createdAt).toLocaleDateString("en-PK", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex flex-col gap-4">
          {/* Status timeline */}
          {!isCancelled && (
            <div className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
              <h2 className="font-brand text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4">
                Order Progress
              </h2>
              <ol className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => {
                  const isDone = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const isLast = i === STATUS_STEPS.length - 1;
                  const label =
                    step === "PENDING" ? "Placed" :
                    step === "CONFIRMED" ? "Confirmed" :
                    step === "PREPARING" ? "Preparing" :
                    step === "READY" ? "Ready" : "Delivered";

                  return (
                    <li key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                            isDone
                              ? isCurrent
                                ? "border-[#8C1515] bg-[#8C1515] text-white"
                                : "border-green-500 bg-green-500 text-white"
                              : "border-[#E8E0DF] bg-white text-[#6B6B6B]"
                          }`}
                        >
                          {isDone && !isCurrent ? "✓" : i + 1}
                        </div>
                        <span
                          className={`text-[10px] font-medium whitespace-nowrap ${
                            isDone ? (isCurrent ? "text-[#8C1515]" : "text-green-600") : "text-[#6B6B6B]"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      {!isLast && (
                        <div
                          className={`flex-1 h-0.5 mb-4 mx-1 transition-colors ${
                            i < currentStepIndex ? "bg-green-500" : "bg-[#E8E0DF]"
                          }`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
            <h2 className="font-brand text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">
              Items
            </h2>
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C]">
                      {item.quantity}× {item.menuItem.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{item.variant.name}</p>
                    )}
                    {Array.isArray(item.addons) && item.addons.length > 0 && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5">
                        + {item.addons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5 italic">&ldquo;{item.notes}&rdquo;</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[#1C1C1C] shrink-0">
                    {formatPrice(item.totalPrice)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#E8E0DF] mt-4 pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">Delivery</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? (order.fulfillmentType === "PICKUP" ? "—" : "Free") : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-[#E8E0DF] pt-2 mt-1">
                <span>Total</span>
                <span className="text-[#8C1515]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          {order.fulfillmentType === "DELIVERY" && order.address && (
            <div className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
              <h2 className="font-brand text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">
                Delivery Address
              </h2>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#8C1515] shrink-0 mt-0.5" />
                <address className="text-sm text-[#1C1C1C] not-italic leading-relaxed">
                  {order.address.line1}
                  {order.address.line2 && `, ${order.address.line2}`}
                  <br />
                  {order.address.area}, {order.address.city}
                </address>
              </div>
            </div>
          )}

          {/* Contact & payment */}
          <div className="bg-white rounded-2xl border border-[#E8E0DF] p-5">
            <h2 className="font-brand text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">
              Contact &amp; Payment
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-[#8C1515] shrink-0" />
                <span className="text-[#1C1C1C]">{order.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Banknote className="h-4 w-4 text-[#8C1515] shrink-0" />
                <span className="text-[#1C1C1C]">
                  {order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : order.paymentMethod}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
