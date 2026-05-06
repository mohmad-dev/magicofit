"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type PromoBanner = {
  id: string;
  image_url: string;
  title: string;
  subtitle?: string;
  cta_link: string;
  cta_text?: string;
};

interface PromotionalBannersProps {
  banners: PromoBanner[];
}

export default function PromotionalBanners({ banners }: PromotionalBannersProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="w-full py-6 md:py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
          <div className="flex gap-3">
            {banners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.cta_link}
                className="group relative overflow-hidden aspect-[2/1] flex-none w-[280px] snap-start rounded-xl block"
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {banner.subtitle && (
                    <p className="text-white/80 text-[10px] font-medium uppercase tracking-widest mb-1">
                      {banner.subtitle}
                    </p>
                  )}
                  <h3 className="text-white font-outfit text-base font-extrabold uppercase tracking-tight mb-2">
                    {banner.title}
                  </h3>
                  {banner.cta_text && (
                    <span className="inline-flex items-center text-white text-xs font-bold uppercase tracking-wide group-hover:underline">
                      {banner.cta_text}
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Desktop: 4-col grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-4">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.cta_link}
              className="group relative overflow-hidden aspect-[4/3] block rounded-xl"
            >
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {banner.subtitle && (
                  <p className="text-white/80 text-[10px] font-medium uppercase tracking-widest mb-1">
                    {banner.subtitle}
                  </p>
                )}
                <h3 className="text-white font-outfit text-sm lg:text-base font-extrabold uppercase tracking-tight mb-1">
                  {banner.title}
                </h3>
                {banner.cta_text && (
                  <span className="inline-flex items-center text-white text-[10px] lg:text-xs font-bold uppercase tracking-wide group-hover:underline">
                    {banner.cta_text}
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
