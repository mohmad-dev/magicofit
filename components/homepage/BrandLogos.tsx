"use client";

import { useTranslations } from "next-intl";

const brands = [
  { name: "Nike" },
  { name: "Adidas" },
  { name: "Under Armour" },
  { name: "Puma" },
  { name: "Reebok" },
  { name: "New Balance" },
  { name: "Asics" },
  { name: "Jordan" },
];

export default function BrandLogos() {
  const t = useTranslations("brandLogos");
  return (
    <div className="w-full bg-neutral-50 py-10 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xs md:text-sm font-bold text-neutral-400 uppercase tracking-widest mb-8 md:mb-10">
          {t('title')}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <span className="text-lg md:text-2xl font-black tracking-tighter text-neutral-900">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
