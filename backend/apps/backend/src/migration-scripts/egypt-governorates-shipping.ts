import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils";
import {
  createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows";

// 27 Egyptian governorates with shipping prices (amounts in cents: 3000 = 30 EGP)
const GOVERNORATES = [
  { name: "Cairo", ar: "القاهرة", price: 3000 },
  { name: "Giza", ar: "الجيزة", price: 3000 },
  { name: "Alexandria", ar: "الإسكندرية", price: 4000 },
  { name: "Port Said", ar: "بورسعيد", price: 5000 },
  { name: "Suez", ar: "السويس", price: 5000 },
  { name: "Damietta", ar: "دمياط", price: 5000 },
  { name: "Dakahlia", ar: "الدقهلية", price: 5000 },
  { name: "Sharqia", ar: "الشرقية", price: 5000 },
  { name: "Qalyubia", ar: "القليوبية", price: 4000 },
  { name: "Kafr El Sheikh", ar: "كفر الشيخ", price: 5000 },
  { name: "Gharbia", ar: "الغربية", price: 5000 },
  { name: "Monufia", ar: "المنوفية", price: 5000 },
  { name: "Beheira", ar: "البحيرة", price: 5000 },
  { name: "Ismailia", ar: "الإسماعيلية", price: 5000 },
  { name: "North Sinai", ar: "شمال سيناء", price: 8000 },
  { name: "South Sinai", ar: "جنوب سيناء", price: 8000 },
  { name: "Fayoum", ar: "الفيوم", price: 6000 },
  { name: "Beni Suef", ar: "بني سويف", price: 6000 },
  { name: "Minya", ar: "المنيا", price: 6000 },
  { name: "Assiut", ar: "أسيوط", price: 6000 },
  { name: "Sohag", ar: "سوهاج", price: 6000 },
  { name: "Qena", ar: "قنا", price: 6000 },
  { name: "Luxor", ar: "الأقصر", price: 6000 },
  { name: "Aswan", ar: "أسوان", price: 8000 },
  { name: "Red Sea", ar: "البحر الأحمر", price: 8000 },
  { name: "New Valley", ar: "الوادي الجديد", price: 8000 },
  { name: "Matrouh", ar: "مطروح", price: 8000 },
];

export default async function egypt_governorates_shipping({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const regionModuleService = container.resolve(ModuleRegistrationName.REGION);

  logger.info("=== Egypt Governorates Shipping Setup ===");

  // 1. Find Egypt region
  const existingRegions = await regionModuleService.listRegions();
  const egyptRegion = existingRegions.find((r: any) => r.currency_code === "egp");

  if (!egyptRegion) {
    logger.error("Egypt region not found. Run egypt-region-setup first.");
    return;
  }
  logger.info(`Using Egypt region: ${egyptRegion.id}`);

  // 2. Find existing shipping profile
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];
  if (!shippingProfile) {
    logger.error("Shipping profile not found.");
    return;
  }

  // 3. Find the existing Egypt fulfillment set and its service zone
  // Query all fulfillment sets and find the one for Egypt
  const { data: allFulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.*", "service_zones.geo_zones.*"],
  });

  let serviceZoneId: string | null = null;

  // Look for a fulfillment set with an Egypt geo zone
  for (const fs of allFulfillmentSets) {
    if (fs.service_zones?.length > 0) {
      for (const sz of fs.service_zones) {
        if (sz.geo_zones?.some((gz: any) => gz.country_code === "eg")) {
          serviceZoneId = sz.id;
          logger.info(`Found Egypt service zone: ${sz.id} in fulfillment set: ${fs.name}`);
          break;
        }
      }
    }
    if (serviceZoneId) break;
  }

  // If no geo-zone match, try by name
  if (!serviceZoneId) {
    const egyptFs = allFulfillmentSets.find((fs: any) =>
      fs.name?.includes("Egypt") || fs.name?.includes("egypt")
    );
    if (egyptFs?.service_zones?.[0]?.id) {
      serviceZoneId = egyptFs.service_zones[0].id;
      logger.info(`Found Egypt fulfillment set by name, using service zone: ${serviceZoneId}`);
    }
  }

  // Last resort: use any available service zone
  if (!serviceZoneId) {
    for (const fs of allFulfillmentSets) {
      if (fs.service_zones?.[0]?.id) {
        serviceZoneId = fs.service_zones[0].id;
        logger.warn(`No Egypt-specific zone found. Using service zone from: ${fs.name}`);
        break;
      }
    }
  }

  if (!serviceZoneId) {
    logger.error("No service zone found at all. Run egypt-region-setup first.");
    return;
  }

  // 4. Check if governorate shipping options already exist
  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  });

  const governorateOptionsExist = existingOptions.some(
    (opt: any) => opt.name?.includes("Cairo") || opt.name?.includes("القاهرة")
  );

  if (governorateOptionsExist) {
    logger.info("Governorate shipping options already exist. Skipping.");
    return;
  }

  // 5. Create shipping options for each governorate
  logger.info(`Creating ${GOVERNORATES.length} governorate shipping options...`);

  const shippingOptionsInput = GOVERNORATES.map((gov) => ({
    name: `Standard Shipping - ${gov.name}`,
    price_type: "flat" as const,
    provider_id: "manual_manual",
    service_zone_id: serviceZoneId,
    shipping_profile_id: shippingProfile.id,
    type: {
      label: `Standard - ${gov.name}`,
      description: `Standard delivery to ${gov.name} (${gov.ar})`,
      code: `standard-eg-${gov.name.toLowerCase().replace(/\s+/g, "-")}`,
    },
    prices: [
      {
        currency_code: "egp",
        amount: gov.price,
      },
      {
        region_id: egyptRegion.id,
        amount: gov.price,
      },
    ],
    rules: [
      {
        attribute: "is_return",
        value: "false",
        operator: "eq" as const,
      },
    ],
  }));

  // Create in batches of 5 to avoid overloading
  const BATCH_SIZE = 5;
  for (let i = 0; i < shippingOptionsInput.length; i += BATCH_SIZE) {
    const batch = shippingOptionsInput.slice(i, i + BATCH_SIZE);
    try {
      await createShippingOptionsWorkflow(container).run({
        input: batch,
      });
      logger.info(`Created shipping options batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(shippingOptionsInput.length / BATCH_SIZE)}`);
    } catch (e: any) {
      logger.warn(`Failed to create batch starting at ${i}: ${e.message}`);
    }
  }

  logger.info(`=== Egypt Governorates Shipping Setup Complete (${GOVERNORATES.length} options) ===`);
}
