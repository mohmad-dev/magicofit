"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";

export type SortOption = "best-selling" | "price-low" | "price-high" | "newest";

interface SortOptionConfig {
  value: SortOption;
  labelAr: string;
  labelEn: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  { value: "best-selling", labelAr: "الأكثر مبيعاً", labelEn: "Best Selling" },
  { value: "price-low", labelAr: "السعر: من الأقل للأعلى", labelEn: "Price: Low to High" },
  { value: "price-high", labelAr: "السعر: من الأعلى للأقل", labelEn: "Price: High to Low" },
  { value: "newest", labelAr: "الأحدث", labelEn: "Newest" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const isAr = locale === "ar";

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[44px] items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-lg hover:border-[#0E1014] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 cursor-pointer"
        aria-label={isAr ? "ترتيب المنتجات" : "Sort products"}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-ink-primary">
          {isAr ? "ترتيب: " : "Sort: "}
          {selectedOption ? (isAr ? selectedOption.labelAr : selectedOption.labelEn) : ""}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-ink-secondary transition-transform ${
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
          <div className="absolute end-0 top-full mt-2 z-20 w-56 bg-white border border-border-subtle rounded-xl shadow-lg py-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full min-h-[44px] px-4 py-2 text-start text-sm transition-colors cursor-pointer ${
                  value === option.value
                    ? "bg-[#0E1014] text-[#E5C573] font-semibold"
                    : "text-ink-primary hover:bg-[#F0EFEA]"
                }`}
              >
                {isAr ? option.labelAr : option.labelEn}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
