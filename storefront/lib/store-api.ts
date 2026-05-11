import { medusaClient } from './medusa-client'
import type { MedusaProduct, MedusaCollection, MedusaCategory, MedusaCart, MedusaOrder, MedusaRegion } from './types/medusa'

// Products
export async function getProducts(params?: {
  limit?: number
  offset?: number
  category_id?: string[]
  collection_id?: string[]
  tags?: string[]
  region_id?: string
}): Promise<{ products: MedusaProduct[]; count: number }> {
  const queryParams = new URLSearchParams()
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  if (params?.category_id) params.category_id.forEach(id => queryParams.append('category_id[]', id))
  if (params?.collection_id) params.collection_id.forEach(id => queryParams.append('collection_id[]', id))
  if (params?.tags) params.tags.forEach(tag => queryParams.append('tags[]', tag))
  if (params?.region_id) queryParams.append('region_id', params.region_id)
  
  // Medusa v2 often needs specific fields for pricing
  queryParams.append('fields', '*variants.calculated_price,*categories,*collection')

  const queryString = queryParams.toString()
  const endpoint = `/store/products${queryString ? `?${queryString}` : ''}`

  console.log('=== GET PRODUCTS API ===');
  console.log('Endpoint:', endpoint);
  console.log('Params:', params);

  const result = await medusaClient.get<{ products: MedusaProduct[]; count: number }>(endpoint);
  
  console.log('Products returned:', result.products.length);
  if (params?.collection_id || params?.category_id) {
    console.log('Products with collection:', result.products.map(p => ({ id: p.id, title: p.title, collection: (p as any).collection })));
  }

  return result;
}

export async function getProductByHandle(handle: string, regionId?: string): Promise<MedusaProduct> {
  const queryParams = new URLSearchParams()
  queryParams.append('handle', handle)
  if (regionId) queryParams.append('region_id', regionId)
  queryParams.append('fields', '*variants.calculated_price,*variants.options,*variants.options.option,*categories,*variants.inventory_quantity')
  const queryString = queryParams.toString()
  const endpoint = `/store/products?${queryString}`
  return medusaClient.get<{ products: MedusaProduct[] }>(endpoint)
    .then(data => {
      if (!data.products || data.products.length === 0) {
        throw new Error(`Product with handle: ${handle} was not found`)
      }
      return data.products[0]
    })
}

export async function searchProducts(
  query: string,
  params?: {
    region_id?: string
  }
): Promise<{ products: MedusaProduct[]; count: number }> {
  const queryParams = new URLSearchParams()
  queryParams.append('q', query)
  if (params?.region_id) queryParams.append('region_id', params.region_id)
  // Ensure pricing fields are present in search results
  queryParams.append('fields', '*variants.calculated_price,*variants.prices')

  return medusaClient.get<{ products: MedusaProduct[]; count: number }>(
    `/store/products?${queryParams.toString()}`
  )
}

// Collections
export async function getCollections(): Promise<MedusaCollection[]> {
  return medusaClient.get<{ collections: MedusaCollection[] }>('/store/collections')
    .then(data => data.collections)
}

// Categories
export async function getCategories(): Promise<MedusaCategory[]> {
  return medusaClient.get<{ product_categories: MedusaCategory[] }>('/store/product-categories')
    .then(data => data.product_categories)
}

// Regions
export async function getRegions(): Promise<MedusaRegion[]> {
  return medusaClient.get<{ regions: MedusaRegion[] }>('/store/regions')
    .then(data => data.regions)
}

// Cart
export async function getCart(cartId: string): Promise<MedusaCart> {
  return medusaClient.get<MedusaCart>(`/store/carts/${cartId}`)
}

export async function createCart(): Promise<MedusaCart> {
  return medusaClient.post<MedusaCart>('/store/carts')
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<MedusaCart> {
  return medusaClient.post<MedusaCart>(`/store/carts/${cartId}/line-items`, {
    variant_id: variantId,
    quantity,
  })
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<MedusaCart> {
  return medusaClient.post<MedusaCart>(`/store/carts/${cartId}/line-items/${itemId}`, {
    quantity,
  })
}

export async function removeFromCart(cartId: string, itemId: string): Promise<MedusaCart> {
  return medusaClient.delete<MedusaCart>(`/store/carts/${cartId}/line-items/${itemId}`)
}

// Orders
export async function getOrders(limit = 10, offset = 0): Promise<{ orders: MedusaOrder[]; count: number }> {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  })

  return medusaClient.get<{ orders: MedusaOrder[]; count: number }>(`/store/customers/orders?${queryParams}`)
}

export async function getOrder(orderId: string): Promise<MedusaOrder> {
  return medusaClient.get<{ order: MedusaOrder }>(`/store/orders/${orderId}`)
    .then(data => data.order)
}

// Auth — Medusa v2 uses /auth/customer/emailpass for customer authentication
export async function login(email: string, password: string) {
  return medusaClient.post('/auth/customer/emailpass', { email, password })
}

export async function register(email: string, password: string, firstName?: string, lastName?: string) {
  // Step 1: Get registration token
  const tokenRes: any = await medusaClient.post('/auth/customer/emailpass/register', {
    email,
    password,
  })
  const token = tokenRes.token || tokenRes

  // Step 2: Create customer using the registration token
  return medusaClient.post('/store/customers', {
    email,
    first_name: firstName || '',
    last_name: lastName || '',
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// NOTE: Customer-related functions (getCustomer, updateCustomer, getOrders, etc.)
// have been moved to actions/customer.ts as server actions that properly
// pass the auth token. Use those instead of these client-side functions.
