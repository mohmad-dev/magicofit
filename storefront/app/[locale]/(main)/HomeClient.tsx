"use client";

import dynamic from "next/dynamic";
import HeroBanner, { Banner, SideBanner } from "@/components/homepage/HeroBanner";
import CategoryProductSection from "@/components/homepage/CategoryProductSection";
import TrustBadges from "@/components/layout/TrustBadges";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";

// Lazy load non-critical components
const SocialMapBanner = dynamic(() => import("@/components/homepage/SocialMapBanner"), {
  loading: () => <div className="h-96 bg-neutral-800 animate-pulse" />,
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
      <div className="mt-4 md:mt-6">
        <HeroBanner banners={banners} sideBanners={sideBanners} />
      </div>

      {/* Collection Tabs with Products */}
      {collectionSections.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
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

          {/* Products Grid for Active Collection - Optimized for 10 products */}
          {activeCollectionData && activeCollectionData.products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {activeCollectionData.products.slice(0, 10).map((product, index) => (
                <ProductCard key={product.id} {...product} priority={index < 5} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category-based product sections - 10 products each */}
      {categorySections.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
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

      {/* Banner before Category Showcase */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-primary-700 py-6 md:py-8">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-2 uppercase tracking-tight">
            تسوق حسب الفئة
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            اعثر على ما تحتاجه بالضبط
          </p>
        </div>
      </div>

      {/* Category Showcase - Horizontal scroll on mobile */}
      {categories.length > 0 && (
        <section className="py-6 md:py-10 bg-neutral-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile: horizontal scroll */}
            <div className="md:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4">
              <div className="flex gap-4">
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/shop/${category.slug}`}
                    className="group bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center flex-none w-[160px] snap-start"
                  >
                    <div className="w-14 h-14 rounded-full bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center mb-3 transition-colors">
                      <svg className="w-7 h-7 text-neutral-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="font-outfit font-bold text-sm text-neutral-900 mb-1 uppercase tracking-wide">
                      {category.name}
                    </h3>
                    <p className="text-neutral-600 text-xs">
                      {category.productCount} منتج
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className="group bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
                    <svg className="w-8 h-8 text-neutral-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="font-outfit font-extrabold text-lg text-neutral-900 mb-2 uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-3">
                    {category.productCount} منتج
                  </p>
                  <div className="flex items-center text-primary-700 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                    تسوق الآن
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust badges - right after hero for first impression */}
      <div className="w-full bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <TrustBadges />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandLogos />
      </div>

      <SocialMapBanner />
    </div>
  );
}
