# 04 — Implementation Roadmap: MagicOFit Sports E-Commerce

> **Execution Agent**: Windsurf AI  
> **Total Duration**: ~8 Sprints (16 weeks)  
> **Priority**: Ship a functional MVP by Sprint 4, then iterate.

---

## 1. Sprint Overview

```
Sprint 0  ─── Foundation & DevOps Setup          (Week 1)
Sprint 1  ─── Backend Core (MedusaJS)             (Week 2-3)
Sprint 2  ─── Storefront Core Pages               (Week 4-5)
Sprint 3  ─── Product Detail & Cart               (Week 6-7)
Sprint 4  ─── Order Management (MVP LAUNCH)         (Week 8-9)
Sprint 5  ─── Search, Filters & Performance        (Week 10-11)
Sprint 6  ─── User Accounts & Order Management     (Week 12-13)
Sprint 7  ─── Polish, A11y & CRO Enhancements      (Week 14-15)
Sprint 8  ─── Testing, Security Audit & Launch      (Week 16)
```

```
                    MVP LINE
                       │
  S0 ──── S1 ──── S2 ──── S3 ──── S4 ══════ S5 ──── S6 ──── S7 ──── S8
  Setup   Backend  Pages   PDP     Checkout   Search  Account  CRO    Launch
                          & Cart   & Pay      Filter  Orders   Polish  Audit
```

---

## 2. Sprint 0 — Foundation & DevOps (Week 1)

### Goals
Set up the entire development environment, tooling, and infrastructure so that all future sprints have zero friction.

### Tasks

#### 0.1 Project Initialization

```bash
# Create project structure
mkdir -p magicofit/{storefront,backend,docs}

# Initialize Next.js 14 storefront with App Router
cd storefront
npx -y create-next-app@latest ./ --typescript --app --src-dir=false --eslint --import-alias="@/*" --use-npm

# Initialize MedusaJS v2 backend
cd ../backend
npx -y create-medusa-app@latest ./ --skip-db --no-browser
```

#### 0.2 Development Infrastructure

```yaml
# docker-compose.yml — spin up all services
# PostgreSQL 16, Redis 7, Meilisearch v1.6
# See 01_System_Architecture.md → Section 9.1
```

**Windsurf Commands:**
1. Create `docker-compose.yml` in project root (as specified in doc 01, section 9.1)
2. Create `.env.example` with all required environment variables
3. Create `.env.local` for storefront with `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
4. Create `medusa-config.ts` for backend with database, Redis, and module configs
5. Verify services start: `docker-compose up -d`
6. Verify Medusa migrations: `cd backend && npx medusa migrations run`
7. Verify Medusa server starts: `npx medusa develop`

#### 0.3 Code Quality Setup

```bash
# ESLint + Prettier for storefront
cd storefront
npm install -D eslint-config-next prettier eslint-config-prettier

# Husky + lint-staged for pre-commit hooks
npm install -D husky lint-staged
npx husky init
```

**Files to create:**
- `.eslintrc.json` — ESLint config extending next/core-web-vitals
- `.prettierrc` — Prettier config (semi: true, singleQuote: true, tabWidth: 2)
- `.husky/pre-commit` — lint-staged hook
- `tsconfig.json` — Strict TypeScript config with path aliases

#### 0.4 Component Priority — Build Order

```
PRIORITY 1 (Build first — used everywhere):
├── globals.css            — Design system tokens (CSS variables)
├── fonts.ts               — Font loading (Inter + Outfit via next/font)
├── layout.tsx (root)      — Root layout with providers
├── Button.tsx             — Primary, secondary, outline, ghost variants
├── Input.tsx              — Text, email, password with validation states
├── Skeleton.tsx           — Loading skeletons for all content types
└── lib/medusa.ts          — Medusa client configuration

PRIORITY 2 (Layout shell):
├── Header.tsx             — Navigation, search, cart icon, user menu
├── Footer.tsx             — Links, social, newsletter
├── MobileMenu.tsx         — Hamburger → full-screen mobile nav
├── Breadcrumb.tsx         — Dynamic breadcrumb from route
└── Toast.tsx              — Notification system

