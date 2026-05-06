export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CASH_ON_DELIVERY" | "JAZZCASH" | "EASYPAISA" | "CARD";
export type FulfillmentType = "DELIVERY" | "PICKUP";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
}

export interface Variant {
  id: string;
  name: string;
  priceExtra: number;
  isDefault: boolean;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  basePrice: number;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  sortOrder: number;
  category: Category;
  variants: Variant[];
  addons: Addon[];
}

export type MenuItemWithRelations = MenuItem;
export type CategoryWithItems = Category & { items: MenuItem[] };

export interface OrderItem {
  id: string;
  menuItemId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addons: { name: string; price: number }[];
  notes?: string | null;
  menuItem: { name: string; imageUrl?: string | null };
  variant?: { name: string } | null;
}

export interface DeliveryAddress {
  line1: string;
  line2?: string;
  area: string;
  city: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  notes?: string | null;
  items: OrderItem[];
  address?: DeliveryAddress | null;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  imageUrl: string | null;
  basePrice: number;
  variantId?: string;
  variantName?: string;
  variantExtra: number;
  addons: { id: string; name: string; price: number }[];
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export interface CreateOrderPayload {
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  deliveryAddress?: DeliveryAddress;
  items: {
    menuItemId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    addons: { id: string; name: string; price: number }[];
    notes?: string;
  }[];
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}
