"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type SortOption = "best-selling" | "price-low" | "price-high" | "newest";

interface SortOptionConfig {
  value: SortOption;
  label: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  { value: "best-selling", label: "Best Selling" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:border-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Sort products"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-neutral-900">
          Sort: {selectedOption?.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  value === option.value
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
