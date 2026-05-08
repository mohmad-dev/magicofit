import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/inventory",
      options: {
        // Inventory module configuration
      },
    },
    {
      resolve: "@medusajs/stock-location",
      options: {
        // Stock location module configuration
      },
    },
    // Redis event bus - optional for development, required for production
    ...(process.env.REDIS_URL ? [{
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
      key: "event_bus_redis",
    }] : []),
    // Meilisearch plugin - disabled: medusa-plugin-meilisearch v2.x is NOT compatible with Medusa v2
    // TODO: Implement custom Meilisearch module for Medusa v2 or use @medusajs/search
    // {
    //   resolve: "medusa-plugin-meilisearch",
    //   options: {
    //     config: {
    //       host: process.env.MEILI_HOST || "http://127.0.0.1:7700",
    //       apiKey: process.env.MEILI_MASTER_KEY || "masterKey123",
    //     },
    //     settings: {
    //       products: {
    //         searchableAttributes: ["title", "description", "handle", "variant_sku"],
    //         displayedAttributes: ["*", "id"],
    //         filterableAttributes: ["category_id", "collection_id", "tags", "variant_sku"],
    //         sortableAttributes: ["title", "created_at", "updated_at"],
    //         rankingRules: [
    //           "words",
    //           "typo",
    //           "proximity",
    //           "attribute",
    //           "sort",
    //           "exactness",
    //         ],
    //         stopWords: ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"],
    //       },
    //     },
    //   },
    // },
  ],
})
