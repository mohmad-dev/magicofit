import { MedusaContainer } from "@medusajs/medusa"

export default async function linkApiKeyToSalesChannel({ container }: { container: MedusaContainer }) {
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
      is_active: true,
    })
    console.log("✅ Default sales channel created")
  }
  
  // Get the latest publishable key
  const apiKeys = await apiKeyModuleService.listApiKeys({
    type: "publishable",
  })
  const apiKey = apiKeys[0]
  
  if (!apiKey) {
    console.error("❌ No publishable key found. Create one first.")
    return
  }
  
  // Link the API key to the sales channel
  await apiKeyModuleService.updateApiKeys(apiKey.id, {
    title: apiKey.title || "Publishable Key for Storefront",
    sales_channel_id: salesChannel.id,
  })
  
  console.log("✅ Publishable API Key linked to sales channel:")
  console.log("API Key:", apiKey.token)
  console.log("Sales Channel:", salesChannel.name)
  console.log("Sales Channel ID:", salesChannel.id)
}
