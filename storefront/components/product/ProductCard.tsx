"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";
import UrgencyBadge from "./UrgencyBadge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useUIStore } from "@/stores/ui-store";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
  stock?: number;
  hideAddToCart?: boolean;
}

export default function ProductCard({
  id,
  handle,
  name,
  price,
  originalPrice,
  image,
  inStock = true,
  stock,
  hideAddToCart = false,
}: ProductCardProps) {
  const t = useTranslations("product");
  const productLink = handle ? `/products/${handle}` : `/products/${id}`;
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
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

  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full border border-neutral-100/50">
      {/* Image */}
      <Link href={productLink} className="relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden block">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-neutral-900 shadow-lg">
              {t("unavailable")}
            </span>
          </div>
        )}
        {inStock && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-green-600 uppercase tracking-wider shadow-sm border border-green-100">
              {t("available")}
            </span>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-primary-600 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wide shadow-lg">
            -{discount}%
          </div>
        )}
        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              wishlisted ? "fill-red-500 text-red-500" : "text-neutral-600 hover:text-red-500"
            }`}
          />
        </button>
        {inStock && stock && stock > 0 && stock <= 5 && (
          <div className="absolute left-3 bottom-3 z-10">
            <UrgencyBadge stock={stock} />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <Link href={productLink}>
          <h3 className="font-outfit font-bold text-sm md:text-base leading-snug text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors uppercase tracking-wide">
            {name}
          </h3>
        </Link>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-extrabold text-neutral-900 tracking-tight">
              {formatPrice(price)}
            </span>
            {discount > 0 && originalPrice && (
              <span className="text-xs text-neutral-400 line-through font-medium">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {!hideAddToCart && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 text-xs font-bold rounded-full border-neutral-200 text-neutral-700 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm hover:shadow"
              disabled={!inStock}
              onClick={(e) => { e.preventDefault(); handleAddToCart(); }}
              aria-label={`Add ${name} to cart`}
            >
              {t("add")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
