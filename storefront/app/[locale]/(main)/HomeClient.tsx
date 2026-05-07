"use client";

import dynamic from "next/dynamic";
import HeroBanner, { Banner, SideBanner } from "@/components/homepage/HeroBanner";
import PromotionalBanners, { PromoBanner } from "@/components/homepage/PromotionalBanners";
import CategoryShowcase from "@/components/homepage/CategoryShowcase";
import TabbedProductShowcase from "@/components/homepage/TabbedProductShowcase";
import CategoryProductSection from "@/components/homepage/CategoryProductSection";
import TrustBadges from "@/components/layout/TrustBadges";

// Lazy load non-critical components
const WhatsAppSubscribe = dynamic(() => import("@/components/homepage/WhatsAppSubscribe"), {
  loading: () => <div className="h-96 bg-neutral-900 animate-pulse" />,
});

const BrandLogos = dynamic(() => import("@/components/homepage/BrandLogos"), {
  loading: () => <div className="h-32 bg-neutral-100 animate-pulse rounded-xl" />,
});



interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  slug: string;
}

interface CategorySection {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface HomeClientProps {
  banners: Banner[];
  sideBanners: SideBanner[];
  promoBanners: PromoBanner[];
  featuredProducts: Product[];
  bestSellers: Product[];
  latestArrivals: Product[];
  categorySections: CategorySection[];
  categories: Category[];
}

export default function HomeClient({
  banners,
  sideBanners,
  promoBanners,
  featuredProducts,
  bestSellers,
  latestArrivals,
  categorySections,
  categories,
}: HomeClientProps) {
  return (
    <div className="flex flex-col">
      <HeroBanner banners={banners} sideBanners={sideBanners} />

      {/* Trust badges - right after hero for first impression */}
      <div className="w-full bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <TrustBadges />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <TabbedProductShowcase
          featuredProducts={featuredProducts}
          bestSellers={bestSellers}
          latestArrivals={latestArrivals}
        />
      </div>

      {/* Category-based product sections */}
      {categorySections.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {categorySections.map((section) => (
            <CategoryProductSection
              key={section.id}
              categoryName={section.name}
              categorySlug={section.slug}
              products={section.products}
            />
          ))}
        </div>
      )}

      <PromotionalBanners banners={promoBanners} />

      {categories.length > 0 && (
        <CategoryShowcase
          categories={categories}
        />
      )}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandLogos />
      </div>

      <WhatsAppSubscribe />
    </div>
  );
}