PRIORITY 3 (Product display):
├── ProductCard.tsx        — Card with image, name, price, rating
├── ProductGrid.tsx        — Responsive grid container
├── SizeSelector.tsx       — Interactive size picker
├── ColorSelector.tsx      — Color swatch with active state
├── AddToCartButton.tsx    — Click handler with loading/success states
├── StockIndicator.tsx     — In stock / Low stock / Out of stock
└── ProductGallery.tsx     — Image gallery with zoom + thumbnails

PRIORITY 4 (Cart & Order):
├── CartDrawer.tsx         — Slide-out cart drawer
├── CartItem.tsx           — Line item with quantity controls
├── CartSummary.tsx        — Subtotal, shipping, total
├── OrderForm.tsx          — Order form (address, shipping, phone)
├── AddressForm.tsx        — Shipping/billing address
├── ShippingSelector.tsx   — Shipping method radio group
└── OrderSummary.tsx       — Order summary

PRIORITY 5 (Search & Filters):
├── SearchBar.tsx          — Debounced input with autocomplete
├── SearchResults.tsx      — Search results with highlighting
├── FilterSidebar.tsx      — Faceted filters (desktop)
└── FilterSheet.tsx        — Faceted filters (mobile bottom sheet)

PRIORITY 6 (Homepage Sections):
├── HeroBanner.tsx         — Video/image hero with CTA
├── FeaturedProducts.tsx   — Trending products row
├── CategoryShowcase.tsx   — Category grid cards
├── BrandLogos.tsx         — Brand carousel
└── Newsletter.tsx         — Email signup form

PRIORITY 7 (Account & Extras):
├── AccountDashboard.tsx   — User profile and orders overview
├── OrderHistory.tsx       — List of past orders
├── OrderDetail.tsx        — Single order detail
├── WishlistPage.tsx       — Saved products
├── ProductReviews.tsx     — Reviews section
└── ReviewForm.tsx         — Write a review
```

---

## 3. Sprint 1 — Backend Core (Week 2-3)

### Goals
Configure MedusaJS v2 with all modules, seed the database, and create a fully functional API.

### Tasks

#### 1.1 Medusa Module Configuration

```typescript
// medusa-config.ts
module.exports = {
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    redis_url: process.env.REDIS_URL,
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
  },
  modules: {
    // Enable all required modules
    inventoryService: { resolve: "@medusajs/inventory", },
    stockLocationService: { resolve: "@medusajs/stock-location", },
    // Search
    searchService: { resolve: "medusa-plugin-meilisearch", options: { config: { host: process.env.MEILI_HOST }, settings: { /* see doc 02, section 7 */ } } },
  },
};
```

#### 1.2 Data Seeding

**Windsurf Commands:**
1. Create seed file `backend/data/seed.json` with:
   - 25 product categories (hierarchy from doc 02, section 3)
   - 12 collections (automatic + manual)
   - 50 products across categories with complex variants
   - Pricing in USD, EUR, SAR
   - Inventory levels per variant
2. Run `npx medusa seed -f data/seed.json`
3. Verify products appear in Medusa Admin (`http://localhost:9000/app`)

#### 1.3 Custom Modules

**Files to create:**
- `backend/src/subscribers/product-updated.ts` — Sync product changes to Meilisearch
- `backend/src/subscribers/inventory-updated.ts` — Log inventory changes, trigger low-stock alerts
- `backend/src/subscribers/order-placed.ts` — Reserve inventory, send confirmation email
- `backend/src/jobs/cleanup-abandoned-carts.ts` — Release reserved inventory from abandoned carts (30min)
- `backend/src/workflows/reserve-inventory.ts` — Atomic inventory reservation (see doc 02, section 4.3)

#### 1.4 API Verification Checklist

