import CartSummary from "../cart/CartSummary";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  shippingMethod: string;
  tax?: number;
  discount?: number;
}

const shippingPrices: Record<string, number> = {
  standard: 25,
  express: 50,
  "same-day": 100,
};

export default function OrderSummary({
  items,
  shippingMethod,
  tax = 0,
  discount = 0,
}: OrderSummaryProps) {
  const shipping = shippingPrices[shippingMethod] || 25;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
      {/* Items List */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Order Items</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="text-gray-900">{item.name}</p>
              <p className="text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t pt-4">
        <CartSummary
          items={items}
          shipping={shipping}
          tax={tax}
          discount={discount}
        />
      </div>

      {/* Payment Info */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure payment with Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
}
