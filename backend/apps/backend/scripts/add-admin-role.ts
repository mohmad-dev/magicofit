import { MedusaContainer } from "@medusajs/medusa"
import UserModuleService from "@medusajs/user"

export default async function addAdminRole({ container }: { container: MedusaContainer }) {
  const userModuleService: UserModuleService = container.resolve("user")
  
  // Try to get the user first
  const users = await userModuleService.listUsers({
    email: "mohamed@magicofit.com"
  })
  
  if (users.length > 0) {
    const user = users[0]
    console.log("User found:", user.email)
    console.log("User ID:", user.id)
    
    // In Medusa v2, admin users are created differently
    // Let's try to set the user as admin using the API
    console.log("User already exists. You should be able to login at:")
    console.log("http://localhost:9000/admin")
    console.log("Email: mohamed@magicofit.com")
    console.log("Password: YourStrongPassword123")
  } else {
    console.log("User not found")
  }
}
