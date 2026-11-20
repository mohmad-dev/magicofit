"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import UrgencyBadge from "./UrgencyBadge";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useUIStore } from "@/stores/ui-store";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Plus, Check } from "lucide-react";

interface ProductCardProps {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  inStock?: boolean;
  stock?: number;
  hideAddToCart?: boolean;
  priority?: boolean;
}

export default function ProductCard({
  id,
  handle,
  name,
  price,
  originalPrice,
  image,
  hoverImage,
  inStock = true,
  stock,
  hideAddToCart = false,
  priority = false,
}: ProductCardProps) {
  const t = useTranslations("product");
  const locale = useLocale();
  const isAr = locale === "ar";
  const productLink = handle ? `/products/${handle}` : `/products/${id}`;
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const wishlisted = mounted && wishlistItems.some((item) => item.productId === id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      image,
      price,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        productId: id,
        handle: handle || "",
        name,
        image,
        price,
        originalPrice,
      });
    }
  };

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const hasAlternateImage = Boolean(hoverImage && hoverImage !== image);

  return (
    <article className="group flex flex-col w-full bg-white">
      {/* Studio Image Stage */}
      <div className="relative aspect-[4/5] bg-[#F5F5F5] rounded-xl overflow-hidden">
        <Link href={productLink} className="block w-full h-full">
          <Image
            src={getProductImageUrl(image)}
            alt={name}
            fill
            className={`object-cover transition-all duration-500 ${
              hasAlternateImage
                ? "group-hover:opacity-0 group-hover:scale-[1.03]"
                : "group-hover:scale-[1.03]"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
          {hasAlternateImage && hoverImage && (
            <Image
              src={getProductImageUrl(hoverImage)}
              alt={`${name} — 2`}
              fill
              className="object-cover opacity-0 scale-[1.03] transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              loading="lazy"
            />
          )}
        </Link>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0F1115]/55 backdrop-blur-xs">
            <span className="rounded-md bg-white px-3 py-1 text-xs font-bold text-[#111318]">
              {t("unavailable")}
            </span>
          </div>
        )}

        {/* Discount Badge Only */}
        {discount > 0 && (
          <span className="font-latin pointer-events-none absolute top-2.5 start-2.5 z-10 rounded-md bg-[#D9480F] px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">
            -{discount}%
          </span>
        )}

        {/* Low Stock Indicator */}
        {inStock && stock !== undefined && stock > 0 && stock <= 5 && (
          <div className="pointer-events-none absolute bottom-2.5 start-2.5 z-10">
            <UrgencyBadge stock={stock} />
          </div>
        )}

        {/* Always-Visible Touch-Friendly Wishlist Heart */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-2.5 end-2.5 z-10 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/95 hover:bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          aria-label={wishlisted ? (isAr ? "إزالة من المفضلة" : "Remove from wishlist") : (isAr ? "أضف للمفضلة" : "Add to wishlist")}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted ? "fill-red-600 text-red-600" : "text-[#111318] hover:text-red-600"
            }`}
          />
        </button>
      </div>

      {/* Product Info + Add Button */}
      <div className="pt-3 flex flex-col gap-1.5 flex-1 justify-between">
        <Link href={productLink}>
          <h3 className="font-display font-bold text-sm md:text-[15px] leading-snug text-[#111318] line-clamp-2 group-hover:text-[#D9480F] transition-colors rtl:tracking-normal">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-col">
            <span className="font-latin text-sm sm:text-base font-extrabold text-[#111318] tabular-nums">
              {formatPrice(price)}
            </span>
            {discount > 0 && originalPrice && (
              <span className="font-latin text-xs text-[#525252] line-through tabular-nums">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {!hideAddToCart && (
            <button
              type="button"
              disabled={!inStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              className="min-h-[40px] sm:min-h-[44px] px-3.5 rounded-full bg-[#0F1115] hover:bg-[#D9480F] text-white text-xs font-bold inline-flex items-center justify-center gap-1 transition-colors active:scale-95 disabled:opacity-40 cursor-pointer flex-shrink-0"
              aria-label={`${t("addToCart")}: ${name}`}
            >
              {justAdded ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              <span>{t("add")}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
