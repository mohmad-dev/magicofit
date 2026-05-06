import { MedusaContainer } from "@medusajs/medusa"

export default async function linkProductsToChannel({ container }: { container: MedusaContainer }) {
  const salesChannelModuleService = container.resolve("sales_channel")
  const productModuleService = container.resolve("product")
  
  // Get default sales channel
  const channels = await salesChannelModuleService.listSalesChannels()
  const salesChannel = channels[0]
  
  if (!salesChannel) {
    console.error("❌ No sales channel found")
    return
  }
  
  console.log("Sales Channel:", salesChannel.name, "ID:", salesChannel.id)
  
  // Get all products
  const products = await productModuleService.listProducts()
  console.log(`Found ${products.length} products`)
  
  // Update each product to add it to the sales channel
  for (const product of products) {
    const currentChannels = product.sales_channel_ids || []
    if (!currentChannels.includes(salesChannel.id)) {
      await productModuleService.updateProducts(product.id, {
        sales_channel_ids: [...currentChannels, salesChannel.id],
      })
      console.log(`✅ Linked product ${product.title} to sales channel`)
    }
  }
  
  console.log("✅ All products linked to sales channel")
}
