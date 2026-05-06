import { X } from "lucide-react";

interface ActiveFilter {
  id: string;
  label: string;
  type: "category" | "price" | "brand" | "size" | "color";
}

interface ActiveFilterChipsProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilterChips({
  filters,
  onRemove,
  onClearAll,
}: ActiveFilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-neutral-900">
          Active Filters:
        </span>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onRemove(filter.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-primary-500/50 rounded-full text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors group"
          >
            {filter.label}
            <X className="h-3 w-3 group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-sm font-bold text-neutral-600 hover:text-neutral-900 underline underline-offset-2 transition-colors whitespace-nowrap"
      >
        Clear All
      </button>
    </div>
  );
}
