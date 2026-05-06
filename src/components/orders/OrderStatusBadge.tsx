import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: "Pending",   className: "bg-yellow-100 text-yellow-800 border border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-800 border border-blue-200" },
  PREPARING: { label: "Preparing", className: "bg-orange-100 text-orange-800 border border-orange-200" },
  READY:     { label: "Ready",     className: "bg-green-100 text-green-800 border border-green-200" },
  DELIVERED: { label: "Delivered", className: "bg-green-600 text-white border border-green-600" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 border border-red-200" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = statusConfig[status];
  return <Badge className={className}>{label}</Badge>;
}
