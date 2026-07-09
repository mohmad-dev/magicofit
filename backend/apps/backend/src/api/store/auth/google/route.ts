import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import jwt from "jsonwebtoken";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id_token } = req.body as { id_token: string };

  if (!id_token) {
    res.status(400).json({ message: "Google ID Token is required" });
    return;
  }

  console.log(`[Google Auth] Verifying Google ID Token...`);

  try {
    // 1. Verify token with Google's tokeninfo API
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`;
    const googleRes = await fetch(googleVerifyUrl);

    if (!googleRes.ok) {
      const errorText = await googleRes.text().catch(() => "");
      console.error(`[Google Auth] Google API token verification failed:`, errorText);
      res.status(401).json({ message: "Invalid Google ID Token" });
      return;
    }

    const payload = await googleRes.json();
    const { email, sub: googleId, given_name: firstName, family_name: lastName, email_verified } = payload;

    if (!email_verified) {
      res.status(401).json({ message: "Google email is not verified" });
      return;
    }

    console.log(`[Google Auth] Successfully verified token for email: ${email}, Google ID: ${googleId}`);

    const authModuleService = req.scope.resolve(Modules.AUTH);
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
    const configModule = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE);
    const jwtSecret = configModule.projectConfig.http.jwtSecret || "supersecret";

    // 2. Find or create customer
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
        // No auth identity linked yet
      }
    } else {
      // Create new customer
      customer = await customerModuleService.createCustomers({
        email,
        first_name: firstName || email.split("@")[0],
        last_name: lastName || "",
      });
    }

    // 3. Create auth identity if not exists
    if (!authIdentity) {
      authIdentity = await authModuleService.createAuthIdentities({
        provider_identities: [
          {
            provider: "google",
            entity_id: googleId,
          },
        ],
        app_metadata: {
          customer_id: customer.id,
        },
      });
    }

    // 4. Generate Medusa JWT token
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
    console.error("[Google Auth] Error during login:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
}
