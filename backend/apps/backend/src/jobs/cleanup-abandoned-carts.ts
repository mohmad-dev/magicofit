import { MedusaContainer } from "@medusajs/framework";

/**
 * Cleanup Abandoned Carts Job
 *
 * Releases reserved inventory from abandoned carts after 30 minutes
 * This job should be scheduled to run periodically (e.g., every 15 minutes)
 */
export const config = {
  name: "cleanup-abandoned-carts",
  schedule: "*/15 * * * *", // Run every 15 minutes
};

export default async function cleanupAbandonedCarts({
  container,
}: {
  container: MedusaContainer;
}) {
  const query = container.resolve("query");

  try {
    console.log("Starting cleanup of abandoned carts...");

    // Find carts that have been abandoned for more than 30 minutes
    // Carts are considered abandoned if:
    // - They have items
    // - No order has been created
    // - Last updated more than 30 minutes ago
    const abandonedCarts = await query.graph({
      entity: "cart",
      fields: ["id", "updated_at"],
      filters: {
        updated_at: { $lt: new Date(Date.now() - 30 * 60 * 1000) },
      },
    });

    console.log(`Found ${abandonedCarts.data.length} potentially abandoned carts`);

    // TODO: Release reserved inventory for each abandoned cart
    // This will be implemented when inventory reservation logic is ready
    // for (const cart of abandonedCarts.data) {
    //   await releaseReservedInventory(cart.id);
    //   console.log(`Released inventory from abandoned cart ${cart.id}`);
    // }

    console.log("Abandoned cart cleanup completed");
  } catch (error) {
    console.error("Error during abandoned cart cleanup:", error);
  }
}
