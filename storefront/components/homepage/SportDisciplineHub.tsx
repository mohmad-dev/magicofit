"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";

interface HubProduct {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  categoryName?: string;
  inStock?: boolean;
  stock?: number;
}

interface HubCategory {
  id: string;
  name: string;
  image: string;
  productCount: number;
  slug: string;
}

interface HubCategorySection {
  id: string;
  name: string;
  slug: string;
  products: HubProduct[];
}

interface SportDisciplineHubProps {
  categories: HubCategory[];
  categorySections: HubCategorySection[];
}

type DisciplineKind =
  | "football"
  | "jersey"
  | "tracksuit"
  | "shorts"
  | "running"
  | "equipment";

function detectDisciplineKind(name: string, slug: string): DisciplineKind {
  const key = `${name} ${slug}`.toLowerCase();
  if (key.includes("كرة") || key.includes("football") || key.includes("soccer") || key.includes("حذاء") || key.includes("احذ")) {
    return "football";
  }
  if (key.includes("تيشيرت") || key.includes("قميص") || key.includes("shirt") || key.includes("jersey") || key.includes("ملابس")) {
    return "jersey";
  }
  if (key.includes("بنط") || key.includes("ترنج") || key.includes("pant") || key.includes("track")) {
    return "tracksuit";
  }
  if (key.includes("شورت") || key.includes("short")) {
    return "shorts";
  }
  if (key.includes("جري") || key.includes("run") || key.includes("لياق") || key.includes("fitness")) {
    return "running";
  }
  return "equipment";
}

