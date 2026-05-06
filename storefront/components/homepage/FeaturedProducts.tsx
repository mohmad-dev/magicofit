"use client";

import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
  stock?: number;
}

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
  viewAllLink?: string;
}

export default function FeaturedProducts({
  title,
  subtitle,
  products,
  viewAllLink,
  loading = false,
}: FeaturedProductsProps) {
  if (products.length === 0 && !loading) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 uppercase tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-neutral-600">{subtitle}</p>
            )}
          </div>
          {viewAllLink && !loading && (
            <Link href={viewAllLink}>
              <button className="text-primary-600 hover:text-primary-700 font-bold text-sm uppercase tracking-wide">
                View All →
              </button>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
