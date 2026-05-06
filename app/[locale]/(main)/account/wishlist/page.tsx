"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import WishlistPage from "@/components/account/WishlistPage";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

export default function WishlistRoute() {
  const t = useTranslations("common");
  const tWishlist = useTranslations("wishlist");
  const addItem = useCartStore((state) => state.addItem);
  const { items, removeItem } = useWishlistStore();

  const handleRemove = (itemId: string) => {
    removeItem(itemId);
  };

  const handleMoveToCart = (itemId: string) => {
    const item = items.find(i => i.productId === itemId);
    if (item) {
      addItem({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: 1,
        variant: item.variant,
      });
      removeItem(itemId);
    }
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("account"), href: "/account" },
    { label: tWishlist("title"), href: "/account/wishlist" },
  ];

  const mappedItems = items.map((item) => ({
    id: item.productId,
    name: item.name,
    image: item.image,
    price: item.price,
    originalPrice: item.originalPrice,
    inStock: true,
  }));

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <WishlistPage
        items={mappedItems}
        onRemove={handleRemove}
        onMoveToCart={handleMoveToCart}
      />
    </div>
  );
}
