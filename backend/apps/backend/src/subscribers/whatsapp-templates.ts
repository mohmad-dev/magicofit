export interface WhatsAppTemplate {
  type: 'order_created' | 'order_shipped' | 'order_delivered';
  getText: (data: any) => string;
}

export const whatsappTemplates: Record<string, WhatsAppTemplate> = {
  order_created: {
    type: 'order_created',
    getText: (data) => {
      const { order } = data;
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

      const total = order?.total || order?.amount || "0";
      const currency = order?.currency_code || "EGP";

      return `*تم تأكيد الطلب* ✅

مرحبًا ${name}،

نشكرك على الشراء! رقم طلبك هو #${displayId}.

📦 تفاصيل الطلب:
${itemsText || "- (تفاصيل الطلب غير متاحة)"}

💰 الإجمالي: ${total} ${currency}

🚚 تاريخ التوصيل المُقدّر: خلال 5 أيام

سنخبرك عندما يتم شحن طلبك.

شكراً لاختيارك MagicOFit! 🏆`;
    },
  },
  order_shipped: {
    type: 'order_shipped',
    getText: (data) => {
      const { order, trackingNumber, carrier } = data;
      const fullName = `${order?.shipping_address?.first_name || ""} ${order?.shipping_address?.last_name || ""}`.trim();
      const name = fullName || order?.customer?.first_name || "عميلنا";
      const displayId = order?.display_id ?? order?.id;

      return `*تم شحن طلبك* 🚚

مرحبًا ${name}،

تم شحن طلبك #${displayId} بنجاح!

📦 شركة الشحن: ${carrier || "قيد المعالجة"}
🔢 رقم التتبع: ${trackingNumber || "سيتم إرساله قريباً"}

📍 عنوان التوصيل:
${order?.shipping_address?.address_1 || ""}
${order?.shipping_address?.city || ""} - ${order?.shipping_address?.country_code || ""}

يمكنك تتبع طلبك من خلال الرابط:
https://magicofit.shop/orders/${displayId}

شكراً لصبرك! 🙏`;
    },
  },
  order_delivered: {
    type: 'order_delivered',
    getText: (data) => {
      const { order } = data;
      const fullName = `${order?.shipping_address?.first_name || ""} ${order?.shipping_address?.last_name || ""}`.trim();
      const name = fullName || order?.customer?.first_name || "عميلنا";
      const displayId = order?.display_id ?? order?.id;

      return `*تم وصول طلبك* 🎉

مرحبًا ${name}،

نأمل أن تكون قد استلمت طلبك #${displayId} بسلام!

✅ إذا كان كل شيء على ما يرام، نود أن نسمع رأيك:
https://magicofit.shop/orders/${displayId}/review

❓ إذا كان هناك أي مشكلة، لا تتردد في التواصل معنا:
📱 واتساب: 01091998631
📧 البريد: support@magicofit.com

شكراً لاختيارك MagicOFit! 🏆

نتطلع لرؤيتك مرة أخرى! 👋`;
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
