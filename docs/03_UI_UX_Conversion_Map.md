# 03 — UI/UX & Conversion Map: MagicOFit Sports E-Commerce

> **Design Philosophy**: Performance meets conversion. Every pixel earns revenue.  
> **Target Metrics**: 3.5%+ Conversion Rate, <2% Cart Abandonment Reduction per quarter, 60+ NPS.

---

## 1. Design System Foundation

### 1.1 Brand & Color Palette

```css
:root {
  /* Primary — Electric Energy */
  --color-primary-50:  #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;   /* Main brand green */
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;

  /* Accent — Power Orange */
  --color-accent-400: #fb923c;
  --color-accent-500: #f97316;    /* CTA accent */
  --color-accent-600: #ea580c;

  /* Neutral — Carbon */
  --color-neutral-50:  #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
  --color-neutral-950: #0a0a0a;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;

  /* Surface (Dark Mode First) */
  --surface-bg:      #0a0a0a;
  --surface-card:    #171717;
  --surface-elevated:#262626;
  --surface-overlay: rgba(0, 0, 0, 0.7);

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Outfit', sans-serif;

  /* Spacing Scale */
  --space-xs:  0.25rem;   /* 4px */
  --space-sm:  0.5rem;    /* 8px */
  --space-md:  1rem;      /* 16px */
  --space-lg:  1.5rem;    /* 24px */
  --space-xl:  2rem;      /* 32px */
  --space-2xl: 3rem;      /* 48px */
  --space-3xl: 4rem;      /* 64px */

  /* Border Radius */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.3);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.3);
  --shadow-lg:  0 10px 25px rgba(0,0,0,0.4);
  --shadow-glow:0 0 30px rgba(34,197,94,0.15);

  /* Transitions */
  --transition-fast:   150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow:   400ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Z-Index Scale */
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-toast:     500;
}
```

### 1.2 Typography Scale

```css
/* Type Scale */
.text-display-xl { font: 700 3.5rem/1.1 var(--font-display); letter-spacing: -0.02em; }
.text-display-lg { font: 700 3rem/1.1 var(--font-display);   letter-spacing: -0.02em; }
.text-display-md { font: 600 2.25rem/1.2 var(--font-display); letter-spacing: -0.01em; }
.text-heading-lg { font: 600 1.875rem/1.3 var(--font-display); }
.text-heading-md { font: 600 1.5rem/1.3 var(--font-display); }
.text-heading-sm { font: 600 1.25rem/1.4 var(--font-display); }
.text-body-lg    { font: 400 1.125rem/1.6 var(--font-primary); }
.text-body-md    { font: 400 1rem/1.6 var(--font-primary); }
.text-body-sm    { font: 400 0.875rem/1.5 var(--font-primary); }
.text-caption    { font: 500 0.75rem/1.4 var(--font-primary); letter-spacing: 0.02em; }
.text-overline   { font: 700 0.625rem/1.2 var(--font-primary); letter-spacing: 0.1em; text-transform: uppercase; }
```

---

## 2. Page-by-Page Design & CRO Specifications

---

### 2.1 Homepage (`/`)

#### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│ ▌ ANNOUNCEMENT BAR ▌                                    │
│ "Free Shipping on Orders over $100 | Use Code: MAGIC100"│
│ (dismissible, sticky on scroll, semi-transparent)        │
├──────────────────────────────────────────────────────────┤
│ HEADER                                                   │
│ [Logo]  [Shop▼] [Sports▼] [Brands▼] [Sale🔥]  🔍 ♡ 🛒(3)│
├──────────────────────────────────────────────────────────┤
│                                                          │
│              ╔══════════════════════════╗                │
│              ║     HERO SECTION        ║                │
│              ║                          ║                │
│              ║  "GEAR UP FOR            ║                │
│              ║   GREATNESS"             ║                │
│              ║                          ║                │
│              ║  Full-screen video bg    ║                │
│              ║  with parallax effect    ║                │
│              ║                          ║                │
│              ║  [SHOP NEW ARRIVALS →]   ║                │
│              ║  [EXPLORE SALE →]        ║                │
│              ╚══════════════════════════╝                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  CATEGORY SHOWCASE (Horizontal scroll, card-based)       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ 👟      │ │ 👕      │ │ 🎒      │ │ 🧤      │      │
│  │Footwear │ │ Apparel │ │Equipment│ │Accessory│      │
│  │         │ │         │ │         │ │         │      │
│  │ Shop → │ │ Shop → │ │ Shop → │ │ Shop → │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│  (Glassmorphism cards with hover lift + gradient border) │
├──────────────────────────────────────────────────────────┤
│  FEATURED PRODUCTS — "Trending Now"                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │      │ │      │ │      │ │      │ │      │         │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │ │ Img  │         │
│  │      │ │      │ │      │ │      │ │      │         │
│  │Nike  │ │Adidas│ │Under │ │Gymsh.│ │Wilson│         │
│  │$130  │ │$95   │ │$85   │ │$65   │ │$220  │         │
│  │★★★★½ │ │★★★★★ │ │★★★★☆ │ │★★★★½ │ │★★★★★ │         │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
│  (Quick-view on hover, "Add to Cart" appears on hover)  │
├──────────────────────────────────────────────────────────┤
│  SPORT-SPECIFIC SECTIONS — "Shop By Sport"               │
│  ┌────────────────────┐  ┌─────────────────────┐        │
│  │  🏃 RUNNING        │  │  🏋️ GYM & FITNESS   │        │
│  │  Full-bleed image  │  │  Full-bleed image    │        │
│  │  with CTA overlay  │  │  with CTA overlay    │        │
│  └────────────────────┘  └─────────────────────┘        │
│  ┌────────────────────┐  ┌─────────────────────┐        │
│  │  🎾 TENNIS         │  │  🧘 YOGA & WELLNESS │        │
│  │  Full-bleed image  │  │  Full-bleed image    │        │
│  └────────────────────┘  └─────────────────────┘        │
│  (2×2 grid with zoom-on-hover effect)                    │
├──────────────────────────────────────────────────────────┤
│  TRUST INDICATORS BAR                                    │
│  🚚 Free Shipping  │  ↩️ 30-Day Returns  │  🔒 Secure   │
│    over $100       │   No Questions     │   Payments   │
├──────────────────────────────────────────────────────────┤
│  BRAND LOGOS CAROUSEL                                    │
│  [Nike] [Adidas] [Under Armour] [Puma] [Gymshark]...   │
│  (Infinite horizontal scroll, grayscale → color hover)   │
├──────────────────────────────────────────────────────────┤
│  NEWSLETTER SECTION                                      │
│  "Get 15% Off Your First Order"                         │
│  [email input] [SUBSCRIBE]                              │
│  (Glassmorphism card, animated gradient border)          │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
│  [About] [FAQ] [Contact] [Shipping] [Returns]           │
│  [Instagram] [TikTok] [YouTube]                         │
│  © 2025 MagicOFit. Powered by 💪                        │
└──────────────────────────────────────────────────────────┘
```

#### CRO Rules for Homepage

| Element | CRO Principle | Implementation |
|---|---|---|
| Announcement Bar | Urgency & Value | Show time-limited offers; countdown timer for flash sales |
| Hero CTA | Above-the-fold action | Two CTAs: primary (New Arrivals) + secondary (Sale) |
| Category Cards | Reduce choice paralysis | Max 6 categories; icon + image hybrid |
| Featured Products | Social proof | Show star ratings + "Bestseller" badges |
| Trust Bar | Reduce purchase anxiety | Always visible; icons + one-liner text |
| Newsletter | Lead capture | Incentivize with discount; single field for friction reduction |

---

### 2.2 Shop / Category Page (`/shop`, `/shop/[category]`)

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER + BREADCRUMB                                             │
│ Home > Shop > Running Shoes                                     │
├───────────────┬─────────────────────────────────────────────────┤
│               │  TOOLBAR                                        │
│   FILTER      │  ┌────────────────────────────────────────────┐ │
│   SIDEBAR     │  │ 127 Products │ Sort: [Best Selling ▼]     │ │
│               │  │ View: [Grid] [List]                         │ │
│  ┌──────────┐ │  └────────────────────────────────────────────┘ │
│  │ Category │ │                                                 │
│  │ ☐ Road   │ │  PRODUCT GRID (3-4 columns on desktop)         │
│  │ ☐ Trail  │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ ☐ Track  │ │  │      │ │      │ │🔥NEW │ │      │         │
│  ├──────────┤ │  │ Img  │ │ Img  │ │ Img  │ │ Img  │         │
│  │ Price    │ │  │      │ │      │ │      │ │      │         │
│  │ $0 ─○── $500│ │  │Nike  │ │Adidas│ │Hoka  │ │ASICS │         │
│  ├──────────┤ │  │$130  │ │$120  │ │$160  │ │$140  │         │
│  │ Size     │ │  │★★★★½ │ │★★★★★ │ │★★★★☆ │ │★★★★½ │         │
│  │ ☐ 38     │ │  └──────┘ └──────┘ └──────┘ └──────┘         │
│  │ ☐ 39     │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ ☐ 40     │ │  │-20%  │ │      │ │      │ │      │         │
│  │ ☐ 41     │ │  │ Img  │ │ Img  │ │ Img  │ │ Img  │         │
│  │ ☐ 42+    │ │  │      │ │      │ │      │ │      │         │
│  ├──────────┤ │  │NB    │ │Saucon│ │Brooks│ │On    │         │
│  │ Color    │ │  │$̶1̶6̶0̶  │ │$150  │ │$155  │ │$170  │         │
│  │ ⚫⚪🔵🟢🔴│ │  │$128  │ │★★★★½ │ │★★★★★ │ │★★★★☆ │         │
│  ├──────────┤ │  └──────┘ └──────┘ └──────┘ └──────┘         │
│  │ Brand    │ │                                                 │
│  │ ☐ Nike   │ │  [LOAD MORE ↓] or Infinite Scroll              │
│  │ ☐ Adidas │ │                                                 │
│  │ ☐ Hoka   │ ├─────────────────────────────────────────────────┤
│  │ ☐ ON     │ │  RECENTLY VIEWED (horizontal scroll)            │
│  │ ☐ +12    │ │  [Product] [Product] [Product] [Product]        │
│  ├──────────┤ │                                                 │
│  │ Sport    │ │                                                 │
│  │ ☐ Running│ │                                                 │
│  │ ☐ Tennis │ │                                                 │
│  │ ☐ Gym    │ │                                                 │
│  ├──────────┤ │                                                 │
│  │ Gender   │ │                                                 │
│  │ ☐ Men    │ │                                                 │
│  │ ☐ Women  │ │                                                 │
│  │ ☐ Unisex │ │                                                 │
│  ├──────────┤ │                                                 │
│  │ Rating   │ │                                                 │
│  │ ★★★★☆+   │ │                                                 │
│  │ ★★★☆☆+   │ │                                                 │
│  └──────────┘ │                                                 │
│               │                                                 │
│ [Clear All]   │                                                 │
│               │                                                 │
│ MOBILE: Filter│                                                 │
│ opens as      │                                                 │
│ bottom sheet  │                                                 │
└───────────────┴─────────────────────────────────────────────────┘
```

