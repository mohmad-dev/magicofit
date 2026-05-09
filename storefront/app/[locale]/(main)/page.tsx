import HomeClient from "./HomeClient";
import { getProducts, getCategories, getRegions, getCollections } from "@/lib/store-api";
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

    // Fetch collections
    const collections = await getCollections();
    console.log('Collections:', collections.map(c => ({ id: c.id, handle: c.handle, title: c.title })));

    // Define the 3 main collections we want to display
    const collectionHandles = ['منتجات-مميزة', 'الأكثر-مبيعاً', 'new-arrivals'];
    const collectionData: { id: string; handle: string; title: string; products: any[] }[] = [];

    // Fetch products for each collection
    for (const handle of collectionHandles) {
      const collection = collections.find(c => c.handle === handle || c.handle === decodeURIComponent(handle));
      if (collection) {
        const productsData = await getProducts({
          limit: 10,
          collection_id: [collection.id],
          region_id: regionId,
        });
        collectionData.push({
          id: collection.id,
          handle: collection.handle,
          title: collection.title,
          products: productsData.products,
        });
      }
    }

    // Fetch categories
    const categoriesData = await getCategories();

    // Fetch all products for category sections
    const allProductsData = await getProducts({
      limit: 100,
      region_id: regionId,
    });

    // Transform Medusa products to our format
    const transformProduct = (product: any) => {
      const firstVariant = product.variants?.[0];

      const image =
        product.thumbnail ||
        (product.images && product.images.length > 0
          ? typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0].url
          : null) ||
        "/placeholder-product.png";

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

      const categoryIds = product.categories?.map((c: any) => c.id || c.category_id) || [];

      return {
        id: product.id,
        name: product.title || "",
        price: price,
        originalPrice: originalPrice,
        image: image,
        inStock: true,
        stock: firstVariant?.inventory_quantity ?? 0,
        handle: product.handle || "",
        categoryIds,
      };
    };

    // Transform products for each collection
    const collectionSections = collectionData.map(col => ({
      id: col.id,
      handle: col.handle,
      title: col.title,
      products: col.products.map(transformProduct),
    }));

    // Group products by category - 10 products per category
    const allTransformedProducts = allProductsData.products.map(transformProduct);

    const categorySections = categoriesData.map((cat: MedusaCategory) => {
      const catProducts = allTransformedProducts.filter(
        (p: any) => p.categoryIds?.includes(cat.id)
      ).map(({ categoryIds, ...rest }: any) => rest);

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.handle,
        products: catProducts.slice(0, 10),
      };
    }).filter((section: any) => section.products.length > 0);

    // Transform categories for showcase
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

    return {
      collectionSections,
      categorySections,
      categories,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      collectionSections: [],
      categorySections: [],
      categories: [],
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <HomeClient
      banners={heroSlides}
      sideBanners={sideBanners}
      collectionSections={data.collectionSections}
      categorySections={data.categorySections}
      categories={data.categories}
    />
  );
}
