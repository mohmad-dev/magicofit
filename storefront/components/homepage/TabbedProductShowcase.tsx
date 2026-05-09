"use client";

import { useState } from "react";
import ProductCard from "../product/ProductCard";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

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

interface TabbedProductShowcaseProps {
  featuredProducts: Product[];
  bestSellers: Product[];
  latestArrivals: Product[];
}

type TabType = "featured" | "bestsellers" | "latest";

export default function TabbedProductShowcase({
  featuredProducts,
  bestSellers,
  latestArrivals,
}: TabbedProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TabType>("featured");

  const t = useTranslations("productShowcase");

  const tabs = [
    { id: "featured" as TabType, label: t('featured'), href: "/collection/منتجات-مميزة" },
    { id: "bestsellers" as TabType, label: t('bestsellers'), href: "/collection/الأكثر-مبيعاً" },
    { id: "latest" as TabType, label: t('latest'), href: "/collection/new-arrivals" },
  ];

  const getProducts = () => {
    switch (activeTab) {
      case "featured":
        return featuredProducts;
      case "bestsellers":
        return bestSellers;
      case "latest":
        return latestArrivals;
      default:
        return featuredProducts;
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="py-8 md:py-16">
      {/* Tab Navigation + View All */}
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <div className="flex gap-2 md:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-outfit font-bold text-xs md:text-sm uppercase tracking-wide whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        {activeTabData && (
          <Link
            href={activeTabData.href}
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 uppercase tracking-wide whitespace-nowrap"
          >
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Products - Mobile: 2-col grid, Desktop: 4-col grid for bigger cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
        {getProducts().map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            hideAddToCart
          />
        ))}
      </div>

      {getProducts().length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          {t('noProducts')}
        </div>
      )}

      {/* Mobile View All link */}
      {activeTabData && (
        <Link
          href={activeTabData.href}
          className="md:hidden flex items-center justify-center gap-1 mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 uppercase tracking-wide"
        >
          {t('viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </section>
  );
}
