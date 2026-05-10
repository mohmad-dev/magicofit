import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework";

import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import {
  isWhatsAppNotificationsEnabled,
  sendOrderCreatedWhatsApp,
} from "../whatsapp/evolution";

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

    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    logger.info(`Order ${orderId} placed - processing...`);

    if (!isWhatsAppNotificationsEnabled()) {
      logger.info("WhatsApp notifications disabled - skipping");
      return;
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY);
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
      logger.warn(`Order ${orderId} not found - skipping WhatsApp notification`);
      return;
    }

    await sendOrderCreatedWhatsApp({
      container,
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

    logger.info(`Order ${orderId} processed successfully`);
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
