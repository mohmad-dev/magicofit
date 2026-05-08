import { MedusaContainer } from "@medusajs/medusa"
import { Scrypt } from "@medusajs/utils"

export default async function deleteAndRecreateAdmin({ container }: { container: MedusaContainer }) {
  // Skip if BOOTSTRAP_ADMIN is not set to true
  if (process.env.BOOTSTRAP_ADMIN !== "true") {
    console.log("ℹ️ BOOTSTRAP_ADMIN is not true, skipping admin creation")
    return
  }

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("Missing required env vars: ADMIN_EMAIL and ADMIN_PASSWORD")
  }

  const userModuleService = container.resolve("user")
  const authModuleService = container.resolve("auth")
  
  // Delete existing auth identities for this email
  const existingAuthIdentities = await authModuleService.listAuthIdentities({
    provider_idp: "emailpass",
  })
  
  for (const identity of existingAuthIdentities) {
    const identityEmail = identity.provider_metadata?.email
    if (identityEmail === email) {
      await authModuleService.deleteAuthIdentities(identity.id)
      console.log("✅ Old auth identity deleted")
    }
  }
  
  // Delete existing user if present
  const users = await userModuleService.listUsers({ email })
  
  if (users.length > 0) {
    await userModuleService.deleteUsers(users[0].id)
    console.log("✅ Old user deleted")
  }
  
  // Create new admin user
  const newUser = await userModuleService.createUsers({
    email,
    first_name: "Mohamed",
    last_name: "Admin",
  })
  
  console.log("✅ User created:", newUser.email, "ID:", newUser.id)

  // Hash password with Scrypt (same algorithm Medusa emailpass provider uses)
  const scrypt = new Scrypt()
  const passwordHash = await scrypt.hash(password)

  // Create auth identity with properly hashed password
  await authModuleService.createAuthIdentities({
    provider_idp: "emailpass",
    entity_id: newUser.id,
    provider_metadata: {
      email,
      password: passwordHash,
    },
    app_metadata: {
      user_id: newUser.id,
    },
  })
  
  console.log("✅ Auth identity created for:", email)
  console.log("Login at: /app/login")
  console.log("Email:", email)
}
