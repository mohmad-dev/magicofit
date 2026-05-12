"use client";

import ProductCard from "../product/ProductCard";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
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
    <section className="py-3 md:py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="font-outfit text-lg md:text-2xl font-extrabold text-neutral-900 uppercase tracking-tight">
          {categoryName}
        </h2>
        <Link
          href={`/shop/${categorySlug}`}
          className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-primary-700 hover:text-primary-800 uppercase tracking-wide whitespace-nowrap"
        >
          {t('viewAll')}
          <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </Link>
      </div>

      {/* Products - keep larger cards like the main showcases */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {products.slice(0, 10).map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </section>
  );
}
