"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const brands = [
  { name: "Nike" },
  { name: "Adidas" },
  { name: "Puma" },
  { name: "Tempo Sport" },
  { name: "Umbro" },
  { name: "Uhlsport" },
  { name: "Kelme" },
  { name: "Joma" },
  { name: "Kappa" },
  { name: "New Balance" },
  { name: "Under Armour" },
];

export default function BrandLogos() {
  const t = useTranslations("brandLogos");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="w-full bg-[#F5F5F5] border-b border-[#EAEAEA] py-8 md:py-10 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 text-center">
        <p className="text-xs font-bold text-[#525252] uppercase rtl:tracking-normal tracking-widest">
          {t("title")}
        </p>
      </div>

      {/* Pause-on-hover horizontal marquee */}
      <div className="relative overflow-hidden" dir="ltr">
        <div className="flex w-max animate-brand-marquee motion-reduce:animate-none motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center gap-3 md:gap-6 px-4">
          {[...brands, ...brands].map((brand, idx) => (
            <Link
              key={`${brand.name}-${idx}`}
              href={`/search?q=${encodeURIComponent(brand.name)}`}
              className="min-h-[44px] px-5 inline-flex items-center font-latin text-lg md:text-xl font-black tracking-tight uppercase text-[#111318]/75 hover:text-[#111318] transition-colors flex-shrink-0"
              aria-label={`${isAr ? "تصفح منتجات" : "Browse"} ${brand.name}`}
            >
              {brand.name}
            </Link>
          ))}
        </div>

        {/* Edge Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-[#F5F5F5] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-[#F5F5F5] to-transparent" />
      </div>
    </section>
  );
}
