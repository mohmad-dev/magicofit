import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSelect: (size: string) => void;
  availableSizes?: string[];
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  availableSizes,
}: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => {
          const isAvailable = !availableSizes || availableSizes.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              onClick={() => isAvailable && onSelect(size)}
              disabled={!isAvailable}
              className={cn(
                "h-12 rounded-lg border-2 text-sm font-semibold transition-all",
                isSelected
                  ? "border-primary-600 bg-primary-600 text-white"
                  : isAvailable
                  ? "border-neutral-300 bg-white text-neutral-900 hover:border-primary-600 hover:text-primary-600"
                  : "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
