import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional class handling and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in EGP (Egyptian Pound)
 * @param price - The price value to format
 * @returns Formatted price string (e.g., "500 ج.م.")
 */
export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(price);
  return `${formatted} ج.م.`;
}

/**
 * Extract variant option value by option title from Medusa v2 variant options
 * Medusa v2 returns options as: [{ id, value, option: { title: "Size" } }]
 * Legacy format was: { Size: "M", Color: "Black" }
 */
export function getVariantOptionValue(
  variantOptions: Array<{ id: string; value: string; option?: { id: string; title: string } }> | Record<string, string> | undefined,
  optionTitle: string
): string | undefined {
  if (!variantOptions) return undefined;
  if (Array.isArray(variantOptions)) {
    const found = variantOptions.find(o => o.option?.title === optionTitle);
    return found?.value;
  }
  // Legacy Record format
  return variantOptions[optionTitle];
}
