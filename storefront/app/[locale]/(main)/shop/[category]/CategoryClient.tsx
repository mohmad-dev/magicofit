"use client";

import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

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
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#111318] mb-2 uppercase rtl:tracking-normal tracking-tight">
          {categoryName}
        </h1>
        <p className="text-[#525252] text-sm md:text-base">
          {t("productCount", { count: filteredProducts.length })}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-xs md:text-sm text-[#525252]">
          {t("showingProducts", { count: filteredProducts.length })}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs md:text-sm text-[#525252] hidden sm:inline">
            {t("sortBy")}:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="min-h-[44px] rounded-lg border border-neutral-300 px-3 py-2 text-xs md:text-sm text-[#111318] focus:border-[#0F1115] focus:outline-none focus:ring-1 focus:ring-[#0F1115] bg-white cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-16 bg-[#F5F5F5] rounded-2xl px-4">
          <p className="text-[#525252] text-lg mb-5">{t("noProducts")}</p>
          <Link
            href="/shop"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0F1115] hover:bg-[#D9480F] px-7 py-2.5 text-sm font-bold text-white transition-colors"
          >
            {isAr ? "تصفح جميع المنتجات" : "Browse All Products"}
          </Link>
        </div>
      )}
    </div>
  );
}
