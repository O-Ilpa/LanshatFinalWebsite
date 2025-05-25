import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageCarousel = ({
  images,
  currentImageIndex,
  nextImage,
  prevImage,
  goToImage,
  alt,
  loading = false,
}) => {
  return (
    <div>
      <div
        className="relative w-full h-[500px] bg-gray-100 rounded-t-lg flex items-center justify-center"
        dir="rtl"
      >
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 transition-colors"
          onClick={prevImage}
          aria-label="السابق"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
        {loading && images.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        ) : images.length > 0 ? (
          <img
            className="w-full h-full object-contain rounded-t-lg transition-all duration-300"
            src={
              typeof images[currentImageIndex] === "string"
                ? images[currentImageIndex]
                : images[currentImageIndex].url
            }
            alt={alt || "صورة الآلة"}
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400 text-lg">لا توجد صورة</span>
        )}
        <button
          type="button"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 transition-colors"
          onClick={nextImage}
          aria-label="التالي"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
      </div>
      {/* Thumbnails and counter in a gray bar below the image */}
      {images.length > 1 && (
        <div className="w-full bg-gray-200 rounded-b-lg flex items-center justify-between px-2 py-2 gap-2">
          <div className="flex gap-2 overflow-x-auto flex-1 justify-center">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={typeof img === "string" ? img : img.url}
                alt="صورة مصغرة"
                className={`w-24 h-24 object-cover rounded border-2 cursor-pointer transition-all ${
                  idx === currentImageIndex
                    ? "border-blue-600 bg-white"
                    : "border-gray-200"
                }`}
                onClick={() => goToImage(idx)}
                loading="lazy"
              />
            ))}
          </div>
          <div className="text-xs text-gray-700 bg-white/80 rounded px-2 py-1 border ml-2 flex-shrink-0">
            <span>{currentImageIndex + 1}</span> / <span>{images.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
