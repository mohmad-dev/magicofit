import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import {
  isWhatsAppNotificationsEnabled,
  sendOrderUpdatedWhatsApp,
} from "./whatsapp";

/**
 * Order Updated Subscriber
 *
 * Sends WhatsApp notification when order status is updated
 * Triggered when order status changes
 */
export default async function orderUpdatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    const orderId = data.id;

    logger.info(`=== ORDER UPDATED SUBSCRIBER START ===`);
    logger.info(`Order ${orderId} status updated - processing...`);

    // Check if WhatsApp notifications are enabled
    const whatsappEnabled = isWhatsAppNotificationsEnabled();
    logger.info(`WhatsApp notifications enabled: ${whatsappEnabled}`);

    if (!whatsappEnabled) {
      logger.info("WhatsApp notifications disabled - skipping");
      return;
    }

    logger.info(`Fetching order ${orderId} data...`);
    const query = container.resolve("query");
    const orderData = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "created_at",
        "customer.first_name",
        "customer.last_name",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "shipping_address.phone",
      ],
      filters: { id: orderId },
    });

    const order = orderData?.data?.[0];
    if (!order) {
      logger.warn(`Order ${orderId} not found - skipping WhatsApp notification`);
      return;
    }

    const newStatus = order.status;
    logger.info(`Order new status: ${newStatus}`);

    // Send WhatsApp notification
    logger.info(`Sending WhatsApp notification for order ${orderId} status update...`);

    await sendOrderUpdatedWhatsApp({
      order,
      newStatus,
    });

    logger.info(`Order ${orderId} status update notification sent successfully`);
    logger.info(`=== ORDER UPDATED SUBSCRIBER END ===`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    logger.error(`Error processing order status update: ${errorMessage}`);
    logger.error(`Error stack: ${errorStack}`);
  }
}

export const config: SubscriberConfig = {
  event: "order.updated",
  context: {
    subscriberId: "order-updated-subscriber",
  },
};
