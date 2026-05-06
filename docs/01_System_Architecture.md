# 01 — System Architecture: MagicOFit Sports E-Commerce

> **Stack**: Next.js 14 (App Router) + MedusaJS v2 + PostgreSQL + Redis + Meilisearch  
> **Target**: Sub-2s LCP globally, 99.9% uptime, 10K+ concurrent users

---

## 1. Core Stack Overview

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG/ISR, React Server Components |
| **Backend / Commerce Engine** | MedusaJS v2 | Headless commerce: products, cart, orders, payments, shipping |
| **Database** | PostgreSQL 16 | Primary data store (via MedusaJS + Prisma/MikroORM) |
| **Cache / Sessions** | Redis 7 | Session store, cart cache, rate limiting, pub/sub |
| **Search** | Meilisearch | Typo-tolerant faceted product search |
| **Object Storage** | Cloudflare R2 / AWS S3 | Product images, videos, assets |
| **CDN** | Cloudflare / Vercel Edge Network | Static assets, image optimization |
| **Auth** | MedusaJS Auth Module + JWT | Customer accounts, admin auth |
| **Payments** | Stripe + PayPal (via Medusa Payment Providers) | PCI-compliant payment processing |
| **Messaging** | WhatsApp Business API (via Twilio) | Order confirmations, shipping updates, abandoned cart recovery |
| **SMS Fallback** | Twilio SMS | OTP verification, fallback when WhatsApp unavailable |
| **Animations** | Framer Motion (motion) | Declarative animations, page transitions, gesture interactions |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking, performance monitoring |

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Web (Next.js)│  │  Mobile PWA  │  │  Admin Dashboard   │    │
│  │  App Router   │  │  (Next.js)   │  │  (Medusa Admin)    │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
└─────────┼────────────────┼────────────────────┼────────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EDGE / CDN LAYER                             │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Vercel Edge Network / Cloudflare                    │       │
│  │  • Static asset caching    • Image optimization      │       │
│  │  • Edge middleware (geo, A/B, auth check)             │       │
│  └──────────────────────┬───────────────────────────────┘       │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Next.js Server (App Router)                 │    │
│  │  • React Server Components (RSC)                        │    │
│  │  • API Routes → proxying to Medusa                      │    │
│  │  • Server Actions (cart mutations, wishlist)             │    │
│  │  • Middleware (locale detection, auth validation)        │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐    │
│  │              MedusaJS v2 Backend                         │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ │    │
│  │  │ Product  │ │  Cart &  │ │  Payment  │ │ Shipping  │ │    │
│  │  │ Module   │ │  Order   │ │  Module   │ │  Module   │ │    │
│  │  └──────────┘ └──────────┘ └───────────┘ └───────────┘ │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ │    │
│  │  │Customer  │ │Inventory │ │  Pricing  │ │Promotion  │ │    │
│  │  │ Module   │ │  Module  │ │  Module   │ │  Module   │ │    │
│  │  └──────────┘ └──────────┘ └───────────┘ └───────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │ PostgreSQL   │  │    Redis     │  │   Meilisearch    │      │
│  │ (Primary DB) │  │ (Cache/Queue)│  │ (Product Search) │      │
│  └──────────────┘  └──────────────┘  └──────────────────┘      │
│  ┌──────────────┐  ┌──────────────────────────────────┐        │
│  │ S3 / R2      │  │  Event Bus (Redis Streams)       │        │
│  │ (Assets)     │  │  • inventory.updated              │        │
│  └──────────────┘  │  • order.placed                   │        │
│                     │  • product.updated                │        │
│                     └──────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow Architecture

### 3.1 Product Browsing Flow (Read-Heavy)

```
User Request → Edge/CDN Cache Check
  ├── HIT  → Return cached page (< 50ms)
  └── MISS → Next.js Server
               ├── RSC renders page
               │     ├── fetch products from Redis cache
               │     │     ├── HIT → return cached products
               │     │     └── MISS → query MedusaJS API
               │     │                  └── query PostgreSQL
               │     │                  └── cache result in Redis (TTL: 5min)
               │     ├── fetch filters from Meilisearch
               │     └── compose HTML response
               └── Return response + set CDN cache headers
```

