"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "../ui/Button";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

interface CartItemProps {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({
  productId: _productId,
  name,
  image,
  price,
  quantity,
  variant,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="flex gap-4 rounded-lg border border-border-subtle bg-white p-3.5">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-[#F0EFEA]">
        <Image
          src={getProductImageUrl(image)}
          alt={name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-display font-semibold text-ink-primary line-clamp-2 rtl:tracking-normal">{name}</h3>
          {variant && (
            <p className="mt-1 text-xs text-ink-secondary">
              {variant.size && `${t("size")}: ${variant.size}`}
              {variant.size && variant.color && " • "}
              {variant.color && `${t("color")}: ${variant.color}`}
            </p>
          )}
          <p className="font-latin mt-1 text-sm font-bold text-ink-primary tabular-nums">
            {formatPrice(price)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11"
              onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label={isAr ? `تقليل الكمية: ${name}` : `Decrease quantity: ${name}`}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="font-latin w-8 text-center text-sm font-semibold text-ink-primary tabular-nums">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11"
              onClick={() => onUpdateQuantity(quantity + 1)}
              aria-label={isAr ? `زيادة الكمية: ${name}` : `Increase quantity: ${name}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 sm:h-11 sm:w-11 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onRemove}
            aria-label={isAr ? `حذف من السلة: ${name}` : `Remove item: ${name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
