# 02 — Data Schema & Inventory: MagicOFit Sports E-Commerce

> **Database**: PostgreSQL 16 via MedusaJS v2 (MikroORM)  
> **Design Goal**: Support complex sports product variants (Size × Color × Material × Grip) with bullet-proof inventory tracking to prevent overselling.

---

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────┐
│   Collection    │       │      Product         │       │  Product Image   │
│─────────────────│       │─────────────────────│       │──────────────────│
│ id (PK)         │       │ id (PK)              │       │ id (PK)          │
│ title           │──┐    │ title                │──────▷│ product_id (FK)  │
│ handle (unique) │  │    │ handle (unique)      │       │ url              │
│ description     │  │    │ subtitle             │       │ alt_text         │
│ thumbnail       │  │    │ description          │       │ rank (sort order)│
│ metadata (JSON) │  │    │ material             │       │ is_thumbnail     │
│ is_active       │  │    │ weight               │       │ metadata (JSON)  │
│ created_at      │  │    │ origin_country       │       │ created_at       │
│ updated_at      │  │    │ hs_code (customs)    │       └──────────────────┘
└─────────────────┘  │    │ status (draft/       │
                     │    │   published/archived)│       ┌──────────────────┐
┌─────────────────┐  │    │ discountable         │       │  Product Tag     │
│ Product_Collection│ │    │ metadata (JSON)      │       │──────────────────│
│ (Junction Table) │ │    │ type_id (FK)         │       │ id (PK)          │
│─────────────────│  │    │ category_id (FK)     │       │ value            │
│ product_id (FK) │──┘    │ created_at           │──────▷│                  │
│ collection_id(FK)│──────│ updated_at           │       └──────────────────┘
└─────────────────┘       │ deleted_at           │
                          └──────────┬───────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
              ┌──────▼──────────┐            ┌───────▼─────────────┐
              │ Product Option  │            │   Product Variant    │
              │─────────────────│            │─────────────────────│
              │ id (PK)         │            │ id (PK)              │
              │ product_id (FK) │            │ product_id (FK)      │
              │ title           │            │ title                │
              │ (e.g. "Size",   │            │ sku (unique)         │
              │  "Color",       │            │ barcode (unique)     │
              │  "Material")    │            │ ean                  │
              │ metadata (JSON) │            │ upc                  │
              │ created_at      │            │ hs_code              │
              └──────┬──────────┘            │ weight               │
                     │                       │ length               │
              ┌──────▼──────────┐            │ width                │
              │  Option Value   │            │ height               │
              │─────────────────│            │ mid_code             │
              │ id (PK)         │            │ material             │
              │ option_id (FK)  │            │ metadata (JSON)      │
              │ value           │◀──────────▷│ manage_inventory     │
              │ metadata (JSON) │  (M2M via  │ allow_backorder      │
              │ rank            │  variant_  │ inventory_quantity   │
              └─────────────────┘  option_   │ created_at           │
                                   value)    │ updated_at           │
                                             │ deleted_at           │
                                             └──────────┬───────────┘
                                                        │
                                    ┌───────────────────┴────────────────┐
                                    │                                    │
                             ┌──────▼──────────┐              ┌─────────▼──────────┐
                             │  Money Amount   │              │ Inventory Item     │
                             │  (Pricing)      │              │────────────────────│
                             │─────────────────│              │ id (PK)            │
                             │ id (PK)         │              │ sku                │
                             │ variant_id (FK) │              │ origin_country     │
                             │ currency_code   │              │ hs_code            │
                             │ amount          │              │ requires_shipping  │
                             │ min_quantity     │              │ metadata (JSON)    │
                             │ max_quantity     │              │ created_at         │
                             │ price_list_id   │              │ updated_at         │
                             │ region_id       │              └─────────┬──────────┘
                             │ created_at      │                        │
                             └─────────────────┘              ┌─────────▼──────────┐
                                                              │ Inventory Level    │
                                                              │────────────────────│
                                                              │ id (PK)            │
                                                              │ inventory_item_id  │
                                                              │ location_id (FK)   │
                                                              │ stocked_quantity   │
                                                              │ reserved_quantity  │
                                                              │ incoming_quantity  │
                                                              │ metadata (JSON)    │
                                                              │ created_at         │
                                                              │ updated_at         │
                                                              └──────────────────┘

