"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface Category {
  id: string;
  name: string;
  image?: string;
  productCount: number;
  slug: string;
}

interface CategoryShowcaseProps {
  title?: string;
  subtitle?: string;
  categories: Category[];
}

export default function CategoryShowcase({
  title,
  subtitle,
  categories,
}: CategoryShowcaseProps) {
  const t = useTranslations("categoryShowcase");
  if (categories.length === 0) return null;

  const displayTitle = title || t('title');
  const displaySubtitle = subtitle || t('subtitle');

  return (
    <section className="py-6 md:py-10 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink-primary mb-2 uppercase rtl:tracking-normal tracking-tight">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-ink-secondary text-sm md:text-base">{displaySubtitle}</p>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className="group bg-white rounded-xl p-6 border border-border-subtle hover:border-[#0E1014] hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-[#F0EFEA] group-hover:bg-[#0E1014] flex items-center justify-center mb-4 transition-colors">
                <Package className="w-8 h-8 text-ink-secondary group-hover:text-[#E5C573] transition-colors" />
              </div>

              {/* Name */}
              <h3 className="font-display font-extrabold text-lg text-ink-primary mb-2 uppercase rtl:tracking-normal tracking-wide">
                {category.name}
              </h3>

              {/* Product Count */}
              <p className="font-latin text-ink-secondary text-sm mb-3 tabular-nums">
                {category.productCount} {t('products')}
              </p>

              {/* Shop Now */}
              <div className="inline-flex items-center text-primary-600 text-sm font-bold opacity-100 md:opacity-75 md:group-hover:opacity-100 transition-opacity uppercase rtl:tracking-normal tracking-wide">
                <span>{t('shopNow')}</span>
                <ArrowRight className="ms-1 h-4 w-4 rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
