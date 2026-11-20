"use client";

import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

interface CategoryClientProps {
  initialProducts: any[];
  categoryName: string;
  categorySlug: string;
  debugInfo?: {
    searchedSlug?: string;
    availableCategories?: string[];
    foundCategory?: string;
    error?: string;
  };
}

export default function CategoryClient({ initialProducts, categoryName, categorySlug }: CategoryClientProps) {
  const [sortBy, setSortBy] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const t = useTranslations("categoryPage");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";

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
        <div className="flex items-center gap-2.5 mb-2">
          <span className="h-[2px] w-5 bg-[#C8A04A]" aria-hidden="true" />
          <span className="text-xs font-bold text-[#A68132] uppercase rtl:tracking-normal tracking-wider">
            {tCommon("categories")}
          </span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-ink-primary mb-1.5 uppercase rtl:tracking-normal tracking-tight">
          {categoryName}
        </h1>
        <p className="text-ink-secondary text-sm md:text-base">
          {t("productCount", { count: filteredProducts.length })}
        </p>
      </div>

      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
        <p className="text-xs md:text-sm text-ink-secondary font-medium">
          {t("showingProducts", { count: filteredProducts.length })}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs md:text-sm text-ink-secondary hidden sm:inline">
            {t("sortBy")}:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="min-h-[40px] rounded-md border border-border-subtle px-3 py-2 text-xs md:text-sm focus:border-ink-primary focus:outline-none bg-white cursor-pointer"
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
        <div className="text-center py-16 bg-white rounded-lg border border-border-subtle px-4">
          <p className="text-ink-primary font-bold text-lg mb-2">{t("noProducts")}</p>
          <p className="text-ink-secondary text-sm mb-6">
            {isAr
              ? "جرب استكشاف بقية الأقسام الرياضية أو تصفح المتجر بالكامل."
              : "Explore our other sports categories or browse the full store."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-md bg-[#0E1014] text-white text-sm font-bold hover:bg-[#171A21] transition-colors"
          >
            {isAr ? "تصفح جميع المنتجات" : "Browse All Products"}
          </Link>
        </div>
      )}
    </div>
  );
}
