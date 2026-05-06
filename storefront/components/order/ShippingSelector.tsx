import { Truck, Package, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
}

interface ShippingSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 25,
    estimatedDays: "3-5 business days",
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 50,
    estimatedDays: "1-2 business days",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: "same-day",
    name: "Same Day Delivery",
    price: 100,
    estimatedDays: "Today (Riyadh only)",
    icon: <Clock className="h-5 w-5" />,
  },
];

export default function ShippingSelector({ selected, onSelect }: ShippingSelectorProps) {
  return (
    <div className="space-y-3">
      {shippingOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
            selected === option.id
              ? "border-primary-600 bg-primary-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 ${
                  selected === option.id ? "text-primary-600" : "text-gray-400"
                }`}
              >
                {option.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{option.name}</h3>
                <p className="text-sm text-gray-500">{option.estimatedDays}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatPrice(option.price)}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