| Endpoint | Method | Test |
|---|---|---|
| `/store/products` | GET | Returns product list with variants and prices |
| `/store/products/:id` | GET | Returns single product with all relations |
| `/store/collections` | GET | Returns collections |
| `/store/carts` | POST | Creates new cart |
| `/store/carts/:id/line-items` | POST | Adds item to cart with inventory check |
| `/store/carts/:id` | POST | Updates cart (shipping address, etc.) |
| `/store/auth/otp/send` | POST | Sends WhatsApp OTP |
| `/store/auth/otp/verify` | POST | Verifies OTP and returns JWT |

---

## 4. Sprint 2 — Storefront Core Pages (Week 4-5)

### Goals
Build the storefront layout shell (Header, Footer), Homepage, and Shop/Category pages.

### Tasks

#### 2.1 Design System & Layout

**Windsurf Commands:**
1. Create `storefront/styles/globals.css` with all CSS variables (design tokens from doc 03, section 1.1)
2. Create `storefront/styles/fonts.ts` — configure Inter and Outfit via `next/font/google`
3. Create root `app/layout.tsx` — HTML lang, fonts, metadata, global providers
4. Create `app/(main)/layout.tsx` — Header + Footer wrapper
5. Build `Header.tsx` — logo, navigation, search icon, wishlist icon, cart icon with badge
6. Build `Footer.tsx` — links, social icons, newsletter form
7. Build `MobileMenu.tsx` — hamburger toggle, animated slide-in full-screen menu

#### 2.2 Homepage

**Windsurf Commands:**
1. Build `HeroBanner.tsx` — full-width hero with video/image background, CTA buttons
2. Build `CategoryShowcase.tsx` — glassmorphism category cards with hover effects
3. Build `FeaturedProducts.tsx` — fetch trending products from Medusa, horizontal scroll
4. Build `ProductCard.tsx` — image, name, price (with sale), rating stars, quick actions
5. Build `Newsletter.tsx` — email capture form with glassmorphism styling
6. Build main `app/(main)/page.tsx` tying all sections together with ISR (`revalidate: 60`)

#### 2.3 Shop / Category Pages

**Windsurf Commands:**
1. Build `app/(main)/shop/page.tsx` — all products page with product grid
2. Build `app/(main)/shop/[category]/page.tsx` — category-filtered product grid
3. Build `ProductGrid.tsx` — responsive CSS grid (2 cols mobile, 3 cols tablet, 4 cols desktop)
4. Build sort dropdown (Best Selling, Price Low-High, Price High-Low, Newest, Rating)
5. Implement ISR with `revalidate: 300` for category pages
6. Add `generateStaticParams()` for top-level categories
7. Add breadcrumb navigation

---

## 5. Sprint 3 — Product Detail & Cart (Week 6-7)

### Goals
Build the Product Detail Page with full variant selection and the Cart experience.

### Tasks

#### 3.1 Product Detail Page

**Windsurf Commands:**
1. Build `app/(main)/products/[handle]/page.tsx` — ISR page with `revalidate: 60`
2. Build `ProductGallery.tsx` — main image + thumbnail strip, zoom on hover, video support
3. Build `SizeSelector.tsx` — interactive size grid with availability indicators, size guide modal
4. Build `ColorSelector.tsx` — color swatches that change product images on click
5. Build `AddToCartButton.tsx` — Server Action integration, loading → success animation
6. Build `StockIndicator.tsx` — "In Stock", "Only 3 left!", "Out of Stock"
7. Build tabbed content section (Description, Specifications, Reviews, Shipping)
8. Build `StickyCartBar.tsx` — appears when main CTA scrolls out of view
9. Build "You May Also Like" recommendations section (use Medusa related products)
10. Add structured data (JSON-LD) for Product schema
11. Build `generateStaticParams()` for top 100 products

#### 3.2 Cart

