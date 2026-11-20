"use client";

import ProductCard from "./ProductCard";

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

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
  );
}