┌──────────────────┐     ┌──────────────────┐      ┌──────────────────┐
│    Customer      │     │      Order       │      │   Order Item     │
│──────────────────│     │──────────────────│      │──────────────────│
│ id (PK)          │     │ id (PK)          │      │ id (PK)          │
│ email (unique)   │────▷│ customer_id (FK) │      │ order_id (FK)    │
│ first_name       │     │ display_id       │─────▷│ variant_id (FK)  │
│ last_name        │     │ status           │      │ title            │
│ phone            │     │ fulfillment_      │      │ quantity         │
│ has_account      │     │   status         │      │ unit_price       │
│ password_hash    │     │ payment_status   │      │ subtotal         │
│ metadata (JSON)  │     │ currency_code    │      │ tax_total        │
│ created_at       │     │ region_id (FK)   │      │ total            │
│ updated_at       │     │ email            │      │ discount_total   │
│ deleted_at       │     │ shipping_address │      │ metadata (JSON)  │
└──────────────────┘     │ billing_address  │      │ created_at       │
                         │ subtotal         │      └──────────────────┘
                         │ shipping_total   │
                         │ discount_total   │      ┌──────────────────┐
                         │ tax_total        │      │   Fulfillment    │
                         │ total            │      │──────────────────│
                         │ paid_total       │─────▷│ id (PK)          │
                         │ refunded_total   │      │ order_id (FK)    │
                         │ metadata (JSON)  │      │ provider_id      │
                         │ created_at       │      │ tracking_numbers │
                         │ updated_at       │      │ data (JSON)      │
                         │ canceled_at      │      │ shipped_at       │
                         └──────────────────┘      │ created_at       │
                                                   └──────────────────┘
```

---

## 2. Sports Product Variant System (Complex Variants)

### 2.1 The Challenge

Sports products require more variant dimensions than typical e-commerce:

| Product Type | Variant Dimensions | Example |
|---|---|---|
| Running Shoes | Size × Color × Width | Nike Pegasus 41 — Size 10, Black, Wide |
| Tennis Rackets | Grip Size × String Pattern × Weight | Wilson Pro Staff — Grip 3, 16×19, 315g |
| Cycling Jerseys | Size × Color × Fit | Castelli Aero — Medium, Red, Race Fit |
| Yoga Mats | Thickness × Material × Length | Manduka PRO — 6mm, Natural Rubber, 71" |
| Gym Gloves | Size × Material × Wrist Support | RDX F12 — Large, Leather, With Strap |
| Dumbbells | Weight × Material × Coating | Rogue — 25kg, Cast Iron, Rubber Coated |
| Compression Wear | Size × Color × Compression Level | 2XU — Medium, Black, Medical Grade |

### 2.2 Variant Data Model (MedusaJS)

```typescript
// Example: A Running Shoe with 3 option axes

// Product: "Nike Air Pegasus 41"
const product = {
  id: "prod_pegasus41",
  title: "Nike Air Pegasus 41",
  handle: "nike-air-pegasus-41",
  subtitle: "Road Running Shoes",
  description: "Responsive cushioning for everyday runs...",
  status: "published",
  material: "Mesh Upper, React Foam Midsole",
  weight: 280, // grams
  metadata: {
    sport: "running",
    gender: "unisex",
    terrain: "road",
    cushion_type: "neutral",
    drop_mm: 10,
    arch_support: "medium",
    brand: "Nike",
  },
};

// Product Options (dimensions of variation)
const options = [
  {
    id: "opt_size",
    product_id: "prod_pegasus41",
    title: "Size",
    values: [
      { id: "optval_38", value: "38" },
      { id: "optval_39", value: "39" },
      { id: "optval_40", value: "40" },
      { id: "optval_41", value: "41" },
      { id: "optval_42", value: "42" },
      { id: "optval_43", value: "43" },
      { id: "optval_44", value: "44" },
      { id: "optval_45", value: "45" },
      { id: "optval_46", value: "46" },
    ],
  },
  {
    id: "opt_color",
    product_id: "prod_pegasus41",
    title: "Color",
    values: [
      { id: "optval_black", value: "Black/White", metadata: { hex: "#1a1a1a", swatch: "/swatches/black-white.jpg" } },
      { id: "optval_blue",  value: "Navy Blue",   metadata: { hex: "#1e3a5f", swatch: "/swatches/navy-blue.jpg" } },
      { id: "optval_green", value: "Forest Green", metadata: { hex: "#2d5016", swatch: "/swatches/forest-green.jpg" } },
    ],
  },
  {
    id: "opt_width",
    product_id: "prod_pegasus41",
    title: "Width",
    values: [
      { id: "optval_standard", value: "Standard (D)" },
      { id: "optval_wide",     value: "Wide (2E)" },
      { id: "optval_extrawide", value: "Extra Wide (4E)" },
    ],
  },
];

