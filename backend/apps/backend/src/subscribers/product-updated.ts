import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import MeiliSearch from "meilisearch";

/**
 * Product Updated Subscriber
 *
 * Syncs product changes to Meilisearch search index
 * Triggered when a product is created, updated, or deleted
 */
export default async function productUpdatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productId = data.id;

  try {
    const meiliHost = process.env.MEILI_HOST || "http://127.0.0.1:7700";
    const meiliKey = process.env.MEILI_MASTER_KEY || "masterKey123";
    const client = new MeiliSearch({ host: meiliHost, apiKey: meiliKey });

    const eventParts = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
      ?.projectConfig || {};
    
    // For delete events, remove the document from the index
    if (container["event"]?.eventName?.includes("deleted")) {
      await client.index("products").deleteDocument(productId);
      logger.info(`Product ${productId} deleted from Meilisearch index`);
      return;
    }

    // For create/update events, fetch the product and reindex it
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const productData = await query.graph({
      entity: "product",
      fields: [
        "id", "title", "handle", "description", "thumbnail",
        "status", "created_at", "updated_at",
        "categories.id", "categories.handle",
        "tags.id", "tags.value",
        "variants.id", "variants.sku", "variants.title",
        "variants.calculated_price",
      ],
      filters: { id: productId },
    });

    if (!productData.data?.[0]) {
      logger.warn(`Product ${productId} not found for Meilisearch sync`);
      return;
    }

    const product = productData.data[0];
    const document = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description || "",
      thumbnail: product.thumbnail || "",
      variant_sku: product.variants?.map((v: any) => v.sku).join(", ") || "",
      category_id: product.categories?.map((c: any) => c.id) || [],
      collection_id: [],
      tags: product.tags?.map((t: any) => t.value) || [],
      created_at: Math.floor(new Date(product.created_at).getTime() / 1000),
      updated_at: Math.floor(new Date(product.updated_at).getTime() / 1000),
    };

    await client.index("products").addDocuments([document], { primaryKey: "id" });
    logger.info(`Product ${productId} synced to Meilisearch`);
  } catch (error) {
    logger.error(`Error syncing product ${productId} to Meilisearch: ${error}`);
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
  context: {
    subscriberId: "product-updated-subscriber",
  },
};
