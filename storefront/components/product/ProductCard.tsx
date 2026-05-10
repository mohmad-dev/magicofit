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
    <div className="group relative flex flex-col gap-2.5 transition-all duration-300 hover:-translate-y-1 w-full">
      {/* Image */}
      <Link href={productLink} className="relative aspect-square bg-[#F5F5F5] rounded-xl overflow-hidden block">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <span className="rounded bg-white px-3 py-1 text-sm font-medium text-neutral-900">
              {t("unavailable")}
            </span>
          </div>
        )}
        {inStock && (
          <div className="absolute left-2 top-2">
            <span className="rounded bg-white/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-green-600 uppercase tracking-wider shadow-sm">
              {t("available")}
            </span>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute right-2 top-2 rounded bg-primary-600 px-2 py-1 text-xs font-bold text-white uppercase tracking-wide">
            -{discount}%
          </div>
        )}
        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted ? "fill-red-500 text-red-500" : "text-neutral-500 hover:text-red-400"
            }`}
          />
        </button>
        {inStock && stock && stock > 0 && stock <= 5 && (
          <div className="absolute left-2 bottom-2">
            <UrgencyBadge stock={stock} />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="px-1.5 flex flex-col gap-1.5 pb-2">
        <Link href={productLink}>
          <h3 className="font-outfit font-semibold text-sm md:text-[15px] leading-snug text-neutral-800 line-clamp-2 hover:text-primary-600 transition-colors uppercase tracking-tight">
            {name}
          </h3>
        </Link>

        {/* Action Row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-neutral-900">
              {formatPrice(price)}
            </span>
            {discount > 0 && originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {!hideAddToCart && (
            <Button
              variant="outline"
              size="sm"
              className="h-11 px-4 text-sm rounded-full border-neutral-300 text-neutral-700 hover:border-primary-600 hover:text-primary-600 hover:bg-transparent transition-colors"
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
