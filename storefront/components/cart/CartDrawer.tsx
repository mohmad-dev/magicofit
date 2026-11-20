"use client";

import { X, ShoppingBag } from "lucide-react";
import { Button } from "../ui/Button";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import FreeShippingProgress from "./FreeShippingProgress";
import { useLocale, useTranslations } from "next-intl";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const isAr = locale === "ar";
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 end-0 flex w-full max-w-md flex-col bg-canvas shadow-2xl border-s border-border-subtle">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0E1014] text-white border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-[#E5C573]" />
            <h2 className="font-display text-lg font-extrabold text-white uppercase rtl:tracking-normal tracking-tight">
              {t("title")}
            </h2>
            <span className="font-latin rounded-full bg-[#C84300] px-2 py-0.5 text-xs font-bold text-white tabular-nums">
              {totalItems}
            </span>
          </div>
          <Button
            variant="icon"
            className="text-neutral-300 hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label={isAr ? "إغلاق السلة" : "Close cart"}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
              <h3 className="font-display text-lg font-semibold text-ink-primary mb-2 rtl:tracking-normal">
                {t("empty")}
              </h3>
              <p className="text-sm text-ink-secondary mb-4">
                {t("emptyDesc")}
              </p>
              <Button variant="primary" onClick={onClose}>
                {t("continueShopping")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
                  onRemove={() => onRemoveItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-subtle p-6 bg-canvas space-y-4">
            <FreeShippingProgress 
              currentAmount={items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              freeShippingThreshold={2000}
            />
            <CartSummary items={items} />
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onCheckout}
            >
              {t("proceedToCheckout")}
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={onClose}
            >
              {t("continueShopping")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
