
export function isWhatsAppNotificationsEnabled() {
  return process.env.WHATSAPP_NOTIFICATIONS_ENABLED === "true";
}

export function normalizeEgyptWhatsAppNumber(input: string) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0020")) {
    return digits.slice(2);
  }

  if (digits.startsWith("20")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `20${digits.slice(1)}`;
  }

  if (digits.startsWith("1") && digits.length === 10) {
    return `20${digits}`;
  }

  return digits;
}

export async function evolutionSendText({
  baseUrl,
  apiKey,
  instance,
  number,
  text,
  timeoutMs = 15_000,
}: {
  baseUrl: string;
  apiKey: string;
  instance: string;
  number: string;
  text: string;
  timeoutMs?: number;
}) {
  const url = `${baseUrl.replace(/\/$/, "")}/message/sendText/${encodeURIComponent(instance)}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number,
        text,
        linkPreview: false,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Evolution API sendText failed: ${res.status} ${res.statusText} ${body}`);
    }

    return await res.json().catch(() => ({}));
  } finally {
    clearTimeout(t);
  }
}

export async function sendOrderCreatedWhatsApp({
  container,
  order,
}: {
  container: any;
  order: any;
}) {
  const baseUrl = process.env.EVOLUTION_API_BASE_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.WHATSAPP_INSTANCE;

  if (!baseUrl || !apiKey || !instance) {
    console.warn("WhatsApp notifications skipped: missing EVOLUTION_API_BASE_URL / EVOLUTION_API_KEY / WHATSAPP_INSTANCE");
    return;
  }

  const phoneRaw = order?.shipping_address?.phone;
  const number = phoneRaw ? normalizeEgyptWhatsAppNumber(phoneRaw) : null;

  if (!number) {
    console.warn(`WhatsApp notifications skipped: missing/invalid phone for order ${order?.id || ""}`);
    return;
  }

  const fullName = `${order?.shipping_address?.first_name || ""} ${order?.shipping_address?.last_name || ""}`.trim();
  const name = fullName || order?.customer?.first_name || "عميلنا";

  const displayId = order?.display_id ?? order?.id;
  const itemsText = Array.isArray(order?.items)
    ? order.items
        .slice(0, 6)
        .map((it: any) => {
          const title = it?.title || "منتج";
          const qty = it?.quantity ?? 1;
          return `- ${title} × ${qty}`;
        })
        .join("\n")
    : "";

  const text = `*تم تأكيد الطلب*\n\nمرحبًا ${name}،\n\nنشكرك على الشراء! رقم طلبك هو #${displayId}.\n\nسنبدأ في تجهيز طلبك وهو عبارة عن:\n${itemsText || "- (تفاصيل الطلب غير متاحة)"}\n\nتاريخ التوصيل المُقدّر: خلال 5 أيام\n\nسنخبرك عندما يتم شحن طلبك.`;

  try {
    await evolutionSendText({
      baseUrl,
      apiKey,
      instance,
      number,
      text,
    });

    console.log(`WhatsApp order confirmation sent for order ${order?.id || ""} to ${number}`);
  } catch (e: any) {
    console.error(`WhatsApp send failed for order ${order?.id || ""}: ${e?.message || e}`);
  }
}
