"use client";

import dynamic from "next/dynamic";
import HeroBanner, { Banner, SideBanner } from "@/components/homepage/HeroBanner";
import CategoryProductSection from "@/components/homepage/CategoryProductSection";
import SportDisciplineHub from "@/components/homepage/SportDisciplineHub";
import TrustBadges from "@/components/layout/TrustBadges";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SocialMapBanner = dynamic(() => import("@/components/homepage/SocialMapBanner"), {
  loading: () => <div className="h-96 bg-[#0E1014] animate-pulse" />,
});

const BrandLogos = dynamic(() => import("@/components/homepage/BrandLogos"), {
  loading: () => <div className="h-28 bg-surface-subtle animate-pulse" />,
});

interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  categoryName?: string;
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
  const DirectionalArrow = isAr ? ArrowLeft : ArrowRight;
  const [activeCollection, setActiveCollection] = useState(0);

  const activeCollectionData = collectionSections[activeCollection] || collectionSections[0];

  return (
    <div className="flex flex-col bg-canvas">
      {/* 1. Editorial 16:9 Hero + 2 Architectural Callout Panels */}
      <HeroBanner banners={banners} sideBanners={sideBanners} />

      {/* 2. Razor-Clean Early Trust Utility Bar */}
      <TrustBadges />

      {/* 3. Signature Interactive «Choose Your Game» Sport Discipline Hub */}
      <SportDisciplineHub categories={categories} categorySections={categorySections} />

      {/* 4. Tabbed Featured Collections Showcase */}
      {collectionSections.length > 0 && (
        <section className="py-10 md:py-12 border-t border-border-subtle bg-white">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink-primary uppercase rtl:tracking-normal tracking-tight">
                  {activeCollectionData?.title || (isAr ? "تشكيلاتنا المختارة" : "Featured Collections")}
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
                <div
                  role="tablist"
                  aria-label={isAr ? "المجموعات المميزة" : "Featured collections"}
                  className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#ECEAE3] border border-border-subtle overflow-x-auto max-w-full"
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
                        className={`min-h-[44px] px-4 sm:px-5 rounded-md font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[#0E1014] text-[#E5C573]"
                            : "text-ink-secondary hover:text-ink-primary"
                        }`}
                      >
                        {collection.title}
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-xs sm:text-sm font-bold text-ink-primary hover:text-primary-600 transition-colors whitespace-nowrap"
                >
                  <span>{isAr ? "تصفح المتجر" : "Shop All"}</span>
                  <DirectionalArrow className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {activeCollectionData && activeCollectionData.products.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {activeCollectionData.products.slice(0, 8).map((product, index) => (
                  <ProductCard key={product.id} {...product} priority={index < 4} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Category Product Shelves */}
      {categorySections.length > 0 && (
        <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
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

      {/* 6. Kinetic Global Brands Marquee */}
      <BrandLogos />

      {/* 7. Store Headquarters Map & Direct Channels */}
      <SocialMapBanner />
    </div>
  );
}
