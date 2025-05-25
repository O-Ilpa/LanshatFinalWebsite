import React from 'react';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import MachineCard from './machineCard';
import { Clock } from 'lucide-react';

const RecentlyViewed = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            المنتجات التي تم عرضها مؤخراً
          </h2>
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            مسح الكل
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyViewed.map((item) => (
            <MachineCard key={item._id} machine={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed; 