#### Faceted Search Implementation

```typescript
// Meilisearch faceted search query
const searchProducts = async (params: SearchParams) => {
  const { query, filters, sort, page, limit } = params;

  // Build Meilisearch filter string
  const filterParts: string[] = [];

  if (filters.categories?.length) {
    filterParts.push(`category_handle IN [${filters.categories.map(c => `"${c}"`).join(', ')}]`);
  }
  if (filters.brands?.length) {
    filterParts.push(`brand IN [${filters.brands.map(b => `"${b}"`).join(', ')}]`);
  }
  if (filters.sizes?.length) {
    filterParts.push(`sizes IN [${filters.sizes.map(s => `"${s}"`).join(', ')}]`);
  }
  if (filters.colors?.length) {
    filterParts.push(`colors IN [${filters.colors.map(c => `"${c}"`).join(', ')}]`);
  }
  if (filters.priceRange) {
    filterParts.push(`price_usd >= ${filters.priceRange.min} AND price_usd <= ${filters.priceRange.max}`);
  }
  if (filters.sport) {
    filterParts.push(`sport = "${filters.sport}"`);
  }
  if (filters.gender) {
    filterParts.push(`gender = "${filters.gender}"`);
  }
  if (filters.inStockOnly) {
    filterParts.push(`in_stock = true`);
  }
  if (filters.onSale) {
    filterParts.push(`on_sale = true`);
  }
  if (filters.minRating) {
    filterParts.push(`rating >= ${filters.minRating}`);
  }

  // Sort mapping
  const sortMap: Record<string, string[]> = {
    "best-selling":  ["total_sold:desc"],
    "price-asc":     ["price_usd:asc"],
    "price-desc":    ["price_usd:desc"],
    "newest":        ["created_at_timestamp:desc"],
    "rating":        ["rating:desc"],
  };

  const response = await meilisearchClient.index("products").search(query || "", {
    filter: filterParts.join(" AND "),
    sort: sortMap[sort] || ["total_sold:desc"],
    facets: [
      "category_handle",
      "brand",
      "sport",
      "gender",
      "sizes",
      "colors",
      "on_sale",
      "in_stock",
    ],
    hitsPerPage: limit || 24,
    page: page || 1,
    attributesToHighlight: ["title", "description"],
    highlightPreTag: '<mark class="search-highlight">',
    highlightPostTag: "</mark>",
  });

  return {
    products: response.hits,
    totalProducts: response.totalHits,
    totalPages: response.totalPages,
    currentPage: response.page,
    facets: response.facetDistribution,  // { brand: { Nike: 42, Adidas: 38 }, ... }
    processingTimeMs: response.processingTimeMs,
  };
};
```

#### URL-Based Filter State (SEO-Friendly)

