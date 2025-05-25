import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCogs, FaTools, FaTruck, FaWrench, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MachineCard from "./components/machineCard";
import RawMaterialCard from "./components/RawMaterialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useEffect as useEffect2, useState as useState2 } from "react";

const categories = [
  "ماكينات تعبئة",
  "ماكينات تغليف",
  "ماكينات صناعية أخرى",
  "قطع غيار",
];

const ProductsAndServices = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const navigate = useNavigate();
  // Egypt Materials State
  const [egyptMaterials, setEgyptMaterials] = useState2([]);
  const [egyptLoading, setEgyptLoading] = useState2(true);
  const [egyptError, setEgyptError] = useState2(null);

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  // Extract unique categories from products (fallback to predefined)
  const allCategories = [
    "الكل",
    ...categories,
    ...Array.from(
      new Set(
        products
          .map((p) => p.machineType)
          .filter((c) => c && !categories.includes(c))
      )
    ),
  ];

  const filteredProducts =
    selectedCategory === "الكل"
      ? products
      : products.filter((p) => p.machineType === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / cardsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when category changes
  }, [selectedCategory]);

  useEffect(() => {
    axios
      .get(`${BACKAPI}/api/machines/get`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.machines);
        } else {
          setError("لم يتم العثور على المنتجات.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("حدث خطأ أثناء جلب البيانات.");
        setLoading(false);
      });
  }, []);

  // Fetch Egypt Materials
  useEffect2(() => {
    axios
      .get(`${BACKAPI}/api/egypt-materials`)
      .then((res) => {
        if (res.data.success) {
          setEgyptMaterials(res.data.materials);
        } else {
          setEgyptError("لم يتم العثور على المواد الخام.");
        }
        setEgyptLoading(false);
      })
      .catch(() => {
        setEgyptError("حدث خطأ أثناء جلب المواد الخام.");
        setEgyptLoading(false);
      });
  }, []);

  return (
    <div
      className="max-w-7xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow mt-8"
      dir="rtl"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
        منتجاتنا وخدماتنا
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        اكتشف مجموعة واسعة من الماكينات الصناعية والخدمات التي نقدمها لتلبية
        جميع احتياجاتك الصناعية.
      </p>
      {/* Egypt Materials Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">مواد خام مصرية</h2>
        {egyptLoading ? (
          <div className="text-center py-6">جاري تحميل المواد الخام...</div>
        ) : egyptError ? (
          <div className="text-center py-6 text-red-600">{egyptError}</div>
        ) : egyptMaterials.length === 0 ? (
          <div className="text-center py-6 text-gray-500">لا توجد مواد خام متاحة حالياً.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {egyptMaterials.map((product) => (
              <RawMaterialCard key={product._id} material={product} />
            ))}
          </div>
        )}
      </section>
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {allCategories.map((cat) => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-full font-bold border transition-colors text-base shadow-sm ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Products Stack with Pager */}
      {loading ? (
        <div className="text-center py-10">جاري التحميل...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          لا توجد منتجات في هذه الفئة حالياً.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 px-4 md:px-8">
            {paginatedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/${product.slug}`)}
                className="cursor-pointer"
              >
                <MachineCard machine={product} horizontal={true} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded font-bold ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded font-bold ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsAndServices;
