"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor?: string;
  countdownDate?: Date;
}

interface HeroCarouselProps {
  slides: Slide[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  slides,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      dragFree: true,
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: autoPlayInterval,
        stopOnInteraction: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-white text-neutral-900">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div
              key={s.id}
              className="flex-[0_0_85%] min-w-0 md:flex-[0_0_85%] lg:flex-[0_0_85%] relative"
              style={{ margin: "0 7.5%" }}
            >
              <div className="relative h-full w-full rounded-2xl overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={slides.indexOf(s) === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/60" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="max-w-2xl">
                      <p className="text-sm md:text-base font-medium mb-2 opacity-80 uppercase tracking-widest text-primary-600">
                        {s.subtitle}
                      </p>
                      <h1 className="font-outfit text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase italic tracking-tighter mb-6 text-neutral-900 drop-shadow-sm">
                        {s.title}
                      </h1>
                      <p className="text-base md:text-lg mb-8 opacity-90 line-clamp-2 text-neutral-700">
                        {s.description}
                      </p>
                      <Link href={s.ctaLink}>
                        <Button variant="primary" size="lg" className="group bg-primary-600 hover:bg-primary-700 text-white font-bold tracking-wide uppercase shadow-lg shadow-primary-500/30">
                          {s.ctaText}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {scrollSnaps.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "w-8 bg-primary-600"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
