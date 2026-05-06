"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "../ui/Button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  alt: string;
  discount?: number;
}

export default function ProductGallery({ images, alt, discount }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt_text || `${alt} - Image ${currentIndex + 1}`}
              fill
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute right-4 top-4 rounded bg-primary-600 px-3 py-2 text-sm font-bold text-white uppercase tracking-wide shadow-lg">
            -{discount}%
          </div>
        )}
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5 text-neutral-900" />
            </Button>
            <Button
              variant="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5 text-neutral-900" />
            </Button>
          </>
        )}

        {/* Zoom Indicator */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-2 right-2 rounded-full bg-white/90 p-2 hover:bg-white transition-colors shadow-md"
          title={isZoomed ? "Zoom out" : "Zoom in"}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <ZoomIn className="h-4 w-4 text-neutral-900" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {images.map((image, index) => (
            <motion.button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all snap-start ${
                index === currentIndex
                  ? "border-primary-500 shadow-lg scale-105"
                  : "border-neutral-200 hover:border-primary-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt_text || `${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
