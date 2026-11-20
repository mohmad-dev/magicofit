"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { getRegions, searchProducts } from "@/lib/store-api";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [regionId, setRegionId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("search");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    (async () => {
      try {
        const regions = await getRegions();
        const egyptRegion = regions.find((r) => r.currency_code === "egp") || regions[0];
        if (!cancelled) setRegionId(egyptRegion?.id);
      } catch {
        if (!cancelled) setRegionId(undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchProducts(query, { region_id: regionId });
        const transformed = data.products.slice(0, 8).map((product: any) => {
          const firstVariant = product.variants?.[0];
          const getPrice = (variant: any) => {
            if (variant?.calculated_price) {
              return variant.calculated_price.calculated_amount;
            }
            if (variant?.prices && variant.prices.length > 0) {
              return variant.prices[0].amount;
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
  }, [query, regionId]);

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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-white rounded-xl border border-border-subtle shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={t("searchPlaceholder")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-3.5 bg-white">
          <Search className="h-5 w-5 text-ink-secondary flex-shrink-0" />
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full text-base text-ink-primary placeholder:text-ink-secondary/70 focus:outline-none bg-transparent"
              autoFocus
            />
          </form>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center hover:bg-surface-subtle rounded-md transition-colors cursor-pointer"
            aria-label={isAr ? "إغلاق البحث" : "Close search"}
          >
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-7 w-7 text-primary-600 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-border-subtle">
              {results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductClick(product.handle)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-surface-subtle transition-colors text-start cursor-pointer"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 bg-[#F0EFEA] rounded-md overflow-hidden">
                    <Image
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-ink-primary truncate">{product.name}</h3>
                    <p className="font-latin text-primary-600 font-extrabold text-sm mt-1 tabular-nums">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12 px-4">
              <p className="text-ink-secondary font-medium">{t("noResultsFor", { query })}</p>
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <p className="text-ink-secondary text-sm">{t("enterSearch")}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-5 py-3 bg-surface-subtle flex items-center justify-between text-xs text-ink-secondary">
          <span>{isAr ? "اضغط Enter لعرض جميع النتائج" : "Press Enter to view all results"}</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="font-latin px-2 py-0.5 bg-white border border-border-subtle rounded text-ink-primary font-semibold">
              Esc
            </kbd>
            <span>{isAr ? "للإغلاق" : "to close"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
