"use client";

import ProductGrid from "@/components/product/ProductGrid";
import SortDropdown from "@/components/search/SortDropdown";
import ViewToggle from "@/components/search/ViewToggle";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getProducts, getRegions } from "@/lib/store-api";
import { useTranslations } from "next-intl";
import type { MedusaProduct } from "@/lib/types/medusa";

interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  stock: number;
}

export default function ShopPage() {
  const t = useTranslations("shop");
  const [sortBy, setSortBy] = useState<"best-selling" | "price-low" | "price-high" | "newest">("best-selling");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        // Try to fetch region for pricing, but don't block products fetch if it fails
        let regionId: string | undefined;
        try {
          const regions = await getRegions();
          const egyptRegion = regions.find(r => r.currency_code === 'egp') || regions[0];
          regionId = egyptRegion?.id;
        } catch (regionError) {
          console.warn('Failed to fetch regions, proceeding without region:', regionError);
        }

        const data = await getProducts({ 
          limit: 50,
          region_id: regionId,
        });
        const transformed = data.products.map(transformMedusaProduct);
        setAllProducts(transformed);
        setFilteredProducts(transformed);
        setDisplayedProducts(transformed.slice(0, 8));
        setHasMore(transformed.length > 8);
        setTotalCount(data.count);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setFilteredProducts([]);
        setDisplayedProducts([]);
        setHasMore(false);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const transformMedusaProduct = (product: MedusaProduct): Product => {
    const firstVariant = product.variants?.[0];
    
    // Use calculated_price for accurate pricing
    const getPrice = (variant: any) => {
      if (variant?.calculated_price) {
        return variant.calculated_price.calculated_amount;
      }
      if (variant?.prices && variant.prices.length > 0) {
        return variant.prices[0].amount;
      }
      return 0;
    };

    const getOriginalPrice = (variant: any) => {
      if (variant?.calculated_price?.original_amount) {
        return variant.calculated_price.original_amount;
      }
      if (variant?.prices && variant.prices.length > 1) {
        return variant.prices[1].amount;
      }
      return undefined;
    };

    return {
      id: product.id,
      name: product.title || '',
      price: getPrice(firstVariant),
      originalPrice: getOriginalPrice(firstVariant),
      image: product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png',
      // For demo purposes, show as available even if inventory is 0
      inStock: true,
      stock: firstVariant?.inventory_quantity ?? 0,
      handle: product.handle || '',
    };
  };

  const handleSortChange = (value: "best-selling" | "price-low" | "price-high" | "newest") => {
    setSortBy(value);
    
    let sorted = [...allProducts];
    
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
    setDisplayedProducts(sorted.slice(0, 8));
    setHasMore(sorted.length > 8);
  };

  const loadMore = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const nextLength = Math.min(currentLength + 8, filteredProducts.length);
      setDisplayedProducts(filteredProducts.slice(0, nextLength));
      setHasMore(nextLength < filteredProducts.length);
      setIsLoading(false);
    }, 1000);
  };

  const observerTarget = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMore,
  });

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-extrabold text-neutral-900 mb-2 uppercase tracking-tight">
          {t('title')}
        </h1>
        <p className="text-neutral-600">{t('subtitle')}</p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <p className="text-sm text-neutral-600 font-medium">
          {t('showing', { count: displayedProducts.length, total: totalCount })}
        </p>
        <div className="flex items-center gap-3">
          <SortDropdown value={sortBy} onChange={handleSortChange} />
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={displayedProducts} />

      {/* Load More Button (fallback) */}
      {!isLoading && hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} variant="primary">
            {t('loadMore')}
          </Button>
        </div>
      )}

      {/* Observer Target for Infinite Scroll */}
      <div ref={observerTarget} className="h-4" />

      {/* Loading State */}
      {isLoading && (
        <p className="text-center text-neutral-500 mt-8">
          {t('loading')}
        </p>
      )}

      {/* Empty State */}
      {!isLoading && displayedProducts.length === 0 && (
        <p className="text-center text-neutral-500 mt-8">
          {t('noProducts')}
        </p>
      )}

      {/* End Message */}
      {!isLoading && !hasMore && displayedProducts.length > 0 && (
        <p className="text-center text-neutral-500 mt-8">
          {t('endOfList')}
        </p>
      )}
    </div>
  );
}
