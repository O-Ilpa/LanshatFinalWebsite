import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InquiryForm from "./InquiryForm";
import RawMaterialDetailCard from "./RawMaterialDetailCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const EgyptMaterialView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  // Inquiry form state
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
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKAPI}/api/egypt-materials`)
      .then((res) => {
        if (res.data.success) {
          const found = res.data.materials.find((m) => m._id === id);
          if (found) {
            setProduct(found);
            setForm((prev) => ({
              ...prev,
              message: `استفسار عن المنتج: ${found.name}\n`,
            }));
          } else setError("لم يتم العثور على المنتج.");
        } else {
          setError("لم يتم العثور على المنتج.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("حدث خطأ أثناء جلب بيانات المنتج.");
        setLoading(false);
      });
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess(false);
    try {
      // Simulate success
      setTimeout(() => {
        setFormSuccess(true);
        setFormLoading(false);
      }, 1200);
    } catch {
      setFormError("حدث خطأ أثناء إرسال الاستفسار. حاول مرة أخرى.");
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }
  if (!product) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-2 md:px-8">
      <button
        className="mb-6 text-blue-700 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← عودة
      </button>
      <RawMaterialDetailCard material={product} />
      {/* Inquiry form and any other details remain below */}
      <div id="inquiry-form-section" className="mt-8">
        <InquiryForm
          form={form}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          loading={formLoading}
          error={formError}
          success={formSuccess}
          showExtraFields={true}
        />
      </div>
    </div>
  );
};

export default EgyptMaterialView; 