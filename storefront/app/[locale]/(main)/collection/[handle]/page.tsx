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
    // Decode the URL handle
    const decodedHandle = decodeURIComponent(collectionHandle);

    // Get all collections to find the collection ID
    const collections = await getCollections();

    console.log('=== COLLECTION DEBUG ===');
    console.log('Raw handle from URL:', collectionHandle);
    console.log('Decoded handle:', decodedHandle);
    console.log('All collections:', collections.map(c => ({ id: c.id, handle: c.handle, title: c.title })));

    // Try to find collection by handle (both encoded and decoded)
    let collection = collections.find(c => c.handle === decodedHandle);
    if (!collection) {
      collection = collections.find(c => c.handle === collectionHandle);
    }

    console.log('Found collection:', collection?.id, collection?.title);

    if (!collection) {
      return {
        products: [],
        collectionName: decodedHandle,
        debugInfo: {
          searchedHandle: decodedHandle,
          availableCollections: collections.map(c => c.handle),
        }
      };
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

    console.log('Products found for collection:', productsData.products.length);
    console.log('Product IDs:', productsData.products.map(p => p.id));

    // Transform products
    const transformedProducts = productsData.products.map((product: MedusaProduct) => {
      const firstVariant = product.variants?.[0];

      const getPrice = (variant: any) => {
        if (variant?.calculated_price) {
          return variant.calculated_price.calculated_amount;
        }
        if (variant?.prices && variant.prices.length > 0) {
          return variant.prices[0].amount;
        }
        return 0;
      };

      const getOriginalPrice = (variant: any) => {
        if (variant?.calculated_price?.original_amount) {
          return variant.calculated_price.original_amount;
        }
        if (variant?.prices && variant.prices.length > 1) {
          return variant.prices[1].amount;
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
      debugInfo: {
        searchedHandle: decodedHandle,
        foundCollection: collection.handle,
      }
    };
  } catch (error) {
    console.error('Error fetching collection data:', error);
    return { products: [], collectionName: decodeURIComponent(collectionHandle), debugInfo: { error: String(error) } };
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const { products, collectionName, debugInfo } = await getCollectionData(handle);

  return (
    <CollectionClient
      initialProducts={products}
      collectionName={collectionName}
      collectionHandle={handle}
      debugInfo={debugInfo}
    />
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
