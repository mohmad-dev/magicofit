import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { isWhatsAppNotificationsEnabled, evolutionSendText, normalizeEgyptWhatsAppNumber } from "../../../../../subscribers/whatsapp";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { phone } = req.body as { phone: string };
  
  if (!phone) {
    res.status(400).json({ success: false, message: "Phone number is required" });
    return;
  }

  // Generate a random 6-digit OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[WhatsApp Auth] Generated OTP ${code} for phone: ${phone}`);

  try {
    const cacheService = req.scope.resolve("cacheService") as any;
    await cacheService.set(`otp_${phone}`, code, 300);

    // Check if WhatsApp notifications are enabled
    const whatsappEnabled = isWhatsAppNotificationsEnabled();
    console.log(`[WhatsApp Auth] WhatsApp notifications enabled status: ${whatsappEnabled}`);

    if (whatsappEnabled) {
      const baseUrl = process.env.EVOLUTION_API_BASE_URL;
      const apiKey = process.env.EVOLUTION_API_KEY;
      const instance = process.env.WHATSAPP_INSTANCE;

      const normalizedNumber = normalizeEgyptWhatsAppNumber(phone);
      console.log(`[WhatsApp Auth] Normalized WhatsApp number: ${normalizedNumber}`);

      if (normalizedNumber && baseUrl && apiKey && instance) {
        const text = `*رمز التحقق الخاص بك لمتجر الماجيكو للرياضة* 🩵\n\nرمز التحقق (OTP) الخاص بك هو: *${code}*\n\nالرمز صالح لمدة 5 دقائق. يرجى عدم مشاركته مع أي شخص.`;

        await evolutionSendText({
          baseUrl,
          apiKey,
          instance,
          number: normalizedNumber,
          text,
        });

        console.log(`[WhatsApp Auth] OTP successfully sent via Evolution API to ${normalizedNumber}`);
      } else {
        console.warn(`[WhatsApp Auth] Missing configuration or invalid number. BaseURL: ${baseUrl ? "OK" : "MISSING"}, APIKey: ${apiKey ? "OK" : "MISSING"}, Instance: ${instance ? "OK" : "MISSING"}`);
      }
    } else {
      console.log(`[WhatsApp Auth] WhatsApp notifications disabled, local log bypass. OTP is: ${code}`);
    }

    res.status(200).json({ 
      success: true, 
      message: "OTP sent successfully" 
    });
  } catch (error: any) {
    console.error("[WhatsApp Auth] Error in sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}
