"use client";

import { X } from "lucide-react";
import { Button } from "../ui/Button";
import FilterSidebar from "./FilterSidebar";

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

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterCategory[];
  priceRange: { min: number; max: number };
  selectedCategories: Set<string>;
  selectedPriceRange: { min: number; max: number };
  onCategoryToggle: (categoryId: string) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export default function FilterSheet({
  isOpen,
  onClose,
  categories,
  priceRange,
  selectedCategories,
  selectedPriceRange,
  onCategoryToggle,
  onPriceRangeChange,
  onClearFilters,
  onApplyFilters,
}: FilterSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
          <h2 className="font-outfit text-lg font-extrabold text-neutral-900 uppercase tracking-tight">Filters</h2>
          <Button
            variant="icon"
            size="icon"
            onClick={onClose}
            className="hover:bg-neutral-100"
          >
            <X className="h-5 w-5 text-neutral-700" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar
            categories={categories}
            priceRange={priceRange}
            selectedCategories={selectedCategories}
            selectedPriceRange={selectedPriceRange}
            onCategoryToggle={onCategoryToggle}
            onPriceRangeChange={onPriceRangeChange}
            onClearFilters={onClearFilters}
            onApplyFilters={onApplyFilters}
          />
        </div>
      </div>
    </div>
  );
}