### 3.2 Cart & Checkout Flow (Write-Heavy)

```
User Action (Add to Cart) → Next.js Server Action
  └── POST /store/carts/{id}/line-items (MedusaJS)
        ├── Validate product variant exists
        ├── Check inventory (real-time from PostgreSQL)
        ├── Calculate pricing (promotions, discounts)
        ├── Update cart in PostgreSQL
        ├── Invalidate cart cache in Redis
        └── Return updated cart → Client re-renders cart UI

Checkout Flow:
  1. Create/Update Cart     → Server Action → Medusa Cart API
  2. Set Shipping Address   → Server Action → Medusa Cart API
  3. Select Shipping Option → Server Action → Medusa Shipping API
  4. Initialize Payment     → Server Action → Medusa Payment API → Stripe
  5. Complete Order          → Server Action → Medusa Order API
     └── Event: order.placed
           ├── Reserve inventory (hard lock)
           ├── Send WhatsApp order confirmation (with order summary + tracking link)
           ├── Create fulfillment record
           └── Sync to analytics
```

### 3.3 Search Flow

```
User Types Query → Client-side debounce (300ms)
  └── GET /search?q=... → Next.js API Route
        └── Meilisearch query
              ├── Typo tolerance
              ├── Faceted filters (size, color, price, category)
              ├── Geo-filtering (for shipping availability)
              └── Return results (< 50ms)
                    → Client renders results with highlighting
```

---

## 4. Rendering Strategy

### 4.1 Strategy Matrix

| Page | Rendering | Revalidation | Rationale |
|---|---|---|---|
| **Homepage** | ISR | `revalidate: 60` (60s) | Frequently updated promotions, but tolerable staleness |
| **Category/Collection Pages** | ISR | `revalidate: 300` (5min) | Product listings change less frequently |
| **Product Detail Page** | ISR | `revalidate: 60` + On-demand | Price/stock must be semi-real-time; on-demand revalidation on product update event |
| **Search Results** | SSR (Dynamic) | No cache | Query-dependent, unique per request |
| **Cart Page** | SSR (Dynamic) | No cache | User-specific, must be real-time |
| **Checkout Pages** | SSR (Dynamic) | No cache | Sensitive flow, user-specific, PCI considerations |
| **User Account/Orders** | SSR (Dynamic) | No cache | Private, user-specific data |
| **About/Contact/FAQ** | SSG (Static) | Build-time | Rarely changes, maximum performance |
| **Blog/Articles** | ISR | `revalidate: 3600` (1hr) | Content updates infrequently |
| **Legal Pages** | SSG (Static) | Build-time | Almost never changes |
| **404 / Error Pages** | SSG (Static) | Build-time | Static content |

### 4.2 Implementation Patterns

```typescript
// ISR Example — Product Page
// app/products/[handle]/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const products = await medusa.products.list({ limit: 100 });
  return products.map((p) => ({ handle: p.handle }));
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);     // RSC fetch
  const inventory = await getInventory(product.id);     // real-time check
  return <ProductTemplate product={product} inventory={inventory} />;
}
```

```typescript
// Dynamic SSR Example — Cart Page
// app/cart/page.tsx
export const dynamic = 'force-dynamic'; // Always SSR

export default async function CartPage() {
  const cart = await getCart(); // reads session cookie → fetches cart
  return <CartTemplate cart={cart} />;
}
```

```typescript
// On-demand Revalidation — Webhook
// app/api/webhooks/product-update/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { product_id, handle } = await request.json();
  revalidatePath(`/products/${handle}`);
  revalidateTag(`product-${product_id}`);
  return Response.json({ revalidated: true });
}
```

### 4.3 React Server Components vs Client Components