**Windsurf Commands:**
1. Create `stores/ui-store.ts` — Zustand store for cart drawer state
2. Create `actions/cart.ts` — Server Actions: `addToCart`, `removeFromCart`, `updateQuantity`
3. Build `CartDrawer.tsx` — animated slide-out drawer from right
4. Build `CartItem.tsx` — product image, name, variant info, quantity controls, remove
5. Build `CartSummary.tsx` — subtotal, free shipping progress bar, estimated total
6. Build `app/(main)/cart/page.tsx` — full cart page (for direct linking)
7. Implement cart cookie management (`cart_id` in HttpOnly cookie)
8. Add optimistic UI updates for quantity changes

---

## 6. Sprint 4 — Order Management — MVP LAUNCH (Week 8-9)

Complete the order flow without online payments. Orders are created for cash-on-delivery or manual payment processing.

### Tasks

#### 4.1 Order Form

**Windsurf Commands:**
1. Build `app/order/layout.tsx` — minimal layout (logo only, no nav)
2. Build `app/order/page.tsx` — one-page order form with SSR
3. Build `OrderForm.tsx` — phone-first order form (WhatsApp OTP → Address → Shipping)
4. Build `AddressForm.tsx` — shipping/billing address with validation
5. Build `ShippingSelector.tsx` — shipping method radio group
6. Create `actions/order.ts` — Server Actions for address, shipping
7. Implement WhatsApp phone-first order flow (Phone OTP → Address → Shipping → Order Confirmation)

#### 4.2 Order Creation

**Windsurf Commands:**
1. Create order with Medusa Order API (without payment)
2. Implement order confirmation flow
3. Build order confirmation page (`/order/success`)
4. Add order status tracking (pending → processing → shipped → delivered)

#### 4.3 Inventory Reservation at Order

**Windsurf Commands:**
1. Implement cart validation before order (check stock of all items)
2. Reserve inventory atomically when order is created
3. Release inventory if order is cancelled
4. Test concurrent order scenarios

#### 4.4 MVP Launch Checklist

**Backend:**
☐ Inventory reservation workflow implemented
☐ Order status flow working (pending → completed)
☐ WhatsApp OTP authentication working
☐ Order confirmation emails sent

**Frontend:**
☐ Order page renders with all forms
☐ Form validation works (phone, address, shipping)
☐ Order creates successfully without payment
☐ Order confirmation page shows order details
☐ Cart clears after successful order

**E2E Tests:**
☐ User can complete order as guest
☐ Inventory is deducted after successful order
☐ Low stock prevents order
☐ Abandoned cart releases inventory after 30min

---

## 7. Sprint 5 — Search, Filters & Performance (Week 10-11)

### Goals
Implement full-text search with Meilisearch and advanced faceted filters.

### Tasks

#### 5.1 Meilisearch Integration

**Windsurf Commands:**
1. Configure Meilisearch index settings (see doc 02, section 7)
2. Build product sync subscriber (product CRUD → update Meilisearch index)
3. Create `lib/search.ts` — Meilisearch client wrapper
4. Create `app/api/search/route.ts` — proxy search API route

#### 5.2 Search UI

**Windsurf Commands:**
1. Build `SearchBar.tsx` — debounced input (300ms), keyboard shortcuts (Cmd+K)
2. Build autocomplete dropdown — instant results as user types
3. Build `app/(main)/search/page.tsx` — full search results page (SSR)
4. Implement search highlighting on result titles

#### 5.3 Faceted Filters

**Windsurf Commands:**
1. Build `FilterSidebar.tsx` — collapsible filter groups (Category, Price, Size, Color, Brand, etc.)
2. Build `FilterSheet.tsx` — mobile bottom sheet version of filters
3. Implement URL-based filter state (see doc 03, section 2.2)
4. Build price range slider component
5. Build color swatch filter
6. Build active filter chips (removable, shown above grid)
7. Show facet counts dynamically from Meilisearch response
8. Implement "Clear All Filters" button

#### 5.4 Performance Optimization

**Windsurf Commands:**
1. Configure `next/image` for all product images with proper sizes
2. Implement dynamic imports for heavy components (`ProductReviews`, `ProductGallery`)
3. Add loading skeletons for all async-rendered sections
4. Set up `@next/bundle-analyzer` and verify bundle size < 200KB
5. Verify Core Web Vitals (LCP < 2s, FID < 100ms, CLS < 0.05)
6. Add font preloading and `next/font` setup verification

