"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Container } from "@/components/layout/Container";
import { useTranslations } from "next-intl";

interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
}

interface CollectionClientProps {
  initialProducts: Product[];
  collectionName: string;
  collectionHandle: string;
}

export default function CollectionClient({
  initialProducts,
  collectionName,
  collectionHandle,
}: CollectionClientProps) {
  const [products] = useState(initialProducts);
  const t = useTranslations("collection");

  useEffect(() => {
    console.log('=== COLLECTION CLIENT DEBUG ===');
    console.log('Collection Handle:', collectionHandle);
    console.log('Collection Name:', collectionName);
    console.log('Products Count:', products.length);
    console.log('Products:', products);
  }, [collectionHandle, collectionName, products]);

  return (
    <Container className="py-8 md:py-16 min-h-screen">
      <div className="mb-8 md:mb-12 border-b border-neutral-100 pb-6 md:pb-8">
        <h1 className="font-outfit text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tighter text-neutral-900 mb-3 md:mb-4">
          {collectionName}
        </h1>
        <p className="text-sm md:text-lg text-neutral-500">
          {products.length} {t('products')}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-lg">{t('noProducts')}</p>
        </div>
      )}
    </Container>
  );
}
