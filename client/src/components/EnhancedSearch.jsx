import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, History, TrendingUp, Filter } from 'lucide-react';
import axios from 'axios';

const EnhancedSearch = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Load popular searches
    const loadPopularSearches = async () => {
      try {
        const response = await axios.get(`${BACKAPI}/api/search/popular`);
        if (response.data.success) {
          setPopularSearches(response.data.searches);
        }
      } catch (error) {
        console.error('Error loading popular searches:', error);
      }
    };
    loadPopularSearches();

    // Handle click outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKAPI}/api/machines/search?q=${encodeURIComponent(query)}&filter=${activeFilter}`);
        if (response.data.success) {
          setSuggestions(response.data.machines);
          
          // Track search analytics
          axios.post(`${BACKAPI}/api/search/analytics`, {
            query,
            timestamp: new Date().toISOString(),
            resultsCount: response.data.machines.length
          });
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, activeFilter]);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // Track search analytics
    axios.post(`${BACKAPI}/api/search/analytics`, {
      query: searchQuery,
      timestamp: new Date().toISOString(),
      type: 'full_search'
    });

    // Navigate to search results
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}&filter=${activeFilter}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'machines', label: 'الماكينات' },
    { id: 'parts', label: 'قطع الغيار' },
    { id: 'materials', label: 'المواد الخام' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div ref={searchRef} className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن ماكينات، قطع غيار، أو خدمات..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              dir="rtl"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-3 h-3" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {/* Popular Searches */}
          {!query && popularSearches.length > 0 && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  عمليات البحث الشائعة
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search.term)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {search.term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  عمليات البحث الأخيرة
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  مسح الكل
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-right p-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-gray-700"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {query && (
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">جاري البحث...</div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSearch(item.name)}
                      className="w-full text-right p-2 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <img
                        src={item.images[0]?.url || '/placeholder.png'}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{item.machineType}</span>
                          {item.price && (
                            <span className="text-green-600 font-medium">
                              {item.price} ج.م
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">لا توجد نتائج</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearch; 