import { MedusaContainer } from "@medusajs/medusa"

export default async function deleteAndRecreateAdmin({ container }: { container: MedusaContainer }) {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("Missing required env vars: ADMIN_EMAIL and ADMIN_PASSWORD")
  }

  const userModuleService = container.resolve("user")
  
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

  // Create auth identity so the user can actually log in via emailpass
  const authModuleService = container.resolve("auth")
  
  await authModuleService.createAuthIdentities({
    provider_idp: "emailpass",
    entity_id: newUser.id,
    provider_metadata: {
      email,
      password,
    },
    app_metadata: {
      user_id: newUser.id,
    },
  })
  
  console.log("✅ Auth identity created for:", email)
  console.log("Login at: /app/login")
  console.log("Email:", email)
}
