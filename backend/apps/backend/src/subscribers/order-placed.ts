import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

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
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    const orderId = data.id;

    logger.info(`=== ORDER PLACED SUBSCRIBER START ===`);
    logger.info(`Order ${orderId} placed - processing...`);

    // Check if WhatsApp notifications are enabled
    const whatsappEnabled = isWhatsAppNotificationsEnabled();
    logger.info(`WhatsApp notifications enabled: ${whatsappEnabled}`);
    logger.info(`WHATTSAPP_NOTIFICATIONS_ENABLED env var: ${process.env.WHATSAPP_NOTIFICATIONS_ENABLED}`);

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
        "created_at",
        "customer.first_name",
        "customer.last_name",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "shipping_address.phone",
        "items.title",
        "items.quantity",
        "subtotal",
        "total",
        "currency_code",
      ],
      filters: { id: orderId },
    });

    const order = orderData?.data?.[0];
    if (!order) {
      logger.warn(`Order ${orderId} not found - skipping WhatsApp notification`);
      return;
    }

    logger.info(`Order data fetched: ${JSON.stringify(order, null, 2)}`);
    logger.info(`Sending WhatsApp notification for order ${orderId}...`);

    await sendOrderCreatedWhatsApp({
      order,
    });

    logger.info(`Order ${orderId} processed successfully`);
    logger.info(`=== ORDER PLACED SUBSCRIBER END ===`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    logger.error(`Error processing order placement: ${errorMessage}`);
    logger.error(`Error stack: ${errorStack}`);
  }
}

export const config: SubscriberConfig = {
  event: ["order.created", "order.placed"],
  context: {
    subscriberId: "order-placed-subscriber",
  },
};
