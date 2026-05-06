import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function debug_fulfillment({
  container,
}: {
  container: MedusaContainer;
}) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // List all fulfillment sets with service zones
  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "type", "service_zones.*", "service_zones.geo_zones.*"],
  });

  console.log("=== Fulfillment Sets ===");
  console.log(JSON.stringify(fulfillmentSets, null, 2));

  // List all shipping options
  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "price_type"],
  });

  console.log("\n=== Shipping Options ===");
  console.log(JSON.stringify(shippingOptions, null, 2));
}
