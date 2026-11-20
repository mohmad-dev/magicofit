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
    <section className="py-6 md:py-8 border-t border-[#EAEAEA] first:border-t-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#111318] uppercase rtl:tracking-normal tracking-tight">
          {categoryName}
        </h2>
        <Link
          href={`/shop/${categorySlug}`}
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#111318] hover:text-[#D9480F] uppercase rtl:tracking-normal tracking-wide whitespace-nowrap transition-colors"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>

      {/* Stacked 5-Column Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
        {products.slice(0, 10).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
