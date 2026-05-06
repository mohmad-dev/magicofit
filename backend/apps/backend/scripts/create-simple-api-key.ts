import { MedusaContainer } from "@medusajs/medusa"

export default async function createSimpleApiKey({ container }: { container: MedusaContainer }) {
  const apiKeyModuleService = container.resolve("api_key")
  const userModuleService = container.resolve("user")
  const salesChannelModuleService = container.resolve("sales_channel")
  
  // Get or create default sales channel
  const channels = await salesChannelModuleService.listSalesChannels()
  const salesChannel = channels[0]
  
  if (!salesChannel) {
    console.error("❌ No sales channel found")
    return
  }
  
  // Get admin user
  const users = await userModuleService.listUsers()
  const adminUser = users[0]
  
  if (!adminUser) {
    console.error("❌ No admin user found")
    return
  }
  
  // Create publishable key
  const apiKey = await apiKeyModuleService.createApiKeys({
    title: "Storefront Key",
    type: "publishable",
    created_by: adminUser.id,
  })
  
  console.log("✅ API Key created:")
  console.log("Key:", apiKey.token)
  console.log("ID:", apiKey.id)
  console.log("\nAdd this to .env.local:")
  console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
}
