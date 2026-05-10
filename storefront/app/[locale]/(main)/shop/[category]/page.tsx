import CategoryClient from "./CategoryClient";
import { Container } from "@/components/layout/Container";
import { getProducts, getCategories, getRegions } from "@/lib/store-api";
import type { MedusaProduct } from "@/lib/types/medusa";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

async function getCategoryData(categorySlug: string) {
  try {
    // Decode the URL slug
    const decodedSlug = decodeURIComponent(categorySlug);

    // Get all categories to find the category ID
    const categories = await getCategories();

    console.log('=== CATEGORY DEBUG ===');
    console.log('Raw slug from URL:', categorySlug);
    console.log('Decoded slug:', decodedSlug);
    console.log('All categories:', categories.map(c => ({ id: c.id, handle: c.handle, name: c.name })));

    // Try to find category by handle (both encoded and decoded)
    let category = categories.find(cat => cat.handle === decodedSlug);
    if (!category) {
      category = categories.find(cat => cat.handle === categorySlug);
    }

    console.log('Found category:', category?.id, category?.name);

    if (!category) {
      return {
        products: [],
        categoryName: decodedSlug,
        debugInfo: {
          searchedSlug: decodedSlug,
          availableCategories: categories.map(c => c.handle),
        }
      };
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

    console.log('Products found for category:', productsData.products.length);
    console.log('Product IDs:', productsData.products.map(p => p.id));

    // Transform products
    const transformedProducts = productsData.products.map((product: MedusaProduct) => {
      const firstVariant = product.variants?.[0];

      // Use calculated_price for accurate pricing
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
      categoryName: category.name,
      debugInfo: {
        searchedSlug: decodedSlug,
        foundCategory: category.handle,
      }
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return { products: [], categoryName: decodeURIComponent(categorySlug), debugInfo: { error: String(error) } };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const { products, categoryName, debugInfo } = await getCategoryData(category);

  return (
    <Container className="py-6 md:py-8">
      <CategoryClient
        initialProducts={products}
        categoryName={categoryName}
        categorySlug={category}
        debugInfo={debugInfo}
      />
    </Container>
  );
}

// Generate static params - disable for now to allow dynamic categories
export function generateStaticParams() {
  return [];
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
