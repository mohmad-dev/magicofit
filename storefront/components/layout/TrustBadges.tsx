"use client";

import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TrustBadges() {
  const t = useTranslations("trustBadges");

  const trustBadges = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#111318] flex-shrink-0" />,
      title: t("securePayment"),
      description: t("securePaymentDesc"),
    },
    {
      icon: <Truck className="h-5 w-5 text-[#111318] flex-shrink-0" />,
      title: t("fastDelivery"),
      description: t("fastDeliveryDesc"),
    },
    {
      icon: <RotateCcw className="h-5 w-5 text-[#111318] flex-shrink-0" />,
      title: t("easyReturns"),
      description: t("easyReturnsDesc"),
    },
    {
      icon: <Headphones className="h-5 w-5 text-[#111318] flex-shrink-0" />,
      title: t("support247"),
      description: t("support247Desc"),
    },
  ];

  return (
    <section aria-label={t("securePayment")} className="w-full bg-white border-y border-[#EAEAEA]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-4 px-3 sm:px-4 lg:py-5 lg:px-6 border-[#EAEAEA] [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0 [&:nth-child(even)]:border-s lg:[&:nth-child(even)]:border-s-0 lg:[&:not(:first-child)]:border-s lg:first:ps-0 lg:last:pe-0"
            >
              {badge.icon}
              <div className="min-w-0">
                <h3 className="font-display text-xs sm:text-sm font-bold text-[#111318] uppercase rtl:tracking-normal tracking-wide leading-tight mb-0.5">
                  {badge.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#525252] leading-snug line-clamp-2">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