// One variant = one unique combination (Size × Color × Width)
const variants = [
  {
    id: "var_pegasus41_38_black_standard",
    product_id: "prod_pegasus41",
    title: "38 / Black/White / Standard",
    sku: "NKE-PEG41-38-BLK-STD",
    barcode: "0194956789012",
    manage_inventory: true,
    allow_backorder: false,
    inventory_quantity: 15,
    options: [
      { option_id: "opt_size",  value: "38" },
      { option_id: "opt_color", value: "Black/White" },
      { option_id: "opt_width", value: "Standard (D)" },
    ],
    prices: [
      { currency_code: "USD", amount: 13000 }, // $130.00 (cents)
      { currency_code: "EUR", amount: 12500 },
      { currency_code: "SAR", amount: 48750 },
    ],
  },
  // ... repeat for all valid combinations
];
```

### 2.3 Sport-Specific Metadata Schema

```typescript
// Unified metadata schema stored in product.metadata JSON field
interface SportProductMetadata {
  // Common
  brand: string;
  sport: SportType;        // "running" | "tennis" | "cycling" | "yoga" | "gym" | "swimming" | "football"
  gender: GenderType;      // "men" | "women" | "unisex" | "kids"
  skill_level?: SkillLevel; // "beginner" | "intermediate" | "advanced" | "pro"
  season?: string;         // "summer_2025" | "all_season"

  // Running-specific
  terrain?: "road" | "trail" | "track";
  cushion_type?: "neutral" | "stability" | "motion_control";
  drop_mm?: number;

  // Tennis-specific
  string_pattern?: string;  // "16x19" | "18x20"
  head_size_sq_in?: number;
  balance?: "head_heavy" | "head_light" | "even";
  swing_weight?: number;

  // Cycling-specific
  fit_type?: "race" | "regular" | "relaxed";
  chamois_padding?: boolean;
  reflective?: boolean;

  // Gym/Fitness-specific
  weight_kg?: number;
  resistance_level?: "light" | "medium" | "heavy" | "extra_heavy";
  material_type?: string;

  // Care & Compliance
  care_instructions?: string[];
  certifications?: string[];  // "OEKO-TEX", "Bluesign", "Fair Trade"
}
```

---

## 3. Collection & Category Hierarchy

### 3.1 Category Tree

```
Sports Store
├── 👟 Footwear
│   ├── Running Shoes
│   │   ├── Road Running
│   │   ├── Trail Running
│   │   └── Track & Field
│   ├── Training Shoes
│   │   ├── Cross Training
│   │   └── Weightlifting
│   ├── Sport-Specific Shoes
│   │   ├── Tennis Shoes
│   │   ├── Football Boots
│   │   ├── Basketball Shoes
│   │   └── Cycling Shoes
│   └── Casual/Recovery
│       ├── Slides
│       └── Recovery Shoes
│
├── 👕 Apparel
│   ├── Tops
│   │   ├── T-Shirts & Tanks
│   │   ├── Long Sleeves
│   │   ├── Hoodies & Jackets
│   │   └── Compression Tops
│   ├── Bottoms
│   │   ├── Shorts
│   │   ├── Leggings & Tights
│   │   ├── Joggers & Pants
│   │   └── Compression Bottoms
│   ├── Sports Bras
│   ├── Outerwear
│   │   ├── Windbreakers
│   │   ├── Rain Jackets
│   │   └── Insulated Jackets
│   └── Swimwear
│       ├── Performance Swimsuits
│       └── Rash Guards
│
├── 🎒 Equipment
│   ├── Gym Equipment
│   │   ├── Dumbbells & Weights
│   │   ├── Kettlebells
│   │   ├── Resistance Bands
│   │   ├── Pull-up Bars
│   │   └── Benches & Racks
│   ├── Racket Sports
│   │   ├── Tennis Rackets
│   │   ├── Badminton Rackets
│   │   └── Table Tennis
│   ├── Yoga & Pilates
│   │   ├── Yoga Mats
│   │   ├── Yoga Blocks
│   │   └── Pilates Rings
│   ├── Recovery & Wellness
│   │   ├── Foam Rollers
│   │   ├── Massage Guns
│   │   └── Ice Baths
│   └── Bags & Storage
│       ├── Gym Bags
│       ├── Backpacks
│       └── Shoe Bags
│
├── 🧤 Accessories
│   ├── Gloves
│   ├── Socks
│   ├── Headbands & Caps
│   ├── Watches & Trackers
│   ├── Water Bottles
│   ├── Sunglasses
│   └── Belts & Supports
│
└── 🏷️ Collections (Curated)
    ├── New Arrivals
    ├── Best Sellers
    ├── Sale / Clearance
    ├── Summer Essentials
    ├── Marathon Training Kit
    ├── Home Gym Starter Pack
    └── Gift Guide
