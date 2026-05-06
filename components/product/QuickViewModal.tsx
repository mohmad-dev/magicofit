"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Plus, Minus, Heart } from "lucide-react";
import { Button } from "../ui/Button";
import { formatPrice } from "@/lib/utils";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    description?: string;
    colors?: string[];
    sizes?: string[];
  };
  onAddToCart: (productId: string) => void;
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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Reset selections when product changes
  useEffect(() => {
    setSelectedColor(product.colors?.[0] || "");
    setSelectedSize(product.sizes?.[0] || "");
    setQuantity(1);
  }, [product.id]);
  const [quantity, setQuantity] = useState(1);

  // Focus trap and keyboard handling
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div ref={modalRef} className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" role="dialog" aria-modal="true" aria-label="Quick view product" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-primary-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-2 uppercase">
              {product.name}
            </h2>


            <div className="flex items-center gap-3 mb-6">
              <span className="font-outfit text-3xl font-extrabold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-neutral-600 mb-6 line-clamp-3">{product.description}</p>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-neutral-900 mb-2">Color: {selectedColor}</p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-primary-600 ring-2 ring-primary-600/30"
                          : "border-neutral-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-neutral-900 mb-2">Size: {selectedSize}</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? "border-primary-600 bg-primary-600 text-white"
                          : "border-neutral-300 hover:border-primary-600"
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
              <p className="font-semibold text-neutral-900 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-neutral-300 rounded-lg flex items-center justify-center hover:border-primary-600 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-neutral-300 rounded-lg flex items-center justify-center hover:border-primary-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => onAddToCart(product.id)}
              >
                Add to Cart - {formatPrice(product.price * quantity)}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`px-4 ${isWishlisted ? "text-red-600 border-red-600" : ""}`}
                onClick={() => onToggleWishlist(product.id)}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
