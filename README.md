# ClucknCoop UI

A headless Next.js 16 frontend template for a food ordering web app. Works out of the box with built-in mock data — no backend, database, or environment variables required. Connect your own REST API by setting a single env var.

**Live demo:** https://ammadqazi.github.io/ClucknCoop-Template/

---

## What's included

- Full ordering flow: menu → cart → checkout → order confirmation → order history
- User authentication (register / login / logout) with JWT stored in `localStorage`
- 5 menu categories, 14 menu items, variants, add-ons — all mock data out of the box
- Pakistani market defaults: PKR prices, COD payment, Lahore delivery areas
- Responsive design, mobile-first

## Tech stack

| Concern | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI primitives) |
| Cart state | Zustand v5 (localStorage persisted) |
| Forms | react-hook-form + Zod v4 |
| Toasts | Sonner |
| Icons | Lucide React |

---

## Getting started

```bash
git clone https://github.com/AmmadQazi/ClucknCoop-Template.git
cd ClucknCoop-Template
npm install
npm run dev
```

Open http://localhost:3000. No `.env` file needed — the app runs entirely on mock data.

---

## Connecting a real backend

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Set your backend base URL (no trailing slash):
   ```bash
   NEXT_PUBLIC_API_URL=https://api.yourbackend.com
   ```

3. Optionally add image domains if your menu images are hosted externally:
   ```bash
   NEXT_PUBLIC_IMAGE_DOMAINS=cdn.yourbackend.com
   ```

4. Restart the dev server. All API calls now go to your backend.

The full REST API contract your backend must implement is documented in [INTEGRATION.md](./INTEGRATION.md).

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage — featured items + hero
│   ├── menu/
│   │   ├── page.tsx                # Server component — fetches categories + items
│   │   └── MenuPageClient.tsx      # Client component — category filter + grid
│   ├── checkout/
│   │   ├── page.tsx                # Checkout form (delivery/pickup, address, COD)
│   │   └── success/page.tsx        # Order confirmation page
│   ├── orders/
│   │   ├── page.tsx                # Order history (requires login)
│   │   └── [id]/
│   │       ├── page.tsx            # Static params wrapper
│   │       └── OrderDetailClient.tsx  # Order detail + status timeline
│   └── auth/
│       ├── login/page.tsx
│       └── register/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Navigation + cart icon + user menu
│   │   ├── Footer.tsx
│   │   └── CartDrawer.tsx          # Slide-out cart sheet
│   ├── menu/
│   │   ├── MenuItemCard.tsx        # Menu item card with add-to-cart
│   │   ├── AddToCartModal.tsx      # Variant + add-on selector dialog
│   │   └── CategoryFilter.tsx      # Horizontal category pill filter
│   ├── orders/
│   │   └── OrderStatusBadge.tsx    # Coloured status pill
│   └── ui/                         # shadcn/ui primitives (Button, Input, Badge…)
├── lib/
│   ├── api.ts                      # Unified data layer — mock or real fetch
│   ├── auth-context.tsx            # React context for auth state + localStorage
│   ├── mock-data.ts                # 5 categories, 14 items, 2 sample orders
│   └── utils.ts                    # cn(), formatPrice()
├── store/
│   └── cart.ts                     # Zustand cart store
└── types/
    └── index.ts                    # All TypeScript interfaces
```

---

## How the data layer works

`src/lib/api.ts` checks `NEXT_PUBLIC_API_URL` at runtime:

- **Not set → mock mode.** Returns data from `src/lib/mock-data.ts`. No network calls. `createOrder` generates a fake order stored in `sessionStorage` so the success page can read it. `login` accepts any credentials and returns a demo user.
- **Set → live mode.** Makes `fetch` calls to your REST API. Passes the JWT `Bearer` token from `localStorage` on authenticated endpoints.

You can swap between modes by simply setting or unsetting the env var — no code changes needed.

---

## Authentication flow

Auth state lives in `src/lib/auth-context.tsx`. On login/register the JWT and user object are saved to `localStorage` under the key `cc-auth`. The `useAuth()` hook exposes `{ user, token, isLoading, login, logout, register }`.

Protected routes (`/orders`, `/orders/[id]`) redirect to `/auth/login` client-side when no user is found. There is no server-side middleware — this is a purely static export.

---

## Cart

The Zustand store in `src/store/cart.ts` persists to `localStorage` via the `persist` middleware with `skipHydration: true` to avoid SSR mismatches. Each cart item stores:

```ts
{
  menuItemId: string
  name: string
  imageUrl: string | null
  basePrice: number
  quantity: number
  selectedVariant: Variant | null
  selectedAddons: Addon[]
  notes: string
}
```

---

## Deployment

The repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds a static export and deploys to GitHub Pages on every push to `main`.

To deploy to your own infrastructure, run:

```bash
npm run build   # outputs to ./out/
```

Then serve the `out/` directory from any static host (Vercel, Netlify, S3, nginx, etc.).

> **Note:** The `basePath` in `next.config.ts` is set to `/ClucknCoop-Template` for the GitHub Pages demo. Remove or change it for your own domain deployment.

---

## Customising for your restaurant

| What to change | Where |
|---|---|
| Restaurant name, colours, fonts | `src/app/globals.css` (CSS variables + `@theme`) |
| Menu categories and items | `src/lib/mock-data.ts` (or connect a real API) |
| Delivery fee logic | `src/app/checkout/page.tsx` — `DELIVERY_FEE` / `FREE_DELIVERY_ABOVE` constants |
| Delivery areas (dropdown) | `src/app/checkout/page.tsx` — `AREAS` array |
| Payment methods | Extend `PaymentMethod` in `src/types/index.ts` and the checkout form |
| Order statuses | `src/types/index.ts` → `OrderStatus` + `OrderStatusBadge.tsx` |

---

## API contract

See [INTEGRATION.md](./INTEGRATION.md) for the full REST API specification your backend needs to implement, including all request/response shapes and enum values.

---

## Scripts

```bash
npm run dev     # Start development server on http://localhost:3000
npm run build   # Production static export → ./out/
npm run lint    # ESLint
```
