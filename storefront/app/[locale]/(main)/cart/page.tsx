"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import FreeShippingProgress from "@/components/cart/FreeShippingProgress";
import { useCartStore } from "@/stores/cart-store";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 2000 ? 0 : 50;
  const tax = subtotal * 0.14;

  const breadcrumbItems = [
    { label: tCommon("home"), href: "/" },
    { label: tCommon("cart"), href: "/cart" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6 md:mb-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="font-display text-2xl md:text-4xl font-extrabold text-ink-primary mb-6 md:mb-8 uppercase rtl:tracking-normal tracking-tight">{t("title")}</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 md:py-24">
          <div className="mx-auto w-20 h-20 rounded-full bg-[#F0EFEA] flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-ink-secondary" />
          </div>
          <p className="text-ink-primary mb-2 text-lg font-semibold">{t("empty")}</p>
          <p className="text-ink-secondary mb-6 text-sm">{t("emptyDesc")}</p>
          <Link
            href="/shop"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary-600 px-8 py-3 text-white font-bold transition-colors hover:bg-primary-700 uppercase rtl:tracking-normal tracking-wide text-sm"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  productId={item.productId}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  quantity={item.quantity}
                  variant={{
                    size: item.variant?.size,
                    color: item.variant?.color,
                  }}
                  onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1 space-y-4">
              <FreeShippingProgress 
                currentAmount={subtotal}
                freeShippingThreshold={2000}
              />
              <CartSummary
                items={items.map((item) => ({
                  price: item.price,
                  quantity: item.quantity,
                }))}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
