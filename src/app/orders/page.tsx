"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardList, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth/login?callbackUrl=/orders");
      return;
    }
    api.getOrders(token ?? "")
      .then(setOrders)
      .finally(() => setFetching(false));
  }, [isLoading, user, token, router]);

  if (isLoading || fetching) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#FFF8F5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8C1515]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8F5] py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-brand text-2xl font-semibold text-[#1C1C1C] mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF0F0]">
              <ClipboardList className="h-9 w-9 text-[#8C1515]" />
            </div>
            <div>
              <p className="font-brand text-xl font-semibold text-[#1C1C1C]">No orders yet</p>
              <p className="mt-1.5 text-sm text-[#6B6B6B]">
                When you place an order, it will appear here
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8C1515] text-white text-sm font-medium hover:bg-[#A01A1A] transition-colors"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => {
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
              const date = new Date(order.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl border border-[#E8E0DF] p-4 hover:border-[#8C1515]/40 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-brand text-base font-semibold text-[#8C1515]">
                          {order.orderNumber}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-[#6B6B6B]">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} · {date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-base font-bold text-[#1C1C1C]">{formatPrice(order.total)}</span>
                      <ChevronRight className="h-4 w-4 text-[#6B6B6B] group-hover:text-[#8C1515] transition-colors" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
