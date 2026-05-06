import { AlertTriangle } from "lucide-react";

interface UrgencyBadgeProps {
  stock: number;
  threshold?: number;
}

export default function UrgencyBadge({ stock, threshold = 5 }: UrgencyBadgeProps) {
  if (stock > threshold) return null;

  return (
    <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>Only {stock} left!</span>
    </div>
  );
}
