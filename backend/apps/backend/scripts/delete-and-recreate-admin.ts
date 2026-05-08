import { MedusaContainer } from "@medusajs/medusa"

export default async function deleteAndRecreateAdmin({ container }: { container: MedusaContainer }) {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("Missing required env vars: ADMIN_EMAIL and ADMIN_PASSWORD")
  }

  const userModuleService = container.resolve("user")
  
  // Delete the existing user
  const users = await userModuleService.listUsers({
    email
  })
  
  if (users.length > 0) {
    const user = users[0]
    await userModuleService.deleteUsers(user.id)
    console.log("✅ Old user deleted")
  }
  
  // Create new admin user
  const newUser = await userModuleService.createUsers({
    email,
    first_name: "Mohamed",
    last_name: "Admin",
    password_hash: password
  })
  
  console.log("✅ New admin user created!")
  console.log("Email:", newUser.email)
  console.log("ID:", newUser.id)
  console.log("")
  console.log("Login at: http://localhost:9000/admin")
  console.log("Email:", email)
}
