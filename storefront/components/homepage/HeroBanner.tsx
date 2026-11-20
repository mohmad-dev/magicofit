"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  if (isLoading) {
    return (
      <section className="w-full bg-white pt-4 pb-3 md:pt-5 md:pb-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full aspect-[16/9] md:aspect-[2.2/1] lg:max-h-[520px] rounded-2xl bg-[#F5F5F5] animate-pulse" />
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) return null;

  return (
    <section
      className="relative w-full bg-white pt-4 pb-3 md:pt-5 md:pb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group rounded-2xl overflow-hidden bg-[#0F1115]" dir={isRTL ? "rtl" : "ltr"}>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="relative flex-[0_0_100%] min-w-0 overflow-hidden"
                >
                  <Link href={banner.cta_link || "/shop"} className="block w-full h-full cursor-pointer">
                    <div className="relative w-full aspect-[16/9] md:aspect-[2.2/1] lg:max-h-[520px] bg-[#0F1115]">
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
                        sizes="100vw"
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
                className="hidden md:flex absolute start-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-[#0F1115]/65 hover:bg-[#0F1115] text-white border border-white/15 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                aria-label={isRTL ? "الشريحة السابقة" : "Previous slide"}
              >
                {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="hidden md:flex absolute end-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-[#0F1115]/65 hover:bg-[#0F1115] text-white border border-white/15 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                aria-label={isRTL ? "الشريحة التالية" : "Next slide"}
              >
                {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </>
          )}

          {/* Subtle Progress Rail Overlay */}
          {banners.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent pt-6 pb-2 px-4 flex items-center justify-center gap-1.5 pointer-events-none">
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
                    <span className="block relative h-[3px] w-10 sm:w-14 rounded-full bg-white/30 overflow-hidden group-hover/bar:bg-white/50 transition-colors">
                      {isActive && (
                        <span
                          key={`${selectedIndex}-${isPaused}`}
                          className={`block h-full w-full bg-white ${!isPaused ? "animate-hero-bar" : ""}`}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
