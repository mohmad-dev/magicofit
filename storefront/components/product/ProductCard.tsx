"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import UrgencyBadge from "./UrgencyBadge";
import QuickViewModal from "./QuickViewModal";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useUIStore } from "@/stores/ui-store";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Eye, Plus, Check } from "lucide-react";

interface ProductCardProps {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  categoryName?: string;
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
  categoryName,
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
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const wishlisted = mounted && wishlistItems.some((item) => item.productId === id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (qty = 1) => {
    addItem({
      productId: id,
      name,
      image,
      price,
      quantity: qty,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    openCart();
  };

  const handleToggleWishlist = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
    <>
      <article className="group flex flex-col w-full">
        {/* Borderless Editorial Image Stage */}
        <div className="relative aspect-[4/5] bg-[#F0EFEA] rounded-lg overflow-hidden">
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
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
            {hasAlternateImage && hoverImage && (
              <Image
                src={getProductImageUrl(hoverImage)}
                alt={`${name} — 2`}
                fill
                className="object-cover opacity-0 scale-[1.03] transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                loading="lazy"
              />
            )}
          </Link>

          {/* Unavailable Overlay */}
          {!inStock && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0E1014]/55 backdrop-blur-[2px]">
              <span className="rounded-sm bg-white px-3 py-1 text-xs font-bold text-ink-primary">
                {t("unavailable")}
              </span>
            </div>
          )}

          {/* Discount Tag Only (Clean, zero "In stock" noise) */}
          {discount > 0 && (
            <span className="font-latin pointer-events-none absolute top-2.5 start-2.5 z-10 rounded-sm bg-[#C84300] px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">
              -{discount}%
            </span>
          )}

          {/* Low Stock Scarcity Indicator */}
          {inStock && stock !== undefined && stock > 0 && stock <= 5 && (
            <div className="pointer-events-none absolute bottom-2.5 start-2.5 md:group-hover:opacity-0 transition-opacity z-10">
              <UrgencyBadge stock={stock} />
            </div>
          )}

          {/* Always-Visible Touch-Friendly Wishlist Heart */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-2.5 end-2.5 z-10 h-11 w-11 rounded-full bg-white/90 hover:bg-white border border-border-subtle/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer"
            aria-label={wishlisted ? (isAr ? "إزالة من المفضلة" : "Remove from wishlist") : (isAr ? "أضف للمفضلة" : "Add to wishlist")}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted ? "fill-red-600 text-red-600" : "text-ink-primary hover:text-red-600"
              }`}
            />
          </button>

          {/* Desktop Slide-Up Quick Action Bar */}
          {!hideAddToCart && (
            <div className="hidden md:flex items-center gap-1.5 absolute inset-x-2.5 bottom-2.5 p-1.5 rounded-md bg-[#0E1014]/92 backdrop-blur-sm text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 z-10">
              <button
                type="button"
                disabled={!inStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(1);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 rounded text-xs font-bold text-white hover:bg-white/10 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label={`${t("addToCart")}: ${name}`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#E5C573]" />
                    <span className="text-[#E5C573]">{isAr ? "تمت الإضافة" : "Added"}</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 text-[#E5C573]" />
                    <span>{t("addToCart")}</span>
                  </>
                )}
              </button>

              <span className="h-5 w-[1px] bg-white/15" aria-hidden="true" />

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded text-neutral-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label={`${t("quickView")}: ${name}`}
                title={t("quickView")}
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Clean Typographic Metadata */}
        <div className="pt-3 flex flex-col gap-1">
          {categoryName && (
            <span className="text-[11px] font-semibold text-ink-secondary line-clamp-1">
              {categoryName}
            </span>
          )}

          <Link href={productLink}>
            <h3 className="font-display font-bold text-sm md:text-[15px] leading-snug text-ink-primary line-clamp-2 group-hover:text-primary-600 transition-colors rtl:tracking-normal">
              {name}
            </h3>
          </Link>

          {/* Price + Mobile Quick Add Row */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
              <span className="font-latin text-sm sm:text-base font-extrabold text-ink-primary tabular-nums">
                {formatPrice(price)}
              </span>
              {discount > 0 && originalPrice && (
                <span className="font-latin text-xs text-ink-secondary line-through tabular-nums">
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
                  handleAddToCart(1);
                }}
                className="md:hidden inline-flex items-center justify-center gap-1 min-h-[44px] px-3.5 rounded-md bg-[#0E1014] hover:bg-[#171A21] text-white text-xs font-bold active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                aria-label={`${t("addToCart")}: ${name}`}
              >
                {justAdded ? (
                  <Check className="h-3.5 w-3.5 text-[#E5C573]" />
                ) : (
                  <Plus className="h-3.5 w-3.5 text-[#E5C573]" />
                )}
                <span>{t("add")}</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {isQuickViewOpen && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          product={{
            id,
            handle,
            name,
            price,
            originalPrice,
            image,
          }}
          onAddToCart={(_, qty = 1) => {
            setIsQuickViewOpen(false);
            handleAddToCart(qty);
          }}
          onToggleWishlist={() => handleToggleWishlist()}
          isWishlisted={wishlisted}
        />
      )}
    </>
  );
}
