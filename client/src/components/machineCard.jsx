import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaRegStar,
  FaFlag,
  FaCheckCircle,
  FaEnvelope,
  FaShoppingCart,
  FaRobot,
  FaInfoCircle,
} from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "../CartContext";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const MachineCard = ({ machine, onClick }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const { addToCart, cart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];

  if (!machine) return null;
  const images =
    machine.images && machine.images.length > 0 ? machine.images : [];

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

  const showMachine = () => {
    if (onClick) return onClick();
    if (machine.slug) {
      navigate(`/viewmachine/${machine.slug}`);
    } else if (machine._id) {
      navigate(`/viewmachine/${machine._id}`);
    }
  };

  return (
    <div
      className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50/80 to-white/90 rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex flex-col md:flex-row hover:scale-[1.015] hover:shadow-2xl transition-all duration-200 group cursor-pointer mb-4"
      dir="rtl"
      onClick={showMachine}
      style={{ minHeight: '220px' }}
    >
      {/* AI/Smart Suggestion Badge */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow animate-pulse backdrop-blur-sm">
        <FaRobot className="text-lg animate-bounce" />
        {t.smartSuggestion}
        <span
          className="ml-1 text-white/80 hover:text-white cursor-pointer relative"
          onMouseEnter={e => { e.stopPropagation(); setShowTooltip(true); }}
          onMouseLeave={e => { e.stopPropagation(); setShowTooltip(false); }}
          onClick={e => { e.stopPropagation(); setShowTooltip(v => !v); }}
        >
          <FaInfoCircle />
          {showTooltip && (
            <span className="absolute right-0 top-8 bg-white text-gray-700 rounded-lg shadow-lg px-4 py-2 text-xs w-56 z-50 border border-blue-200 animate-fade-in">
              {t.smartSuggestionTooltip}
            </span>
          )}
        </span>
      </div>
      {/* Favorite icon */}
      <FavoriteButton id={machine._id} className="absolute top-3 right-3 z-20 text-2xl bg-white rounded-full p-1 shadow hover:scale-110 transition-transform" />
      {/* Image section */}
      <div className="relative w-full md:w-[280px] h-[220px] overflow-hidden flex-shrink-0">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={machine.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={t.previousImage}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={t.nextImage}
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">{t.noImage}</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded flex items-center gap-1 text-xs text-blue-700 font-bold border border-blue-200 shadow">
          <FaCheckCircle className="text-blue-500" />
          {t.verifiedDealer}
        </div>
      </div>
      {/* Details section */}
      <div className="flex-1 flex flex-col justify-between p-4 gap-2">
        <div>
          {/* Category and title */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
              {machine.machineType || t.uncategorized}
            </span>
            {machine.featured && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                {t.featured} <FaStar className="text-yellow-500" />
              </span>
            )}
          </div>
          <div className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
            {machine.name || t.machineName}
          </div>
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <FaFlag className="text-lg text-gray-400" />
            <span>{machine.location || t.egypt}</span>
            <span className="text-xs text-gray-400">{t.distanceNotSpecified}</span>
          </div>
        </div>
        {/* Price and Inquiry Button */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-green-600">
            {machine.price ? `${machine.price} ${t.currency}` : t.priceOnRequest}
          </span>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-semibold shadow transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/viewmachine/${machine.slug || machine._id}`);
            }}
          >
            {t.viewDetails}
          </button>
        </div>
        {/* Description */}
        <div className="text-sm text-gray-700 mt-2 line-clamp-2">
          <span className="font-bold">{t.condition}:</span> {machine.condition || "-"}
          {machine.manufacturer && (
            <span className="ml-2">{t.manufacturer}: {machine.manufacturer}</span>
          )}
          <br />
          {machine.description ? machine.description.split("\n")[0] : "-"}
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
