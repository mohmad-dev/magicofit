// Seed script disabled - see below
// import { MedusaContainer } from "@medusajs/framework";
// import { ProductStatus } from "@medusajs/framework/utils";
// import { createProductsWorkflow, createSalesChannelsWorkflow } from "@medusajs/medusa/core-flows";
// import categories from "../../data/categories.json";
// import collections from "../../data/collections.json";
// import products from "../../data/products.json";

export default async function magicofit_seed({
  container,
}: {
  container: any;
}) {
  // Temporarily disabled due to data structure mismatches
  // TODO: Fix product variant structure to match Medusa v2 format
  console.log("MagicOFit seed script temporarily disabled");
  return;

  /* TypeScript type errors - code disabled until fixed
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["sa", "ae", "qa", "kw", "bh", "om", "eg", "jo", "lb"];

  logger.info("Seeding MagicOFit store data...");

  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "MagicOFit Store",
          description: "MagicOFit Sports E-Commerce",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "MagicOFit Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [_store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "MagicOFit",
          supported_currencies: [
            {
              currency_code: "sar",
              is_default: true,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
            {
              currency_code: "eur",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  // logger.info("Seeding region data...");
  // const { result: regionResult } = await createRegionsWorkflow(container).run({
  //   input: {
  //     regions: [
  //       {
  //         name: "GCC & MENA",
  //         currency_code: "sar",
  //         countries,
  //         payment_providers: ["pp_system_default"],
  //       },
  //     ],
  //   },
  // });
  // const region = regionResult[0];
  // logger.info("Finished seeding regions.");

  // Get existing region (already seeded by initial-data-seed)
  const regionModuleService = container.resolve(ModuleRegistrationName.REGION);
  const regions = await regionModuleService.listRegions();
  const region = regions[0];
  logger.info(`Using existing region: ${region.name}`);

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "MagicOFit Warehouse - Riyadh",
          address: {
            city: "Riyadh",
            country_code: "SA",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    type: "shipping",
    name: "MagicOFit GCC Delivery",
    service_zones: [
      {
        name: "GCC & MENA",
        geo_zones: countries.map((country_code) => ({
          type: "country" as const,
          country_code,
        })),
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

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Standard delivery 3-5 business days",
          code: "standard",
        },
        prices: [
          {
            currency_code: "sar",
            amount: 25,
          },
          {
            currency_code: "usd",
            amount: 7,
          },
          {
            currency_code: "eur",
            amount: 6,
          },
          {
            region_id: region.id,
            amount: 25,
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
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Express delivery 1-2 business days",
          code: "express",
        },
        prices: [
          {
            currency_code: "sar",
            amount: 50,
          },
          {
            currency_code: "usd",
            amount: 14,
          },
          {
            currency_code: "eur",
            amount: 12,
          },
          {
            region_id: region.id,
            amount: 50,
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
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: categories.map((cat) => ({
        name: cat.name,
        handle: cat.handle,
        description: cat.description,
        is_active: cat.is_active,
        metadata: cat.metadata,
      })),
    },
  });
  logger.info(`Finished seeding ${categoryResult.length} categories.`);

  logger.info("Seeding collections...");
  const { result: collectionResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: collections.map((col) => ({
        title: col.title,
        handle: col.handle,
        description: col.description,
        metadata: col.metadata,
      })),
    },
  });
  logger.info(`Finished seeding ${collectionResult.length} collections.`);

  logger.info("Seeding products...");
  const categoryMap = new Map(
    categoryResult.map((cat) => [cat.name, cat.id])
  );
  const collectionMap = new Map(
    collectionResult.map((col) => [col.title, col.id])
  );

  const productsData = products.map((product) => ({
    title: product.title,
    handle: product.handle,
    subtitle: product.subtitle,
    description: product.description,
    category_ids: categoryMap.get(product.category)
      ? [categoryMap.get(product.category)!]
      : [],
    collection_id: collectionMap.get(product.collection),
    material: product.material,
    weight: product.weight,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfile.id,
    images: product.images.map((url, index) => ({
      url,
      is_thumbnail: index === 0,
      alt_text: `${product.title} - View ${index + 1}`,
    })),
    options: product.options.map((opt) => ({
      title: opt.title,
      values: opt.values,
    })),
    variants: product.variants.map((variant) => ({
      title: variant.title,
      sku: variant.sku,
      barcode: variant.barcode,
      options: variant.options,
      prices: variant.prices,
      manage_inventory: variant.manage_inventory,
      allow_backorder: variant.allow_backorder,
    })),
    sales_channels: [
      {
        id: defaultSalesChannel.id,
      },
    ],
    metadata: product.metadata,
  }));

  await createProductsWorkflow(container).run({
    input: {
      products: productsData,
    },
  });
  logger.info(`Finished seeding ${productsData.length} products.`);

  logger.info("Seeding inventory levels.");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 100,
        inventory_item_id: item.id,
      })),
    },
  });

  logger.info("Finished seeding inventory levels data.");
  logger.info("MagicOFit seed completed successfully!");
  */
}
