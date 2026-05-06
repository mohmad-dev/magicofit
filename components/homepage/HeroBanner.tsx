"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

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

export default function HeroBanner({ banners = [], sideBanners = [], isLoading = false }: HeroBannerProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? "rtl" : "ltr" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);



  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
   }, [emblaApi, onSelect]);

  // Auto-play carousel
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    const interval = setInterval(() => {
      if (!isPaused) emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, isPaused, banners.length]);

  // Loading skeleton state for perfectly avoiding CLS
  if (isLoading) {
    return (
      <div className="relative z-10 w-full bg-neutral-50 pb-12 md:pb-16">
         <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-200 animate-pulse" />
         <div className="flex justify-center mt-6 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2.5 w-2.5 rounded-full bg-neutral-200 animate-pulse" />
            ))}
         </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative z-10 w-full overflow-hidden bg-neutral-50 pb-12 md:pb-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Main Carousel - full width on mobile, ~70% on desktop */}
          <div className="lg:col-span-7">
            <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
                  {banners.map((banner, index) => (
                      <div
                        key={banner.id}
                        className="relative flex-[0_0_100%] min-w-0 overflow-hidden"
                      >
                        <Link href={banner.cta_link} className="block w-full h-full cursor-pointer hover:opacity-95 transition-opacity">
                          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-100">
                            <Image
                              src={banner.mobile_image_url}
                              alt={banner.title || "Promotion image"}
                              fill
                              className="object-cover object-center md:hidden"
                              priority={index === 0}
                              sizes="100vw"
                            />
                            <Image
                              src={banner.image_url}
                              alt={banner.title || "Promotion image"}
                              fill
                              className="hidden md:block object-cover object-center"
                              priority={index === 0}
                              sizes="70vw"
                            />
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>

              {/* Prev/Next Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Previous slide"
                  >
                    {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Next slide"
                  >
                    {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                </>
              )}
            </div>

            {/* Progress Bar Navigation */}
            <div className="flex justify-center mt-6 md:mt-8 gap-1">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className="h-0.5 bg-neutral-200 hover:bg-neutral-300 transition-colors duration-300 focus:outline-none rounded-full overflow-hidden"
                  style={{ width: index === selectedIndex ? '32px' : '8px' }}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`h-full bg-neutral-700 transition-all duration-500 rounded-full ${
                      index === selectedIndex ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Side Banners - hidden on mobile, ~30% on desktop */}
          {sideBanners.length > 0 && (
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
              {sideBanners.map((sb) => (
                <Link
                  key={sb.id}
                  href={sb.cta_link}
                  className="relative flex-1 overflow-hidden rounded-xl group cursor-pointer"
                >
                  <Image
                    src={sb.image_url}
                    alt={sb.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-white text-sm font-bold uppercase tracking-wide drop-shadow-lg">
                      {sb.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
