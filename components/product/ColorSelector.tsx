"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Map common color names to hex values for swatch display
const COLOR_HEX_MAP: Record<string, string> = {
  red: "#EF4444", blue: "#3B82F6", green: "#22C55E", yellow: "#EAB308",
  black: "#1F2937", white: "#F9FAFB", grey: "#6B7280", gray: "#6B7280",
  pink: "#EC4899", purple: "#A855F7", orange: "#F97316", brown: "#92400E",
  beige: "#D2B48C", navy: "#1E3A5F", teal: "#14B8A6", gold: "#D4A017",
  silver: "#C0C0C0", khaki: "#C3B091", olive: "#808000", maroon: "#800000",
  coral: "#FF7F50", turquoise: "#40E0D0", burgundy: "#800020", ivory: "#FFFFF0",
  أحمر: "#EF4444", أزرق: "#3B82F6", أخضر: "#22C55E", أصفر: "#EAB308",
  أسود: "#1F2937", أبيض: "#F9FAFB", رمادي: "#6B7280", وردي: "#EC4899",
  بنفسجي: "#A855F7", برتقالي: "#F97316", بني: "#92400E", بيج: "#D2B48C",
  كحلي: "#1E3A5F", ذهبي: "#D4A017", فضي: "#C0C0C0",
};

function getColorHex(value: string): string {
  if (value.startsWith("#") || value.startsWith("rgb")) return value;
  return COLOR_HEX_MAP[value.toLowerCase()] || "#" + value.toLowerCase().replace(/\s/g, "");
}

interface ColorSelectorProps {
  colors: Array<{ name: string; value: string }>;
  selectedColor?: string;
  onSelect: (color: string) => void;
  availableColors?: string[];
}

export default function ColorSelector({
  colors,
  selectedColor,
  onSelect,
  availableColors,
}: ColorSelectorProps) {
  const t = useTranslations("product");
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-neutral-900 uppercase tracking-wide">{t("color")}</label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isAvailable = !availableColors || availableColors.includes(color.name);
          const isSelected = selectedColor === color.name;
          const hexColor = getColorHex(color.value);

          return (
            <button
              key={color.name}
              onClick={() => isAvailable && onSelect(color.name)}
              disabled={!isAvailable}
              className={cn(
                "relative h-12 w-12 rounded-full border-2 transition-all",
                isSelected
                  ? "border-primary-600 ring-2 ring-offset-2 ring-primary-600"
                  : isAvailable
                  ? "border-neutral-300 hover:border-primary-600"
                  : "border-neutral-200 opacity-50 cursor-not-allowed"
              )}
              style={{ backgroundColor: hexColor }}
              title={color.name}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