```
Server Components (default — 85% of components):
├── ProductCard          — fetches and renders product data
├── ProductGrid          — layout and data fetching
├── CategoryNav          — navigation tree from CMS
├── Footer / Header      — static content sections
├── OrderHistory         — server-side data fetch
├── BreadcrumbNav        — route-based, no interactivity
└── RecommendationRow    — fetches recommendations server-side

Client Components ('use client' — 18% of components):
├── AddToCartButton      — click handler, optimistic UI
├── QuantitySelector     — stateful increment/decrement
├── ImageGallery         — swipe, zoom, thumbnail click
├── SizeSelector         — interactive size picker with state
├── SearchModal          — full-screen search overlay (Cmd+K), trending terms, instant results
├── FilterSidebar        — interactive filter toggles
├── CartDrawer           — animated slide-out, real-time updates
├── WishlistToggle       — click handler, auth check
├── MobileMenu           — animated hamburger menu
├── ToastNotifications   — notifications system
├── ScrollToTop          — floating button, appears after 400px scroll, smooth scroll
└── PageTransition       — framer-motion layout animation wrapper for route changes
```

---

## 5. Global State Management

### 5.1 Strategy: Minimal Client State + Server-First

> **Principle**: Leverage React Server Components and MedusaJS as the source of truth. Only use client-side state for ephemeral UI interactions.

