import { MedusaContainer } from "@medusajs/medusa"

export default async function createApiKeyWithChannel({ container }: { container: MedusaContainer }) {
  const apiKeyModuleService = container.resolve("api_key")
  const salesChannelModuleService = container.resolve("sales_channel")
  const userModuleService = container.resolve("user")
  const linkService = container.resolve("link")
  
  // Get or create default sales channel
  const channels = await salesChannelModuleService.listSalesChannels()
  const salesChannel = channels[0]
  
  if (!salesChannel) {
    console.error("❌ No sales channel found. Run setup-sales-channel.ts first.")
    return
  }
  
  // Get the admin user
  const users = await userModuleService.listUsers()
  const adminUser = users[0]
  
  if (!adminUser) {
    console.error("❌ No admin user found.")
    return
  }
  
  // Create new publishable key
  const apiKey = await apiKeyModuleService.createApiKeys({
    title: "Storefront Publishable Key",
    type: "publishable",
    created_by: adminUser.id,
  })
  
  // Link the API key to sales channel using link service
  await linkService.create({
    apiKeyService: {
      apiKey: apiKey.id,
    },
    salesChannelService: {
      salesChannel: salesChannel.id,
    },
  })
  
  console.log("✅ Publishable API Key created and linked:")
  console.log("Key:", apiKey.token)
  console.log("ID:", apiKey.id)
  console.log("Sales Channel:", salesChannel.name)
  
  console.log("\nAdd this to your .env.local:")
  console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
}
