import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medusaClient } from '@/lib/medusa-client';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
  variantId?: string;
  medusaLineItemId?: string;
}

interface CartState {
  items: CartItem[];
  medusaCartId: string | null;
  addItem: (item: Omit<CartItem, 'id' | 'medusaLineItemId'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  setMedusaCartId: (id: string | null) => void;
  syncWithMedusa: () => Promise<void>;
}

async function ensureMedusaCart(cartId: string | null): Promise<string> {
  if (cartId) {
    try {
      await medusaClient.get(`/store/carts/${cartId}`);
      return cartId;
    } catch {
      // Cart no longer exists, create new one
    }
  }
  const res: any = await medusaClient.post('/store/carts', {
    region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || undefined,
  });
  return res.cart?.id || res.id;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      medusaCartId: null,

      setMedusaCartId: (id) => {
        set({ medusaCartId: id });
      },

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.productId === item.productId && 
          i.variant?.size === item.variant?.size && 
          i.variant?.color === item.variant?.color
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });

          // Update existing Medusa line item quantity
          if (existingItem.medusaLineItemId && item.variantId) {
            const cartId = get().medusaCartId;
            if (cartId) {
              medusaClient.post(`/store/carts/${cartId}/line-items/${existingItem.medusaLineItemId}`, {
                quantity: newQuantity,
              }).catch(e => console.error("Medusa update existing item error:", e));
            }
          } else if (item.variantId) {
            // No medusaLineItemId yet — add as new line item
            const cartId = get().medusaCartId;
            ensureMedusaCart(cartId).then((newCartId) => {
              if (!get().medusaCartId) {
                set({ medusaCartId: newCartId });
              }
              return medusaClient.post(`/store/carts/${newCartId}/line-items`, {
                variant_id: item.variantId,
                quantity: newQuantity,
              });
            }).catch(e => console.error("Medusa add existing item sync error:", e));
          }
        } else {
          const newId = crypto.randomUUID();
          set({
            items: [...items, { ...item, id: newId }],
          });

          // Add new line item to Medusa and save medusaLineItemId
          if (item.variantId) {
            const cartId = get().medusaCartId;
            ensureMedusaCart(cartId).then((newCartId) => {
              if (!get().medusaCartId) {
                set({ medusaCartId: newCartId });
              }
              return medusaClient.post(`/store/carts/${newCartId}/line-items`, {
                variant_id: item.variantId,
                quantity: item.quantity,
              });
            }).then((res: any) => {
              const lineItem = res?.cart?.items?.slice(-1)[0] || res?.line_item || res;
              if (lineItem?.id) {
                set({
                  items: get().items.map((i) =>
                    i.id === newId
                      ? { ...i, medusaLineItemId: lineItem.id }
                      : i
                  ),
                });
              }
            }).catch(e => console.error("Medusa add item sync error:", e));
          }
        }
      },

      removeItem: (itemId) => {
        const item = get().items.find(i => i.id === itemId);
        set({ items: get().items.filter((item) => item.id !== itemId) });

        // Sync to Medusa in background
        if (item?.medusaLineItemId && get().medusaCartId) {
          medusaClient.delete(`/store/carts/${get().medusaCartId}/line-items/${item.medusaLineItemId}`)
            .catch(e => console.error("Medusa remove item sync error:", e));
        }
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const item = get().items.find(i => i.id === itemId);
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });

        // Sync to Medusa in background
        if (item?.medusaLineItemId && get().medusaCartId) {
          medusaClient.post(`/store/carts/${get().medusaCartId}/line-items/${item.medusaLineItemId}`, {
            quantity,
          }).catch(e => console.error("Medusa update quantity sync error:", e));
        }
      },

      clearCart: () => {
        set({ items: [], medusaCartId: null });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      syncWithMedusa: async () => {
        try {
          let cartId = get().medusaCartId;
          if (!cartId) {
            // Create cart if we have items but no Medusa cart yet
            if (get().items.length === 0) return;
            cartId = await ensureMedusaCart(null);
            set({ medusaCartId: cartId });
          }

          const res: any = await medusaClient.get(`/store/carts/${cartId}`);
          const cart = res.cart || res;
          if (!cart?.items) return;

          // Map Medusa cart items to local items
          const syncedItems: CartItem[] = cart.items.map((li: any) => ({
            id: li.id,
            productId: li.product_id || li.variant?.product_id || '',
            name: li.title || li.variant?.title || '',
            image: li.thumbnail || li.variant?.product?.thumbnail || '',
            price: (li.unit_price || 0) / 100,
            quantity: li.quantity,
            variantId: li.variant_id,
            medusaLineItemId: li.id,
          }));

          set({ items: syncedItems, medusaCartId: cartId });
        } catch (e) {
          console.error("Medusa cart sync error:", e);
          // Cart may have been deleted — reset medusaCartId so next action creates a new one
          set({ medusaCartId: null });
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
