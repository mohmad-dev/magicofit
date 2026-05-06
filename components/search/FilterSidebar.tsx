"use client";

import { useState } from "react";
import Slider from "../ui/Slider";
import { Button } from "../ui/Button";

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface FilterCategory {
  id: string;
  name: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  categories: FilterCategory[];
  priceRange: { min: number; max: number };
  selectedCategories: Set<string>;
  selectedPriceRange: { min: number; max: number };
  onCategoryToggle: (categoryId: string) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export default function FilterSidebar({
  categories,
  priceRange,
  selectedCategories,
  selectedPriceRange,
  onCategoryToggle,
  onPriceRangeChange,
  onClearFilters,
  onApplyFilters,
}: FilterSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState(selectedPriceRange);

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange({ min: value[0], max: value[1] });
  };

  const handleApplyPrice = () => {
    onPriceRangeChange(localPriceRange);
  };

  const hasActiveFilters =
    selectedCategories.size > 0 ||
    selectedPriceRange.min !== priceRange.min ||
    selectedPriceRange.max !== priceRange.max;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-outfit text-lg font-extrabold text-neutral-900 uppercase tracking-tight">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-900">Categories</h3>
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">{category.name}</p>
            <div className="space-y-1 ml-2">
              {category.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(option.id)}
                    onChange={() => onCategoryToggle(option.id)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">{option.name}</span>
                  <span className="text-xs text-neutral-400">({option.count})</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-900">Price Range</h3>
        <div className="px-2">
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            value={[localPriceRange.min, localPriceRange.max]}
            onValueChange={handlePriceChange}
            step={10}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={localPriceRange.min}
              onChange={(e) =>
                setLocalPriceRange({
                  ...localPriceRange,
                  min: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <span className="text-neutral-400 font-medium">-</span>
          <div className="flex-1">
            <input
              type="number"
              value={localPriceRange.max}
              onChange={(e) =>
                setLocalPriceRange({
                  ...localPriceRange,
                  max: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full font-semibold"
          onClick={handleApplyPrice}
        >
          Apply Price Range
        </Button>
      </div>

      {/* Apply Button */}
      <div className="pt-4 border-t border-neutral-200">
        <Button variant="primary" size="md" className="w-full font-bold" onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
