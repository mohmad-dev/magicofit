export interface MedusaProduct {
  id: string
  title: string
  handle: string
  description: string | null
  subtitle: string | null
  thumbnail: string | null
  images: { id: string; url: string }[]
  variants: MedusaVariant[]
  options: MedusaOption[]
  categories?: MedusaCategory[]
  tags: MedusaTag[]
  material?: string
  weight?: number
  status: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaVariant {
  id: string
  title: string
  sku: string | null
  prices: MedusaPrice[]
  calculated_price?: {
    calculated_amount: number
    original_amount?: number
    currency_code: string
  }
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  options?: Array<{ id: string; value: string; option?: { id: string; title: string } }> | Record<string, string>
  created_at: string
  updated_at: string
}

export interface MedusaPrice {
  id: string
  amount: number
  currency_code: string
  created_at: string
  updated_at: string
}

export interface MedusaOption {
  id: string
  title: string
  values: MedusaOptionValue[]
}

export interface MedusaOptionValue {
  id: string
  value: string
}

export interface MedusaTag {
  id: string
  value: string
}

export interface MedusaCollection {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  created_at: string
  updated_at: string
}

export interface MedusaCategory {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  metadata?: Record<string, unknown> | null
  category_products?: { product_id: string }[]
  created_at: string
  updated_at: string
}

export interface MedusaRegion {
  id: string
  name: string
  currency_code: string
  countries: { iso_2: string }[]
}

export interface MedusaCart {
  id: string
  email: string | null
  items: MedusaCartItem[]
  region: MedusaRegion | null
  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  shipping_total: number
  created_at: string
  updated_at: string
}

export interface MedusaCartItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  total: number
  product: MedusaProduct
  variant: MedusaVariant
}

export interface MedusaOrder {
  id: string
  email: string
  status: string
  fulfillment_status: string
  payment_status: string
  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  shipping_total: number
  items: MedusaCartItem[]
  created_at: string
  updated_at: string
}