```

### 3.2 Collection Types in MedusaJS

```typescript
// Automatic collections (rule-based)
const autoCollections = [
  {
    title: "New Arrivals",
    handle: "new-arrivals",
    type: "automatic",
    rules: [{ field: "created_at", operator: "gte", value: "30_days_ago" }],
  },
  {
    title: "Best Sellers",
    handle: "best-sellers",
    type: "automatic",
    rules: [{ field: "metadata.total_sold", operator: "gte", value: 100 }],
  },
  {
    title: "On Sale",
    handle: "sale",
    type: "automatic",
    rules: [{ field: "metadata.on_sale", operator: "eq", value: true }],
  },
];

// Manual collections (hand-curated by admin)
const manualCollections = [
  {
    title: "Marathon Training Kit",
    handle: "marathon-training-kit",
    type: "manual",
    products: ["prod_pegasus41", "prod_shorts_001", "prod_socks_002", "prod_belt_003"],
  },
];
```

---

## 4. Inventory Tracking System (Anti-Overselling)

### 4.1 Inventory Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    INVENTORY TRACKING                          │
│                                                                │
│  Each Product Variant → 1 Inventory Item → N Inventory Levels │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Inventory Level (per Location)                           │  │
│  │                                                          │  │
│  │  stocked_quantity    = Total physical units in warehouse  │  │
│  │  reserved_quantity   = Units reserved by unpaid orders    │  │
│  │  incoming_quantity   = Units on order from supplier       │  │
│  │                                                          │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │ AVAILABLE = stocked - reserved                    │   │  │
│  │  │ This is what the customer sees                    │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Inventory State Machine

```
                        ┌──────────────┐
            Supplier    │   INCOMING   │   Purchase order placed
            ships  ────▶│  (incoming   │◀── to supplier
                        │   _quantity) │
                        └──────┬───────┘
                               │ Goods received
                               ▼
                        ┌──────────────┐
                        │   STOCKED    │   Physical count
                        │  (stocked    │   in warehouse
                        │   _quantity) │
                        └──────┬───────┘
                               │ Customer places order
                               ▼
                        ┌──────────────┐
          Payment       │   RESERVED   │   Order created,
          confirmed ───▶│  (reserved   │   awaiting payment
                        │   _quantity) │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌──────────┐         ┌──────────────┐
             │  SOLD    │         │  RELEASED    │
             │ (stocked │         │ (reserved    │  Payment failed /
             │  -= qty) │         │  -= qty,     │  Order cancelled
             │ (reserved│         │  available   │
             │  -= qty) │         │  restored)   │
             └──────────┘         └──────────────┘
```

### 4.3 Anti-Overselling Strategy

#### Layer 1: Database-Level Protection

```sql
-- PostgreSQL constraint: reserved can never exceed stocked
ALTER TABLE inventory_level
ADD CONSTRAINT check_reserved_not_exceeding_stocked
CHECK (reserved_quantity <= stocked_quantity);

-- PostgreSQL constraint: quantities are never negative
ALTER TABLE inventory_level
ADD CONSTRAINT check_non_negative_quantities
CHECK (
  stocked_quantity >= 0
  AND reserved_quantity >= 0
  AND incoming_quantity >= 0
);
```

#### Layer 2: Atomic Reservation with Row-Level Locking

```typescript
// backend/src/workflows/reserve-inventory.ts
import { createWorkflow, createStep } from "@medusajs/workflows-sdk";