```
┌─────────────────────────────────────────────────────────┐
│                 STATE MANAGEMENT LAYERS                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LAYER 1: Server State (Source of Truth)                │
│  ┌───────────────────────────────────────────────┐      │
│  │  MedusaJS Backend + PostgreSQL                │      │
│  │  • Products, Variants, Inventory              │      │
│  │  • Cart, Orders, Customer data                │      │
│  │  • Pricing, Promotions, Shipping rules        │      │
│  │  Accessed via: RSC data fetching, Server Actions│     │
│  └───────────────────────────────────────────────┘      │
│                                                         │
│  LAYER 2: Cache Layer (Performance)                     │
│  ┌───────────────────────────────────────────────┐      │
│  │  Next.js Cache + Redis                        │      │
│  │  • next/cache with tags & revalidation        │      │
│  │  • Redis for session/cart caching              │      │
│  │  • Meilisearch index (search cache)            │      │
│  └───────────────────────────────────────────────┘      │
│                                                         │
│  LAYER 3: Client State (UI Interactions Only)           │
│  ┌───────────────────────────────────────────────┐      │
│  │  React Context + Zustand (lightweight)        │      │
│  │  • CartDrawer open/close state                │      │
│  │  • Mobile menu toggle                         │      │
│  │  • Active filter selections (before submit)   │      │
│  │  • Toast notification queue                   │      │
│  │  • Image gallery active index                 │      │
│  └───────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Zustand Store Architecture

```typescript
// stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  // Cart Drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Mobile Menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (q: string) => void;

  // Notifications
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),

  isSearchOpen: false,
  searchQuery: '',
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  toasts: [],
  addToast: (toast) => set((s) => ({ toasts: [...s.toasts, toast] })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
```

### 5.3 Server Actions for Cart State

```typescript
// actions/cart.ts
'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { medusaClient } from '@/lib/medusa';

export async function addToCart(variantId: string, quantity: number = 1) {
  const cartId = cookies().get('cart_id')?.value;
  if (!cartId) throw new Error('No cart found');

  const result = await medusaClient.carts.lineItems.create(cartId, {
    variant_id: variantId,
    quantity,
  });

  revalidateTag('cart');
  return result.cart;
}

export async function removeFromCart(lineItemId: string) {
  const cartId = cookies().get('cart_id')?.value;
  if (!cartId) throw new Error('No cart found');

  const result = await medusaClient.carts.lineItems.delete(cartId, lineItemId);
  revalidateTag('cart');
  return result.cart;
}

export async function updateCartQuantity(lineItemId: string, quantity: number) {
  const cartId = cookies().get('cart_id')?.value;
  if (!cartId) throw new Error('No cart found');

  const result = await medusaClient.carts.lineItems.update(cartId, lineItemId, {
    quantity,
  });

  revalidateTag('cart');
  return result.cart;
}
```

---

## 6. Project Directory Structure

```
magicofit/
├── docs/                              # Architecture reference docs
│   ├── 01_System_Architecture.md
│   ├── 02_Data_Schema_&_Inventory.md
│   ├── 03_UI_UX_Conversion_Map.md
│   └── 04_Implementation_Roadmap.md
│
├── storefront/                        # Next.js 14 Frontend
│   ├── app/
│   │   ├── (main)/                    # Main layout group
│   │   │   ├── layout.tsx             # Header + Footer layout
│   │   │   ├── page.tsx               # Homepage (ISR)
│   │   │   ├── shop/
│   │   │   │   ├── page.tsx           # All products (ISR)
│   │   │   │   └── [category]/
│   │   │   │       └── page.tsx       # Category page (ISR)
│   │   │   ├── products/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx       # Product detail (ISR + on-demand)
│   │   │   ├── search/
│   │   │   │   └── page.tsx           # Search results (SSR)
│   │   │   ├── cart/
│   │   │   │   └── page.tsx           # Full cart page (SSR)
│   │   │   ├── account/
│   │   │   │   ├── page.tsx           # Account dashboard (SSR)
│   │   │   │   ├── orders/
│   │   │   │   └── settings/
│   │   │   ├── blog/
│   │   │   │   └── [slug]/page.tsx    # Blog articles (ISR)
│   │   │   └── pages/
│   │   │       ├── about/page.tsx     # Static
│   │   │       ├── contact/page.tsx   # Static
│   │   │       └── faq/page.tsx       # Static
│   │   │
│   │   ├── checkout/                  # Checkout layout group (no header/footer)
│   │   │   ├── layout.tsx             # Minimal checkout layout
│   │   │   └── page.tsx               # One-page checkout (SSR)
│   │   │
│   │   ├── api/
│   │   │   ├── webhooks/              # Medusa event webhooks
│   │   │   └── search/               # Search proxy to Meilisearch
│   │   │
│   │   ├── layout.tsx                 # Root layout (fonts, metadata, providers)
│   │   ├── not-found.tsx              # 404 page
│   │   └── error.tsx                  # Error boundary
│   │
│   ├── components/
│   │   ├── ui/                        # Atomic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── ScrollToTop.tsx        # Floating scroll-to-top button
│   │   │   └── PageTransition.tsx     # framer-motion route transition wrapper
│   │   ├── layout/                    # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── product/                   # Product-related components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── ColorSelector.tsx
│   │   │   ├── AddToCartButton.tsx
│   │   │   ├── StockIndicator.tsx
│   │   │   └── ProductReviews.tsx
│   │   ├── cart/                      # Cart components
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/                  # Checkout components
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── ShippingSelector.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── search/                    # Search components
│   │   │   ├── SearchModal.tsx        # Full-screen search overlay (Cmd+K)
│   │   │   ├── SearchResults.tsx
│   │   │   └── FilterSidebar.tsx
│   │   └── home/                      # Homepage sections
│   │       ├── HeroBanner.tsx
│   │       ├── FeaturedProducts.tsx
│   │       ├── CategoryShowcase.tsx
│   │       └── Newsletter.tsx
│   │
│   ├── lib/
│   │   ├── medusa.ts                  # Medusa client instance
│   │   ├── search.ts                  # Meilisearch client
│   │   ├── utils.ts                   # Utility functions
│   │   └── constants.ts              # App constants
│   │
│   ├── actions/                       # Server Actions
│   │   ├── cart.ts
│   │   ├── checkout.ts
│   │   ├── account.ts
│   │   └── wishlist.ts
│   │
│   ├── stores/                        # Zustand client stores
│   │   └── ui-store.ts
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── styles/
│   │   ├── globals.css                # Global styles, CSS variables, design tokens
│   │   └── fonts.ts                   # Font configuration (Inter, Outfit)
│   │
│   ├── public/
│   │   ├── icons/
│   │   ├── og-image.jpg
│   │   └── favicon.ico
│   │
│   ├── next.config.mjs
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           # MedusaJS v2 Backend
│   ├── src/
│   │   ├── modules/                   # Custom Medusa modules
│   │   │   ├── inventory/             # Custom inventory tracking logic
│   │   │   ├── search/                # Meilisearch integration
│   │   │   └── analytics/            # Order analytics / reporting
│   │   ├── api/                       # Custom API routes
│   │   │   ├── store/                 # Storefront-specific routes
│   │   │   └── admin/                 # Admin-specific routes
│   │   ├── workflows/                 # Medusa Workflows
│   │   │   ├── create-order.ts
│   │   │   ├── reserve-inventory.ts
│   │   │   └── process-payment.ts
│   │   ├── subscribers/               # Event subscribers
│   │   │   ├── order-placed.ts
│   │   │   ├── inventory-updated.ts
│   │   │   └── product-updated.ts
│   │   └── jobs/                      # Background jobs
│   │       ├── sync-search-index.ts
│   │       └── cleanup-abandoned-carts.ts
│   ├── medusa-config.ts
│   └── package.json
│
├── docker-compose.yml                 # PostgreSQL + Redis + Meilisearch
├── .env.example
└── README.md
```

---

## 7. Security Architecture

### 7.1 Authentication Flow

```
Customer Auth (Phone-Based):
  Register → POST /store/customers (phone + name)
           → Send OTP via WhatsApp (fallback: SMS)
           → Verify OTP → Create customer → JWT issued
  Login    → POST /store/auth (phone number)
           → Send OTP via WhatsApp
           → Verify OTP → JWT issued
  Session  → JWT stored in HttpOnly cookie (7 day expiry)
  Refresh  → Automatic via middleware before expiry

Admin Auth:
  Login    → POST /admin/auth      → Medusa Admin validates → JWT issued
  Session  → Separate cookie domain/path
  RBAC     → Medusa built-in role-based access
```

### 7.2 Security Checklist

| Concern | Implementation |
|---|---|
| **XSS** | React auto-escaping + CSP headers via `next.config.mjs` |
| **CSRF** | SameSite cookies + Origin header validation |
| **SQL Injection** | Parameterized queries via MedusaJS ORM (MikroORM) |
| **Rate Limiting** | Redis-based rate limiting on auth & checkout APIs |
| **PCI Compliance** | Stripe Elements (card data never touches our server) |
| **HTTPS** | Enforced via Vercel / CDN edge |
| **Secrets** | Environment variables, never committed to repo |
| **Input Validation** | Zod schemas on all Server Actions and API routes |
| **Dependency Security** | Renovate bot + `npm audit` in CI pipeline |

---

## 8. Performance Optimization

### 8.1 Image Strategy

```typescript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.s3.amazonaws.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 8.2 Bundle Optimization

- **Tree shaking**: Enabled by default in Next.js
- **Dynamic imports**: Heavy components (ImageGallery, Reviews) loaded dynamically
- **Package optimization**: Use `@next/bundle-analyzer` to monitor
- **Font optimization**: `next/font` for zero CLS font loading

```typescript
// Dynamic import example
const ProductReviews = dynamic(
  () => import('@/components/product/ProductReviews'),
  { loading: () => <ReviewsSkeleton />, ssr: false }
);
```

### 8.3 Caching Strategy

| Resource | Cache Location | TTL | Invalidation |
|---|---|---|---|
| Static pages | CDN Edge | Until redeployment | Redeploy |
| ISR pages | CDN + Origin | 60-3600s | Time-based + On-demand |
| Product data | Redis | 5 min | Event-driven (product.updated) |
| Cart data | Redis | 7 days | On mutation |
| Search index | Meilisearch | Real-time sync | Subscriber on product changes |
| User sessions | Redis | 7 days | On logout |

---

## 9. DevOps & Infrastructure

### 9.1 Development Environment

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: magicofit
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: medusa_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  meilisearch:
    image: getmeili/meilisearch:v1.6
    environment:
      MEILI_MASTER_KEY: masterKey123
    ports:
      - "7700:7700"
    volumes:
      - meili_data:/meili_data

volumes:
  postgres_data:
  meili_data:
```

### 9.2 CI/CD Pipeline

```
Push to main → GitHub Actions:
  1. Lint & Type Check     (ESLint + TypeScript)
  2. Unit Tests            (Vitest)
  3. Integration Tests     (Playwright)
  4. Build                 (Next.js build + Medusa build)
  5. Deploy Staging        (Preview URL)
  6. E2E Tests on Staging  (Playwright)
  7. Deploy Production     (Vercel for frontend, Railway/Render for backend)
```

---

## 10. Scalability Plan

| Stage | Users | Infrastructure |
|---|---|---|
| **Launch** | 0-1K | Vercel (Hobby) + Railway (Starter) + Neon (Free PG) |
| **Growth** | 1K-10K | Vercel (Pro) + Railway (Pro) + Dedicated PG + Redis Cloud |
| **Scale** | 10K-100K | Vercel (Enterprise) + Kubernetes + Read replicas + CDN optimization |
| **Enterprise** | 100K+ | Multi-region deployment + DB sharding + dedicated Meilisearch cluster |

---

## 11. Environment Variables Reference

### 11.1 Storefront (`storefront/.env.local`)

```bash
# ── App ──
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="MagicOFit"

# ── MedusaJS Backend ──
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=sk_medusa_...                    # Server-side only

# ── Search ──
NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700
NEXT_PUBLIC_MEILISEARCH_API_KEY=meili_public_...
MEILISEARCH_ADMIN_KEY=meili_admin_...           # Server-side only (indexing)

# ── Payments ──
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...                   # Server-side only
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...

# ── WhatsApp / Twilio ──
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...                           # Server-side only
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886     # Twilio sandbox or business number
TWILIO_SMS_FROM=+14155238886

# ── Analytics ──
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...

# ── Image Storage ──
NEXT_PUBLIC_STORAGE_URL=https://storage.magicofit.com
```

### 11.2 Backend (`backend/.env`)

```bash
# ── Database ──
DATABASE_URL=postgresql://medusa:medusa_password@localhost:5432/magicofit
DATABASE_TYPE=postgres

# ── Redis ──
REDIS_URL=redis://localhost:6379

# ── Auth ──
JWT_SECRET=supersecret_jwt_key_change_in_production
COOKIE_SECRET=supersecret_cookie_change_in_production

# ── CORS ──
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001

# ── Stripe ──
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── WhatsApp / Twilio ──
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_SMS_FROM=+14155238886

# ── Meilisearch ──
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=masterKey123

# ── Storage (S3/R2) ──
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=magicofit-assets
S3_REGION=auto
S3_ENDPOINT=https://....r2.cloudflarestorage.com
```

---

## 12. WhatsApp & Notification Architecture

### 12.1 Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                NOTIFICATION CHANNELS                        │
│                                                             │
│  PRIMARY: WhatsApp Business API (via Twilio)                │
│  ├── Order confirmations (with product images + summary)    │
│  ├── Shipping updates (with tracking link)                  │
│  ├── Delivery confirmation                                  │
│  ├── Abandoned cart recovery (after 1 hour)                 │
│  └── Promotional messages (with opt-in consent)             │
│                                                             │
│  FALLBACK: SMS (via Twilio)                                 │
│  ├── OTP for login/registration                             │
│  └── Critical order updates if WhatsApp delivery fails      │
│                                                             │
│  IN-APP: Toast Notifications                                │
│  ├── Add-to-cart confirmation                               │
│  ├── Price drop alerts (wishlist items)                     │
│  └── Low stock warnings                                    │
└─────────────────────────────────────────────────────────────┘
```

### 12.2 WhatsApp Message Templates

```typescript
// backend/src/services/whatsapp.ts
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ── Order Confirmation ──
export async function sendOrderConfirmation(phone: string, order: Order) {
  const items = order.items.map(i => `• ${i.title} (×${i.quantity}) — $${(i.unit_price / 100).toFixed(2)}`).join('\n');

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${phone}`,
    body: `✅ *طلبك تم بنجاح!*\n\n`
        + `📦 رقم الطلب: #${order.display_id}\n\n`
        + `${items}\n\n`
        + `💰 الإجمالي: $${(order.total / 100).toFixed(2)}\n`
        + `🚚 التوصيل المتوقع: 3-5 أيام عمل\n\n`
        + `تتبع طلبك: ${process.env.SITE_URL}/account/orders/${order.id}\n\n`
        + `شكراً لتسوقك مع MagicOFit! 💪`,
  });
}

