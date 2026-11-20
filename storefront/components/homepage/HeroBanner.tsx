"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Truck } from "lucide-react";

export type Banner = {
  id: string;
  image_url: string;
  mobile_image_url: string;
  title: string;
  cta_link: string;
  cta_text?: string;
};

export type SideBanner = {
  id: string;
  image_url: string;
  title: string;
  cta_link: string;
};

interface HeroBannerProps {
  banners?: Banner[];
  sideBanners?: SideBanner[];
  isLoading?: boolean;
}

export default function HeroBanner({ banners = [], isLoading = false }: HeroBannerProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? "rtl" : "ltr" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play carousel
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    const interval = setInterval(() => {
      if (!isPaused) emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, isPaused, banners.length]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  // Loading skeleton avoiding CLS
  if (isLoading) {
    return (
      <section className="w-full py-4 md:py-6">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 aspect-[16/9] rounded-lg bg-surface-subtle animate-pulse" />
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
              <div className="flex-1 rounded-lg bg-obsidian-900/10 animate-pulse" />
              <div className="flex-1 rounded-lg bg-surface-subtle animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) return null;

  const DirectionalArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      className="relative w-full py-4 md:py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Main 16:9 Uncropped Carousel (8/12 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative group rounded-lg overflow-hidden bg-[#0E1014] border border-border-subtle" dir={isRTL ? "rtl" : "ltr"}>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className="relative flex-[0_0_100%] min-w-0 overflow-hidden"
                    >
                      <Link href={banner.cta_link || "/shop"} className="block w-full h-full cursor-pointer">
                        <div className="relative w-full aspect-[16/9] bg-[#0E1014]">
                          <Image
                            src={banner.mobile_image_url}
                            alt={banner.title || "MagicOFit Promotion"}
                            fill
                            className="object-cover object-center md:hidden"
                            priority={index === 0}
                            fetchPriority={index === 0 ? "high" : undefined}
                            sizes="100vw"
                          />
                          <Image
                            src={banner.image_url}
                            alt={banner.title || "MagicOFit Promotion"}
                            fill
                            className="hidden md:block object-cover object-center"
                            priority={index === 0}
                            fetchPriority={index === 0 ? "high" : undefined}
                            sizes="(max-width: 1024px) 100vw, 66vw"
                          />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtle Hover Navigation Controls */}
              {banners.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollPrev()}
                    className="hidden md:flex absolute start-3 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-[#0E1014]/70 hover:bg-[#0E1014] text-white border border-white/15 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                    aria-label={isRTL ? "الشريحة السابقة" : "Previous slide"}
                  >
                    {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollNext()}
                    className="hidden md:flex absolute end-3 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-[#0E1014]/70 hover:bg-[#0E1014] text-white border border-white/15 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                    aria-label={isRTL ? "الشريحة التالية" : "Next slide"}
                  >
                    {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                </>
              )}

              {/* Clickable Progress Rail Overlay */}
              {banners.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent pt-5 pb-1 px-4 flex items-center justify-center gap-1.5 pointer-events-none">
                  {banners.map((b, index) => {
                    const isActive = index === selectedIndex;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => scrollTo(index)}
                        className="pointer-events-auto py-3 px-0.5 flex items-center cursor-pointer group/bar"
                        aria-label={`${isRTL ? "انتقل إلى العرض" : "Go to slide"} ${index + 1}`}
                      >
                        <span className="block relative h-[3px] w-12 sm:w-16 rounded-full bg-white/30 overflow-hidden group-hover/bar:bg-white/50 transition-colors">
                          {isActive && (
                            <span
                              key={`${selectedIndex}-${isPaused}`}
                              className={`block h-full w-full bg-[#C8A04A] ${!isPaused ? "animate-hero-bar" : ""}`}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Quick Callout Strip */}
            <div className="grid grid-cols-2 gap-2.5 lg:hidden mt-3">
              <Link
                href="/shop"
                className="flex items-center justify-between gap-2 min-h-[44px] rounded-lg bg-[#0E1014] text-white border border-white/10 px-3.5 py-2.5 hover:border-[#C8A04A]/50 transition-colors"
              >
                <span className="font-display text-xs font-extrabold leading-tight">
                  {isRTL ? "تشكيلة 2026" : "2026 Collection"}
                </span>
                <DirectionalArrow className="h-4 w-4 text-[#E5C573] flex-shrink-0" />
              </Link>
              <Link
                href="/shipping"
                className="flex items-center justify-between gap-2 min-h-[44px] rounded-lg bg-[#ECEAE3] text-ink-primary border border-[#DFDCD3] px-3.5 py-2.5 hover:border-ink-primary/40 transition-colors"
              >
                <span className="font-display text-xs font-extrabold leading-tight">
                  {isRTL ? "شحن مجاني +2,000 ج.م." : "Free Ship 2,000+ EGP"}
                </span>
                <Truck className="h-4 w-4 text-primary-600 flex-shrink-0" />
              </Link>
            </div>
          </div>

          {/* 2 Distinct Editorial Callout Panels (4/12 cols on desktop) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
            {/* Top Editorial Panel: Obsidian Season Drops */}
            <Link
              href="/shop"
              className="relative flex-1 overflow-hidden rounded-lg bg-[#0E1014] text-white border border-white/10 p-6 flex flex-col justify-between group hover:border-[#C8A04A]/50 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-[#E5C573] uppercase rtl:tracking-normal tracking-wider mb-2">
                  {isRTL ? "تشكيلة 2026" : "2026 Collection"}
                </p>
                <h2 className="font-display text-xl font-extrabold text-white leading-snug mb-2">
                  {isRTL ? "أطقم الأندية وأحذية الملاعب" : "Pro Club Kits & Match Boots"}
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-[260px]">
                  {isRTL
                    ? "خامات تنفس عالية وأحذية احترافية مختارة لموسم البطولات."
                    : "Performance jerseys and match-ready footwear built for the pitch."}
                </p>
              </div>

              <div className="pt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#E5C573] group-hover:gap-2.5 transition-all">
                <span>{isRTL ? "استكشف التشكيلة" : "Explore Drops"}</span>
                <DirectionalArrow className="h-4 w-4" />
              </div>
            </Link>

            {/* Bottom Editorial Panel: Free Shipping & COD Advantage */}
            <Link
              href="/shipping"
              className="flex-1 overflow-hidden rounded-lg bg-[#ECEAE3] text-ink-primary border border-[#DFDCD3] p-6 flex flex-col justify-between group hover:border-ink-primary/40 transition-colors"
            >
              <div>
                <Truck className="h-5 w-5 text-primary-600 mb-3" />
                <h2 className="font-display text-xl font-extrabold text-ink-primary leading-snug mb-1.5">
                  {isRTL ? "شحن مجاني فوق 2,000 ج.م." : "Free Shipping Over 2,000 EGP"}
                </h2>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {isRTL
                    ? "توصيل سريع لجميع محافظات مصر مع معاينة الطلب والدفع عند الاستلام."
                    : "Reliable delivery across Egypt with Cash on Delivery support."}
                </p>
              </div>

              <div className="pt-3 inline-flex items-center gap-1.5 text-xs font-bold text-ink-primary group-hover:text-primary-600 group-hover:gap-2.5 transition-all">
                <span>{isRTL ? "تفاصيل الشحن" : "Shipping Details"}</span>
                <DirectionalArrow className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
