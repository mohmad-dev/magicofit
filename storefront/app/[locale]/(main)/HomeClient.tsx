"use client";

import dynamic from "next/dynamic";
import HeroBanner, { Banner, SideBanner } from "@/components/homepage/HeroBanner";
import CategoryProductSection from "@/components/homepage/CategoryProductSection";
import TrustBadges from "@/components/layout/TrustBadges";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const SocialMapBanner = dynamic(() => import("@/components/homepage/SocialMapBanner"), {
  loading: () => <div className="h-72 bg-white border-t border-[#EAEAEA] animate-pulse" />,
});

const BrandLogos = dynamic(() => import("@/components/homepage/BrandLogos"), {
  loading: () => <div className="h-28 bg-[#F5F5F5] animate-pulse" />,
});

interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
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
  const locale = useLocale();
  const isAr = locale === "ar";
  const [activeCollection, setActiveCollection] = useState(0);

  const activeCollectionData = collectionSections[activeCollection] || collectionSections[0];

  return (
    <div className="flex flex-col bg-white overflow-x-clip">
      {/* 1. Full-Width Clean Hero Banner */}
      <HeroBanner banners={banners} sideBanners={sideBanners} />

      {/* 2. Compact Single-Row Horizontal Category Strip */}
      <nav
        aria-label={isAr ? "تصفح الفئات" : "Browse categories"}
        className="w-full bg-white border-b border-[#EAEAEA]"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center md:justify-center gap-2 overflow-x-auto scrollbar-hide">
            <Link
              href="/shop"
              className="min-h-[40px] px-5 rounded-full bg-[#0F1115] text-white text-xs sm:text-sm font-bold whitespace-nowrap flex-shrink-0 inline-flex items-center transition-colors hover:bg-[#D9480F]"
            >
              {isAr ? "الكل" : "All"}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop/${category.slug}`}
                className="min-h-[40px] px-4 rounded-full bg-[#F5F5F5] hover:bg-[#0F1115] text-[#111318] hover:text-white text-xs sm:text-sm font-bold whitespace-nowrap flex-shrink-0 transition-colors inline-flex items-center"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. Collection Tabs + Stacked 5-Column Product Grid */}
      {collectionSections.length > 0 && (
        <section className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4 md:pt-8 md:pb-6">
          <div
            role="tablist"
            aria-label={isAr ? "المجموعات المميزة" : "Featured collections"}
            className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-hide mb-6"
          >
            {collectionSections.map((collection, index) => {
              const isActive = activeCollection === index;
              return (
                <button
                  key={collection.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCollection(index)}
                  className={`min-h-[44px] px-5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                    isActive
                      ? "bg-[#0F1115] text-white"
                      : "bg-[#F5F5F5] text-[#111318] hover:bg-neutral-200"
                  }`}
                >
                  {collection.title}
                </button>
              );
            })}
          </div>

          {activeCollectionData && activeCollectionData.products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
              {activeCollectionData.products.slice(0, 10).map((product, index) => (
                <ProductCard key={product.id} {...product} priority={index < 5} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. Stacked Category Product Grids (10 products max per section) */}
      {categorySections.length > 0 && (
        <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
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

      {/* 5. Single-Row Minimal Horizontal Trust Bar */}
      <TrustBadges />

      {/* 6. Soft Studio Gray Brand Strip */}
      <BrandLogos />

      {/* 7. Seamless Charcoal Contact & Store Location Section */}
      <SocialMapBanner />
    </div>
  );
}
