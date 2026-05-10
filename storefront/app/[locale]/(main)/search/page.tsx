"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import FilterSidebar from "@/components/search/FilterSidebar";
import FilterSheet from "@/components/search/FilterSheet";
import ProductGrid from "@/components/product/ProductGrid";
import ActiveFilterChips from "@/components/search/ActiveFilterChips";
import SortDropdown from "@/components/search/SortDropdown";
import ViewToggle from "@/components/search/ViewToggle";
import { searchProducts } from "@/lib/store-api";
import { useTranslations } from "next-intl";
import type { MedusaProduct } from "@/lib/types/medusa";

const mockCategories = [
  {
    id: "1",
    name: "Categories",
    options: [
      { id: "running", name: "Running", count: 245 },
      { id: "training", name: "Training", count: 189 },
      { id: "football", name: "Football", count: 156 },
      { id: "basketball", name: "Basketball", count: 98 },
      { id: "gym", name: "Gym", count: 312 },
    ],
  },
];

export default function SearchPage() {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: 9999 });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"best-selling" | "price-low" | "price-high" | "newest">("best-selling");

  // Search products when query changes
  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await searchProducts(query);
        const transformed = data.products.map((product: MedusaProduct) => {
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
            handle: product.handle || '',
            name: product.title || '',
            price: getPrice(firstVariant),
            originalPrice: getOriginalPrice(firstVariant),
            image: product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png',
            // For demo purposes, show as available even if inventory is 0
            inStock: true,
          };
        });
        setResults(transformed);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setSelectedPriceRange(range);
  };

  const handleClearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedPriceRange({ min: 0, max: 9999 });
  };

  const handleApplyFilters = () => {
    // Apply filters to results
    // Apply filters logic
  };

  const activeFilterCount = selectedCategories.size + (selectedPriceRange.min > 0 || selectedPriceRange.max < 9999 ? 1 : 0);

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder={t('placeholder')}
        />
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            categories={mockCategories}
            priceRange={{ min: 0, max: 9999 }}
            selectedCategories={selectedCategories}
            selectedPriceRange={selectedPriceRange}
            onCategoryToggle={handleCategoryToggle}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {t('filters')}
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="mb-4">
              <ActiveFilterChips
                filters={[
                  ...Array.from(selectedCategories).map((cat) => ({
                    id: cat,
                    label: cat,
                    type: "category" as const,
                  })),
                  ...(selectedPriceRange.min > 0 || selectedPriceRange.max < 9999
                    ? [
                        {
                          id: "price",
                          label: `${selectedPriceRange.min}-${selectedPriceRange.max}`,
                          type: "price" as const,
                        },
                      ]
                    : []),
                ]}
                onRemove={(filterId) => {
                  if (filterId === "price") {
                    setSelectedPriceRange({ min: 0, max: 9999 });
                  } else {
                    handleCategoryToggle(filterId);
                  }
                }}
                onClearAll={handleClearFilters}
              />
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            {query ? (
              <SearchResults
                query={query}
                results={results}
                totalResults={results.length}
              />
            ) : (
              <div>
                <h1 className="font-outfit text-2xl font-extrabold text-neutral-900 uppercase tracking-tight">
                  {t('allProducts')}
                </h1>
                <p className="text-neutral-600">{t('browseCollection')}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3">
              <SortDropdown value={sortBy} onChange={setSortBy} />
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-neutral-200 rounded-xl mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-1"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <ProductGrid products={results} />
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-lg">{t('noResultsFor', { query })}</p>
              <p className="text-neutral-500 text-sm mt-2">{t('tryDifferent')}</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-lg">{t('enterSearch')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {isFilterOpen && (
        <FilterSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={mockCategories}
          priceRange={{ min: 0, max: 9999 }}
          selectedCategories={selectedCategories}
          selectedPriceRange={selectedPriceRange}
          onCategoryToggle={handleCategoryToggle}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
}
