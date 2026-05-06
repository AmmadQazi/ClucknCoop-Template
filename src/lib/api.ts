import { mockCategories, mockMenuItems, mockOrders } from "./mock-data";
import { generateOrderNumber } from "./utils";
import type {
  Category,
  MenuItem,
  Order,
  User,
  CreateOrderPayload,
  RegisterPayload,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function get<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    const err = new Error((json as { error?: string }).error ?? `POST ${path} → ${res.status}`);
    (err as NodeJS.ErrnoException).code = String(res.status);
    throw err;
  }
  return res.json() as Promise<T>;
}

export const api = {
  async getCategories(): Promise<Category[]> {
    if (!BASE) return mockCategories;
    return get<Category[]>("/categories");
  },

  async getMenuItems(opts?: { categorySlug?: string; featured?: boolean }): Promise<MenuItem[]> {
    if (!BASE) {
      let items = mockMenuItems.filter((i) => i.isAvailable);
      if (opts?.categorySlug) items = items.filter((i) => i.category.slug === opts.categorySlug);
      if (opts?.featured) items = items.filter((i) => i.isFeatured);
      return items;
    }
    const params = new URLSearchParams();
    if (opts?.categorySlug) params.set("category", opts.categorySlug);
    if (opts?.featured) params.set("featured", "true");
    const qs = params.toString();
    return get<MenuItem[]>(`/menu-items${qs ? `?${qs}` : ""}`);
  },

  async getMenuItem(slug: string): Promise<MenuItem | null> {
    if (!BASE) return mockMenuItems.find((i) => i.slug === slug) ?? null;
    return get<MenuItem>(`/menu-items/${slug}`);
  },

  async createOrder(payload: CreateOrderPayload, token?: string): Promise<{ order: Order }> {
    if (!BASE) {
      const subtotal = payload.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      const deliveryFee = payload.fulfillmentType === "DELIVERY"
        ? subtotal >= 1500 ? 0 : 100
        : 0;
      const mockOrder: Order = {
        id: `order-${crypto.randomUUID()}`,
        orderNumber: generateOrderNumber(),
        status: "PENDING",
        fulfillmentType: payload.fulfillmentType,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        paymentMethod: payload.paymentMethod,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerEmail: payload.customerEmail,
        notes: payload.notes,
        address: payload.deliveryAddress ?? null,
        createdAt: new Date().toISOString(),
        items: payload.items.map((i, idx) => {
          const menuItem = mockMenuItems.find((m) => m.id === i.menuItemId);
          const variant = menuItem?.variants.find((v) => v.id === i.variantId);
          return {
            id: `oi-${idx}`,
            menuItemId: i.menuItemId,
            variantId: i.variantId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.unitPrice * i.quantity,
            addons: i.addons.map((a) => ({ name: a.name, price: a.price })),
            notes: i.notes,
            menuItem: { name: menuItem?.name ?? "Item", imageUrl: menuItem?.imageUrl },
            variant: variant ? { name: variant.name } : null,
          };
        }),
      };
      sessionStorage.setItem(`cc-order-${mockOrder.id}`, JSON.stringify(mockOrder));
      return { order: mockOrder };
    }
    return post<{ order: Order }>("/orders", payload, token);
  },

  async getOrders(token: string): Promise<Order[]> {
    if (!BASE) return mockOrders;
    return get<Order[]>("/orders", token);
  },

  async getOrder(id: string, token?: string): Promise<Order | null> {
    if (!BASE) {
      const stored = sessionStorage.getItem(`cc-order-${id}`);
      if (stored) return JSON.parse(stored) as Order;
      return mockOrders.find((o) => o.id === id) ?? null;
    }
    return get<Order>(`/orders/${id}`, token);
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (!BASE) {
      return {
        token: "mock-token",
        user: { id: "mock-user-1", name: email.split("@")[0], email, role: "CUSTOMER" },
      };
    }
    return post<{ token: string; user: User }>("/auth/login", { email, password });
  },

  async register(data: RegisterPayload): Promise<{ token: string; user: User }> {
    if (!BASE) {
      return {
        token: "mock-token",
        user: { id: "mock-user-1", name: data.name, email: data.email, role: "CUSTOMER" },
      };
    }
    return post<{ token: string; user: User }>("/auth/register", data);
  },
};