// ── Shipping Update ──
export async function sendShippingUpdate(phone: string, order: Order, trackingNumber: string) {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${phone}`,
    body: `📦 *تم شحن طلبك!*\n\n`
        + `رقم الطلب: #${order.display_id}\n`
        + `رقم التتبع: ${trackingNumber}\n\n`
        + `تتبع شحنتك: https://track.example.com/${trackingNumber}\n\n`
        + `MagicOFit 💪`,
  });
}

// ── OTP Verification ──
export async function sendOTP(phone: string, otp: string) {
  // Try WhatsApp first, fallback to SMS
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phone}`,
      body: `🔐 رمز التحقق الخاص بك: *${otp}*\n\nصالح لمدة 5 دقائق.\n\nMagicOFit`,
    });
  } catch {
    // Fallback to SMS
    await client.messages.create({
      from: process.env.TWILIO_SMS_FROM,
      to: phone,
      body: `MagicOFit: رمز التحقق ${otp} - صالح لمدة 5 دقائق`,
    });
  }
}

// ── Abandoned Cart Recovery ──
export async function sendAbandonedCartReminder(phone: string, cart: Cart) {
  const topItem = cart.items[0];
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${phone}`,
    body: `👋 نسيت شيء في سلتك!\n\n`
        + `${topItem.title} ${cart.items.length > 1 ? `و ${cart.items.length - 1} منتجات أخرى` : ''}\n\n`
        + `أكمل طلبك الآن: ${process.env.SITE_URL}/cart\n\n`
        + `MagicOFit 💪`,
  });
}
```

### 12.3 Notification Events

| Event | Channel | Timing |
|---|---|---|
| OTP (Login/Register) | WhatsApp → SMS fallback | Instant |
| Order Placed | WhatsApp | Instant |
| Payment Confirmed | WhatsApp | Instant |
| Order Shipped | WhatsApp | On fulfillment |
| Out for Delivery | WhatsApp | On carrier update |
| Delivered | WhatsApp | On carrier update |
| Abandoned Cart | WhatsApp | 1 hour after abandonment |
| Back in Stock | WhatsApp (opted-in) | On inventory update |
| Price Drop (Wishlist) | WhatsApp (opted-in) | On price change |

---

## 13. Admin Dashboard Specifications (Medusa Admin)

### 13.1 Dashboard Overview Page

```
┌──────────────────────────────────────────────────────────────┐
│  MAGICOFIT ADMIN DASHBOARD                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 TODAY'S METRICS (Real-time)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ Revenue  │ │ Orders   │ │ Visitors │ │ Conversion   │    │
│  │ $4,250   │ │ 28       │ │ 1,204    │ │ 2.3%         │    │
│  │ ▲ +12%   │ │ ▲ +5     │ │ ▼ -3%    │ │ ▲ +0.2%      │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘    │
│                                                              │
│  📈 REVENUE CHART (Last 30 days)                             │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ___          ___                                     │    │
│  │ /   \___/\   /   \___   ___/\                        │    │
│  │/           \_/         \_/    \___                    │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  🔔 ALERTS & ACTIONS NEEDED                                  │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ ⚠️ 3 products low in stock (< 5 units)               │    │
│  │ 📦 12 orders pending fulfillment                      │    │
│  │ 🔄 2 return requests pending                          │    │
│  │ 💬 5 new product reviews to moderate                  │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  🏆 TOP PRODUCTS (This week)                                 │
│  1. Nike Air Pegasus 41 — 42 units — $5,460                 │
│  2. Adidas Running Shorts — 38 units — $2,090               │
│  3. Gymshark Hoodie — 35 units — $2,275                     │
│  4. Wilson Pro Staff — 12 units — $2,640                    │
│  5. Manduka Yoga Mat — 28 units — $2,240                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 13.2 Admin Sidebar Navigation

