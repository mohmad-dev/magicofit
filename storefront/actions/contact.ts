"use server";

import { medusaClient } from "@/lib/medusa-client";

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const res = await medusaClient.post("/store/contact-messages", formData);
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Failed to submit contact message in server action:", error);
    throw new Error(error.message || "Failed to submit message");
  }
}
