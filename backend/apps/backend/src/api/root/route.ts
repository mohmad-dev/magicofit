import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  _req: MedusaRequest,
  res: MedusaResponse
) {
  res.json({ message: "API is running" });
}

export async function POST(
  _req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const userModuleService = _req.scope.resolve("user")
    
    // Delete existing user if exists
    const existingUsers = await userModuleService.listUsers({
      email: "mohamed@magicofit.com"
    })
    
    if (existingUsers.length > 0) {
      await userModuleService.deleteUsers(existingUsers[0].id)
    }
    
    // Create new admin user
    const newUser = await userModuleService.createUsers({
      email: "mohamed@magicofit.com",
      first_name: "Mohamed",
      last_name: "Admin",
      password_hash: "Medusa@Admin2024!Secure"
    })
    
    // Assign admin role
    const authIdentityService = _req.scope.resolve("auth_identity")
    await authIdentityService.createAuthIdentities({
      provider_idp: "emailpass",
      entity_id: newUser.id,
      provider_metadata: {
        email: "mohamed@magicofit.com",
        password: "Medusa@Admin2024!Secure"
      },
      app_metadata: {
        user_id: newUser.id
      }
    })
    
    res.json({
      success: true,
      message: "Admin user created successfully",
      email: "mohamed@magicofit.com",
      password: "Medusa@Admin2024!Secure",
      userId: newUser.id
    })
    
  } catch (error) {
    console.error("Error creating admin user:", error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
