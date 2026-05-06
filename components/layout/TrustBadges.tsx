"use client";

import { Shield, Truck, RotateCcw, HeadphonesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TrustBadges() {
  const t = useTranslations("trustBadges");

  const trustBadges = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('securePayment'),
      description: t('securePaymentDesc'),
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('freeShipping'),
      description: t('freeShippingDesc'),
    },
    {
      icon: <RotateCcw className="h-6 w-6" />,
      title: t('easyReturns'),
      description: t('easyReturnsDesc'),
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: t('support247'),
      description: t('support247Desc'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-8">
      {trustBadges.map((badge, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-neutral-200 hover:border-primary-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="text-primary-600 mb-3 group-hover:scale-110 transition-transform">
            {badge.icon}
          </div>
          <h3 className="font-outfit font-bold text-neutral-900 mb-1 uppercase tracking-wide">
            {badge.title}
          </h3>
          <p className="text-sm text-neutral-600">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
