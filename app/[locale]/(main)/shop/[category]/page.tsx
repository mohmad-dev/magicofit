import CategoryClient from "./CategoryClient";
import { getProducts, getCategories, getRegions } from "@/lib/store-api";
import type { MedusaProduct } from "@/lib/types/medusa";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

async function getCategoryData(categorySlug: string) {
  try {
    // Get all categories to find the category ID
    const categories = await getCategories();
    const category = categories.find(cat => cat.handle === categorySlug);
    
    if (!category) {
      return { products: [], categoryName: categorySlug };
    }

    // Try to fetch region for pricing, but don't block products fetch if it fails
    let regionId: string | undefined;
    try {
      const regions = await getRegions();
      const egyptRegion = regions.find(r => r.currency_code === 'egp') || regions[0];
      regionId = egyptRegion?.id;
    } catch (regionError) {
      console.warn('Failed to fetch regions, proceeding without region:', regionError);
    }

    // Fetch products for this category
    const productsData = await getProducts({ 
      limit: 50,
      category_id: [category.id],
      region_id: regionId,
    });

    // Transform products
    const transformedProducts = productsData.products.map((product: MedusaProduct) => {
      const firstVariant = product.variants?.[0];
      
      // Use calculated_price for accurate pricing
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
      categoryName: category.name,
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return { products: [], categoryName: categorySlug };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const { products, categoryName } = await getCategoryData(category);

  return (
    <CategoryClient
      initialProducts={products}
      categoryName={categoryName}
      categorySlug={category}
    />
  );
}

// Generate static params - disable for now to allow dynamic categories
export function generateStaticParams() {
  return [];
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
