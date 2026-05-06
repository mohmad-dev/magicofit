import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createStockLocationsWorkflow,
  createShippingOptionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  createTaxRegionsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function egypt_region_setup({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );
  const regionModuleService = container.resolve(ModuleRegistrationName.REGION);
  const pricingModuleService = container.resolve(ModuleRegistrationName.PRICING);

  logger.info("=== Egypt Region Setup ===");

  // 1. Check if Egypt region already exists
  const existingRegions = await regionModuleService.listRegions();
  const egyptRegion = existingRegions.find((r: any) => r.currency_code === "egp");

  if (egyptRegion) {
    logger.info(`Egypt region already exists: ${egyptRegion.id}`);
    return;
  }

  // 2. Create Egypt Region
  logger.info("Creating Egypt region with EGP currency...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Egypt",
          currency_code: "egp",
          countries: ["eg"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const egyptRegionCreated = regionResult[0];
  logger.info(`Egypt region created: ${egyptRegionCreated.id}`);

  // 3. Create tax region for Egypt (14% VAT)
  logger.info("Creating tax region for Egypt...");
  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: "eg",
        provider_id: "tp_system",
      },
    ],
  });
  logger.info("Tax region for Egypt created.");

  // 4. Get existing sales channel
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const defaultSalesChannel = salesChannels[0];

  // 5. Create stock location in Cairo
  logger.info("Creating Cairo warehouse...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "MagicOFit Warehouse - Cairo",
          address: {
            city: "Cairo",
            country_code: "eg",
            address_1: "Nasr City",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];
  logger.info(`Cairo warehouse created: ${stockLocation.id}`);

  // Link fulfillment provider to stock location
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  // 6. Create fulfillment set for Egypt
  logger.info("Creating Egypt fulfillment set...");
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Egypt Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Egypt",
        geo_zones: [
          {
            country_code: "eg",
            type: "country" as const,
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  // 7. Create shipping options for Egypt
  logger.info("Creating shipping options for Egypt...");
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping - Egypt",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Standard delivery 3-5 business days",
          code: "standard-eg",
        },
        prices: [
          {
            currency_code: "egp",
            amount: 5000, // 50 EGP
          },
          {
            region_id: egyptRegionCreated.id,
            amount: 5000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping - Egypt",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Express delivery 1-2 business days",
          code: "express-eg",
        },
        prices: [
          {
            currency_code: "egp",
            amount: 10000, // 100 EGP
          },
          {
            region_id: egyptRegionCreated.id,
            amount: 10000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Shipping options for Egypt created.");

  // 8. Link sales channel to stock location
  if (defaultSalesChannel) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel.id],
      },
    });
  }

  // 9. Add EGP prices to all existing product variants
  // EUR to EGP conversion: 1 EUR = 50 EGP (approximate)
  const EUR_TO_EGP = 50;
  logger.info("Adding EGP prices to all product variants...");

  const { data: productVariants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "sku", "prices.*"],
  });

  let pricesAdded = 0;
  for (const variant of productVariants) {
    // Find the EUR price for this variant
    const eurPrice = variant.prices?.find((p: any) => p.currency_code === "eur");
    if (eurPrice) {
      const egpAmount = eurPrice.amount * EUR_TO_EGP;
      
      try {
        await pricingModuleService.createPricePreferences([
          {
            attribute: "currency_code",
            value: "egp",
            is_tax_inclusive: false,
          },
        ]);
      } catch (e) {
        // May already exist, ignore
      }

      // Create EGP price for this variant
      const { data: priceSets } = await query.graph({
        entity: "price_set",
        fields: ["id"],
        filters: {
          id: variant.prices?.[0]?.price_set_id,
        },
      });

      if (priceSets.length > 0) {
        try {
          await pricingModuleService.addPrices({
            priceSetId: priceSets[0].id,
            prices: [
              {
                currency_code: "egp",
                amount: egpAmount,
              },
            ],
          });
          pricesAdded++;
        } catch (e: any) {
          logger.warn(`Failed to add EGP price for variant ${variant.id}: ${e.message}`);
        }
      }
    }
  }

  logger.info(`Added EGP prices to ${pricesAdded} variants.`);
  logger.info("=== Egypt Region Setup Complete ===");
}
