"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

interface WishlistPageProps {
  items: WishlistItem[];
  onRemove: (itemId: string) => void;
  onMoveToCart: (itemId: string) => void;
}

export default function WishlistPage({
  items,
  onRemove,
  onMoveToCart,
}: WishlistPageProps) {
  const t = useTranslations("wishlist");
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleMoveSelectedToCart = () => {
    selectedItems.forEach((itemId) => onMoveToCart(itemId));
    setSelectedItems(new Set());
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("empty")}</h3>
        <p className="text-gray-600 mb-4">
          {t("emptyDesc")}
        </p>
        <Button variant="primary" onClick={() => {
          router.push('/shop');
        }}>
          {t("startShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
          <p className="text-gray-600">{t("itemsSaved", { count: items.length })}</p>
        </div>
        {selectedItems.size > 0 && (
          <Button
            variant="primary"
            onClick={handleMoveSelectedToCart}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {t("moveToCart", { count: selectedItems.size })}
          </Button>
        )}
      </div>

      {/* Select All */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedItems.size === items.length}
          onChange={handleSelectAll}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label className="text-sm text-gray-600">{t("selectAll")}</label>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-gray-200 p-4"
          >
            {/* Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

            {/* Image */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onMoveToCart(item.id)}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t("addToCart")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
