export interface WhatsAppTemplate {
  type: 'order_created' | 'order_shipped' | 'order_delivered' | 'order_updated';
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

      // Round the total to 2 decimal places
      const total = order?.total ? parseFloat(order.total).toFixed(2) : "0";
      const currency = order?.currency_code || "EGP";

      return `*تم تأكيد طلبك بنجاح* ✅

أهلاً يا ${name}،

شكراً جزيلاً لطلبك من الماجيكو للرياضة! 🏆

رقم طلبك: #${displayId}

📦 المنتجات التي طلبتها:
${itemsText || "- تفاصيل الطلب غير متاحة"}

💰 المبلغ الإجمالي: ${total} ${currency}

🚚 موعد التوصيل المتوقع: خلال 5 أيام عمل

سنخبرك عندما يتم شحن طلبك.

إذا كان لديك أي استفسار، تفضل بالتواصل معنا على واتساب: 01148161968

شكراً لثقتك بنا! ❤️`;
    },
  },
  order_shipped: {
    type: 'order_shipped',
    getText: (data) => {
      const { order, trackingNumber, carrier } = data;
      const fullName = `${order?.shipping_address?.first_name || ""} ${order?.shipping_address?.last_name || ""}`.trim();
      const name = fullName || order?.customer?.first_name || "عميلنا العزيز";
      const displayId = order?.display_id ?? order?.id;

      return `*تم شحن طلبك* 🚚

أهلاً يا ${name}،

تم شحن طلبك #${displayId} بنجاح!

📦 شركة الشحن: ${carrier || "قيد المعالجة"}
🔢 رقم التتبع: ${trackingNumber || "سيتم إرساله قريباً"}

📍 عنوان التوصيل:
${order?.shipping_address?.address_1 || ""}
${order?.shipping_address?.city || ""} - ${order?.shipping_address?.country_code || ""}

يمكنك تتبع طلبك من خلال موقعنا:
https://magicofit.shop/orders/${displayId}

شكراً لصبرك! 🙏

إذا كان لديك أي استفسار، تواصل معنا على واتساب: 01148161968`;
    },
  },
  order_delivered: {
    type: 'order_delivered',
    getText: (data) => {
      const { order } = data;
      const fullName = `${order?.shipping_address?.first_name || ""} ${order?.shipping_address?.last_name || ""}`.trim();
      const name = fullName || order?.customer?.first_name || "عميلنا العزيز";
      const displayId = order?.display_id ?? order?.id;

      return `*تم وصول طلبك* 🎉

أهلاً يا ${name}،

نأمل أن تكون قد استلمت طلبك #${displayId} بسلام!

إذا كان كل شيء تمام، نتمنى أن تطلب منا مرة أخرى قريباً 👋

❓ إذا كان هناك أي مشكلة في الطلب، لا تتردد في التواصل معنا مباشرة على واتساب:
📱 01148161968

شكراً لاختيارك الماجيكو للرياضة! 🏆

نتطلع لرؤيتك مرة أخرى! ❤️`;
    },
  },
  order_updated: {
    type: 'order_updated',
    getText: (data) => {
      const { order, newStatus } = data;
      const fullName = `${order?.shipping_address?.first_name || ""} ${order?.shipping_address?.last_name || ""}`.trim();
      const name = fullName || order?.customer?.first_name || "عميلنا العزيز";
      const displayId = order?.display_id ?? order?.id;

      // Translate status to Arabic
      const statusMap: Record<string, string> = {
        'pending': 'قيد الانتظار',
        'confirmed': 'تم التأكيد',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التوصيل',
        'cancelled': 'تم الإلغاء',
        'returned': 'تم الإرجاع',
      };

      const statusArabic = statusMap[newStatus] || newStatus;

      return `*تحديث حالة طلبك* 📋

أهلاً يا ${name}،

تم تحديث حالة طلبك #${displayId}

الحالة الجديدة: ${statusArabic}

إذا كان لديك أي استفسار، تواصل معنا مباشرة على واتساب:
📱 01148161968

شكراً لثقتك بنا! ❤️`;
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
