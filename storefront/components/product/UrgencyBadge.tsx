"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface UrgencyBadgeProps {
  stock: number;
  threshold?: number;
}

export default function UrgencyBadge({ stock, threshold = 5 }: UrgencyBadgeProps) {
  const t = useTranslations("product");
  if (stock <= 0 || stock > threshold) return null;

  return (
    <div className="inline-flex items-center gap-1.5 bg-[#141619]/90 text-[#E5C573] px-2 py-0.5 rounded-sm text-[11px] font-semibold backdrop-blur-sm">
      <AlertTriangle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      <span>{t("onlyLeft", { count: stock })}</span>
    </div>
  );
}
