import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  price: number;
  quantity: number;
}

interface CartSummaryProps {
  items: CartItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
}

export default function CartSummary({
  items,
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
}: CartSummaryProps) {
  const t = useTranslations("cart");
  const calculatedSubtotal = subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = calculatedSubtotal + shipping + tax - discount;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{t("subtotal")}</span>
        <span className="font-medium text-gray-900">
          {formatPrice(calculatedSubtotal)}
        </span>
      </div>

      {shipping > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("shipping")}</span>
          <span className="font-medium text-gray-900">
            {formatPrice(shipping)}
          </span>
        </div>
      )}

      {tax > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("tax")}</span>
          <span className="font-medium text-gray-900">
            {formatPrice(tax)}
          </span>
        </div>
      )}

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("discount")}</span>
          <span className="text-green-600 font-medium">
            -{formatPrice(discount)}
          </span>
        </div>
      )}

      <div className="border-t pt-3">
        <div className="flex justify-between">
          <span className="text-base font-semibold text-gray-900">{t("total")}</span>
          <span className="text-base font-bold text-gray-900">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
