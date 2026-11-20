"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface UrgencyBadgeProps {
  stock: number;
  threshold?: number;
}

export default function UrgencyBadge({ stock, threshold = 5 }: UrgencyBadgeProps) {
  const t = useTranslations("product");
  if (stock > threshold) return null;

  return (
    <div className="inline-flex items-center gap-1.5 bg-[#0F1115]/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-bold">
      <AlertTriangle className="h-3 w-3 text-[#E5C573]" />
      <span>{t("onlyLeft", { count: stock })}</span>
    </div>
  );
}
