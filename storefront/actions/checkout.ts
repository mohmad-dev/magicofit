"use server";

import { medusaClient } from "@/lib/medusa-client";

interface CartItem {
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
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
}

// Arabic governorate name to shipping option code mapping
// Maps Arabic governorate name to the shipping option type code in Dashboard
const GOVERNORATE_TO_SHIPPING_CODE: Record<string, string> = {
  "القاهرة": "cairo",
  "الجيزة": "giza",
  "الإسكندرية": "alexandria",
  "القليوبية": "qalyubia",
  "الفيوم": "fayoum",
  "الفايوم": "fayoum", // Alternative spelling
  "بني سويف": "beni-suef",
  "المنيا": "minya",
  "أسيوط": "assiut",
  "سوهاج": "sohag",
  "قنا": "qena",
  "الأقصر": "luxor",
  "أسوان": "aswan",
  "الدقهلية": "dakahlia",
  "الشرقية": "sharqia",
  "كفر الشيخ": "kafr-el-sheikh",
  "الغربية": "gharbia",
  "المنوفية": "monufia",
  "البحيرة": "beheira",
  "دمياط": "damietta",
  "بورسعيد": "port-said",
  "الإسماعيلية": "ismailia",
  "السويس": "suez",
  "شمال سيناء": "north-sinai",
  "جنوب سيناء": "south-sinai",
  "البحر الأحمر": "red-sea",
  "الوادي الجديد": "new-valley",
  "مطروح": "matrouh",
};

interface CheckoutData {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  medusaCartId?: string | null;
}

export async function processDirectOrder(data: CheckoutData) {
  try {
    // 1. Use existing Medusa cart or create a new one
    let cartId: string;
    if (data.medusaCartId) {
      try {
        const existingCart: any = await medusaClient.get(`/store/carts/${data.medusaCartId}`);
        if (existingCart?.cart?.id || existingCart?.id) {
          cartId = existingCart.cart?.id || existingCart.id;
        } else {
          throw new Error("Cart not found");
        }
      } catch {
        // Cart no longer valid, create new one
        const cartRes: any = await medusaClient.post('/store/carts', {
          region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || undefined,
        });
        const cart = cartRes.cart || cartRes;
        cartId = cart.id;
      }
    } else {
      const cartRes: any = await medusaClient.post('/store/carts', {
        region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || undefined,
      });
      const cart = cartRes.cart || cartRes;
      if (!cart?.id) return { success: false, error: "Failed to create cart" };
      cartId = cart.id;
    }

    // 2. Add Line Items (only for new carts - existing carts already have items from cart-store sync)
    if (!data.medusaCartId) {
      for (const item of data.items) {
        if (item.variantId) {
          await medusaClient.post(`/store/carts/${cartId}/line-items`, {
            variant_id: item.variantId,
            quantity: item.quantity,
          }).catch(e => console.error("Medusa line item error:", e));
        }
      }
    }

    // 3. Update Cart with shipping details
    const finalEmail = data.shippingAddress.email || `whatsapp_${data.shippingAddress.phone}@magicofit.local`;

    await medusaClient.post(`/store/carts/${cartId}`, {
      email: finalEmail,
      shipping_address: {
        first_name: data.shippingAddress.fullName,
        last_name: ".",
        phone: data.shippingAddress.phone,
        address_1: data.shippingAddress.address,
        city: data.shippingAddress.city,
        country_code: "eg",
      },
    }).catch(e => console.error("Update cart error:", e));

    // 4. Add shipping method - match governorate to shipping option
    try {
      const shippingOptions: any = await medusaClient.get(
        `/store/shipping-options?cart_id=${cartId}`
      );
      const options = shippingOptions.shipping_options || shippingOptions;
      if (options && options.length > 0) {
        // Try to find the shipping option matching the selected governorate by code
        const shippingOptionCode = GOVERNORATE_TO_SHIPPING_CODE[data.shippingAddress.city];
        let selectedOption = options.find((opt: any) =>
          shippingOptionCode && opt.type?.code === shippingOptionCode
        );
        // Fallback to first option if no match found
        if (!selectedOption) {
          selectedOption = options[0];
        }
        await medusaClient.post(`/store/carts/${cartId}/shipping-methods`, {
          option_id: selectedOption.id,
        });
      }
    } catch (e) {
      console.error("Shipping method error:", e);
    }

    // 5. Create payment collection and initialize payment session (Medusa v2 flow)
    try {
      const pcRes: any = await medusaClient.post(`/store/payment-collections`, {
        cart_id: cartId,
      });
      const pcId = pcRes.payment_collection?.id;
      if (pcId) {
        await medusaClient.post(`/store/payment-collections/${pcId}/payment-sessions`, {
          provider_id: "pp_system_default",
        });
      }
    } catch (e) {
      console.error("Payment collection/session error:", e);
    }

    // 6. Complete the cart to create a real order in Medusa
    let orderId: string | number = Math.floor(100000 + Math.random() * 900000);
    let cartSummary: { subtotal: number; tax: number; shipping: number; total: number; currency_code: string } | null = null;
    try {
      // Fetch final cart state for tax/total info
      try {
        const finalCart: any = await medusaClient.get(`/store/carts/${cartId}`);
        const fc = finalCart.cart || finalCart;
        if (fc) {
          cartSummary = {
            subtotal: fc.subtotal || 0,
            tax: fc.tax_total || fc.tax || 0,
            shipping: fc.shipping_total || fc.shipping || 0,
            total: fc.total || 0,
            currency_code: fc.currency_code || "egp",
          };
        }
      } catch {
        // Continue without summary
      }

      console.log("=== COMPLETING CART ===");
      console.log("Cart ID:", cartId);

      const completeRes: any = await medusaClient.post(`/store/carts/${cartId}/complete`);
      console.log("=== COMPLETE RESPONSE ===");
      console.log(JSON.stringify(completeRes, null, 2));

      if (completeRes?.order?.id) {
        orderId = completeRes.order.id;
        console.log("✅ Order created in Medusa:", orderId);
      } else if (completeRes?.type === "order" && completeRes?.order) {
        orderId = completeRes.order.id;
        console.log("✅ Order created in Medusa:", orderId);
      } else if (completeRes?.type === "cart") {
        console.error("❌ Cart not completed - still a cart:", completeRes.cart?.id);
        console.error("Cart state:", completeRes.cart);
      } else {
        console.warn("⚠️ Unknown response:", JSON.stringify(completeRes).slice(0, 500));
      }
    } catch (completeError: any) {
      console.error("❌ Cart completion error:", completeError);
      console.error("Error details:", completeError?.response?.data || completeError?.message);
      return {
        success: false,
        cartId: cartId,
        orderId: orderId,
        cartSummary,
        error: "Cart completion failed: " + (completeError?.message || "Unknown error"),
      };
    }

    return { success: true, cartId: cartId, orderId, cartSummary };
  } catch (error) {
    console.error("Direct Order Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Order failed",
      orderId: Math.floor(100000 + Math.random() * 900000),
    };
  }
}
