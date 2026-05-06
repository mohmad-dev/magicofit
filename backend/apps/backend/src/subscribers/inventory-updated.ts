import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework";

/**
 * Inventory Updated Subscriber
 *
 * Logs inventory changes and triggers low-stock alerts
 * Triggered when inventory levels are updated
 */
export default async function inventoryUpdatedHandler({
  event: { data },
}: SubscriberArgs<{ id: string; quantity: number }>) {
  try {
    const inventoryItemId = data.id;
    const quantity = data.quantity;

    // Log inventory change
    console.log(`Inventory item ${inventoryItemId} updated to quantity: ${quantity}`);

    // Trigger low-stock alert if quantity is below threshold
    const LOW_STOCK_THRESHOLD = 10;
    if (quantity < LOW_STOCK_THRESHOLD) {
      console.warn(
        `LOW STOCK ALERT: Inventory item ${inventoryItemId} has only ${quantity} units remaining`
      );

      // TODO: Send notification to admin
      // This could be email, Slack, or other notification system
    }
  } catch (error) {
    console.error("Error processing inventory update:", error);
  }
}

export const config: SubscriberConfig = {
  event: ["inventory-item.updated", "inventory-level.updated"],
  context: {
    subscriberId: "inventory-updated-subscriber",
  },
};
