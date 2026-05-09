import { AlertTriangle, Check } from "lucide-react";

interface StockIndicatorProps {
  quantity: number;
  lowStockThreshold?: number;
  manageInventory?: boolean;
}

export default function StockIndicator({
  quantity,
  lowStockThreshold = 10,
  manageInventory,
}: StockIndicatorProps) {
  // If inventory is not managed (undefined, null, or false), always show as in stock
  if (!manageInventory) {
    return (
      <div className="flex items-center gap-2 text-primary-600">
        <Check className="h-4 w-4" />
        <span className="text-sm font-medium">In Stock</span>
      </div>
    );
  }

  if (quantity === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Out of Stock</span>
      </div>
    );
  }

  if (quantity <= lowStockThreshold) {
    return (
      <div className="flex items-center gap-2 text-primary-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">
          Only {quantity} left in stock
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-primary-600">
      <Check className="h-4 w-4" />
      <span className="text-sm font-medium">In Stock</span>
    </div>
  );
}
