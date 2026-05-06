"use server";

import { cookies } from "next/headers";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const SESSION_COOKIE = "_medusa_jwt";

async function authenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_API_KEY,
    ...(options.headers as Record<string, string> || {}),
  };

  if (sessionCookie?.value) {
    headers["Authorization"] = `Bearer ${sessionCookie.value}`;
  }

  const response = await fetch(`${MEDUSA_BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Medusa API Error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export async function getCustomer() {
  try {
    const data: any = await authenticatedRequest("/store/customers/me");
    return { customer: data.customer || data, error: null };
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return { customer: null, error: error instanceof Error ? error.message : "Failed to fetch customer" };
  }
}

export async function updateCustomer(customerData: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}) {
  try {
    const data: any = await authenticatedRequest("/store/customers/me", {
      method: "POST",
      body: JSON.stringify(customerData),
    });
    return { customer: data.customer || data, error: null };
  } catch (error) {
    console.error("Failed to update customer:", error);
    return { customer: null, error: error instanceof Error ? error.message : "Failed to update customer" };
  }
}

export async function getOrders(limit = 50, offset = 0) {
  try {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    const data: any = await authenticatedRequest(`/store/customers/orders?${queryParams}`);
    return { orders: data.orders || [], count: data.count || 0, error: null };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { orders: [], count: 0, error: error instanceof Error ? error.message : "Failed to fetch orders" };
  }
}

export async function getOrder(orderId: string) {
  try {
    const data: any = await authenticatedRequest(`/store/orders/${orderId}`);
    return { order: data.order || data, error: null };
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return { order: null, error: error instanceof Error ? error.message : "Failed to fetch order" };
  }
}

export async function getCustomerAddresses() {
  try {
    const data: any = await authenticatedRequest("/store/customers/me/addresses");
    return { addresses: data.addresses || [], error: null };
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return { addresses: [], error: error instanceof Error ? error.message : "Failed to fetch addresses" };
  }
}

export async function createCustomerAddress(addressData: any) {
  try {
    const data: any = await authenticatedRequest("/store/customers/me/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
    return { address: data.address || data, error: null };
  } catch (error) {
    console.error("Failed to create address:", error);
    return { address: null, error: error instanceof Error ? error.message : "Failed to create address" };
  }
}
