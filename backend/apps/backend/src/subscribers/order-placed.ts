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

    console.log(`=== ORDER PLACED SUBSCRIBER START ===`);
    console.log(`Order ${orderId} placed - processing...`);

    // Check if WhatsApp notifications are enabled
    const whatsappEnabled = isWhatsAppNotificationsEnabled();
    console.log(`WhatsApp notifications enabled: ${whatsappEnabled}`);
    console.log(`WHATTSAPP_NOTIFICATIONS_ENABLED env var: ${process.env.WHATSAPP_NOTIFICATIONS_ENABLED}`);

    if (!whatsappEnabled) {
      console.log("WhatsApp notifications disabled - skipping");
      return;
    }

    console.log(`Fetching order ${orderId} data...`);
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
        "total",
        "currency_code",
      ],
      filters: { id: orderId },
    });

    const order = orderData?.data?.[0];
    if (!order) {
      console.warn(`Order ${orderId} not found - skipping WhatsApp notification`);
      return;
    }

    console.log(`Order data fetched:`, JSON.stringify(order, null, 2));
    console.log(`Sending WhatsApp notification for order ${orderId}...`);

    await sendOrderCreatedWhatsApp({
      order,
    });

    console.log(`Order ${orderId} processed successfully`);
    console.log(`=== ORDER PLACED SUBSCRIBER END ===`);
  } catch (error) {
    console.error("Error processing order placement:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
  }
}

export const config: SubscriberConfig = {
  event: "order.created",
  context: {
    subscriberId: "order-placed-subscriber",
  },
};
