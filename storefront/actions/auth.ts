"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE = "_medusa_jwt";
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

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
    throw new Error(`Medusa API Error: ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export async function sendWhatsAppOTP(phoneNumber: string) {
  try {
    await fetch(`${MEDUSA_BACKEND_URL}/auth/whatsapp/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Failed to send OTP", error);
    return { success: false, message: "Failed to send OTP" };
  }
}

export async function verifyWhatsAppOTP(phoneNumber: string, code: string) {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/auth/whatsapp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      body: JSON.stringify({ phone: phoneNumber, code }),
    });

    const data = await response.json();

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, data.token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return { success: true, customer: data.customer };
    }
    
    return { success: false, message: data.message || "Invalid OTP" };
  } catch (error) {
    console.error("Failed to verify OTP", error);
    return { success: false, message: "Verification failed" };
  }
}

export async function loginWithGoogle(idToken: string) {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await response.json();

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, data.token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return { success: true, customer: data.customer };
    }

    return { success: false, message: data.message || "Google authentication failed" };
  } catch (error) {
    console.error("Failed to authenticate with Google", error);
    return { success: false, message: "Google authentication failed" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function checkAuthStatus(): Promise<{ authenticated: boolean; customer?: any }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);
    if (!sessionCookie?.value) {
      return { authenticated: false };
    }

    // Validate session with Medusa backend (passing auth token)
    try {
      const customerData: any = await authenticatedRequest('/store/customers/me');
      const customer = customerData.customer || customerData;
      return { authenticated: true, customer };
    } catch {
      // Session token is invalid or expired
      cookieStore.delete(SESSION_COOKIE);
      return { authenticated: false };
    }
  } catch (error) {
    return { authenticated: false };
  }
}
