import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import jwt from "jsonwebtoken";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { phone, code } = req.body as { phone: string, code: string };

  console.log(`[WhatsApp Auth] Verifying OTP ${code} for ${phone}`);

  // Simulation for now - 123456 is the master code
  // TODO: Replace with real OTP verification (Twilio/UltraMsg)
  if (code !== "123456") {
    res.status(401).json({ message: "Invalid OTP" });
    return;
  }

  try {
    const authModuleService = req.scope.resolve(Modules.AUTH);
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
    const configModule = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE);
    const jwtSecret = configModule.projectConfig.http.jwtSecret || "supersecret";

    // 1. Find existing customer by phone or email pattern
    const email = `whatsapp_${phone}@magicofit.local`;
    const customers = await customerModuleService.listCustomers({
      email,
    });

    let customer;
    let authIdentity;

    if (customers.length > 0) {
      // Existing customer
      customer = customers[0];

      // Try to find existing auth identity
      try {
        const authIdentities = await authModuleService.listAuthIdentities({
          app_metadata: { customer_id: customer.id },
        });
        authIdentity = authIdentities[0];
      } catch {
        // No auth identity yet
      }
    } else {
      // 2. Create new customer
      customer = await customerModuleService.createCustomers({
        email,
        phone,
        first_name: phone,
        last_name: "",
      });
    }

    // 3. Create auth identity if not exists
    if (!authIdentity) {
      authIdentity = await authModuleService.createAuthIdentities({
        provider_identities: [
          {
            provider: "whatsapp",
            entity_id: phone,
          },
        ],
        app_metadata: {
          customer_id: customer.id,
        },
      });
    }

    // 4. Generate real JWT token
    const token = jwt.sign(
      {
        actor_id: customer.id,
        actor_type: "customer",
        auth_identity_id: authIdentity.id,
        app_metadata: {
          customer_id: customer.id,
        },
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      customer: {
        id: customer.id,
        phone: customer.phone,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
      },
    });
  } catch (error) {
    console.error("[WhatsApp Auth] Error creating session:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
}
