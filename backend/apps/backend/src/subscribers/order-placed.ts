import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework";

import {
  isWhatsAppNotificationsEnabled,
  sendOrderCreatedWhatsApp,
} from "./whatsapp";

/**
 * Order Placed Subscriber
 *
 * Reserves inventory and sends confirmation email when an order is placed
 * Triggered when an order is created
 */
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    const orderId = data.id;

    console.log(`Order ${orderId} placed - processing...`);

    if (!isWhatsAppNotificationsEnabled()) {
      console.log("WhatsApp notifications disabled - skipping");
      return;
    }

    const query = container.resolve("query");
    const orderData = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "created_at",
        "customer.first_name",
        "customer.last_name",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "shipping_address.phone",
        "items.title",
        "items.quantity",
      ],
      filters: { id: orderId },
    });

    const order = orderData?.data?.[0];
    if (!order) {
      console.warn(`Order ${orderId} not found - skipping WhatsApp notification`);
      return;
    }

    await sendOrderCreatedWhatsApp({
      order,
    });

    // TODO: Reserve inventory for order items
    // This will be implemented when the inventory reservation workflow is ready
    // const inventoryModuleService = container.resolve("inventory");
    // await reserveInventoryForOrder(orderId);

    // TODO: Send confirmation email to customer
    // This will be implemented when email service is configured
    // const notificationService = container.resolve("notification");
    // await notificationService.sendOrderConfirmation(orderId);

    console.log(`Order ${orderId} processed successfully`);
  } catch (error) {
    console.error("Error processing order placement:", error);
  }
}

export const config: SubscriberConfig = {
  event: "order.created",
  context: {
    subscriberId: "order-placed-subscriber",
  },
};
