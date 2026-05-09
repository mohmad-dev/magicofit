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
    <section className="py-8 md:py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 uppercase tracking-tight">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-neutral-600 text-sm md:text-base">{displaySubtitle}</p>
          )}
        </div>

        {/* Categories Grid - No images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className="group bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
                <Package className="w-8 h-8 text-neutral-400 group-hover:text-primary-600 transition-colors" />
              </div>

              {/* Name */}
              <h3 className="font-outfit font-extrabold text-lg text-neutral-900 mb-2 uppercase tracking-wide">
                {category.name}
              </h3>

              {/* Product Count */}
              <p className="text-neutral-500 text-sm mb-3">
                {category.productCount} {t('products')}
              </p>

              {/* Shop Now */}
              <div className="flex items-center text-primary-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                {t('shopNow')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
