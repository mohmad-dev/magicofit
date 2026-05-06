import { Grid3x3, List } from "lucide-react";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-neutral-100 rounded-lg p-1">
      <button
        onClick={() => onChange("grid")}
        className={`p-2 rounded-md transition-all ${
          value === "grid"
            ? "bg-white shadow-sm text-primary-600"
            : "text-neutral-600 hover:text-neutral-900"
        }`}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
      >
        <Grid3x3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-2 rounded-md transition-all ${
          value === "list"
            ? "bg-white shadow-sm text-primary-600"
            : "text-neutral-600 hover:text-neutral-900"
        }`}
        aria-label="List view"
        aria-pressed={value === "list"}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
