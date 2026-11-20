import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "../ui/Button";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 p-3">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
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
          <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
          {variant && (
            <p className="mt-1 text-xs text-gray-500">
              {variant.size && `${t("size")}: ${variant.size}`}
              {variant.size && variant.color && " • "}
              {variant.color && `${t("color")}: ${variant.color}`}
            </p>
          )}
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {formatPrice(price)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
