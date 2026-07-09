"use server";

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

  try {
    const response = await fetch(`${backendUrl}/store/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
      },
      body: JSON.stringify(formData),
    });

    const json = await response.json();

    if (!response.ok) {
      const errMsg = json?.message || json?.error || `HTTP ${response.status}`;
      console.error("Contact message backend error:", errMsg, json);
      return { success: false, error: errMsg };
    }

    return { success: true, data: json };
  } catch (error: any) {
    console.error("Failed to submit contact message in server action:", error);
    return {
      success: false,
      error: error.message || "Failed to submit message",
    };
  }
}
