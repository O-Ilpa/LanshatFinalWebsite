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

const RawMaterialDetailCard = ({ material }) => {
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
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50/80 to-white/90 rounded-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-200 group cursor-pointer mb-8" dir="rtl">
      {/* Image section */}
      <div className="relative w-full md:w-1/2 flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 to-white/60 p-4">
        {/* Badges */}
        <div className="flex flex-row flex-wrap gap-2 justify-start items-center mb-4 w-full">
          <span className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow">
            <FaRobot className="text-base" />
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
          </span>
          {material.featured && (
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">
              <FaStar className="text-yellow-500" /> مميز
            </span>
          )}
          {material.type && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <FaWarehouse /> {material.type}
            </span>
          )}
          {material.category && (
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <FaIndustry /> {material.category}
            </span>
          )}
          {material.certifications && material.certifications.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <FaCertificate /> شهادات
            </span>
          )}
        </div>
        {/* Image carousel */}
        <div className="relative w-full aspect-square max-w-xs mx-auto flex items-center justify-center bg-white rounded-xl border border-blue-100 shadow-sm">
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
              className="w-full h-full object-contain rounded-xl"
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
          {/* Favorite icon */}
          <FavoriteButton id={material._id} className="absolute top-2 right-2 z-20 text-2xl bg-white rounded-full p-1 shadow hover:scale-110 transition-transform" />
        </div>
      </div>
      {/* Details section */}
      <div className="flex-1 flex flex-col justify-between p-6 gap-4">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-blue-900 mb-2 truncate">
            {material.name || "اسم المادة"}
          </div>
          {/* Supplier and location */}
          <div className="flex flex-wrap items-center gap-3 text-base text-gray-700 mb-3">
            {material.supplier && <span><FaCheckCircle className="inline text-blue-400 mr-1" /> {material.supplier}</span>}
            {material.location && <span><FaMapMarkerAlt className="inline text-gray-400 mr-1" /> {material.location}</span>}
            {material.availableQuantity && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold text-sm">
                الكمية: {material.availableQuantity}
              </span>
            )}
          </div>
          {/* Full Description */}
          <div className="text-base text-gray-800 mb-4 whitespace-pre-line">
            {material.description || "لا يوجد وصف متاح."}
          </div>
          {/* Additional Info */}
          {material.additionalInfo && Object.keys(material.additionalInfo).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2 text-blue-800">معلومات إضافية</h2>
              {Object.entries(material.additionalInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm text-gray-600 border-b py-1">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mt-2 mb-2">
          <button
            type="button"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow flex items-center gap-2 text-lg transition-all duration-150"
            onClick={e => {
              e.stopPropagation();
              toast.success("تم إرسال طلب عرض السعر!");
            }}
          >
            <FaEnvelope className="text-xl" />
            طلب عرض سعر
          </button>
          <button
            type="button"
            className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow flex items-center gap-2 text-lg transition-all duration-150 ${cart.find(i => i._id === material._id) ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={e => {
              e.stopPropagation();
              if (!cart.find(i => i._id === material._id)) {
                addToCart(material);
                toast.success("تمت الإضافة إلى السلة");
              }
            }}
            disabled={!!cart.find(i => i._id === material._id)}
          >
            <FaShoppingCart className="text-xl" />
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
};

export default RawMaterialDetailCard; 