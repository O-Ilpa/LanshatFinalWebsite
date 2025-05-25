import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import axios from "axios";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaFlag,
  FaPhone,
  FaEnvelope,
  FaEuroSign,
  FaUser,
  FaPrint,
  FaRegStar,
  FaStar,
  FaShareAlt,
  FaWhatsapp,
  FaShoppingCart,
  FaArrowUp,
  FaExclamationTriangle,
  FaFileDownload,
} from "react-icons/fa";
import InquiryForm from "./InquiryForm";
import ImageCarousel from "./ImageCarousel";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import { toast } from "react-toastify";
import MachineCard from "./machineCard";
import { useCart } from "../CartContext";
import FavoriteButton from "./FavoriteButton";

const ShowMachine = () => {
  const { id, slug } = useParams();
  const idOrSlug = id || slug;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const modalRef = useRef();
  const [modalForm, setModalForm] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    zip: "",
    country: t.country,
    isDealer: false,
    receiveOffers: false,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [similarMachines, setSimilarMachines] = useState([]);
  const { cart, addToCart } = useCart();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [similarMachinesError, setSimilarMachinesError] = useState("");
  const [similarMachinesLoading, setSimilarMachinesLoading] = useState(false);

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        // Check if idOrSlug is a valid MongoDB ObjectId (24 hex chars)
        const isObjectId = /^[a-fA-F0-9]{24}$/.test(idOrSlug);
        let response;
        if (isObjectId) {
          response = await axios.get(`/api/machines/show/${idOrSlug}`);
        } else {
          response = await axios.get(`/api/machines/slug/${idOrSlug}`);
        }
        if (response.data.success) {
          setMachine(response.data.machine);
          addToRecentlyViewed(response.data.machine);
          setModalForm((prev) => ({
            ...prev,
            message: t.defaultInquiryMessage.replace("{machineName}", response.data.machine?.name),
          }));
        } else {
          toast.error(t.machineNotFound);
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching machine:", error);
        toast.error(t.errorFetchingMachine);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [idOrSlug, navigate, t, addToRecentlyViewed]);

  useEffect(() => {
    if (machine && machine._id) {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favs.includes(machine._id));
    }
  }, [machine]);

  useEffect(() => {
    if (machine && machine.machineType) {
      setSimilarMachinesLoading(true);
      setSimilarMachinesError("");
      axios
        .get(`/api/machines/get?type=${encodeURIComponent(machine.machineType)}`)
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.machines)) {
            setSimilarMachines(
              res.data.machines.filter((m) => m._id !== machine._id).slice(0, 4)
            );
          } else {
            setSimilarMachinesError(t.errorLoadingSimilarMachines);
          }
        })
        .catch((err) => {
          setSimilarMachinesError(t.errorLoadingSimilarMachines);
        })
        .finally(() => {
          setSimilarMachinesLoading(false);
        });
    }
  }, [machine ? machine.machineType : null]);

  // Modal close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Add useEffect to reset modal message when modal opens or machine changes
  useEffect(() => {
    if (showModal && machine) {
      setModalForm((prev) => ({
        ...prev,
        message: t.defaultInquiryMessage.replace("{machineName}", machine.name),
      }));
    }
  }, [showModal, machine]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation for image carousel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">{t.machineNotFound}</h2>
      </div>
    );
  }

  const images =
    machine.images && machine.images.length > 0 ? machine.images : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      images.length === 0 ? 0 : (prev + 1) % images.length
    );
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      images.length === 0 ? 0 : (prev - 1 + images.length) % images.length
    );
  };
  const goToImage = (idx) => setCurrentImageIndex(idx);

  // Modal form handlers
  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    // Frontend validation
    if (!modalForm.name || !modalForm.email || !modalForm.message) {
      setModalError(t.fillAllRequiredFields);
      return;
    }
    if (!validateEmail(modalForm.email)) {
      setModalError(t.enterValidEmail);
      return;
    }
    setModalLoading(true);
    try {
      const res = await axios.post(`${BACKAPI}/api/inquiry`, modalForm);
      if (res.data.success) {
        setModalSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setModalSuccess(false);
          setModalForm({
            message: "",
            name: "",
            email: "",
            phone: "",
            company: "",
            zip: "",
            country: t.country,
            isDealer: false,
            receiveOffers: false,
          });
        }, 2000);
      } else {
        setModalError(res.data.message || t.unexpectedError);
      }
    } catch (err) {
      setModalError(
        err.response?.data?.message || t.errorSendingInquiry
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleFavorite = () => {
    if (!machine || !machine._id) return;
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favs.includes(machine._id)) {
      favs = favs.filter((id) => id !== machine._id);
      setIsFavorite(false);
    } else {
      favs.push(machine._id);
      setIsFavorite(true);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: document.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("تم نسخ الرابط!");
    }
  };

  // Back to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      {/* Map z-index fix for overlays/modals */}
      <style>{`.leaflet-container { z-index: 10 !important; }`}</style>
      {/* Modal for price inquiry */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative text-right"
            dir="rtl"
          >
            <button
              className="absolute left-4 top-4 text-2xl text-gray-400 hover:text-gray-700 font-bold"
              onClick={() => setShowModal(false)}
              aria-label={t.close}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{t.priceInquiry}</h2>
            <InquiryForm
              form={modalForm}
              onChange={handleModalChange}
              onSubmit={handleModalSubmit}
              loading={modalLoading}
              error={modalError}
              success={modalSuccess}
              showExtraFields={true}
            />
          </div>
        </div>
      )}
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
          aria-label={t.backToTop}
        >
          <FaArrowUp />
        </button>
      )}
      <div
        className="max-w-7xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow mt-8"
        dir="rtl"
      >
        {/* Header: Name, type, price, location, status */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 mb-1">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {machine.machineType || t.machineType}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {machine.yearOfConstruction || "-"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {machine.condition || "-"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                <FaMapMarkerAlt />
                {machine.location || "-"}
                <span className="ml-1">
                  <FaFlag className="inline-block text-lg text-red-600" />
                </span>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {machine.name || t.machineName}
            </h1>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className="bg-green-100 text-green-700 px-3 py-2 rounded font-bold text-lg flex items-center gap-2">
              <FaEuroSign className="inline-block" />
              {machine.price ? `${machine.price} ${t.currency}` : t.priceOnRequest}
            </span>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold shadow flex items-center gap-2 w-fit self-start mt-2"
              onClick={() => setShowModal(true)}
            >
              <FaEuroSign /> {t.requestPrice}
            </button>
          </div>
        </div>
        {/* Main Content: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left: Images and Details */}
          <div className="flex flex-col gap-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg border p-4">
                <ImageCarousel
                  images={images}
                  currentImageIndex={currentImageIndex}
                  nextImage={nextImage}
                  prevImage={prevImage}
                  goToImage={goToImage}
                  alt={machine.name}
                  loading={loading}
                />
            </div>
            {/* Machine Details */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-bold mb-3">{t.machineDetails}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-base">
                <div>
                  <span className="font-semibold">{t.machineType}:</span>{" "}
                  {machine.machineType || "-"}
                </div>
                <div>
                  <span className="font-semibold">{t.manufacturer}:</span>{" "}
                  {machine.manufacturer || "-"}
                </div>
                <div>
                  <span className="font-semibold">{t.model}:</span>{" "}
                  {machine.model || "-"}
                </div>
                <div>
                  <span className="font-semibold">{t.yearOfConstruction}:</span>{" "}
                  {machine.yearOfConstruction || "-"}
                </div>
                <div>
                  <span className="font-semibold">{t.condition}:</span>{" "}
                  {machine.condition || "-"}
                </div>
                <div>
                  <span className="font-semibold">{t.location}:</span>{" "}
                  {machine.location || "-"}
                  {machine.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(machine.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition ml-2 mt-2 text-xs"
                      style={{marginRight: '8px'}}
                    >
                      {t.openInGoogleMaps}
                    </a>
                  )}
                </div>
              </div>
              {/* Special Info Section */}
              {machine.specialInfo &&
                machine.specialInfo.length > 0 &&
                machine.specialInfo.some((item) => item.key && item.value) && (
                  <div className="mt-6">
                    <h3 className="text-md font-bold mb-2">{t.additionalInfo}</h3>
                    <ul className="list-disc pr-4 text-gray-700">
                      {machine.specialInfo
                        .filter((item) => item.key && item.value)
                        .map((item, idx) => (
                          <li key={idx}>
                            <span className="font-semibold">{item.key}:</span>{" "}
                            {item.value}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
            </div>
            {/* Price & Location */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-bold mb-3">{t.priceAndLocation}</h2>
              <div className="flex flex-col gap-2 text-gray-700 text-base">
                <div>
                  <span className="font-semibold">{t.price}:</span>{" "}
                  {machine.price ? `${machine.price} ${t.currency}` : t.onRequest}
                </div>
                <div>
                  <span className="font-semibold">{t.location}:</span>{" "}
                  {machine.location || "-"}
                </div>
              </div>
            </div>
            {/* Offer Details (optional) */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-bold mb-3">{t.offerDetails}</h2>
              <div className="flex flex-col gap-2 text-gray-700 text-base">
                <div>
                  <span className="font-semibold">{t.offerNumber}:</span>{" "}
                  {machine.offerId || "-"}
                </div>
                <div>
                  <span className="font-semibold">{t.lastUpdate}:</span>{" "}
                  {machine.updatedAt
                    ? new Date(machine.updatedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'de' ? 'de-DE' : 'en-US', {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </div>
              </div>
            </div>
            {/* Add Documentation Section if available */}
            {machine.documentation && (
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-lg font-bold mb-3">{t.documentsAndManuals}</h2>
                <div className="flex flex-col gap-2">
                  {machine.documentation.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <FaFileDownload />
                      {doc.name || `${t.document} ${index + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Right: Map and Inquiry Form */}
          <div className="flex-shrink-0 w-full lg:w-[400px] xl:w-[450px] flex flex-col gap-6">
            {/* Inquiry Form (styled as blue card) */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <h2 className="text-lg font-bold mb-3">{t.sendInquiry}</h2>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-6 w-1/2 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              ) : (
                <InquiryForm
                  form={modalForm}
                  onChange={handleModalChange}
                  onSubmit={handleModalSubmit}
                  loading={modalLoading}
                  error={modalError}
                  success={modalSuccess}
                  showExtraFields={true}
                />
              )}
            </div>
            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-md p-6 flex flex-col gap-4 items-start mb-4">
              <h2 className="text-2xl font-extrabold text-blue-900 mb-2">{t.quickContact}</h2>
              <div className="flex flex-col gap-3 w-full">
                <a href={`tel:${machine.phone || '+201224070331'}`} className="flex items-center gap-2 text-blue-800 hover:text-blue-600 font-medium transition-colors text-lg">
                  <FaPhone className="text-xl" />
                  <span dir="ltr">{machine.phone || '+20 122 407 0331'}</span>
                </a>
                <a href={`https://wa.me/${(machine.whatsapp || '+201224070331').replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-700 hover:text-green-600 font-medium transition-colors text-lg">
                  <FaWhatsapp className="text-xl" />
                  <span>{t.whatsapp}</span>
                </a>
                <a href={`mailto:${machine.email || 'info@lanshat.com'}`} className="flex items-center gap-2 text-blue-700 hover:text-blue-500 font-medium transition-colors text-lg">
                  <FaEnvelope className="text-xl" />
                  <span>{machine.email || 'info@lanshat.com'}</span>
                </a>
                <a href="https://facebook.com/lanshat" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-medium transition-colors text-lg">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                  <span>{t.facebook}</span>
                </a>
                <a href="https://linkedin.com/company/lanshat" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-medium transition-colors text-lg">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z"/></svg>
                  <span>{t.linkedin}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Description Section */}
        <div className="bg-white rounded-lg border p-4 mt-8">
          <h2 className="text-lg font-bold mb-3">{t.description}</h2>
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
            {machine.description || t.noDescriptionAvailable}
          </div>
        </div>
        
        {/* Similar Machines Section */}
        <div className="bg-white rounded-lg border p-4 mt-8">
          <h2 className="text-lg font-bold mb-3">{t.similarMachines}</h2>
          {similarMachinesLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : similarMachinesError ? (
            <div className="text-center py-8 text-gray-600">
              <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-2" />
              <p>{similarMachinesError}</p>
            </div>
          ) : similarMachines.length > 0 ? (
            <div className="flex flex-col gap-4">
              {similarMachines.map((m) => (
                <MachineCard key={m._id} machine={m} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              {t.noSimilarMachinesAvailable}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShowMachine;