```
/shop/running-shoes?brand=Nike,Adidas&size=42,43&color=Black&price=5000-20000&sort=best-selling&page=1
```

```typescript
// hooks/useFilterParams.ts
"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function useFilterParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const getFilters = (): SearchFilters => ({
    brands:    searchParams.get("brand")?.split(",") || [],
    sizes:     searchParams.get("size")?.split(",") || [],
    colors:    searchParams.get("color")?.split(",") || [],
    priceRange: searchParams.get("price")
      ? { min: +searchParams.get("price")!.split("-")[0], max: +searchParams.get("price")!.split("-")[1] }
      : undefined,
    sport:     searchParams.get("sport") || undefined,
    gender:    searchParams.get("gender") || undefined,
    sort:      searchParams.get("sort") || "best-selling",
    page:      +(searchParams.get("page") || 1),
  });

  const setFilter = (key: string, value: string | string[] | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    params.delete("page"); // Reset page on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  return { getFilters, setFilter, clearAllFilters };
}
```

#### CRO Rules for Shop Page

| Element | CRO Principle | Implementation |
|---|---|---|
| Active filter chips | Clarity of applied filters | Show removable chips above grid with count |
| Facet counts | Guide browsing decisions | Show "(42)" next to each filter option |
| Quick view on hover | Reduce clicks to conversion | Modal with image, price, sizes, add-to-cart |
| Infinite scroll + Load More | Lower friction than pagination | Hybrid: auto-load 3 pages, then "Load More" button |
| "X products match" | Validate filter selections | Update count in real-time as filters change |
| Sale badge positioning | Urgency | Overlay on top-left corner with percentage off |
| Low stock indicator | Urgency / FOMO | "Only 3 left" badge on product card |
| Recently viewed | Re-engagement | Horizontal scroll row at bottom, persisted in localStorage |

---

