import { MedusaContainer } from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"

export default async function recreateKeyWithLink({ container }: { container: MedusaContainer }) {
  const apiKeyModuleService = container.resolve("api_key")
  const salesChannelModuleService = container.resolve("sales_channel")
  const userModuleService = container.resolve("user")
  const remoteLink = container.resolve("remoteLink")
  
  // Get sales channel
  const channels = await salesChannelModuleService.listSalesChannels()
  const salesChannel = channels[0]
  
  if (!salesChannel) {
    console.error("❌ No sales channel found")
    return
  }
  
  console.log("Sales Channel:", salesChannel.name, "ID:", salesChannel.id)
  
  // Get admin user
  const users = await userModuleService.listUsers()
  const adminUser = users[0]
  
  if (!adminUser) {
    console.error("❌ No admin user found")
    return
  }
  
  // List existing keys
  const existingKeys = await apiKeyModuleService.listApiKeys({ type: "publishable" })
  console.log(`Found ${existingKeys.length} existing keys`)
  
  // Create new key (don't delete old ones as they can't be revoked)
  const apiKey = await apiKeyModuleService.createApiKeys({
    title: "Storefront Key",
    type: "publishable",
    created_by: adminUser.id,
  })
  
  console.log("Created key:", apiKey.token)
  
  // Try to link using remoteLink
  try {
    await remoteLink.create({
      [Modules.API_KEY]: {
        api_key_id: apiKey.id,
      },
      [Modules.SALES_CHANNEL]: {
        sales_channel_id: salesChannel.id,
      },
    })
    console.log("✅ Linked API key to sales channel")
  } catch (error: any) {
    console.log("⚠️ Could not link via remoteLink:", error?.message || error)
    console.log("Key created but may not be linked to sales channel")
  }
  
  console.log("\nAdd this to .env.local:")
  console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
}
