
'use client';

import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  videos?: string[];
  productName: string;
}

export default function ProductImageGallery({ images, videos, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const allMedia = [...images, ...(videos || [])];

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomed(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => prev === allMedia.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
        <img
          src={allMedia[selectedImageIndex]}
          alt={`${productName} - View ${selectedImageIndex + 1}`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => handleImageClick(selectedImageIndex)}
        />
        
        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="ri-arrow-left-line text-gray-800"></i>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="ri-arrow-right-line text-gray-800"></i>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {selectedImageIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {allMedia.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allMedia.map((media, index) => (
            <div
              key={index}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === selectedImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={media}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              <i className="ri-close-line"></i>
            </button>
            <img
              src={allMedia[selectedImageIndex]}
              alt={`${productName} - Zoomed View`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}