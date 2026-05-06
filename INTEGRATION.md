# Backend Integration Guide

This template works out of the box with mock data. To connect a real backend, set `NEXT_PUBLIC_API_URL` in your `.env.local`.

## Environment Variables

```bash
# Your backend base URL (no trailing slash)
NEXT_PUBLIC_API_URL=https://api.example.com

# Comma-separated image hostnames for Next.js Image optimization
NEXT_PUBLIC_IMAGE_DOMAINS=cdn.example.com,assets.example.com
```

When `NEXT_PUBLIC_API_URL` is not set, the app uses the built-in mock data in `src/lib/mock-data.ts` and accepts any credentials on the login/register pages.

---

## API Contract

All endpoints are relative to `NEXT_PUBLIC_API_URL`.

### Categories

**`GET /categories`**

Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string | null",
    "imageUrl": "string | null",
    "sortOrder": 0
  }
]
```

### Menu Items

**`GET /menu-items`**

Query params:
- `category` — filter by category slug
- `featured=true` — only featured items

Response:
```json
[
  {
    "id": "string",
    "slug": "string",
    "name": "string",
    "description": "string | null",
    "imageUrl": "string | null",
    "basePrice": 490,
    "isAvailable": true,
    "isFeatured": false,
    "tags": ["bestseller"],
    "sortOrder": 0,
    "category": { "id": "...", "name": "...", "slug": "...", "sortOrder": 0 },
    "variants": [
      { "id": "string", "name": "Regular", "priceExtra": 0, "isDefault": true }
    ],
    "addons": [
      { "id": "string", "name": "Extra Cheese", "price": 60, "isAvailable": true }
    ]
  }
]
```

**`GET /menu-items/:slug`**

Response: single `MenuItem` object (same shape).

### Orders

**`POST /orders`**

Authorization: `Bearer {token}` (optional — guest checkout allowed)

Request body:
```json
{
  "fulfillmentType": "DELIVERY",
  "paymentMethod": "CASH_ON_DELIVERY",
  "customerName": "Ali Khan",
  "customerPhone": "03001234567",
  "customerEmail": "ali@example.com",
  "notes": "Extra spicy",
  "deliveryAddress": {
    "line1": "House 12, Street 5",
    "line2": "Block B",
    "area": "DHA Phase 1",
    "city": "Lahore"
  },
  "items": [
    {
      "menuItemId": "string",
      "variantId": "string | null",
      "quantity": 2,
      "unitPrice": 550,
      "addons": [{ "id": "a1", "name": "Extra Cheese", "price": 60 }],
      "notes": "No onions"
    }
  ]
}
```

Response `201`:
```json
{
  "order": {
    "id": "string",
    "orderNumber": "CC-123456",
    "status": "PENDING",
    "fulfillmentType": "DELIVERY",
    "subtotal": 1100,
    "deliveryFee": 100,
    "total": 1200,
    "paymentMethod": "CASH_ON_DELIVERY",
    "customerName": "Ali Khan",
    "customerPhone": "03001234567",
    "customerEmail": null,
    "notes": null,
    "address": { "line1": "...", "area": "...", "city": "Lahore" },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": "string",
        "menuItemId": "string",
        "variantId": "string | null",
        "quantity": 2,
        "unitPrice": 550,
        "totalPrice": 1100,
        "addons": [{ "name": "Extra Cheese", "price": 60 }],
        "notes": null,
        "menuItem": { "name": "Classic Coop Burger", "imageUrl": null },
        "variant": { "name": "Single" }
      }
    ]
  }
}
```

**`GET /orders`**

Authorization: `Bearer {token}` (required)

Response: `Order[]` (same shape as above).

**`GET /orders/:id`**

Authorization: `Bearer {token}` (required)

Response: single `Order` object.

### Authentication

**`POST /auth/login`**

Request:
```json
{ "email": "user@example.com", "password": "secret" }
```

Response `200`:
```json
{
  "token": "eyJ...",
  "user": { "id": "string", "name": "Ali Khan", "email": "user@example.com", "role": "CUSTOMER" }
}
```

Error responses: `401` for invalid credentials.

**`POST /auth/register`**

Request:
```json
{
  "name": "Ali Khan",
  "email": "user@example.com",
  "phone": "03001234567",
  "password": "secret123"
}
```

Response `201`:
```json
{
  "token": "eyJ...",
  "user": { "id": "string", "name": "Ali Khan", "email": "user@example.com", "role": "CUSTOMER" }
}
```

Error responses: `409` if email already exists.

---

## Order Status Values

`PENDING` → `CONFIRMED` → `PREPARING` → `READY` → `DELIVERED` | `CANCELLED`

## Payment Method Values

`CASH_ON_DELIVERY` | `JAZZCASH` | `EASYPAISA` | `CARD`

## Fulfillment Type Values

`DELIVERY` | `PICKUP`
