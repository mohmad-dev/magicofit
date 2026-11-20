"use client";

import ProductCard from "../product/ProductCard";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Product {
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

interface CategoryProductSectionProps {
  categoryName: string;
  categorySlug: string;
  products: Product[];
}

export default function CategoryProductSection({
  categoryName,
  categorySlug,
  products,
}: CategoryProductSectionProps) {
  const t = useTranslations("productShowcase");

  if (products.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-t border-border-subtle first:border-t-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5 md:mb-6">
        <div className="flex items-center gap-3">
          <span className="h-5 w-[3px] bg-[#C8A04A] rounded-full" aria-hidden="true" />
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink-primary uppercase rtl:tracking-normal tracking-tight">
            {categoryName}
          </h2>
        </div>

        <Link
          href={`/shop/${categorySlug}`}
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs md:text-sm font-bold text-ink-primary hover:text-primary-600 uppercase rtl:tracking-normal tracking-wide whitespace-nowrap transition-colors"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>

      {/* Editorial Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            categoryName={product.categoryName || categoryName}
          />
        ))}
      </div>
    </section>
  );
}