function DisciplineIcon({ kind, className }: { kind: DisciplineKind; className?: string }) {
  switch (kind) {
    case "football":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" strokeWidth="1.8" />
          <path d="M12 7.5L15.8 10.3L14.3 14.8H9.7L8.2 10.3L12 7.5Z" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 2.5V7.5M15.8 10.3L20.5 8.8M14.3 14.8L17.5 19.5M9.7 14.8L6.5 19.5M8.2 10.3L3.5 8.8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "jersey":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M8.5 4L5 6.5L3 10.5L6.5 12L7.5 9.5V20H16.5V9.5L17.5 12L21 10.5L19 6.5L15.5 4C14.7 5.2 13.4 6 12 6C10.6 6 9.3 5.2 8.5 4Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "tracksuit":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M8 4L4 7V15H7V20H17V15H20V7L16 4H8Z" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 4V20" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9.5 4L12 6.5L14.5 4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "shorts":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M5 5H19L20.5 18H14L12 12L10 18H3.5L5 5Z" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M5 8.5H19" strokeWidth="1.5" />
        </svg>
      );
    case "running":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M13 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13 2Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "equipment":
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M6.5 6.5V17.5M17.5 6.5V17.5M3.5 9V15M20.5 9V15M6.5 12H17.5" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function SportDisciplineHub({
  categories,
  categorySections,
}: SportDisciplineHubProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const shouldReduceMotion = useReducedMotion();
  const DirectionalArrow = isAr ? ArrowLeft : ArrowRight;

  const [selectedSlug, setSelectedSlug] = useState<string>(categories[0]?.slug || "");
  const [quickSort, setQuickSort] = useState<"default" | "price-asc" | "price-desc">("default");

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === selectedSlug) || categories[0],
    [categories, selectedSlug]
  );

  const activeProducts = useMemo(() => {
    if (!activeCategory) return [];
    const section = categorySections.find(
      (s) => s.slug === activeCategory.slug || s.id === activeCategory.id
    );
    const base = section?.products ? [...section.products] : [];
    if (quickSort === "price-asc") {
      base.sort((a, b) => a.price - b.price);
    } else if (quickSort === "price-desc") {
      base.sort((a, b) => b.price - a.price);
    }
    return base.slice(0, 5);
  }, [activeCategory, categorySections, quickSort]);

  const fallbackDisciplines: Array<{ title: string; kind: DisciplineKind; href: string }> = isAr
    ? [
        { title: "كرة القدم والأحذية", kind: "football", href: "/shop" },
        { title: "تيشيرتات وأطقم", kind: "jersey", href: "/shop" },
        { title: "بناطيل وترنجات", kind: "tracksuit", href: "/shop" },
        { title: "شورتات رياضية", kind: "shorts", href: "/shop" },
        { title: "الجري واللياقة", kind: "running", href: "/shop" },
        { title: "أدوات ومعدات", kind: "equipment", href: "/shop" },
      ]
    : [
        { title: "Football & Boots", kind: "football", href: "/shop" },
        { title: "Jerseys & Kits", kind: "jersey", href: "/shop" },
        { title: "Tracksuits & Pants", kind: "tracksuit", href: "/shop" },
        { title: "Match Shorts", kind: "shorts", href: "/shop" },
        { title: "Running & Training", kind: "running", href: "/shop" },
        { title: "Pro Equipment", kind: "equipment", href: "/shop" },
      ];

  return (
    <section className="py-10 md:py-14 bg-canvas">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Architectural Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-[2px] w-5 bg-[#C8A04A]" aria-hidden="true" />
              <span className="text-xs font-bold text-[#A68132] uppercase rtl:tracking-normal tracking-wider">
                {isAr ? "تجهّز للملعب" : "Choose Your Game"}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink-primary uppercase rtl:tracking-normal tracking-tight">
              {isAr ? "اختر رياضتك وابدأ المنافسة" : "Gear Up by Sport Discipline"}
            </h2>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-primary hover:text-primary-600 transition-colors self-start sm:self-auto min-h-[44px]"
          >
            <span>{isAr ? "جميع الفئات" : "All Categories"}</span>
            <DirectionalArrow className="h-4 w-4" />
          </Link>
        </div>

        {/* Interactive Selector Grid / Mobile Horizontal Snap */}
        {categories.length > 0 ? (
          <>
            <div
              role="tablist"
              aria-label={isAr ? "تصفح حسب الرياضة والفئة" : "Browse by sport category"}
              className="flex lg:grid lg:grid-cols-6 gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {categories.slice(0, 6).map((cat) => {
                const isActive = activeCategory?.slug === cat.slug;
                const kind = detectDisciplineKind(cat.name, cat.slug);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setSelectedSlug(cat.slug);
                      setQuickSort("default");
                    }}
                    className={`relative flex-none w-[156px] sm:w-[172px] lg:w-auto snap-start text-start rounded-lg p-4 transition-colors duration-200 cursor-pointer overflow-hidden border min-h-[124px] flex flex-col justify-between ${
                      isActive
                        ? "bg-[#0E1014] text-white border-[#0E1014]"
                        : "bg-white text-ink-primary border-border-subtle hover:border-ink-primary/40"
                    }`}
                  >
                    {/* Crisp Razor Gold Top Rule on Active */}
                    {isActive && (
                      shouldReduceMotion ? (
                        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#C8A04A]" aria-hidden="true" />
                      ) : (
                        <motion.span
                          layoutId="activeDisciplineRule"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          className="absolute inset-x-0 top-0 h-[3px] bg-[#C8A04A]"
                          aria-hidden="true"
                        />
                      )
                    )}

                    <div className="mb-4">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                          isActive
                            ? "bg-[#C8A04A] text-[#0E1014]"
                            : "bg-surface-subtle text-ink-primary"
                        }`}
                      >
                        <DisciplineIcon kind={kind} className="h-5 w-5" />
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-sm leading-snug line-clamp-1">
                        {cat.name}
                      </h3>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isActive ? "text-neutral-400" : "text-ink-secondary"
                        }`}
                      >
                        {isAr ? `${cat.productCount} منتج` : `${cat.productCount} items`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instant Contextual Product Shelf for Selected Discipline */}
            {activeCategory && (
              <div className="mt-6 pt-5 border-t border-border-subtle">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-ink-secondary">
                      {isAr ? `ترتيب ${activeCategory.name}:` : `Sort ${activeCategory.name}:`}
                    </span>
                    {[
                      { id: "default" as const, label: isAr ? "المختارة" : "Featured" },
                      { id: "price-asc" as const, label: isAr ? "الأقل سعراً" : "Lowest Price" },
                      { id: "price-desc" as const, label: isAr ? "الأعلى سعراً" : "Highest Price" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuickSort(opt.id)}
                        className={`min-h-[44px] px-3.5 rounded-md text-xs font-bold transition-colors cursor-pointer border ${
                          quickSort === opt.id
                            ? "bg-[#0E1014] text-[#E5C573] border-[#0E1014]"
                            : "bg-white text-ink-secondary border-border-subtle hover:text-ink-primary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <Link
                    href={`/shop/${activeCategory.slug}`}
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span>
                      {isAr
                        ? `عرض كل ${activeCategory.name} (${activeCategory.productCount})`
                        : `View All ${activeCategory.name} (${activeCategory.productCount})`}
                    </span>
                    <DirectionalArrow className="h-4 w-4" />
                  </Link>
                </div>

                {activeProducts.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
                    {activeProducts.map((product) => (
                      <ProductCard
                        key={`${activeCategory.slug}-${product.id}`}
                        {...product}
                        categoryName={activeCategory.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {fallbackDisciplines.map((d) => (
              <Link
                key={d.title}
                href={d.href}
                className="group bg-white border border-border-subtle hover:border-[#0E1014] rounded-lg p-4 flex flex-col justify-between min-h-[112px] transition-colors"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-surface-subtle group-hover:bg-[#0E1014] group-hover:text-[#E5C573] transition-colors">
                  <DisciplineIcon kind={d.kind} className="h-5 w-5" />
                </span>
                <span className="font-display text-sm font-bold text-ink-primary mt-3">
                  {d.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
