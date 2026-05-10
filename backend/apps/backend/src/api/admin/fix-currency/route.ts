import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "@medusajs/framework/utils";

/**
 * POST /admin/fix-currency
 * 
 * This endpoint fixes the currency from EUR to EGP for the Egypt region.
 * It should be called once after deployment to fix the currency issue.
 * 
 * Requires admin authentication.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const regionModuleService = req.scope.resolve(ModuleRegistrationName.REGION);
  const storeModuleService = req.scope.resolve(ModuleRegistrationName.STORE);
  const pricingModuleService = req.scope.resolve(ModuleRegistrationName.PRICING);

  logger.info("=== Fix EGP Currency API Called ===");

  const results = {
    regionsDeleted: [] as string[],
    regionsCreated: [] as any[],
    storesUpdated: [] as string[],
    pricesUpdated: 0,
    errors: [] as string[],
  };

  try {
    // 1. Get all regions
    const regions = await regionModuleService.listRegions();
    logger.info(`Found ${regions.length} regions`);

    // 2. Find and delete regions with wrong currency for Egypt
    for (const region of regions) {
      const regionWithCountries = await query.graph({
        entity: "region",
        fields: ["id", "countries.iso_2"],
        filters: { id: region.id },
      });

      const countries = regionWithCountries?.data?.[0]?.countries || [];
      
      const hasEgypt = countries.some((c: any) => c.iso_2 === "eg");
      
      if (hasEgypt && region.currency_code !== "egp") {
        logger.info(`Deleting region ${region.name} with currency ${region.currency_code}`);
        
        try {
          await regionModuleService.deleteRegions(region.id);
          results.regionsDeleted.push(region.id);
          logger.info(`Deleted region: ${region.id}`);
        } catch (e: any) {
          results.errors.push(`Failed to delete region ${region.id}: ${e.message}`);
          logger.error(`Failed to delete region: ${e.message}`);
        }
      }
    }

    // 3. Create new Egypt region with EGP
    const updatedRegions = await regionModuleService.listRegions();
    const egpRegion = updatedRegions.find((r: any) => r.currency_code === "egp");

    if (!egpRegion) {
      logger.info("Creating new Egypt region with EGP currency...");
      
      try {
        const newRegion = await regionModuleService.createRegions({
          name: "Egypt",
          currency_code: "egp",
          countries: ["eg"],
          metadata: { source: "fix-currency-api" },
        });
        results.regionsCreated.push(newRegion);
        logger.info(`Created Egypt region with EGP: ${newRegion.id}`);
      } catch (e: any) {
        results.errors.push(`Failed to create Egypt region: ${e.message}`);
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
            },
          ],
        });
        results.storesUpdated.push(store.id);
        logger.info(`Updated store ${store.id} to use EGP`);
      } catch (e: any) {
        results.errors.push(`Failed to update store ${store.id}: ${e.message}`);
        logger.error(`Failed to update store: ${e.message}`);
      }
    }

    // 5. Update product variant prices from EUR to EGP
    const EUR_TO_EGP = 55;

    const { data: priceSets } = await query.graph({
      entity: "price_set",
      fields: ["id", "prices.*"],
    });

    for (const priceSet of priceSets) {
      if (!priceSet.prices || priceSet.prices.length === 0) continue;

      const eurPrice = priceSet.prices.find((p: any) => p.currency_code === "eur");
      
      if (eurPrice) {
        const egpAmount = Math.round(eurPrice.amount * EUR_TO_EGP);
        
        try {
          await pricingModuleService.addPrices({
            priceSetId: priceSet.id,
            prices: [
              {
                currency_code: "egp",
                amount: egpAmount,
              },
            ],
          });
          results.pricesUpdated++;
        } catch (e: any) {
          // Price might already exist
          logger.debug(`Could not add EGP price: ${e.message}`);
        }
      }
    }

    logger.info(`Updated ${results.pricesUpdated} prices to EGP`);

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

    logger.info("=== EGP Currency Fix Complete ===");

    res.json({
      success: true,
      message: "Currency fixed to EGP",
      results,
    });
  } catch (error: any) {
    logger.error(`Currency fix failed: ${error.message}`);
    results.errors.push(error.message);
    
    res.status(500).json({
      success: false,
      message: "Currency fix failed",
      results,
    });
  }
}
