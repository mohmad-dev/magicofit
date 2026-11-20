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
    <section className="w-full bg-surface-subtle border-y border-border-subtle py-10 md:py-12 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-xs font-bold text-ink-secondary uppercase rtl:tracking-normal tracking-widest">
          {t("title")} — {isAr ? "اضغط على أي علامة للتصفية" : "Click any brand to filter gear"}
        </p>
      </div>

      {/* Kinetic Pause-on-Hover Marquee (LTR track for smooth directional continuity) */}
      <div className="relative overflow-hidden" dir="ltr">
        <div className="flex w-max animate-brand-marquee motion-reduce:animate-none motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center gap-3.5 px-4">
          {[...brands, ...brands].map((brand, idx) => (
            <Link
              key={`${brand.name}-${idx}`}
              href={`/search?q=${encodeURIComponent(brand.name)}`}
              className="flex items-center justify-center min-h-[48px] px-6 rounded-md bg-white border border-border-subtle hover:border-[#0E1014] hover:bg-[#0E1014] text-ink-primary hover:text-[#E5C573] transition-colors flex-shrink-0"
              aria-label={`${isAr ? "تصفح منتجات" : "Browse"} ${brand.name}`}
            >
              <span className="font-latin text-base md:text-lg font-black tracking-tight uppercase">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Edge Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-[#F0EFEA] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-[#F0EFEA] to-transparent" />
      </div>
    </section>
  );
}
