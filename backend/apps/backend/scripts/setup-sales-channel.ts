import { MedusaContainer } from "@medusajs/medusa"

export default async function setupSalesChannel({ container }: { container: MedusaContainer }) {
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
  
  console.log("Sales Channel ID:", salesChannel.id)
  console.log("Sales Channel Name:", salesChannel.name)
}
