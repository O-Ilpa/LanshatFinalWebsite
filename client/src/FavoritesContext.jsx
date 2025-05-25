import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

const FAVORITES_KEY = "lanshat_favorites";

function getLocalFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}
function setLocalFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export const FavoritesProvider = ({ children, isLoggedIn, token }) => {
  const [favorites, setFavorites] = useState([]);
  const BACKAPI = import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEVELOPMENT_API
    : import.meta.env.VITE_PRODUCTION_API;

  // Load favorites on mount
  useEffect(() => {
    if (isLoggedIn && token) {
      axios.get(`${BACKAPI}/api/auth/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.data.success) setFavorites(res.data.favorites);
        })
        .catch(() => setFavorites([]));
    } else {
      setFavorites(getLocalFavorites());
    }
  }, [isLoggedIn, token]);

  // Add/remove favorite
  const toggleFavorite = async (id) => {
    if (isLoggedIn && token) {
      try {
        const res = await axios.post(`${BACKAPI}/api/auth/favorites`, { productId: id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setFavorites(res.data.favorites);
      } catch (err) { console.error(err); }
    } else {
      let favs = getLocalFavorites();
      if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
      } else {
        favs.push(id);
      }
      setLocalFavorites(favs);
      setFavorites(favs);
    }
  };

  // Remove favorite by ID
  const removeFavorite = async (id) => {
    if (isLoggedIn && token) {
      try {
        const res = await axios.delete(`${BACKAPI}/api/auth/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setFavorites(res.data.favorites);
      } catch (err) { console.error(err); }
    } else {
      let favs = getLocalFavorites().filter(f => f !== id);
      setLocalFavorites(favs);
      setFavorites(favs);
    }
  };

  // Merge localStorage favorites into user account on login
  const mergeFavoritesOnLogin = async () => {
    if (isLoggedIn && token) {
      const localFavs = getLocalFavorites();
      for (const id of localFavs) {
        await axios.post(`${BACKAPI}/api/auth/favorites`, { productId: id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem(FAVORITES_KEY);
      // Reload from server
      const res = await axios.get(`${BACKAPI}/api/auth/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setFavorites(res.data.favorites);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite, mergeFavoritesOnLogin }}>
      {children}
    </FavoritesContext.Provider>
  );
}; 