### 2.3 Product Detail Page (`/products/[handle]`)

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ BREADCRUMB: Home > Running Shoes > Nike Air Pegasus 41          │
├───────────────────────────────┬──────────────────────────────────┤
│                               │                                  │
│   IMAGE GALLERY               │   PRODUCT INFO                   │
│   ┌─────────────────────┐     │                                  │
│   │                     │     │   NIKE (link to brand page)      │
│   │                     │     │   Nike Air Pegasus 41            │
│   │    MAIN IMAGE       │     │   Road Running Shoes             │
│   │    (zoomable on     │     │                                  │
│   │     hover/pinch)    │     │   ★★★★½ (4.7) · 234 Reviews     │
│   │                     │     │                                  │
│   │                     │     │   $̶1̶6̶0̶.̶0̶0̶                       │
│   └─────────────────────┘     │   $130.00  -19% SAVE $30        │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │   (or 4 × $32.50 with Afterpay) │
│   │t1│ │t2│ │t3│ │t4│ │t5│  │                                  │
│   └──┘ └──┘ └──┘ └──┘ └──┘  │   COLOR: Black/White  ▸ Navy ▸ Green│
│   (thumbnail strip, click    │   ⚫ ⚪ 🔵 🟢                    │
│    to view; includes video)  │   (swatches with product image   │
│                               │    change on click)              │
│   ┌─────────────────────┐     │                                  │--
│   │ 360° VIEW / VIDEO   │     │   SIZE: (with size guide link)   │
│   │ [Play Button]       │     │   [38] [39] [40] [41✓] [42]    │
│   └─────────────────────┘     │   [43] [44] [45] [46]           │
│                               │   ⚠️ Size 39 — Only 2 left!     │
│                               │                                  │
│                               │   WIDTH:                         │
│                               │   [Standard (D)] [Wide (2E)]     │
│                               │   [Extra Wide (4E)]              │
│                               │                                  │
│                               │   ┌──────────────────────────┐   │
│                               │   │  [−] 1 [+]              │   │
│                               │   │                          │   │
│                               │   │  [🛒 ADD TO CART — $130] │   │
│                               │   │    (Primary, full-width) │   │
│                               │   │                          │   │
│                               │   │  [♡ ADD TO WISHLIST]     │   │
│                               │   └──────────────────────────┘   │
│                               │                                  │
│                               │   🚚 Free shipping over $100    │
│                               │   ↩️  30-day free returns        │
│                               │   📦 Estimated delivery: 3-5 days│
│                               │   ✅ In Stock — Ships today      │
│                               │                                  │
├───────────────────────────────┴──────────────────────────────────┤
│                                                                  │
│  ── STICKY ADD-TO-CART BAR (appears on scroll past main CTA) ── │
│  │ Nike Air Pegasus 41 │ Size: 41 │ $130 │ [ADD TO CART] │      │
│  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  TABS: [Description] [Specifications] [Reviews (234)] [Shipping]│
│                                                                  │
│  Description:                                                    │
│  Responsive cushioning for everyday runs. The Pegasus 41        │
│  features React foam technology for smooth transitions...        │
│                                                                  │
│  KEY FEATURES:                                                   │
│  • React foam midsole for responsive cushioning                 │
│  • Engineered mesh upper for breathability                      │
│  • Waffle outsole for multi-surface traction                    │
│  • 10mm heel-to-toe drop                                        │
│  • Weight: 280g (Men's size 42)                                 │
│                                                                  │
│  Specifications Table:                                           │
│  ┌──────────────┬───────────────────┐                            │
│  │ Material     │ Mesh / React Foam │                            │
│  │ Drop         │ 10mm              │                            │
│  │ Weight       │ 280g              │                            │
│  │ Terrain      │ Road              │                            │
│  │ Cushioning   │ Neutral           │                            │
│  │ Origin       │ Vietnam           │                            │
│  │ SKU          │ NKE-PEG41-41-BLK  │                            │
│  └──────────────┴───────────────────┘                            │
│                                                                  │
│  Reviews:                                                        │
│  [Sort: Most Recent ▼] [Filter: All Stars ▼]                    │
│  ┌──────────────────────────────────────────┐                    │
│  │ ★★★★★  "Best running shoe I've owned"    │                    │
│  │ John D. — Verified Purchase — 2 days ago │                    │
│  │ Size: 42, Color: Black — True to size    │                    │
│  │ Great cushioning for my daily 10K runs...│                    │
│  │ 👍 Helpful (12) │ 👎 Unhelpful (1)       │                    │
│  │ [Reply] [Report]                          │                    │
│  └──────────────────────────────────────────┘                    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  "YOU MAY ALSO LIKE" — AI-powered recommendations                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                            │
│  │Shoe 2│ │Socks │ │Insole│ │Shorts│                            │
│  └──────┘ └──────┘ └──────┘ └──────┘                            │
│  (Cross-sell: complementary products)                            │
│                                                                  │
│  "RECENTLY VIEWED"                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                            │
│  │Prev 1│ │Prev 2│ │Prev 3│ │Prev 4│                            │
│  └──────┘ └──────┘ └──────┘ └──────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

#### CRO Rules for Product Page

| Element | CRO Principle | Implementation |
|---|---|---|
| **Sticky Add-to-Cart** | Persistent CTA | Fixed bar appears when main CTA scrolls out of view |
| **Urgency Signals** | FOMO | "Only X left!", countdown for sale price |
| **Trust Signals** | Reduce anxiety | Shipping, returns, security badges near CTA |
| **Image Gallery** | Reduce uncertainty | 5+ images, 360° view, zoom, video demo |
| **Size Guide** | Reduce returns | Interactive size guide modal with measurement chart |
| **Color Swatches** | Visual clarity | Real color swatches, images change per color |
| **Reviews with Photos** | Social proof | Verified purchase badge, filterable by rating |
| **Cross-sells** | Increase AOV | "Complete the look" — complementary products |
| **Buy Now, Pay Later** | Lower price friction | Show Afterpay/Klarna installment option |
| **Delivery Estimate** | Set expectations | Geolocation-based shipping estimate |

---

### 2.4 Cart Page & Cart Drawer (`/cart`)

#### Cart Drawer (Slide-Out)

```
┌──────────────────────────────────┐
│  YOUR CART (3 items)         [×] │
│  ─────────────────────────────── │
│  ┌─────┐ Nike Air Pegasus 41    │
│  │ Img │ Black / Size 41 / Std  │
│  │     │ $130.00                │
│  │     │ [−] 1 [+]     [🗑️]    │
│  └─────┘                        │
│  ─────────────────────────────── │
│  ┌─────┐ Adidas Running Shorts  │
│  │ Img │ Navy / Size M          │
│  │     │ $55.00                 │
│  │     │ [−] 1 [+]     [🗑️]    │
│  └─────┘                        │
│  ─────────────────────────────── │
│  ┌─────┐ Nike Running Socks     │
│  │ Img │ White / Pack of 3      │
│  │     │ $18.00                 │
│  │     │ [−] 1 [+]     [🗑️]    │
│  └─────┘                        │
│  ─────────────────────────────── │
│                                  │
│  🏷️ [Enter Promo Code] [Apply]  │
│                                  │
│  Subtotal:        $203.00        │
│  Shipping:        FREE ✅        │
│  ─────────────────────────────── │
│  Estimated Total: $203.00        │
│                                  │
│  [🛒 PROCEED TO CHECKOUT]        │
│  (Primary CTA, full-width,      │
│   pulsing subtle animation)     │
│                                  │
│  or [Continue Shopping →]        │
│                                  │
│  🔒 Secure checkout              │
│  💳 Visa • MC • Amex • PayPal   │
│                                  │
│  PROGRESS BAR:                   │
│  ████████████░░░ $203/$250       │
│  "Add $47 more for FREE gift! 🎁"│
└──────────────────────────────────┘
```

#### CRO Rules for Cart

| Element | CRO Principle | Implementation |
|---|---|---|
| **Free shipping progress bar** | Increase AOV | Visual bar showing distance to free shipping threshold |
| **Promo code field** | Maintain on-site traffic | Collapsed by default (don't remind users to leave and search for codes) |
| **Urgency in cart items** | Prevent abandonment | "Hurry! Only 2 left in this size" |
| **Payment icons** | Trust | Show accepted payment method logos |
| **Upsell / Gift threshold** | AOV increase | "Add $47 more for a FREE gift!" |
| **Saved for later** | Reduce deletion regret | Allow moving items to wishlist instead of deleting |
| **Cart persistence** | Recovery | Cart saved to server (logged in) or localStorage (guest) for 30 days |

---

### 2.5 Checkout Page (`/checkout`) — One-Page Checkout

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [MagicOFit Logo]                    🔒 Secure Checkout          │
│ (Minimal header — no navigation to prevent exit)                │
├────────────────────────────────┬────────────────────────────────┤
│                                │                                │
│  CHECKOUT FORM (Left 60%)      │  ORDER SUMMARY (Right 40%)    │
│                                │  (Sticky on scroll)           │
│  ┌──── STEP INDICATOR ──────┐  │                                │
│  │ ① Info  ─── ② Shipping   │  │  ┌─────┐ Pegasus 41     $130 │
│  │        ─── ③ Payment     │  │  │ Img │ Size 41, Black       │
│  └──────────────────────────┘  │  └─────┘ Qty: 1               │
│                                │  ──────────────────────        │
│  📱 CONTACT (WhatsApp-First)   │  ┌─────┐ Running Shorts  $55  │
│  ┌──────────────────────────┐  │  │ Img │ Size M, Navy          │
│  │ Phone: +966 50 123 4567  │  │  └─────┘ Qty: 1               │
│  │ [Verify via WhatsApp OTP]│  │  ──────────────────────        │
│  │ ☐ Get delivery updates   │  │  ┌─────┐ Running Socks   $18  │
│  └──────────────────────────┘  │  │ Img │ Pack of 3             │
│                                │  └─────┘ Qty: 1               │
│  📦 SHIPPING ADDRESS           │  │                                │
│  ┌──────────────────────────┐  │                                │
│  │ First Name │ Last Name   │  │  ──────────────────────        │
│  │ Address Line 1           │  │  🏷️ [Enter Code] [Apply]      │
│  │ Address Line 2           │  │                                │
│  │ City │ State │ ZIP       │  │  Subtotal:       $203.00      │
│  │ Country [▼]              │  │  Shipping:       FREE ✅       │
│  │ Phone                    │  │  Discount:       -$0.00       │
│  │ ☐ Save for next time    │  │  Tax (est.):     $16.24       │
│  └──────────────────────────┘  │  ─────────────────────         │
│                                │  Total:          $219.24      │
│  🚚 SHIPPING METHOD            │                                │
│  ┌──────────────────────────┐  │                                │
│  │ ◉ Standard (3-5 days)   │  │                                │
│  │   FREE                   │  │                                │
│  │ ○ Express (1-2 days)    │  │                                │
│  │   $12.99                 │  │                                │
│  │ ○ Next Day               │  │                                │
│  │   $24.99                 │  │                                │
│  └──────────────────────────┘  │                                │
│                                │                                │
│  💳 PAYMENT                    │                                │
│  ┌──────────────────────────┐  │                                │
│  │ ◉ Credit Card            │  │                                │
│  │ ┌────────────────────┐   │  │                                │
│  │ │ Card Number (Stripe│   │  │                                │
│  │ │ Element - secure)  │   │  │                                │
│  │ │ MM/YY │ CVC        │   │  │                                │
│  │ └────────────────────┘   │  │                                │
│  │                          │  │                                │
│  │ ○ PayPal                 │  │                                │
│  │ ○ Apple Pay / Google Pay │  │                                │
│  └──────────────────────────┘  │                                │
│                                │                                │
│  ☐ Billing same as shipping    │                                │
│                                │                                │
│  ┌──────────────────────────┐  │                                │
│  │  [💳 PAY $219.24 NOW]   │  │                                │
│  │  (Big, prominent,        │  │                                │
│  │   loading state on click)│  │                                │
│  └──────────────────────────┘  │                                │
│                                │                                │
│  🔒 256-bit SSL encryption     │                                │
│  Data handled by Stripe        │                                │
│  [Privacy] [Terms] [Returns]   │                                │
│                                │                                │
├────────────────────────────────┴────────────────────────────────┤
│ © MagicOFit — Need help? support@magicofit.com                  │
└─────────────────────────────────────────────────────────────────┘
```

#### CRO Rules for Checkout

| Element | CRO Principle | Implementation |
|---|---|---|
| **One-page checkout** | Minimize steps & friction | All steps visible on one scrollable page |
| **Minimal header** | Prevent exit | Logo only, no navigation links |
| **Phone-first auth** | Reduce barriers & trust | Phone input -> WhatsApp OTP for instant account creation/login |
| **Express payments** | Speed | Apple Pay / Google Pay buttons above form |
| **Step indicator** | Progress visibility | Visual stepper (non-clickable, just shows progress) |
| **Sticky order summary** | Constant price visibility | Summary sticks to right side on desktop |
| **Address autocomplete** | Reduce friction | Google Places API for address suggestions |
| **Saved addresses** | Returning customers | Pre-fill from customer profile |
| **Real-time validation** | Error prevention | Validate fields on blur, not on submit |
| **Loading state on CTA** | Prevent double-submit | Spinner + disabled state on payment button |
| **Security badges** | Trust at payment moment | SSL, Stripe, PCI badges near payment button |
| **Promo code (collapsed)** | Subtle presence | Don't prominently show to prevent coupon hunting |

---

## 3. Global UX Patterns

### 3.1 Micro-Animations Specification

| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Add to Cart | Cart icon bounces + count badge scales up | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Cart Drawer opens | Slide in from right + backdrop fade | 300ms | ease-out |
| Product image hover | Scale 1.05 | 250ms | ease |
| CTA button hover | Subtle glow + slight lift (translate-y: -1px) | 200ms | ease |
| Filter toggle | Collapse/Expand with height animation | 200ms | ease |
| Toast notification | Slide down from top + auto-dismiss | Entry: 300ms, Hold: 4s | ease-out |
| Page transition | Fade in + slight upward slide | 200ms | ease |
| Skeleton loading | Pulse animation (opacity 0.5 → 1 → 0.5) | 1.5s loop | ease-in-out |
| Wishlist heart click | Heart fills + brief scale-up | 300ms | spring |
| Sticky header | Slide down on scroll-up, hide on scroll-down | 250ms | ease |

### 3.2 Mobile-First Responsive Breakpoints

```css
/* Mobile-first breakpoints */
/* Mobile: default (< 640px) */
@media (min-width: 640px)  { /* sm — Tablet portrait */ }
@media (min-width: 768px)  { /* md — Tablet landscape */ }
@media (min-width: 1024px) { /* lg — Desktop */ }
@media (min-width: 1280px) { /* xl — Large desktop */ }
@media (min-width: 1536px) { /* 2xl — Ultra-wide */ }
```

### 3.3 Mobile-Specific UX Adaptations

| Desktop Feature | Mobile Adaptation |
|---|---|
| Filter sidebar | Bottom sheet (slide up, 75% height) |
| Product grid (4 cols) | 2 columns |
| Cart drawer (side) | Full-screen overlay |
| Hover quick-view | Tap to quick-view |
| Sticky add-to-cart bar | Sticky bottom bar (always visible) |
| Mega menu navigation | Hamburger → full-screen menu |
| Search bar in header | Expandable search icon → full-width overlay |
| Multi-column checkout | Single column, stacked sections |

### 3.4 Accessibility (A11y) Requirements

| Requirement | Implementation |
|---|---|
| ARIA labels | All interactive elements have descriptive `aria-label` |
| Keyboard nav | Tab order follows visual order; focus rings visible |
| Screen reader | Product cards announce name, price, rating, availability |
| Color contrast | WCAG AA (4.5:1 text, 3:1 large text) |
| Reduced motion | `prefers-reduced-motion` media query disables animations |
| Focus trapping | Modals and drawers trap focus until closed |
| Skip navigation | "Skip to main content" link on all pages |
| Image alt text | All product images have descriptive alt text |
| Form validation | Error messages announced via `aria-live="polite"` |

---

## 4. Performance UX Targets

| Metric | Target | How |
|---|---|---|
| **LCP** | < 2.0s | ISR + next/image optimization + CDN |
| **FID** | < 100ms | Minimal JS, RSC-first architecture |
| **CLS** | < 0.05 | Fixed image dimensions, font preloading |
| **INP** | < 200ms | Optimistic UI for cart mutations |
| **TTFB** | < 400ms | Edge caching + Redis |
| **Bundle < 200KB** | gzipped JS | Tree shaking + dynamic imports |

---

## 5. SEO Strategy Per Page

| Page | Title Template | Meta Description | Schema.org |
|---|---|---|---|
| Home | `MagicOFit — Premium Sports Gear & Athletic Wear` | `Shop the best sports clothing...` | `Organization`, `WebSite` |
| Category | `{Category} — MagicOFit` | `Browse our {Category} collection...` | `CollectionPage`, `BreadcrumbList` |
| Product | `{Product Name} — {Category} — MagicOFit` | `{Product desc, 155 chars}` | `Product` (price, availability, rating) |
| Cart | `Your Cart — MagicOFit` | _noindex_ | — |
| Checkout | `Checkout — MagicOFit` | _noindex_ | — |
| Blog | `{Title} — MagicOFit Blog` | `{Article excerpt, 155 chars}` | `Article`, `BlogPosting` |

```typescript
// Structured data example for Product page
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title,
  image: product.images.map(i => i.url),
  description: product.description,
  brand: { "@type": "Brand", name: product.metadata.brand },
  sku: product.variants[0].sku,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: product.minPrice / 100,
    highPrice: product.maxPrice / 100,
    offerCount: product.variants.length,
    availability: product.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviewCount,
  },
};
```

---

## 6. Empty States & Error UX

Handling empty states elegantly is critical for retaining users instead of bouncing them.

### 6.1 Empty Cart
* **Visual:** Faded illustration of an empty shopping bag.
* **Copy:** "Your cart is lightweight right now."
* **CTA:** [Shop New Arrivals] (Primary), [View Best Sellers] (Secondary).
* **Cross-sell:** Show a "Trending Products" carousel below.

### 6.2 Empty Wishlist
* **Visual:** Heart icon with a line through it or shattered.
* **Copy:** "Nothing caught your eye yet?"
* **CTA:** [Explore Categories]

### 6.3 404 Error Page
* **Visual:** Athletic metaphor (e.g., a runner taking a wrong turn, or an empty track).
* **Copy:** "False Start! We couldn't find the page you're looking for."
* **CTA:** [Return to Homepage], plus an embedded search bar to find what they wanted.

### 6.4 No Search Results
* **Visual:** Magnifying glass over a shoe print.
* **Copy:** "We couldn't find matches for '{query}'."
* **UX Recovery:** Show typo suggestions via Meilisearch ("Did you mean 'Nike'?").
* **Cross-sell:** "While we look into that, check out our popular gear."

---

## 7. Loading Strategy & Skeletons

Instead of generic spinners, the UI must use predictive skeleton loaders to reduce perceived wait time.

### 7.1 Skeleton Implementations

* **Product Grid (Shop Page):** Show 8-12 blank cards with a pulsing gray image placeholder (`aspect-square`), a short text line placeholder (brand), a longer text line (title), and a small box (price).
* **Product Detail Page:** 
  * Main gallery: large pulsing square.
  * Title/Price area: pulsing bars representing text.
  * CTA: Full-width faded button with no text.
* **Cart Drawer:** Shows 3 skeleton line items (image box + two text lines).

### 7.2 Progressive Loading (Next.js Suspense)
* The overarching layout (Header, Nav, Footer, basic layout grid) loads immediately from the edge/static generation.
* Dynamic areas (Search results, Cart contents, User profile details) are wrapped in React `<Suspense>` boundaries with matching skeleton fallbacks.

---

## 8. Analytics & Tracking Architecture

Tracking is integrated primarily using server-side tracking where possible to ensure high high fidelity despite ad-blockers, combined with client-side events for immediate interactions.

### 8.1 Key Conversion Events (dataLayer)

| Event Name | Trigger | Properties Tracked |
|---|---|---|
| `view_item` | Product page loads | `currency`, `value`, `items[{item_id, item_name, category, price}]` |
| `add_to_cart` | Click on "Add to Cart" | `value`, `items[{id, name, variant, qty}]` |
| `remove_from_cart` | Delete item in drawer | `value`, `items[...]` |
| `begin_checkout` | Click Checkout from Cart | `value`, `coupon`, `items[...]` |
| `add_shipping_info` | Selected shipping tier | `shipping_tier` |
| `add_payment_info` | Selected payment type | `payment_type` |
| `purchase` | Order successful | `transaction_id`, `value`, `tax`, `shipping`, `currency`, `items[...]` |
| `whatsapp_opt_in` | User checks WhatsApp box | `phone_prefix`, `location` |
| `search` | User submits search | `search_term` |

### 8.2 Client-Side Engagement Tracking

* **Scroll Depth:** Track when users scroll 50%, 75%, and 90% down the Homepage or long Product Detail pages.
* **Hover intent:** Track when users hover over an item for more than 2 seconds but don't click (indicates interest, useful for retargeting).
* **Filter usage:** Track which facets users toggle in `/shop` to inform inventory/buying decisions.