const reserveInventoryStep = createStep(
  "reserve-inventory",
  async ({ items }: { items: { variant_id: string; quantity: number }[] }, context) => {
    const inventoryService = context.container.resolve("inventoryService");

    // Use database transaction with row-level lock
    return await context.container.resolve("manager").transaction(async (transactionManager) => {
      const reservations = [];

      for (const item of items) {
        // SELECT ... FOR UPDATE — locks the row to prevent concurrent reads
        const inventoryLevel = await transactionManager.query(
          `SELECT * FROM inventory_level
           WHERE inventory_item_id = (
             SELECT inventory_item_id FROM product_variant_inventory_item
             WHERE variant_id = $1
           )
           FOR UPDATE`,
          [item.variant_id]
        );

        const available = inventoryLevel[0].stocked_quantity - inventoryLevel[0].reserved_quantity;

        if (available < item.quantity) {
          throw new Error(
            `Insufficient inventory for variant ${item.variant_id}. ` +
            `Available: ${available}, Requested: ${item.quantity}`
          );
        }

        // Atomic reservation
        await transactionManager.query(
          `UPDATE inventory_level
           SET reserved_quantity = reserved_quantity + $1,
               updated_at = NOW()
           WHERE inventory_item_id = (
             SELECT inventory_item_id FROM product_variant_inventory_item
             WHERE variant_id = $2
           )`,
          [item.quantity, item.variant_id]
        );

        reservations.push({
          variant_id: item.variant_id,
          quantity: item.quantity,
        });
      }

      return reservations;
    });
  },
  // Compensating action: release inventory if later steps fail
  async (reservations, context) => {
    if (!reservations) return;

    const manager = context.container.resolve("manager");
    await manager.transaction(async (transactionManager) => {
      for (const res of reservations) {
        await transactionManager.query(
          `UPDATE inventory_level
           SET reserved_quantity = reserved_quantity - $1,
               updated_at = NOW()
           WHERE inventory_item_id = (
             SELECT inventory_item_id FROM product_variant_inventory_item
             WHERE variant_id = $2
           )`,
          [res.quantity, res.variant_id]
        );
      }
    });
  }
);
```

#### Layer 3: Frontend Real-Time Availability

```typescript
// components/product/StockIndicator.tsx
"use client";

interface StockIndicatorProps {
  availableQuantity: number;
  lowStockThreshold?: number; // default: 5
}

export function StockIndicator({
  availableQuantity,
  lowStockThreshold = 5,
}: StockIndicatorProps) {
  if (availableQuantity <= 0) {
    return (
      <div className="stock-indicator stock-indicator--out">
        <span className="stock-dot stock-dot--red" />
        Out of Stock
      </div>
    );
  }

  if (availableQuantity <= lowStockThreshold) {
    return (
      <div className="stock-indicator stock-indicator--low">
        <span className="stock-dot stock-dot--orange" />
        Only {availableQuantity} left — order soon!
      </div>
    );
  }

  return (
    <div className="stock-indicator stock-indicator--in">
      <span className="stock-dot stock-dot--green" />
      In Stock
    </div>
  );
}
```

#### Layer 4: Cart Validation Before Payment

```typescript
// backend/src/workflows/validate-cart-inventory.ts
async function validateCartBeforePayment(cartId: string) {
  const cart = await cartService.retrieve(cartId, {
    relations: ["items", "items.variant"],
  });

  const issues: string[] = [];

  for (const item of cart.items) {
    const available = await getAvailableQuantity(item.variant_id);

    if (available < item.quantity) {
      if (available === 0) {
        issues.push(`"${item.title}" is now out of stock.`);
        await cartService.removeLineItem(cartId, item.id);
      } else {
        issues.push(
          `"${item.title}" only has ${available} units available. Quantity adjusted.`
        );
        await cartService.updateLineItem(cartId, item.id, {
          quantity: available,
        });
      }
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues, updatedCart: await cartService.retrieve(cartId) };
  }

  return { valid: true, issues: [], updatedCart: cart };
}
```

#### Layer 5: Abandoned Reservation Cleanup

```typescript
// backend/src/jobs/cleanup-abandoned-reservations.ts
// Runs every 30 minutes via MedusaJS scheduled jobs

