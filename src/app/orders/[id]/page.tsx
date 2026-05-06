import OrderDetailClient from "./OrderDetailClient";

export async function generateStaticParams() {
  return [{ id: "mock-order-1" }, { id: "mock-order-2" }];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
