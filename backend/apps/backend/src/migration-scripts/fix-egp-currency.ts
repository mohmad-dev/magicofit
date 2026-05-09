import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "@medusajs/framework/utils";

/**
 * This migration fixes the currency from EUR to EGP for the Egypt region
 * and updates the store's default currency.
 */
export default async function fix_egp_currency({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const regionModuleService = container.resolve(ModuleRegistrationName.REGION);
  const storeModuleService = container.resolve(ModuleRegistrationName.STORE);
  const pricingModuleService = container.resolve(ModuleRegistrationName.PRICING);

  logger.info("=== Fix EGP Currency Migration ===");

  // 1. Get all regions
  const regions = await regionModuleService.listRegions();
  logger.info(`Found ${regions.length} regions`);

  // 2. Find and update the Egypt region (currently has EUR, should be EGP)
  for (const region of regions) {
    logger.info(`Region: ${region.name} - Currency: ${region.currency_code}`);
    
    // If region has Egypt country but wrong currency, update it
    const countries = await regionModuleService.listRegionCountries({
      region_id: region.id,
    });
    
    const hasEgypt = countries.some((c: any) => c.iso_2 === "eg");
    
    if (hasEgypt && region.currency_code !== "egp") {
      logger.info(`Fixing Egypt region: changing currency from ${region.currency_code} to EGP...`);
      
      // Delete the old region and create new one with EGP
      try {
        await regionModuleService.deleteRegions(region.id);
        logger.info(`Deleted old region: ${region.id}`);
      } catch (e: any) {
        logger.warn(`Could not delete region: ${e.message}`);
      }
    }
  }

  // 3. Create new Egypt region with EGP if it doesn't exist
  const updatedRegions = await regionModuleService.listRegions();
  const egpRegion = updatedRegions.find((r: any) => r.currency_code === "egp");

  if (!egpRegion) {
    logger.info("Creating new Egypt region with EGP currency...");
    
    try {
      const newRegion = await regionModuleService.createRegions({
        name: "Egypt",
        currency_code: "egp",
        countries: ["eg"],
        metadata: { source: "migration" },
      });
      logger.info(`Created Egypt region with EGP: ${newRegion.id}`);
    } catch (e: any) {
      logger.error(`Failed to create Egypt region: ${e.message}`);
    }
  } else {
    logger.info(`Egypt region with EGP already exists: ${egpRegion.id}`);
  }

  // 4. Update store's default currency to EGP
  const stores = await storeModuleService.listStores();
  
  for (const store of stores) {
    logger.info(`Updating store: ${store.name}`);
    
    try {
      await storeModuleService.updateStores(store.id, {
        supported_currencies: [
          {
            currency_code: "egp",
            is_default: true,
            is_tax_inclusive: false,
          },
        ],
      });
      logger.info(`Updated store ${store.id} to use EGP as default currency`);
    } catch (e: any) {
      logger.error(`Failed to update store: ${e.message}`);
    }
  }

  // 5. Update product variant prices from EUR to EGP
  // EUR to EGP conversion rate (approximate)
  const EUR_TO_EGP = 55;

  logger.info("Updating product variant prices to EGP...");

  // Get all price sets and update them
  const { data: priceSets } = await query.graph({
    entity: "price_set",
    fields: ["id", "prices.*"],
  });

  let pricesUpdated = 0;

  for (const priceSet of priceSets) {
    if (!priceSet.prices || priceSet.prices.length === 0) continue;

    // Find EUR price
    const eurPrice = priceSet.prices.find((p: any) => p.currency_code === "eur");
    
    if (eurPrice) {
      const egpAmount = Math.round(eurPrice.amount * EUR_TO_EGP);
      
      try {
        // Add EGP price
        await pricingModuleService.addPrices({
          priceSetId: priceSet.id,
          prices: [
            {
              currency_code: "egp",
              amount: egpAmount,
            },
          ],
        });
        pricesUpdated++;
      } catch (e: any) {
        // Price might already exist
        logger.debug(`Could not add EGP price: ${e.message}`);
      }
    }
  }

  logger.info(`Updated ${pricesUpdated} prices to EGP`);

  // 6. Create price preference for EGP
  try {
    await pricingModuleService.createPricePreferences([
      {
        attribute: "currency_code",
        value: "egp",
        is_tax_inclusive: false,
      },
    ]);
    logger.info("Created EGP price preference");
  } catch (e: any) {
    logger.debug(`Price preference may already exist: ${e.message}`);
  }

  logger.info("=== EGP Currency Migration Complete ===");
}
