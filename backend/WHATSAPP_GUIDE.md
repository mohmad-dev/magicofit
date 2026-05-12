# نظام إرسال رسائل WhatsApp - MagicOFit

## 📋 نظرة عامة

هذا النظام يسمح بإرسال رسائل WhatsApp تلقائية للعملاء عند:
1. إنشاء طلب جديد (Order Created)
2. شحن الطلب (Order Shipped)
3. وصول الطلب (Order Delivered)

## 🔧 كيفية العمل

### 1. المتغيرات المطلوبة في Railway Backend

تأكد من وجود هذه المتغيرات في خدمة Backend على Railway:

```env
WHATSAPP_NOTIFICATIONS_ENABLED=true
EVOLUTION_API_BASE_URL=https://evolution-api-production-7c69.up.railway.app
EVOLUTION_API_KEY=magicofit_evo_2026_KEY_12343333
WHATSAPP_INSTANCE=magicofit-store
```

### 2. القوالب المتاحة

#### قالب تأكيد الطلب (order_created)
```
*تم تأكيد الطلب* ✅

مرحبًا [اسم العميل]،

نشكرك على الشراء! رقم طلبك هو #[رقم الطلب].

📦 تفاصيل الطلب:
- [منتج 1] × [الكمية]
- [منتج 2] × [الكمية]

💰 الإجمالي: [المبلغ] EGP

🚚 تاريخ التوصيل المُقدّر: خلال 5 أيام

سنخبرك عندما يتم شحن طلبك.

شكراً لاختيارك MagicOFit! 🏆
```

#### قالب شحن الطلب (order_shipped)
```
*تم شحن طلبك* 🚚

مرحبًا [اسم العميل]،

تم شحن طلبك #[رقم الطلب] بنجاح!

📦 شركة الشحن: [اسم الشركة]
🔢 رقم التتبع: [رقم التتبع]

📍 عنوان التوصيل:
[العنوان]

يمكنك تتبع طلبك من خلال الرابط:
https://magicofit.shop/orders/[رقم الطلب]

شكراً لصبرك! 🙏
```

#### قالب وصول الطلب (order_delivered)
```
*تم وصول طلبك* 🎉

مرحبًا [اسم العميل]،

نأمل أن تكون قد استلمت طلبك #[رقم الطلب] بسلام!

✅ إذا كان كل شيء على ما يرام، نود أن نسمع رأيك:
https://magicofit.shop/orders/[رقم الطلب]/review

❓ إذا كان هناك أي مشكلة، لا تتردد في التواصل معنا:
📱 واتساب: 01091998631
📧 البريد: support@magicofit.com

شكراً لاختيارك MagicOFit! 🏆

نتطلع لرؤيتك مرة أخرى! 👋
```

## 🚀 كيفية الاستخدام

### 1. إرسال رسالة تأكيد الطلب (تلقائي)

يتم إرسال هذه الرسالة تلقائياً عند إنشاء طلب جديد من خلال Subscriber في Medusa:

```typescript
import { sendOrderCreatedWhatsApp } from "./subscribers/whatsapp";

// يتم استدعاؤه تلقائياً من order.created event
await sendOrderCreatedWhatsApp({ order });
```

### 2. إرسال رسالة شحن الطلب (يدوي)

يمكنك استدعاء هذه الدالة عند شحن الطلب:

```typescript
import { sendOrderShippedWhatsApp } from "./subscribers/whatsapp";

await sendOrderShippedWhatsApp({
  order,
  trackingNumber: "TRK123456789",
  carrier: "Aramex"
});
```

### 3. إرسال رسالة وصول الطلب (يدوي)

يمكنك استدعاء هذه الدالة عند وصول الطلب:

```typescript
import { sendOrderDeliveredWhatsApp } from "./subscribers/whatsapp";

await sendOrderDeliveredWhatsApp({ order });
```

## 🧪 كيفية الاختبار

### 1. اختبار إرسال رسالة مباشرة

استخدم هذا الأمر في PowerShell لاختبار إرسال رسالة:

```powershell
$body = @{
  number = "201091998631"
  text = "اختبار إرسال رسالة من MagicOFit"
  linkPreview = $false
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "https://evolution-api-production-7c69.up.railway.app/message/sendText/magicofit-store" `
  -Method POST `
  -Headers @{"apikey"="magicofit_evo_2026_KEY_12343333";"Content-Type"="application/json; charset=utf-8"} `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

### 2. اختبار إنشاء طلب

1. ادخل إلى المتجر: https://magicofit.shop
2. أضف منتج إلى السلة
3. أكمل عملية الشراء
4. تأكد من كتابة رقم هاتف صحيح في عنوان الشحن
5. راقب رسالة WhatsApp التي ستصل

### 3. مراقبة Logs في Railway

1. افتح خدمة Backend في Railway
2. اذهب إلى تبويب Logs
3. ابحث عن:
   - `WhatsApp order confirmation sent` - يعني الإرسال نجح
   - `WhatsApp send failed` - يعني هناك خطأ
   - `WhatsApp notifications skipped` - يعني متغيرات البيئة ناقصة

## 📝 تعديل القوالب

لتعديل القوالب، افتح الملف:
```
backend/apps/backend/src/subscribers/whatsapp-templates.ts
```

يمكنك تعديل النصوص حسب رغبتك. تأكد من استخدام:
- `*نص*` للنص العريض (Bold)
- `_نص_` للنص المائل (Italic)
- `~نص~` للنص المشطوب (Strikethrough)
- Emojis لإضافة جمالية للرسائل

## ⚠️ ملاحظات مهمة

1. **رقم الهاتف**: يجب أن يكون بالصيغة المصرية (01xxxxxxxxx أو 20xxxxxxxxx)
2. **ترميز الأحرف**: النظام يستخدم UTF-8 لدعم العربية بشكل صحيح
3. **تقييد الإرسال**: Evolution API قد يكون له حدود للإرسال، راجع إعداداتك
4. **حالة Instance**: تأكد من أن الـ instance في حالة `open` قبل الإرسال

## 🆘 استكشاف الأخطاء

### المشكلة: لا تصل الرسائل

**الحلول:**
1. تحقق من أن `WHATSAPP_NOTIFICATIONS_ENABLED=true`
2. تحقق من حالة الـ instance في Evolution API
3. راقب Logs في Railway Backend
4. تأكد من أن رقم الهاتف صحيح

### المشكلة: النص العربي يظهر كرموز (????)

**الحلول:**
1. تأكد من استخدام `Content-Type: application/json; charset=utf-8`
2. تم إصلاح هذه المشكلة في الكود الحالي

### المشكلة: الرسالة تصل لكن بدون تنسيق

**الحلول:**
1. تأكد من استخدام `*` للنص العريض
2. WhatsApp يدعم تنسيق Markdown محدود

## 📞 الدعم

إذا واجهت أي مشاكل، تواصل مع:
- واتساب: 01091998631
- البريد: support@magicofit.com