---

## 8. Sprint 6 — User Accounts & Order Management (Week 12-13)

### Goals
Customer authentication, account management, order history, and wishlist.

### Tasks

#### 6.1 Authentication (WhatsApp OTP)

**Windsurf Commands:**
1. Create `actions/account.ts` — Server Actions: `requestOtp`, `verifyOtp`, `logout`
2. Implement JWT session management (HttpOnly cookies, 7-day expiry)
3. Build WhatsApp login/verification modal
4. Build protected route middleware (`middleware.ts`)
5. Implement phone-first checkout linking to existing accounts

#### 6.2 Account Pages

**Windsurf Commands:**
1. Build `app/(main)/account/page.tsx` — account dashboard
2. Build `app/(main)/account/orders/page.tsx` — order history list
3. Build `app/(main)/account/orders/[id]/page.tsx` — order detail with tracking
4. Build `app/(main)/account/settings/page.tsx` — profile, password, addresses
5. Build address management (add, edit, delete, set default)

#### 6.3 Wishlist

**Windsurf Commands:**
1. Create `actions/wishlist.ts` — Server Actions for wishlist CRUD
2. Build `WishlistToggle.tsx` — heart icon with auth check
3. Build wishlist page with product cards and "Move to Cart" action
4. Store wishlist in customer metadata (for logged-in users)
5. Fallback to localStorage for guest users

#### 6.4 Admin Dashboard Extensions

**Windsurf Commands:**
1. Scaffold Medusa Admin custom widget components (`backend/src/admin/widgets`)
2. Build "WhatsApp Logs" timeline component on the Order Details page.
3. Add "Send Manual WhatsApp Message" action in the admin UI.
4. Build a custom Admin Module for logging phone-orders placed manually.

---

## 9. Sprint 7 — Polish, A11y & CRO (Week 14-15)

### Goals
Micro-animations, accessibility compliance, and conversion rate optimization features.

### Tasks

#### 7.1 Micro-Animations

**Windsurf Commands:**
1. Implement cart icon bounce animation on add-to-cart
2. Add product card hover effects (scale, shadow lift)
3. Add CTA button hover glow effects
4. Implement skeletal loading animations (pulse)
5. Add page transition animations (fade + slide)
6. Implement `prefers-reduced-motion` media query override
7. Add smooth scroll behavior globally

#### 7.2 Accessibility Audit

**Windsurf Commands:**
1. Add ARIA labels to all interactive elements
2. Implement keyboard navigation for product grid, filters, and modals
3. Add focus trapping for modals and drawers
4. Add "Skip to main content" link
5. Verify color contrast (WCAG AA compliance)
6. Add `aria-live` regions for dynamic content (toast, cart count)
7. Test with screen reader (add descriptive alt text to all images)
8. Run axe-core accessibility audit

#### 7.3 CRO Enhancements

**Windsurf Commands:**
1. Build announcement bar with dismissibility and countdown timer
2. Add "Only X left" urgency badges on product cards and PDP
3. Implement recently viewed products (localStorage + horizontal scroll)
4. Build free shipping progress bar in cart
5. Add trust badges section (icons + text near checkout CTA)
6. Implement abandoned cart recovery (redirect back to cart on return visit)
7. Build product review system (`ProductReviews.tsx`, `ReviewForm.tsx`)
8. Add "Complete the Look" cross-sell section on PDP

---

## 10. Sprint 8 — Testing, Security & Launch (Week 16)

### Goals
Comprehensive testing, security hardening, and production deployment.

### Tasks

#### 10.1 Unit Tests

