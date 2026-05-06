"use client";

import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useTranslations } from "next-intl";

interface CategoryClientProps {
  initialProducts: any[];
  categoryName: string;
  categorySlug: string;
}

export default function CategoryClient({ initialProducts, categoryName, categorySlug }: CategoryClientProps) {
  const [sortBy, setSortBy] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const t = useTranslations("categoryPage");
  const tCommon = useTranslations("common");

  const sortOptions = [
    { value: "featured", label: t("sortFeatured") },
    { value: "price-low", label: t("sortPriceLow") },
    { value: "price-high", label: t("sortPriceHigh") },
    { value: "newest", label: t("sortNewest") },
  ];

  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    let sorted = [...initialProducts];
    
    switch (value) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.reverse();
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  };

  const breadcrumbItems = [
    { label: tCommon("home"), href: "/" },
    { label: tCommon("shop"), href: "/shop" },
    { label: categoryName, href: `/shop/${categorySlug}` },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-outfit text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 uppercase tracking-tight">{categoryName}</h1>
        <p className="text-neutral-600 text-sm md:text-base">
          {t("productCount", { count: filteredProducts.length })}
        </p>
      </div>

      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs md:text-sm text-neutral-600">
          {t("showingProducts", { count: filteredProducts.length })}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs md:text-sm text-neutral-600 hidden sm:inline">
            {t("sortBy")}:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs md:text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-500 text-lg">{t("noProducts")}</p>
        </div>
      )}
    </div>
  );
}
