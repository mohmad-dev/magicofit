"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="relative z-10 w-full overflow-hidden bg-neutral-50 pb-6 md:pb-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
                              className="object-cover object-center md:hidden rounded-2xl"
                              priority={index === 0}
                              sizes="100vw"
                            />
                            <Image
                              src={banner.image_url}
                              alt={banner.title || "Promotion image"}
                              fill
                              className="hidden md:block object-cover object-center rounded-2xl"
                              priority={index === 0}
                              sizes="70vw"
                            />
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            {/* Progress indicators */}
            <div className="flex justify-center mt-4 md:mt-6 gap-1.5">
              {banners.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === selectedIndex ? 'w-8 bg-neutral-800' : 'w-2 bg-neutral-300'
                  }`}
                />
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