```bash
# Install testing dependencies
cd storefront
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Test Coverage Requirements:**

| Component | Tests |
|---|---|
| `AddToCartButton` | Renders, handles click, shows loading/success, handles out-of-stock |
| `SizeSelector` | Renders sizes, handles selection, shows unavailable sizes as disabled |
| `ColorSelector` | Renders swatches, updates active state |
| `CartItem` | Renders info, updates quantity, removes item |
| `StockIndicator` | Renders all states (in stock, low, out) |
| `ProductCard` | Renders product info, sale badge, rating |
| Server Actions | `addToCart`, `removeFromCart`, `updateQuantity` — happy path + error handling |
| `useFilterParams` | Parses URL params, sets params, clears all |
| Search | Debounce works, results render, filters apply |
| Checkout form | Validation works, submission flow, error states |

```typescript
// Example test — AddToCartButton
import { render, screen, fireEvent } from "@testing-library/react";
import { AddToCartButton } from "@/components/product/AddToCartButton";

describe("AddToCartButton", () => {
  it("renders with correct text", () => {
    render(<AddToCartButton variantId="var_001" price={13000} />);
    expect(screen.getByRole("button")).toHaveTextContent("Add to Cart — $130.00");
  });

  it("shows disabled state when out of stock", () => {
    render(<AddToCartButton variantId="var_001" price={13000} outOfStock />);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("Out of Stock");
  });

  it("shows loading state during add-to-cart action", async () => {
    render(<AddToCartButton variantId="var_001" price={13000} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });
});
```

#### 10.2 Integration / E2E Tests

```bash
# Install Playwright
cd storefront
npm install -D @playwright/test
npx playwright install
```

**E2E Test Scenarios:**

```typescript
// tests/e2e/checkout-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test("complete purchase as guest", async ({ page }) => {
    // 1. Browse to product
    await page.goto("/products/nike-air-pegasus-41");
    await expect(page.locator("h1")).toContainText("Nike Air Pegasus 41");

    // 2. Select variant
    await page.click('[data-size="42"]');
    await page.click('[data-color="Black/White"]');

    // 3. Add to cart
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText("1");

    // 4. Open cart and proceed to checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('[data-testid="checkout-button"]');

    // 5. Fill checkout form (Phone First)
    await page.fill('[name="phone"]', "+966501234567");
    await page.click('[data-testid="verify-otp"]');
    // ... simulate OTP verification ...
    await page.fill('[name="firstName"]', "John");
    await page.fill('[name="lastName"]', "Doe");
    await page.fill('[name="address1"]', "123 Main St");
    await page.fill('[name="city"]', "Riyadh");
    await page.fill('[name="postalCode"]', "12211");
    await page.selectOption('[name="country"]', "SA");

    // 6. Select shipping
    await page.click('[data-testid="shipping-standard"]');

    // 7. Place order (no payment required)
    await page.click('[data-testid="place-order-button"]');

    // 8. Verify success
    await expect(page).toHaveURL(/\/order\/success/);
    await expect(page.locator("h1")).toContainText("Order Confirmed");
  });

  test("prevents order with out-of-stock item", async ({ page }) => {
    // ... test that validates cart before order
  });
});
```

#### 10.3 Security Checklist

| Check | Action | Priority |
|---|---|---|
| **CSP Headers** | Add Content-Security-Policy in `next.config.mjs` `headers()` | 🔴 Critical |
| **CSRF Protection** | Verify SameSite=Strict on session cookies | 🔴 Critical |
| **Input Validation** | Add Zod schemas to ALL Server Actions and API routes | 🔴 Critical |
| **Rate Limiting** | Implement Redis-based rate limiting on `/store/auth`, `/store/carts` | 🔴 Critical |
| **HTTPS Enforcement** | Verify HSTS header, redirect HTTP→HTTPS | 🔴 Critical |
| **Secrets Management** | All API keys in env vars, `.env` in `.gitignore` | 🔴 Critical |
| **SQL Injection** | Verify parameterized queries (automatic via MikroORM) | 🟡 Medium |
| **XSS** | Verify React auto-escaping; no `dangerouslySetInnerHTML` | 🟡 Medium |
| **Dependency Audit** | Run `npm audit fix`, update vulnerable packages | 🟡 Medium |
| **Admin Access** | Verify Medusa Admin is not publicly accessible in production | 🔴 Critical |
| **Error Messages** | Verify error responses don't leak stack traces in production | 🟡 Medium |
| **File Upload** | Validate file types and sizes if user uploads (reviews, avatar) | 🟡 Medium |

```typescript
// next.config.mjs — Security headers
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "frame-src 'self'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.r2.cloudflarestorage.com https://*.s3.amazonaws.com",
              "connect-src 'self' https://*.meilisearch.com",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};
