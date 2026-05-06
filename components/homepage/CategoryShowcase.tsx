"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Category {
  id: string;
  name: string;
  image: string;
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

        {/* Categories - Mobile: horizontal scroll, Desktop: grid */}
        {/* Mobile scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
          <div className="flex gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-square hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500/50 flex-none w-[200px] snap-start"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="200px"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-outfit font-extrabold text-base mb-1 uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-xs mb-2">
                    {category.productCount} {t('products')}
                  </p>
                  <div className="flex items-center text-primary-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                    {t('shopNow')}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-square hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500/50"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 1024px) 33vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-outfit font-extrabold text-lg mb-1 uppercase tracking-wide">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-2">
                  {category.productCount} {t('products')}
                </p>
                <div className="flex items-center text-primary-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                  {t('shopNow')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