export default async function cleanupAbandonedReservations(container) {
  const manager = container.resolve("manager");

  // Release inventory reserved by carts older than 30 minutes with no payment
  const abandonedCarts = await manager.query(
    `SELECT c.id, li.variant_id, li.quantity
     FROM cart c
     JOIN line_item li ON li.cart_id = c.id
     WHERE c.payment_id IS NULL
       AND c.completed_at IS NULL
       AND c.updated_at < NOW() - INTERVAL '30 minutes'
       AND li.variant_id IS NOT NULL`
  );

  for (const cart of abandonedCarts) {
    await manager.query(
      `UPDATE inventory_level
       SET reserved_quantity = GREATEST(reserved_quantity - $1, 0),
           updated_at = NOW()
       WHERE inventory_item_id = (
         SELECT inventory_item_id FROM product_variant_inventory_item
         WHERE variant_id = $2
       )`,
      [cart.quantity, cart.variant_id]
    );
  }

  console.log(`Released inventory from ${abandonedCarts.length} abandoned cart items.`);
}
```

---

## 5. Order Data Model

### 5.1 Order Status Flow

```
                    ┌──────────────┐
                    │   PENDING    │  Cart → Order created
                    │              │  (inventory reserved)
                    └──────┬───────┘
                           │ Payment processed
                           ▼
                    ┌──────────────┐
                    │  COMPLETED   │  Payment confirmed
                    │              │  (inventory deducted from stocked)
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌───────────┐ ┌──────────┐ ┌──────────┐
       │ FULFILLED │ │ PARTIALLY│ │ SHIPPED  │
       │           │ │ FULFILLED│ │          │
       └───────────┘ └──────────┘ └──────────┘
              │            │            │
              └────────────┼────────────┘
                           ▼
                    ┌──────────────┐
                    │  DELIVERED   │
                    └──────────────┘

  Cancellation/Return:
       COMPLETED → CANCELED    (full inventory release)
       DELIVERED → RETURN_REQUESTED → RETURNED (inventory restocked)
       DELIVERED → PARTIALLY_RETURNED
```

### 5.2 Payment Status Flow

```
  NOT_PAID → AWAITING → CAPTURED → (optional) PARTIALLY_REFUNDED → REFUNDED
                  │
                  └── CANCELED (payment failed / user canceled)
```

### 5.3 Order Analytics Fields

```typescript
// Stored in order.metadata for analytics
interface OrderAnalytics {
  // Attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_page?: string;

  // Device
  device_type: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;

  // Timing
  time_to_purchase_minutes: number;   // first visit → order
  cart_created_at: string;
  checkout_started_at: string;

  // Conversion
  coupon_code_used?: string;
  discount_amount: number;
  is_first_order: boolean;
  customer_lifetime_value: number;
}
```

---

## 6. Customer Data Model

### 6.1 Customer Profile

```typescript
interface CustomerProfile {
  // Core (MedusaJS built-in)
  id: string;
  // ⚠️ Phone is PRIMARY identifier — login via WhatsApp OTP
  phone: string;            // required, unique, E.164 format e.g. "+966501234567"
  email?: string;           // optional (secondary, not used for login)
  first_name: string;
  last_name: string;
  has_account: boolean;

  // Addresses (one-to-many)
  shipping_addresses: Address[];
  billing_address?: Address;

  // Extended metadata
  metadata: {
    // Auth
    whatsapp_opted_in: boolean;     // consent to receive WhatsApp messages
    whatsapp_opt_in_date: string;   // ISO timestamp of consent
    last_otp_sent_at?: string;      // rate-limit OTP sends (max 3 per 10 min)

    // Preferences
    preferred_sizes: {
      shoes?: string;      // "42"
      tops?: string;       // "L"
      bottoms?: string;    // "M"
    };
    preferred_sports: string[];     // ["running", "gym", "yoga"]
    favorite_brands: string[];      // ["Nike", "Adidas"]
    preferred_locale: string;       // "en" | "ar"

    // Marketing
    sms_marketing_consent: boolean;
    consent_date: string;

    // Loyalty
    loyalty_points: number;
    loyalty_tier: "bronze" | "silver" | "gold" | "platinum";
    total_orders: number;
    total_spent: number;            // in default currency (cents)
    first_order_date: string;
    last_order_date: string;

    // Wishlist
    wishlist_ids: string[];         // product variant IDs
  };
}
```

---

## 7. Search Index Schema (Meilisearch)

```typescript
// Meilisearch index configuration
const productsIndex = {
  uid: "products",
  primaryKey: "id",

  // Searchable attributes (priority order)
  searchableAttributes: [
    "title",
    "brand",
    "description",
    "category",
    "sport",
    "tags",
    "sku",
  ],

  // Faceted / filterable attributes
  filterableAttributes: [
    "category_handle",       // "running-shoes"
    "collection_handles",    // ["new-arrivals", "best-sellers"]
    "brand",                 // "Nike"
    "sport",                 // "running"
    "gender",                // "men"
    "price_usd",             // 13000 (cents for range filter)
    "sizes",                 // ["38", "39", "40", ...]
    "colors",                // ["Black", "Blue", ...]
    "material",              // "Mesh"
    "in_stock",              // true/false
    "on_sale",               // true/false
    "rating",                // 4.5
    "created_at_timestamp",  // for sorting by newness
  ],

  // Sortable attributes
  sortableAttributes: [
    "price_usd",
    "created_at_timestamp",
    "rating",
    "total_sold",
  ],

  // Ranking rules (priority order)
  rankingRules: [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
    "total_sold:desc",  // popular items rank higher by default
  ],

  // Typo tolerance
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: {
      oneTypo: 4,
      twoTypos: 8,
    },
  },

  // Synonyms
  synonyms: {
    "sneakers": ["shoes", "trainers", "kicks"],
    "tights": ["leggings", "compression pants"],
    "hoodie": ["sweatshirt", "pullover"],
    "weights": ["dumbbells", "barbells"],
    "mat": ["yoga mat", "exercise mat"],
  },
};

