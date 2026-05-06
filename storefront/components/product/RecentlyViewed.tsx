"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
  stock?: number;
}

const STORAGE_KEY = "recently-viewed";
const MAX_ITEMS = 8;

interface RecentlyViewedProps {
  currentProductId?: string;
}

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter out current product if viewing a product page
        const filtered = currentProductId
          ? parsed.filter((p: RecentlyViewedProduct) => p.id !== currentProductId)
          : parsed;
        setProducts(filtered);
      } catch (e) {
        console.error("Failed to parse recently viewed:", e);
      }
    }
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="py-12 bg-neutral-50">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-8 uppercase tracking-tight">
          Recently Viewed
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 snap-start">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function addToRecentlyViewed(product: RecentlyViewedProduct) {
  const stored = localStorage.getItem(STORAGE_KEY);
  let products: RecentlyViewedProduct[] = [];
  
  if (stored) {
    try {
      products = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse recently viewed:", e);
    }
  }

  // Remove if already exists (to move to front)
  products = products.filter((p) => p.id !== product.id);
  
  // Add to front
  products.unshift(product);
  
  // Limit to max items
  products = products.slice(0, MAX_ITEMS);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
