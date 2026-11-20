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
        <span className="text-ink-secondary">{t("subtotal")}</span>
        <span className="font-latin font-medium text-ink-primary tabular-nums">
          {formatPrice(calculatedSubtotal)}
        </span>
      </div>

      {shipping > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-ink-secondary">{t("shipping")}</span>
          <span className="font-latin font-medium text-ink-primary tabular-nums">
            {formatPrice(shipping)}
          </span>
        </div>
      )}

      {tax > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-ink-secondary">{t("tax")}</span>
          <span className="font-latin font-medium text-ink-primary tabular-nums">
            {formatPrice(tax)}
          </span>
        </div>
      )}

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-ink-secondary">{t("discount")}</span>
          <span className="font-latin text-green-700 font-medium tabular-nums">
            -{formatPrice(discount)}
          </span>
        </div>
      )}

      <div className="border-t border-border-subtle pt-3">
        <div className="flex justify-between">
          <span className="text-base font-semibold text-ink-primary">{t("total")}</span>
          <span className="font-latin text-base font-bold text-ink-primary tabular-nums">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
