"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { searchProducts } from "@/lib/store-api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchProducts(query);
        const transformed = data.products.slice(0, 8).map((product: any) => {
          const firstVariant = product.variants?.[0];
          const getPrice = (variant: any) => {
            if (variant?.calculated_price) {
              return variant.calculated_price.calculated_amount / 100;
            }
            if (variant?.prices && variant.prices.length > 0) {
              return variant.prices[0].amount / 100;
            }
            return 0;
          };

          return {
            id: product.id,
            handle: product.handle,
            name: product.title || "",
            price: getPrice(firstVariant),
            image: product.thumbnail || product.images?.[0]?.url || "/placeholder-product.png",
          };
        });
        setResults(transformed);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleProductClick = (handle: string) => {
    onClose();
    router.push(`/products/${handle}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-neutral-200 px-6 py-4">
          <Search className="h-5 w-5 text-neutral-400 mr-3" />
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full text-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              autoFocus
            />
          </form>
          <button
            onClick={onClose}
            className="ml-3 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.handle)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">{product.name}</h3>
                    <p className="text-primary-600 font-bold mt-1">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">No products found for "{query}"</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">Start typing to search...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50">
          <p className="text-xs text-neutral-500">
            Use <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-neutral-700">↑</kbd>
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-neutral-700">↓</kbd> to navigate,
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-neutral-700">Enter</kbd> to select,
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-neutral-700">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
