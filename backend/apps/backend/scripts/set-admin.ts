import { MedusaContainer } from "@medusajs/medusa"

export default async function setAdmin({ container }: { container: MedusaContainer }) {
  const userModuleService = container.resolve("user")
  const roleModuleService = container.resolve("role")
  
  // Get the user
  const users = await userModuleService.listUsers({
    email: "mohamed@magicofit.com"
  })
  
  if (users.length === 0) {
    console.log("User not found")
    return
  }
  
  const user = users[0]
  console.log("User found:", user.email)
  
  // Get or create admin role
  let adminRole
  try {
    const roles = await roleModuleService.listRoles()
    adminRole = roles.find(r => r.name === "admin")
    
    if (!adminRole) {
      adminRole = await roleModuleService.createRoles({
        name: "admin",
        permissions: ["*"]
      })
      console.log("Admin role created:", adminRole.id)
    } else {
      console.log("Admin role found:", adminRole.id)
    }
    
    // Assign admin role to user
    await userModuleService.updateUsers({
      id: user.id,
      role_ids: [adminRole.id]
    })
    
    console.log("✅ User successfully assigned admin role!")
    console.log("You can now login at: http://localhost:9000/admin")
    console.log("Email: mohamed@magicofit.com")
    console.log("Password: YourStrongPassword123")
  } catch (error: any) {
    console.log("Error:", error.message)
    console.log("Trying alternative: User might already have access")
    console.log("Try logging in at: http://localhost:9000/admin")
  }
}