// Document shape indexed into Meilisearch
interface SearchableProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string;
  brand: string;
  sport: string;
  gender: string;
  category: string;
  category_handle: string;
  collection_handles: string[];
  tags: string[];
  material: string;
  sizes: string[];
  colors: string[];
  price_usd: number;         // min price in cents
  compare_at_price: number;  // original price if on sale
  in_stock: boolean;
  on_sale: boolean;
  rating: number;
  review_count: number;
  total_sold: number;
  sku: string;               // main variant SKU
  created_at_timestamp: number;
}
```

---

## 8. Data Seeding Strategy

```typescript
// Seed data for demo / development
const seedPlan = {
  categories: 25,          // Full category tree
  collections: 12,         // 5 auto + 7 manual
  products: 200,           // Across all categories
  variantsPerProduct: 8,   // avg (Size × Color combinations)
  totalVariants: 1600,     // 200 × 8
  customers: 50,           // Demo accounts
  orders: 300,             // Historical orders for analytics
  reviews: 500,            // Product reviews
  images_per_product: 5,   // Gallery images
};
```

> **Note**: Seed scripts should be idempotent and support incremental updates. Use MedusaJS's built-in seed mechanism (`medusa seed -f seed.json`) for initial data load.

---

## 9. Reviews & Ratings Schema

### 9.1 Database Tables

```sql
-- Product Reviews Table
CREATE TABLE product_review (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  customer_id      TEXT REFERENCES customer(id) ON DELETE SET NULL,
  order_id         TEXT REFERENCES "order"(id) ON DELETE SET NULL,

  -- Review Content
  rating           SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title            VARCHAR(120),
  body             TEXT,

  -- Verified Purchase
  is_verified      BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE if customer_id + order_id confirm purchase

  -- Reviewer info (for guests / display)
  display_name     VARCHAR(80),                     -- e.g. "Mohammed A."

  -- Variant context (what they bought)
  variant_size     VARCHAR(20),                     -- "42"
  variant_color    VARCHAR(50),                     -- "Black/White"
  fit_feedback     TEXT CHECK (fit_feedback IN ('runs_small','true_to_size','runs_large')),

  -- Media
  photos           TEXT[],                          -- Array of R2/S3 URLs

  -- Moderation
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected','spam')),
  rejection_reason TEXT,

  -- Helpfulness
  helpful_count    INT NOT NULL DEFAULT 0,
  unhelpful_count  INT NOT NULL DEFAULT 0,

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpfulness votes (prevent duplicate votes)
CREATE TABLE review_vote (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID NOT NULL REFERENCES product_review(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  is_helpful  BOOLEAN NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (review_id, customer_id)       -- one vote per customer per review
);

-- Aggregate ratings (materialized, updated via trigger)
CREATE TABLE product_rating_aggregate (
  product_id      TEXT PRIMARY KEY REFERENCES product(id) ON DELETE CASCADE,
  average_rating  NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count    INT NOT NULL DEFAULT 0,
  rating_1_count  INT NOT NULL DEFAULT 0,
  rating_2_count  INT NOT NULL DEFAULT 0,
  rating_3_count  INT NOT NULL DEFAULT 0,
  rating_4_count  INT NOT NULL DEFAULT 0,
  rating_5_count  INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to keep aggregate fresh on every approved review
CREATE OR REPLACE FUNCTION refresh_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO product_rating_aggregate (product_id, average_rating, review_count,
    rating_1_count, rating_2_count, rating_3_count, rating_4_count, rating_5_count, updated_at)
  SELECT
    NEW.product_id,
    ROUND(AVG(rating)::NUMERIC, 2),
    COUNT(*),
    COUNT(*) FILTER (WHERE rating = 1),
    COUNT(*) FILTER (WHERE rating = 2),
    COUNT(*) FILTER (WHERE rating = 3),
    COUNT(*) FILTER (WHERE rating = 4),
    COUNT(*) FILTER (WHERE rating = 5),
    NOW()
  FROM product_review
  WHERE product_id = NEW.product_id AND status = 'approved'
  ON CONFLICT (product_id) DO UPDATE SET
    average_rating  = EXCLUDED.average_rating,
    review_count    = EXCLUDED.review_count,
    rating_1_count  = EXCLUDED.rating_1_count,
    rating_2_count  = EXCLUDED.rating_2_count,
    rating_3_count  = EXCLUDED.rating_3_count,
    rating_4_count  = EXCLUDED.rating_4_count,
    rating_5_count  = EXCLUDED.rating_5_count,
    updated_at      = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_refresh_product_rating
AFTER INSERT OR UPDATE ON product_review
FOR EACH ROW EXECUTE FUNCTION refresh_product_rating();

-- Indexes
CREATE INDEX idx_review_product   ON product_review(product_id, status, created_at DESC);
CREATE INDEX idx_review_customer  ON product_review(customer_id);
CREATE INDEX idx_review_order     ON product_review(order_id);
```

### 9.2 Review Submission Flow

```
Customer places order
  └── order.delivered event
        └── After 3 days → Send WhatsApp: "كيف كانت تجربتك؟ اترك تقييماً" + link
              └── Customer clicks link → /reviews/new?order_id=xxx
                    ├── Verify customer owns order
                    ├── Mark is_verified = TRUE
                    ├── Status = 'pending' → Admin reviews
                    └── On approval → update product_rating_aggregate
```

---

## 10. Coupons & Promotions Schema

### 10.1 Coupon Types (MedusaJS Promotion Module)

| Type | Example | Use Case |
|---|---|---|
| `percentage` | 20% off | Sale events, first order |
| `fixed` | $15 off orders > $100 | Loyalty reward |
| `free_shipping` | Free shipping | Cart abandonment recovery |
| `buy_x_get_y` | Buy 2 get 1 free | Bundle promotions |

### 10.2 Coupon Database Extension

```sql
-- Extended coupon tracking (on top of MedusaJS discount tables)
CREATE TABLE coupon_usage_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id  TEXT NOT NULL,              -- MedusaJS discount.id
  code         VARCHAR(50) NOT NULL,
  customer_id  TEXT REFERENCES customer(id),
  order_id     TEXT REFERENCES "order"(id),
  discount_amount_cents INT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  used_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupon_usage_customer ON coupon_usage_log(customer_id);
CREATE INDEX idx_coupon_usage_code     ON coupon_usage_log(code);
```

### 10.3 Promotion Rules

```typescript
// Standard promotions to configure in MedusaJS admin
const promotions = [
  {
    code: "MAGIC100",
    type: "free_shipping",
    condition: "order_subtotal >= 10000",  // $100 in cents
    description: "Free shipping on orders over $100",
    is_permanent: true,
  },
  {
    code: "WELCOME15",
    type: "percentage",
    value: 15,
    condition: "is_first_order === true",
    description: "15% off first order — newsletter signup",
    usage_limit: 1,          // per customer
    starts_at: null,
    ends_at: null,
  },
  {
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    condition: "order_subtotal >= 15000",  // $150 minimum
    description: "Summer sale — 25% off orders above $150",
    starts_at: "2025-06-01T00:00:00Z",
    ends_at: "2025-08-31T23:59:59Z",
    usage_limit: null,        // unlimited uses
  },
  {
    code: "CART10",
    type: "fixed",
    value: 1000,              // $10
    condition: "order_subtotal >= 5000",   // $50 minimum
    description: "Abandoned cart recovery — $10 off",
    usage_limit: 1,
    is_dynamic: true,         // generated per-customer for WhatsApp messages
  },
];
```
