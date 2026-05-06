import { MedusaContainer } from "@medusajs/medusa"
import { UserModuleService } from "@medusajs/user"

export default async function checkUser({ container }: { container: MedusaContainer }) {
  const userModuleService: UserModuleService = container.resolve("user")
  
  const users = await userModuleService.listUsers({
    email: "mohamed@magicofit.com"
  })
  
  if (users.length > 0) {
    const user = users[0]
    console.log("User found:")
    console.log("Email:", user.email)
    console.log("ID:", user.id)
    console.log("First Name:", user.first_name)
    console.log("Last Name:", user.last_name)
    console.log("Roles:", JSON.stringify(user.role_ids))
  } else {
    console.log("User not found")
  }
}
