'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { ProductImage } from '../../types';
import { resolveMediaUrl } from '../../lib/utils';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  activeImageIndex?: number;
}

export const ProductGallery = ({ images, productName, activeImageIndex }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(activeImageIndex ?? 0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  React.useEffect(() => {
    if (activeImageIndex !== undefined && activeImageIndex >= 0 && activeImageIndex < images.length) {
      setSelectedIndex(activeImageIndex);
    }
  }, [activeImageIndex, images.length]);

  const galleryImages =
    images && images.length > 0
      ? images.map((img) => ({
          ...img,
          url: resolveMediaUrl(img.url, '/images/nalmara/hd/cat_sarees_hd.jpg'),
        }))
      : [
          {
            url: '/images/nalmara/hd/cat_sarees_hd.jpg',
            alt: productName,
          },
        ];

  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (Horizontal on mobile, vertical on desktop) */}
      {galleryImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-none py-1">
          {galleryImages.map((img, idx) => (
            <button
              key={img.url + idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? 'border-[#D4AF37] ring-2 ring-[#380725] shadow-lg scale-105'
                  : 'border-[#D4AF37]/35 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display with 24K Gold Bezel & Corner Brackets */}
      <div className="relative flex-1 aspect-[3/4] md:max-h-[600px] bg-gradient-to-b from-[#380725] to-[#240415] rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(40,6,25,0.28)] p-1.5">
        {/* Corner Filigree Brackets */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#FFE59E] z-20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#FFE59E] z-20 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#FFE59E] z-20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#FFE59E] z-20 pointer-events-none" />

        <div
          className="relative w-full h-full cursor-crosshair overflow-hidden rounded-[20px] border border-[#D4AF37]/50"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover object-center transition-transform duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            unoptimized
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Previous / Next buttons */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#280619]/90 border border-[#D4AF37] text-[#FFE59E] hover:bg-[#380725] shadow-lg transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#280619]/90 border border-[#D4AF37] text-[#FFE59E] hover:bg-[#380725] shadow-lg transition-all cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Trigger */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-5 right-5 z-20 p-2.5 rounded-full bg-[#280619]/90 border border-[#D4AF37] text-[#FFE59E] hover:bg-[#380725] shadow-lg transition-colors cursor-pointer"
          aria-label="View fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Gallery Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#1C0411]/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[#380725] border border-[#D4AF37] text-[#FFE59E] hover:bg-[#5B0E3D] transition-colors cursor-pointer"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] border border-[#D4AF37]/50 rounded-2xl overflow-hidden">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || productName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#380725] border border-[#D4AF37] text-[#FFE59E] hover:bg-[#5B0E3D] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#380725] border border-[#D4AF37] text-[#FFE59E] hover:bg-[#5B0E3D] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
