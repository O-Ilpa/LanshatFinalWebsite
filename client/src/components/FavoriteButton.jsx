import React from "react";
import { useFavorites } from "../FavoritesContext";

// You can swap these for your preferred icon set
const HeartFilled = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24} {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const HeartOutline = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24} {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const FavoriteButton = ({ id, className = "", size = 24 }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(id);
  return (
    <button
      aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(id);
      }}
      className={`transition-colors ${className}`}
      style={{ color: isFav ? "#e53e3e" : "#aaa" }}
    >
      {isFav ? <HeartFilled width={size} height={size} /> : <HeartOutline width={size} height={size} />}
    </button>
  );
};

export default FavoriteButton; 