```

#### 10.4 Production Deployment

**Frontend (Vercel):**
1. Connect GitHub repository to Vercel
2. Set environment variables (Medusa URL, Meilisearch host)
3. Configure custom domain
4. Enable Vercel Analytics + Speed Insights
5. Verify ISR working in production

**Backend (Railway / Render):**
1. Deploy MedusaJS to Railway with PostgreSQL add-on
2. Configure Redis add-on
3. Set all environment variables
4. Run migrations in production
5. Verify API health endpoint

**Infrastructure Checklist:**
```
☐ DNS configured for custom domain
☐ SSL certificates active
☐ CDN caching configured
☐ Medusa Admin secured (IP whitelist or auth gateway)
☐ Database backups scheduled (daily)
☐ Error tracking (Sentry) configured
☐ Uptime monitoring configured
☐ Log aggregation set up
☐ Load testing passed (simulate 1000 concurrent users)
```

---

## 11. Post-Launch Roadmap (Future Sprints)

| Sprint | Feature | Impact |
|---|---|---|
| S9 | Multi-language support (i18n) + Multi-currency | 🌍 Global expansion |
| S10 | Product recommendations (ML-based) | 📈 +15% AOV |
| S11 | Loyalty program & referral system | 🔁 Customer retention |
| S12 | Mobile app (React Native) | 📱 Mobile conversion |
| S13 | Blog / Content marketing (CMS integration) | 📝 SEO + Traffic |
| S14 | Advanced analytics dashboard | 📊 Data-driven decisions |
| S15 | B2B wholesale portal | 🏢 Revenue stream |
| S16 | AI chatbot / shopping assistant | 🤖 Support + conversion |

---

## 12. Technical Debt & Maintenance Rules

### Code Review Checklist (for every PR)

```
☐ TypeScript strict mode — no `any` types
☐ Components are < 200 lines (split if larger)
☐ Server Components by default (only `'use client'` when necessary)
☐ No business logic in components (extract to actions/lib)
☐ Loading states and error boundaries for all async components
☐ Responsive design tested at 375px, 768px, 1024px, 1440px
☐ All interactive elements have unique `data-testid` attributes
☐ Images use `next/image` with explicit width/height
☐ No hardcoded strings (use constants or i18n keys)
☐ Console.log statements removed before merge
☐ Accessibility: ARIA labels, keyboard nav, focus management
```

### Dependency Update Schedule

| Frequency | Action |
|---|---|
| Weekly | `npm audit` — fix critical vulnerabilities |
| Biweekly | Update patch versions (`npm update`) |
| Monthly | Review and update minor versions |
| Quarterly | Evaluate major version upgrades (Next.js, MedusaJS) |

---

## 13. Key Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | Best SSR/ISR support, RSC, great DX |
| Commerce Engine | MedusaJS v2 | Open-source, modular, better than Saleor for customization |
| Database | PostgreSQL | ACID compliance, JSON support, MedusaJS native |
| Search | Meilisearch | Faster than Elasticsearch for product search, simpler to operate |
| State Management | Zustand (minimal) | Only for UI state; server state via RSC/Server Actions |
| Payments | None (Cash on Delivery / Manual) | Simplified MVP, no online payment processing |
| Comms & Auth | Twilio (WhatsApp API) | Phone-first OTP and conversational commerce notifications |
| Styling | Vanilla CSS (CSS Variables) | Maximum control, no framework lock-in, better performance |
| Deployment | Vercel + Railway | Optimal for Next.js + Node.js backend |
| Testing | Vitest + Playwright | Fast unit tests + reliable E2E tests |
