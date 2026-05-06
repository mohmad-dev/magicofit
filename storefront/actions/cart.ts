"use server";

import { cookies } from "next/headers";
import { createCart as createMedusaCart, getCart as getMedusaCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, updateCartItem } from "@/lib/store-api";
import { revalidateTag } from "next/cache";

const CART_COOKIE = "_medusa_cart_id";

export async function getCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) return null;

  try {
    const cart = await getMedusaCart(cartId);
    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function createCart() {
  try {
    const cart = await createMedusaCart();
    const cookieStore = await cookies();
    cookieStore.set(CART_COOKIE, cart.id, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return cart;
  } catch (error) {
    console.error("Error creating cart:", error);
    return null;
  }
}

export async function getOrSetCart() {
  const cart = await getCart();
  if (cart) return cart;
  return await createCart();
}

export async function addToCart({ variantId, quantity }: { variantId: string, quantity: number }) {
  const cart = await getOrSetCart();
  if (!cart) throw new Error("Could not manage cart");

  try {
    const updatedCart = await addToCartApi(cart.id, variantId, quantity);
    revalidateTag("cart", {});
    return updatedCart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function removeFromCart(lineItemId: string) {
  const cart = await getCart();
  if (!cart) throw new Error("Cart not found");

  try {
    const updatedCart = await removeFromCartApi(cart.id, lineItemId);
    revalidateTag("cart", {});
    return updatedCart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

export async function updateCartQuantity(lineItemId: string, quantity: number) {
  const cart = await getCart();
  if (!cart) throw new Error("Cart not found");

  try {
    const updatedCart = await updateCartItem(cart.id, lineItemId, quantity);
    revalidateTag("cart", {});
    return updatedCart;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
}
