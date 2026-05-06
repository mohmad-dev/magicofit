import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { phone } = req.body as { phone: string };
  
  console.log(`[WhatsApp Auth] Sending OTP to ${phone}`);
  
  // Simulation for now - in production this hits Twilio/UltraMsg
  res.status(200).json({ 
    success: true, 
    message: "OTP sent (Simulated)" 
  });
}
