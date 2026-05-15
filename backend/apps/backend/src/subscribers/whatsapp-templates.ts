export interface WhatsAppTemplate {
  type: 'order_created';
  getText: (data: any) => string;
}

export const whatsappTemplates: Record<string, WhatsAppTemplate> = {
  order_created: {
    type: 'order_created',
    getText: (data) => {
      const { order } = data;
      const fullName = `${order?.shipping_address?.first_name || ""} ${order?.shipping_address?.last_name || ""}`.trim();
      const name = fullName || order?.customer?.first_name || "عميلنا العزيز";
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

      // Use subtotal for product price only (excluding shipping)
      const subtotal = order?.subtotal ? parseFloat(order.subtotal).toFixed(2) : "0";
      const currency = order?.currency_code || "EGP";

      return `*تم تأكيد طلبك* ✅

أهلاً يا ${name}،

شكراً لطلبك من الماجيكو للرياضة 🩵

رقم الطلب: #${displayId}

📦 المنتجات:
${itemsText || "- تفاصيل الطلب غير متاحة"}

💰 الإجمالي: ${subtotal} ${currency}

🚚 التوصيل من يوم ل 4 أيام

واتساب: 01148161968`;
    },
  },
};

export function getWhatsAppTemplate(type: string, data: any): string | null {
  const template = whatsappTemplates[type];
  if (!template) {
    console.warn(`WhatsApp template not found for type: ${type}`);
    return null;
  }
  return template.getText(data);
}