```
📊 Dashboard          — Overview metrics, alerts, top products
📦 Orders             — Order list, status management, fulfillment
  ├── All Orders      — Filterable table (status, date, customer)
  ├── Pending         — Orders awaiting fulfillment
  ├── Returns         — Return requests and processing
  └── Draft Orders    — Manual orders (phone orders)
🛍️ Products           — Product catalog management
  ├── All Products    — CRUD, bulk operations
  ├── Collections     — Manual + automatic collections
  ├── Categories      — Category tree management
  ├── Inventory       — Stock levels per variant per location
  └── Gift Cards      — Gift card management
👥 Customers          — Customer database
  ├── All Customers   — List with search, phone, total orders
  ├── Customer Groups — Segmentation (VIP, loyal, new)
  └── WhatsApp Log    — Message history per customer
💰 Pricing            — Price lists, currencies
  ├── Price Lists     — Bulk pricing, B2B pricing
  └── Currencies      — Supported currencies (USD, EUR, SAR)
🏷️ Discounts          — Promotions & coupons
  ├── Coupons         — Percentage, fixed, free shipping
  └── Campaigns       — Time-limited promotions
📊 Analytics          — Business intelligence
  ├── Sales Report    — Revenue by period, product, category
  ├── Inventory Report— Stock levels, turnover rate
  ├── Customer Report — Acquisition, retention, LTV
  └── Conversion      — Funnel analysis (visit → cart → checkout → order)
⚙️ Settings           — Store configuration
  ├── General         — Store name, logo, contact info
  ├── Regions         — Shipping zones, tax rates
  ├── Shipping        — Shipping methods and rates
  ├── Payment         — Payment providers (Stripe, PayPal)
  ├── WhatsApp        — Message templates, opt-in settings
  ├── Team            — Admin users and roles
  └── API Keys        — Publishable & secret keys
```

