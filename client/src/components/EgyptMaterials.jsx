import React, { useState, useEffect } from "react";
import InquiryForm from "./InquiryForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RawMaterialCard from "./RawMaterialCard";

const EgyptMaterials = () => {
  const [form, setForm] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    zip: "",
    country: "مصر",
    isDealer: false,
    receiveOffers: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Egypt materials state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const navigate = useNavigate();
  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  useEffect(() => {
    axios
      .get(`${BACKAPI}/api/egypt-materials`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.materials);
        } else {
          setProductsError("لم يتم العثور على المواد الخام.");
        }
        setProductsLoading(false);
      })
      .catch(() => {
        setProductsError("حدث خطأ أثناء جلب المواد الخام.");
        setProductsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // You may want to POST to a specific endpoint for Egypt materials inquiries
      // For now, we'll just simulate success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1200);
    } catch {
      setError("حدث خطأ أثناء إرسال الاستفسار. حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-900">تسهيل التجارة العالمية</h1>
      <p className="text-lg mb-8 text-center text-gray-700">
        من خلال علاقاتنا القوية مع الموردين في مصر، تساعد لنشات الشركات حول العالم في الحصول على مجموعة واسعة من المواد الخام بكفاءة وأمان.
      </p>

      {/* Product Showcase Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">منتجات المواد الخام المصرية</h2>
        {productsLoading ? (
          <div className="text-center py-6">جاري تحميل المواد الخام...</div>
        ) : productsError ? (
          <div className="text-center py-6 text-red-600">{productsError}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-6 text-gray-500">لا توجد مواد خام متاحة حالياً.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <RawMaterialCard key={product._id} material={product} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">مهتم بالحصول على مواد خام من مصر؟</h2>
        <p className="mb-4 text-gray-600">املأ النموذج أدناه وسيتواصل معك فريقنا لمساعدتك في تلبية احتياجاتك.</p>
        <InquiryForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          success={success}
          showExtraFields={true}
        />
      </div>
    </div>
  );
};

export default EgyptMaterials; 