import React, { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaCheckCircle,
  FaEnvelope,
  FaShoppingCart,
  FaRobot,
  FaInfoCircle,
  FaWarehouse,
  FaIndustry,
  FaMapMarkerAlt,
  FaCertificate,
} from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "../CartContext";
import toast from "react-hot-toast";

const RawMaterialCard = ({ material, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const { addToCart, cart } = useCart();
  if (!material) return null;
  const images = material.images && material.images.length > 0 ? material.images : [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      images.length === 0 ? 0 : (prev + 1) % images.length
    );
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      images.length === 0 ? 0 : (prev - 1 + images.length) % images.length
    );
  };

  return (
    <div
      className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50/80 to-white/90 rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex flex-col md:flex-row hover:scale-[1.015] hover:shadow-2xl transition-all duration-200 group cursor-pointer mb-4"
      dir="rtl"
      onClick={onClick}
      style={{ minHeight: '220px' }}
    >
      {/* AI/Smart Suggestion Badge */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow animate-pulse backdrop-blur-sm">
        <FaRobot className="text-lg animate-bounce" />
        اقتراح ذكي
        <span
          className="ml-1 text-white/80 hover:text-white cursor-pointer relative"
          onMouseEnter={e => { e.stopPropagation(); setShowTooltip(true); }}
          onMouseLeave={e => { e.stopPropagation(); setShowTooltip(false); }}
          onClick={e => { e.stopPropagation(); setShowTooltip(v => !v); }}
        >
          <FaInfoCircle />
          {showTooltip && (
            <span className="absolute right-0 top-8 bg-white text-gray-700 rounded-lg shadow-lg px-4 py-2 text-xs w-56 z-50 border border-blue-200 animate-fade-in">
              هذا الاقتراح تم اختياره بناءً على نوع المادة واهتماماتك الأخيرة باستخدام الذكاء الاصطناعي.
            </span>
          )}
        </span>
      </div>
      {/* Favorite icon */}
      <FavoriteButton id={material._id} className="absolute top-3 right-3 z-20 text-2xl bg-white rounded-full p-1 shadow hover:scale-110 transition-transform" />
      {/* Image section */}
      <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-100/60 to-white/60">
        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 transition-colors"
              onClick={prevImage}
              aria-label="السابق"
              tabIndex={-1}
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 transition-colors"
              onClick={nextImage}
              aria-label="التالي"
              tabIndex={-1}
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
        {images.length > 0 ? (
          <img
            className="w-full h-48 md:h-56 object-cover rounded-2xl border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-200"
            src={
              typeof images[currentImageIndex] === "string"
                ? images[currentImageIndex]
                : images[currentImageIndex].url
            }
            alt={material.name || "صورة المادة"}
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400 text-lg">لا توجد صورة</span>
        )}
        {/* Image count */}
        <div className="absolute bottom-2 left-2 bg-white/90 text-gray-700 px-2 py-1 rounded text-xs shadow-sm border border-gray-200 flex items-center gap-1">
          <span>{images.length === 0 ? 0 : currentImageIndex + 1}</span> /
          <span>{images.length}</span>
        </div>
        {/* Certified badge (if any) */}
        {material.certified && (
          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded flex items-center gap-1 text-xs text-blue-700 font-bold border border-blue-200 shadow">
            <FaCheckCircle className="text-blue-500" />
            معتمد
          </div>
        )}
      </div>
      {/* Details section */}
      <div className="flex-1 flex flex-col justify-between p-4 gap-2">
        <div>
          {/* Badges for type/category */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {material.type && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                <FaWarehouse /> {material.type}
              </span>
            )}
            {material.category && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                <FaIndustry /> {material.category}
              </span>
            )}
          </div>
          <div className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
            {material.name || "اسم المادة"}
          </div>
          {/* Supplier and location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            {material.supplier && <span><FaCheckCircle className="inline text-blue-400 mr-1" /> {material.supplier}</span>}
            {material.location && <span><FaMapMarkerAlt className="inline text-gray-400 mr-1" /> {material.location}</span>}
          </div>
          {/* Quantity and certifications */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700 mb-2">
            {material.availableQuantity && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                الكمية: {material.availableQuantity}
              </span>
            )}
            {material.certifications && material.certifications.length > 0 && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                <FaCertificate /> شهادات
              </span>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 items-center mt-2 mb-2">
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow flex items-center gap-2 text-base transition-all duration-150"
            onClick={e => {
              e.stopPropagation();
              toast.success("تم إرسال طلب عرض السعر!");
            }}
          >
            <FaEnvelope className="text-lg" />
            طلب عرض سعر
          </button>
          <button
            type="button"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow flex items-center gap-2 text-base transition-all duration-150 ${cart.find(i => i._id === material._id) ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={e => {
              e.stopPropagation();
              if (!cart.find(i => i._id === material._id)) {
                addToCart(material);
                toast.success("تمت الإضافة إلى السلة");
              }
            }}
            disabled={!!cart.find(i => i._id === material._id)}
          >
            <FaShoppingCart className="text-lg" />
            أضف إلى السلة
          </button>
        </div>
        {/* Short Description */}
        <div className="text-sm text-gray-700 mt-2 line-clamp-2">
          {material.description ? material.description.split("\n")[0] : "-"}
        </div>
      </div>
    </div>
  );
};

export default RawMaterialCard; 