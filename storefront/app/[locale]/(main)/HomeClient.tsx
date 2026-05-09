"use client";

import dynamic from "next/dynamic";
import HeroBanner, { Banner, SideBanner } from "@/components/homepage/HeroBanner";
import CategoryShowcase from "@/components/homepage/CategoryShowcase";
import CategoryProductSection from "@/components/homepage/CategoryProductSection";
import TrustBadges from "@/components/layout/TrustBadges";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";

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

interface CollectionSection {
  id: string;
  handle: string;
  title: string;
  products: Product[];
}

interface HomeClientProps {
  banners: Banner[];
  sideBanners: SideBanner[];
  collectionSections: CollectionSection[];
  categorySections: CategorySection[];
  categories: Category[];
}

export default function HomeClient({
  banners,
  sideBanners,
  collectionSections,
  categorySections,
  categories,
}: HomeClientProps) {
  const [activeCollection, setActiveCollection] = useState(0);

  // Get the active collection products
  const activeCollectionData = collectionSections[activeCollection] || collectionSections[0];

  return (
    <div className="flex flex-col">
      <HeroBanner banners={banners} sideBanners={sideBanners} />

      {/* Trust badges - right after hero for first impression */}
      <div className="w-full bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <TrustBadges />
        </div>
      </div>

      {/* Collection Tabs with Products */}
      {collectionSections.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Collection Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {collectionSections.map((collection, index) => (
              <button
                key={collection.id}
                onClick={() => setActiveCollection(index)}
                className={`px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all ${
                  activeCollection === index
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {collection.title}
              </button>
            ))}
          </div>

          {/* Products Grid for Active Collection */}
          {activeCollectionData && activeCollectionData.products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {activeCollectionData.products.slice(0, 10).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Banner before Category Showcase */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-primary-700 py-8 md:py-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-2 uppercase tracking-tight">
            تسوق حسب الفئة
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            اعثر على ما تحتاجه بالضبط
          </p>
        </div>
      </div>

      {/* Category Showcase - Only one instance */}
      {categories.length > 0 && (
        <CategoryShowcase categories={categories} />
      )}

      {/* Category-based product sections - 10 products each */}
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

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandLogos />
      </div>

      <WhatsAppSubscribe />
    </div>
  );
}
