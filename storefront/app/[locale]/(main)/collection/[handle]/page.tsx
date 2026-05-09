import CollectionClient from "./CollectionClient";
import { getProducts, getRegions, getCollections } from "@/lib/store-api";
import type { MedusaProduct } from "@/lib/types/medusa";

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

async function getCollectionData(collectionHandle: string) {
  try {
    // Get all collections to find the collection ID
    const collections = await getCollections();
    const collection = collections.find(c => c.handle === collectionHandle);

    if (!collection) {
      return { products: [], collectionName: decodeURIComponent(collectionHandle) };
    }

    // Try to fetch region for pricing
    let regionId: string | undefined;
    try {
      const regions = await getRegions();
      const egyptRegion = regions.find(r => r.currency_code === 'egp') || regions[0];
      regionId = egyptRegion?.id;
    } catch (regionError) {
      console.warn('Failed to fetch regions:', regionError);
    }

    // Fetch products for this collection
    const productsData = await getProducts({ 
      limit: 50,
      collection_id: [collection.id],
      region_id: regionId,
    });

    // Transform products
    const transformedProducts = productsData.products.map((product: MedusaProduct) => {
      const firstVariant = product.variants?.[0];
      
      const getPrice = (variant: any) => {
        if (variant?.calculated_price) {
          return variant.calculated_price.calculated_amount / 100;
        }
        if (variant?.prices && variant.prices.length > 0) {
          return variant.prices[0].amount / 100;
        }
        return 0;
      };

      const getOriginalPrice = (variant: any) => {
        if (variant?.calculated_price?.original_amount) {
          return variant.calculated_price.original_amount / 100;
        }
        if (variant?.prices && variant.prices.length > 1) {
          return variant.prices[1].amount / 100;
        }
        return undefined;
      };

      return {
        id: product.id,
        name: product.title || '',
        price: getPrice(firstVariant),
        originalPrice: getOriginalPrice(firstVariant),
        image: product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png',
        inStock: true,
        handle: product.handle || '',
      };
    });

    return {
      products: transformedProducts,
      collectionName: collection.title,
    };
  } catch (error) {
    console.error('Error fetching collection data:', error);
    return { products: [], collectionName: decodeURIComponent(collectionHandle) };
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const { products, collectionName } = await getCollectionData(handle);

  return (
    <CollectionClient
      initialProducts={products}
      collectionName={collectionName}
      collectionHandle={handle}
    />
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
