"use client";

import { Truck, CheckCircle2 } from "lucide-react";
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
    <div className="bg-surface-subtle border border-border-subtle rounded-lg p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {isFree ? (
            <CheckCircle2 className="h-4 w-4 text-[#15803D] flex-shrink-0" />
          ) : (
            <Truck className="h-4 w-4 text-[#A68132] flex-shrink-0" />
          )}
          <span className={`text-xs sm:text-sm font-bold ${isFree ? "text-[#15803D]" : "text-ink-primary"}`}>
            {isFree ? t("unlocked") : t("title")}
          </span>
        </div>
        {!isFree && (
          <span className="text-xs font-semibold text-primary-600 tabular-nums">
            {t("addMore", { amount: formatPrice(remaining) })}
          </span>
        )}
      </div>

      {/* Logical Start-Aligned Progress Track */}
      <div className="relative h-2 bg-border-subtle rounded-full overflow-hidden">
        <div
          className={`absolute top-0 start-0 h-full rounded-full transition-all duration-500 ease-out ${
            isFree ? "bg-[#15803D]" : "bg-[#C8A04A]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="font-latin flex justify-between mt-1.5 text-[11px] text-ink-secondary tabular-nums">
        <span>{formatPrice(0)}</span>
        <span className="font-bold text-ink-primary">{formatPrice(freeShippingThreshold)}</span>
      </div>
    </div>
  );
}
