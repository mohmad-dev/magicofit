"use client";

import ProductCard from "./ProductCard";
import { useTranslations } from "next-intl";

interface CompleteTheLookProps {
  products: Array<{
    id: string;
    handle?: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    inStock?: boolean;
    stock?: number;
  }>;
}

export default function CompleteTheLook({ products }: CompleteTheLookProps) {
  const t = useTranslations("product");
  if (products.length === 0) return null;

  return (
    <div className="border-t border-neutral-200 pt-8">
      <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-6 uppercase tracking-tight">
        {t("completeTheLook")}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] snap-start"
          >
            <ProductCard
              {...product}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
