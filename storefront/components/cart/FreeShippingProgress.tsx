"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";

interface FreeShippingProgressProps {
  currentAmount: number;
  freeShippingThreshold: number;
}

export default function FreeShippingProgress({
  currentAmount,
  freeShippingThreshold,
}: FreeShippingProgressProps) {
  const t = useTranslations("freeShipping");
  const progress = Math.min((currentAmount / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - currentAmount, 0);
  const isFree = currentAmount >= freeShippingThreshold;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isFree ? (
            <Check className="h-5 w-5 text-primary-600" />
          ) : (
            <ShoppingCart className="h-5 w-5 text-primary-600" />
          )}
          <span className="font-semibold text-primary-900">
            {isFree ? `🎉 ${t('unlocked')}` : t('title')}
          </span>
        </div>
        {!isFree && (
          <span className="text-sm font-medium text-primary-700">
            {t('addMore', { amount: formatPrice(remaining) })}
          </span>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-primary-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out ${
            isFree ? "from-green-500 to-green-600" : ""
          }`}
          style={{ width: `${progress}%` }}
        />
        {/* Animated shine effect */}
        <div
          className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-primary-700">
        <span>{formatPrice(0)}</span>
        <span className="font-semibold">{formatPrice(freeShippingThreshold)}</span>
      </div>
    </div>
  );
}
