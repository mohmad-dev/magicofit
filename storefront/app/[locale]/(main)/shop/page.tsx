"use client";

import ProductGrid from "@/components/product/ProductGrid";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import ViewToggle from "@/components/search/ViewToggle";
import { Button } from "@/components/ui/Button";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getCategories, getProducts, getRegions } from "@/lib/store-api";
import { useLocale, useTranslations } from "next-intl";
import type { MedusaCategory, MedusaProduct } from "@/lib/types/medusa";

interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  categoryName?: string;
  categoryIds: string[];
  inStock: boolean;
  stock: number;
}

export default function ShopPage() {
  const t = useTranslations("shop");
  const tCat = useTranslations("categoryPage");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [sortBy, setSortBy] = useState<"best-selling" | "price-low" | "price-high" | "newest">("best-selling");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [categories, setCategories] = useState<MedusaCategory[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleLimit, setVisibleLimit] = useState<number>(12);
  const [isLoading, setIsLoading] = useState(true);

  const transformMedusaProduct = useCallback((product: MedusaProduct): Product => {
    const firstVariant = product.variants?.[0];
    const image = product.thumbnail || product.images?.[0]?.url || "/placeholder-product.png";
    const secondImg = product.images && product.images.length > 1 ? product.images[1].url : undefined;
    const hoverImage = secondImg && secondImg !== image ? secondImg : undefined;

    const getPrice = (variant: any) => {
      if (variant?.calculated_price) return variant.calculated_price.calculated_amount;
      if (variant?.prices && variant.prices.length > 0) return variant.prices[0].amount;
      return 0;
    };

    const getOriginalPrice = (variant: any) => {
      if (variant?.calculated_price?.original_amount) return variant.calculated_price.original_amount;
      if (variant?.prices && variant.prices.length > 1) return variant.prices[1].amount;
      return undefined;
    };

    return {
      id: product.id,
      name: product.title || "",
      price: getPrice(firstVariant),
      originalPrice: getOriginalPrice(firstVariant),
      image,
      hoverImage,
      categoryName: product.categories?.[0]?.name || undefined,
      categoryIds: product.categories?.map((c) => c.id) || [],
      inStock: true,
      stock: firstVariant?.inventory_quantity ?? 0,
      handle: product.handle || "",
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchShopData() {
      try {
        setIsLoading(true);
        let regionId: string | undefined;
        try {
          const regions = await getRegions();
          const egyptRegion = regions.find((r) => r.currency_code === "egp") || regions[0];
          regionId = egyptRegion?.id;
        } catch (regionError) {
          console.warn("Failed to fetch regions, proceeding without region:", regionError);
        }

        const [productsRes, catsRes] = await Promise.all([
          getProducts({ limit: 80, region_id: regionId }),
          getCategories().catch(() => [] as MedusaCategory[]),
        ]);

        if (!active) return;
        const transformed = productsRes.products.map(transformMedusaProduct);
        setAllProducts(transformed);
        setCategories(catsRes || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (active) setAllProducts([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    fetchShopData();
    return () => {
      active = false;
    };
  }, [transformMedusaProduct]);

  const filteredProducts = useMemo(() => {
    const byCat =
      selectedCategoryId === "all"
        ? [...allProducts]
        : allProducts.filter((p) => p.categoryIds.includes(selectedCategoryId));

    switch (sortBy) {
      case "price-low":
        return [...byCat].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...byCat].sort((a, b) => b.price - a.price);
      case "newest":
        return [...byCat].reverse();
      default:
        return byCat;
    }
  }, [allProducts, selectedCategoryId, sortBy]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, visibleLimit),
    [filteredProducts, visibleLimit]
  );

  const hasMore = visibleLimit < filteredProducts.length;

  const loadMore = useCallback(() => {
    setVisibleLimit((prev) => Math.min(prev + 12, filteredProducts.length));
  }, [filteredProducts.length]);

  const observerTarget = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMore,
  });

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Editorial Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="h-[2px] w-5 bg-[#C8A04A]" aria-hidden="true" />
          <span className="text-xs font-bold text-[#A68132] uppercase rtl:tracking-normal tracking-wider">
            {isAr ? "كتالوج الماجيكو" : "MagicOFit Catalog"}
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-primary mb-1.5 uppercase rtl:tracking-normal tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary">{t("subtitle")}</p>
      </div>

      {/* Category Quick-Filter Bar */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 mb-5 border-b border-border-subtle">
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId("all");
              setVisibleLimit(12);
            }}
            className={`min-h-[40px] px-4 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap border transition-colors cursor-pointer ${
              selectedCategoryId === "all"
                ? "bg-[#0E1014] text-[#E5C573] border-[#0E1014]"
                : "bg-white text-ink-secondary border-border-subtle hover:text-ink-primary"
            }`}
          >
            {isAr ? "الكل" : "All"}
          </button>
          {categories.map((cat) => {
            const isAct = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setVisibleLimit(12);
                }}
                className={`min-h-[40px] px-4 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                  isAct
                    ? "bg-[#0E1014] text-[#E5C573] border-[#0E1014]"
                    : "bg-white text-ink-secondary border-border-subtle hover:text-ink-primary"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <p className="text-xs sm:text-sm text-ink-secondary font-medium tabular-nums">
          {t("showing", { count: displayedProducts.length, total: filteredProducts.length })}
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label={tCat("sortBy")}
            className="min-h-[40px] rounded-md border border-border-subtle bg-white px-3.5 text-xs sm:text-sm font-semibold text-ink-primary focus:border-ink-primary focus:outline-none cursor-pointer"
          >
            <option value="best-selling">{tCat("sortFeatured")}</option>
            <option value="price-low">{tCat("sortPriceLow")}</option>
            <option value="price-high">{tCat("sortPriceHigh")}</option>
            <option value="newest">{tCat("sortNewest")}</option>
          </select>
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Product Grid / Skeleton */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : displayedProducts.length > 0 ? (
        <ProductGrid products={displayedProducts} />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-border-subtle">
          <p className="text-ink-secondary font-medium">{t("noProducts")}</p>
        </div>
      )}

      {/* Instant Load More Button */}
      {!isLoading && hasMore && (
        <div className="flex justify-center mt-10">
          <Button onClick={loadMore} variant="secondary">
            {t("loadMore")}
          </Button>
        </div>
      )}

      <div ref={observerTarget} className="h-4" />

      {!isLoading && !hasMore && displayedProducts.length > 0 && (
        <p className="text-center text-xs text-ink-secondary mt-8">{t("endOfList")}</p>
      )}
    </div>
  );
}
