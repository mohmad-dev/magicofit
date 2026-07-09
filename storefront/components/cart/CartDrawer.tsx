"use client";

import { X, ShoppingBag } from "lucide-react";
import { Button } from "../ui/Button";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import FreeShippingProgress from "./FreeShippingProgress";
import { useTranslations } from "next-intl";

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
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary-600" />
            <h2 className="font-outfit text-xl font-extrabold text-neutral-900 uppercase tracking-tight">
              {t("title")}
            </h2>
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-600">
              {totalItems}
            </span>
          </div>
          <Button variant="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
              <h3 className="font-outfit text-lg font-semibold text-neutral-900 mb-2">
                {t("empty")}
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
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
          <div className="border-t border-neutral-200 p-6 bg-neutral-50 space-y-4">
            <FreeShippingProgress 
              currentAmount={items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              freeShippingThreshold={200000}
            />
            <CartSummary items={items} />
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-primary-500/30"
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
