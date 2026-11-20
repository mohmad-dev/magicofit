"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { X, Plus, Minus, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    handle?: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    description?: string;
    colors?: string[];
    sizes?: string[];
  };
  onAddToCart: (productId: string, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: QuickViewModalProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const DirectionalArrow = isAr ? ArrowLeft : ArrowRight;

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedColor(product.colors?.[0] || "");
    setSelectedSize(product.sizes?.[0] || "");
    setQuantity(1);
  }, [product.id, product.colors, product.sizes]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl border border-border-subtle max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t("quickView")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 z-10 inline-flex h-11 w-11 items-center justify-center bg-surface-subtle hover:bg-[#0E1014] hover:text-white text-ink-primary rounded-md transition-colors cursor-pointer"
          aria-label={isAr ? "إغلاق المعاينة" : "Close modal"}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
          {/* Studio Image */}
          <div className="relative aspect-[4/5] bg-surface-subtle rounded-lg overflow-hidden">
            <Image
              src={getProductImageUrl(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <div className="font-latin absolute top-3 start-3 bg-primary-600 text-white font-bold px-2.5 py-1 rounded-sm text-xs tabular-nums">
                -{discount}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col pt-2 md:pt-0">
            <p className="text-xs font-bold text-[#A68132] uppercase rtl:tracking-normal tracking-wider mb-1.5">
              {t("quickView")}
            </p>
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink-primary mb-3 leading-snug rtl:tracking-normal">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-5 pb-4 border-b border-border-subtle">
              <span className="font-latin text-2xl font-extrabold text-ink-primary tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-latin text-base text-ink-secondary line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-ink-secondary mb-6 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-ink-primary mb-2">
                  {t("color")}: <span className="text-ink-secondary font-medium">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-9 w-9 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === color
                          ? "border-primary-600 ring-2 ring-primary-600/30"
                          : "border-border-subtle"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`${t("selectColor")} ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-ink-primary mb-2">
                  {t("size")}: <span className="text-ink-secondary font-medium">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[40px] px-4 py-1.5 border rounded-md text-xs font-bold transition-colors cursor-pointer ${
                        selectedSize === size
                          ? "border-[#0E1014] bg-[#0E1014] text-[#E5C573]"
                          : "border-border-subtle hover:border-ink-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-bold text-ink-primary mb-2">{t("quantity")}</p>
              <div className="inline-flex items-center border border-border-subtle rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-11 w-11 flex items-center justify-center hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label={isAr ? "تقليل الكمية" : "Decrease quantity"}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-latin w-12 text-center font-bold text-sm tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-11 w-11 flex items-center justify-center hover:bg-surface-subtle transition-colors cursor-pointer"
                  aria-label={isAr ? "زيادة الكمية" : "Increase quantity"}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3">
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="flex-1 text-sm"
                  onClick={() => onAddToCart(product.id, quantity)}
                >
                  {t("addToCart")} — <span className="font-latin tabular-nums">{formatPrice(product.price * quantity)}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className={`px-4 ${isWishlisted ? "text-red-600 border-red-600 bg-red-50" : ""}`}
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={isWishlisted ? tCommon("remove") : t("addToWishlist")}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>

              <Link
                href={product.handle ? `/products/${product.handle}` : `/products/${product.id}`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 w-full min-h-[40px] text-xs font-bold text-ink-secondary hover:text-ink-primary transition-colors"
              >
                <span>{t("viewDetails")}</span>
                <DirectionalArrow className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
