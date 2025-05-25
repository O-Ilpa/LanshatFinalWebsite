import React, { useEffect, useState } from "react";
import { useFavorites } from "../FavoritesContext";
import MachineCard from "./machineCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BACKAPI = import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEVELOPMENT_API
    : import.meta.env.VITE_PRODUCTION_API;

  useEffect(() => {
    if (!favorites.length) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Fetch both machines and materials in parallel
    Promise.all([
      axios.get(`${BACKAPI}/api/machines/get`),
      axios.get(`${BACKAPI}/api/egypt-materials`)
    ]).then(([machinesRes, materialsRes]) => {
      const machines = machinesRes.data.machines || [];
      const materials = (materialsRes.data.materials || []).map(m => ({ ...m, isMaterial: true }));
      // Merge all items
      const allItems = [...machines, ...materials];
      // Filter only favorites
      const favItems = allItems.filter(item => favorites.includes(item._id));
      setItems(favItems);
      setLoading(false);
    }).catch(() => {
      setItems([]);
      setLoading(false);
    });
  }, [favorites]);

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">المفضلة</h1>
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-lg">لا توجد عناصر في المفضلة بعد.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => item.isMaterial ? (
            <div key={item._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-start relative">
              <button
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                onClick={e => { e.stopPropagation(); removeFavorite(item._id); }}
                aria-label="إزالة من المفضلة"
              >
                ×
              </button>
              <img src={item.images?.[0]?.url || item.images?.[0] || "/assets/no-image.png"} alt={item.name} className="w-full h-40 object-contain mb-3 rounded" />
              <div className="font-bold text-lg mb-1">{item.name}</div>
              <div className="text-sm text-gray-600 mb-2">{item.type || "مادة خام"}</div>
              <button
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => navigate(`/egypt-materials/${item._id}`)}
              >
                عرض التفاصيل
              </button>
            </div>
          ) : (
            <MachineCard key={item._id} machine={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 