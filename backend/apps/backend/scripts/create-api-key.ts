import { MedusaContainer } from "@medusajs/medusa"

export default async function createApiKey({ container }: { container: MedusaContainer }) {
  const apiKeyModuleService = container.resolve("api_key")
  const salesChannelModuleService = container.resolve("sales_channel")
  
  // Get or create default sales channel
  const channels = await salesChannelModuleService.listSalesChannels()
  let salesChannel = channels[0]
  
  if (!salesChannel) {
    console.log("Creating default sales channel...")
    salesChannel = await salesChannelModuleService.createSalesChannels({
      name: "Default Sales Channel",
      description: "Default sales channel for storefront",
    })
    console.log("✅ Default sales channel created")
  }
  
  // Get the admin user to use as created_by
  const userModuleService = container.resolve("user")
  const users = await userModuleService.listUsers()
  const adminUser = users[0]
  
  if (!adminUser) {
    console.error("❌ No admin user found. Please create an admin user first.")
    return
  }
  
  const apiKey = await apiKeyModuleService.createApiKeys({
    title: "Publishable Key for Storefront",
    type: "publishable",
    created_by: adminUser.id,
    sales_channels: [{ id: salesChannel.id }],
  })
  
  console.log("✅ Publishable API Key created:")
  console.log("Key:", apiKey.token)
  console.log("ID:", apiKey.id)
  console.log("Sales Channel:", salesChannel.name)
  
  console.log("\nAdd this to your .env.local:")
  console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
}
