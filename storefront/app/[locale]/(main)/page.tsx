import HomeClient from "./HomeClient";
import { getProducts, getCategories, getRegions } from "@/lib/store-api";
import type { MedusaCategory } from "@/lib/types/medusa";

export const revalidate = 3600; // ISR revalidation every hour

// Hero slides - static for now
const heroSlides = [
  {
    id: "promo-1",
    image_url: "/images/heropic.webp",
    mobile_image_url: "/images/heropic.webp",
    title: "أقوى كوليكشن عروض الصيف",
    cta_link: "/shop",
    cta_text: "تسوق الآن",
  },
  {
    id: "promo-2",
    image_url: "/images/heropic2.webp",
    mobile_image_url: "/images/heropic2.webp",
    title: "معدات الركض الاحترافية",
    cta_link: "/shop",
    cta_text: "اكتشف الجديد",
  },
];

// Side banners - static for now
const sideBanners = [
  {
    id: "side-1",
    image_url: "/images/heropic.webp",
    title: "New Arrivals",
    cta_link: "/collection/new-arrivals",
  },
  {
    id: "side-2",
    image_url: "/images/heropic2.webp",
    title: "Sale Up to 50%",
    cta_link: "/collection/تخفيضات",
  },
];

async function getHomeData() {
  try {
    // Try to fetch region for pricing, but don't block other fetches if it fails
    let regionId: string | undefined;
    try {
      const regions = await getRegions();
      const defaultRegion = regions.find(r => r.currency_code === 'egp') || regions[0];
      regionId = defaultRegion?.id;
    } catch (regionError) {
      console.warn('Failed to fetch regions, proceeding without region:', regionError);
    }

    // Fetch products with region/pricing context
    const productsData = await getProducts({ 
      limit: 50,
      region_id: regionId,
    });
    const products = productsData.products;

    // Fetch categories
    const categoriesData = await getCategories();

    // Transform Medusa products to our format
    const transformProduct = (product: any) => {
      const firstVariant = product.variants?.[0];

      // 1. Image Logic: thumbnail -> first image -> placeholder
      const image =
        product.thumbnail ||
        (product.images && product.images.length > 0
          ? typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0].url
          : null) ||
        "/placeholder-product.png";

      // 2. Pricing Logic: calculated_price -> cheapest_price -> variant price -> 0
      const getPrice = (variant: any) => {
        if (variant?.calculated_price) {
          return variant.calculated_price.calculated_amount / 100;
        } else if (product.cheapest_price) {
          return product.cheapest_price / 100;
        } else if (variant?.prices && variant.prices.length > 0) {
          return variant.prices[0].amount / 100;
        }
        return 0;
      };

      const getOriginalPrice = (variant: any) => {
        if (variant?.calculated_price?.original_amount) {
          return variant.calculated_price.original_amount / 100;
        } else if (variant?.prices && variant.prices.length > 1) {
          return variant.prices[1].amount / 100;
        }
        return undefined;
      };

      const price = getPrice(firstVariant);
      const originalPrice = getOriginalPrice(firstVariant);

      // 3. Stock Logic: default true unless explicitly unavailable
      const hasInventory = (variant: any) => {
        if (!variant) return true;
        return true;
      };

      // Extract category IDs from product
      const categoryIds = product.categories?.map((c: any) => c.id || c.category_id) || [];

      return {
        id: product.id,
        name: product.title || "",
        price: price,
        originalPrice: originalPrice,
        image: image,
        inStock: hasInventory(firstVariant),
        stock: firstVariant?.inventory_quantity ?? 0,
        handle: product.handle || "",
        categoryIds,
      };
    };

    const allTransformedProducts = products.map(transformProduct);

    // Main product section: ~10 products
    const featuredProducts = allTransformedProducts.slice(0, 10);
    // Best sellers row: next 5 products
    const bestSellers = allTransformedProducts.slice(10, 15);
    const latestArrivals = allTransformedProducts.slice(15, 20);

    // Group products by category for category-based sections
    // Only include categories that have products linked
    const categorySections = categoriesData.map((cat: MedusaCategory) => {
      const catId = cat.id;
      const catProducts = allTransformedProducts.filter(
        (p: any) => p.categoryIds?.includes(catId)
      ).map(({ categoryIds, ...rest }: any) => rest);

      return {
        id: catId,
        name: cat.name,
        slug: cat.handle,
        products: catProducts.slice(0, 5),
      };
    }).filter((section: any) => section.products.length > 0);

    // Transform categories for showcase - only those with products
    const categories = categoriesData
      .map((cat: MedusaCategory) => {
        const catProducts = allTransformedProducts.filter(
          (p: any) => p.categoryIds?.includes(cat.id)
        );
        return {
          id: cat.id,
          name: cat.name,
          image: (cat.metadata?.image as string) || `/images/category-placeholder.svg`,
          productCount: catProducts.length,
          slug: cat.handle,
        };
      })
      .filter((cat: any) => cat.productCount > 0);

    // Strip categoryIds from tab products
    const stripCatIds = (prods: any[]) => prods.map(({ categoryIds, ...rest }: any) => rest);

    // Create promo banners from categories with products
    const promoBanners = categories.slice(0, 4).map((cat: any) => ({
      id: `promo-${cat.id}`,
      image_url: cat.image || `/images/category-placeholder.svg`,
      title: cat.name,
      subtitle: `${cat.productCount} منتجات`,
      cta_link: `/shop/${cat.slug}`,
      cta_text: "تسوق الآن",
    }));

    return {
      featuredProducts: stripCatIds(featuredProducts),
      bestSellers: stripCatIds(bestSellers),
      latestArrivals: stripCatIds(latestArrivals),
      categorySections,
      categories,
      promoBanners,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      featuredProducts: [],
      bestSellers: [],
      latestArrivals: [],
      categorySections: [],
      categories: [],
      promoBanners: [],
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <HomeClient
      banners={heroSlides}
      sideBanners={sideBanners}
      promoBanners={data.promoBanners}
      featuredProducts={data.featuredProducts}
      bestSellers={data.bestSellers}
      latestArrivals={data.latestArrivals}
      categorySections={data.categorySections}
      categories={data.categories}
    />
  );
}