### 13.3 Key Admin Features

| Feature | Description |
|---|---|
| **Quick Order Creation** | Admin can create orders via phone call (manual order entry) |
| **Inventory Alerts** | Auto-notifications when stock drops below threshold |
| **Bulk Operations** | Bulk update prices, stock, status across products |
| **Customer WhatsApp** | View message history, send manual WhatsApp messages |
| **Order Timeline** | Visual timeline of order events (placed → paid → shipped → delivered) |
| **Refund Processing** | Process full/partial refunds with inventory restock option |
| **Export Data** | Export orders, products, customers as CSV |
| **Audit Log** | Track all admin actions (who changed what, when) |

---

## 14. i18n-Ready Architecture

> Even if full multilingual support is post-launch, the architecture must be ready from day one.

### 14.1 Locale Strategy

```typescript
// middleware.ts — Locale detection
import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ar'] as const;
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if locale prefix exists
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const detectedLocale = acceptLanguage.includes('ar') ? 'ar' : DEFAULT_LOCALE;

  // Redirect to localized path
  return NextResponse.redirect(
    new URL(`/${detectedLocale}${pathname}`, request.url)
  );
}
```

### 14.2 RTL Support

```css
/* globals.css — RTL-ready layout */
:root { --dir: ltr; }
[dir="rtl"] { --dir: rtl; }

/* Use logical properties (instead of left/right) */
.container {
  padding-inline-start: var(--space-md);  /* instead of padding-left */
  padding-inline-end: var(--space-md);    /* instead of padding-right */
  margin-inline: auto;
}

/* Flexbox direction adapts automatically with dir="rtl" */
```

### 14.3 Currency Formatting

```typescript
// lib/utils.ts
export function formatPrice(amount: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat(currencyCode === 'SAR' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount / 100); // Medusa stores prices in cents
}
```

### 14.4 Supported Regions (Launch)

| Region | Currency | Locale | Shipping |
|---|---|---|---|
| United States | USD | en-US | Standard, Express |
| Saudi Arabia | SAR | ar-SA | Standard, Express |
| UAE | AED | ar-AE | Standard |
| Europe | EUR | en-GB | Standard |
