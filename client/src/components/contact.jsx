import React, { useState, useRef } from "react";
import Header from "./header";
import Footer from "./footer";
import { Send, MapPin, Mail, Phone, Loader2, Facebook, Linkedin, Instagram, File, CheckCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import logoImgAvif from "../assets/logo.avif";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const BACKAPI = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_API : import.meta.env.VITE_PRODUCTION_API;
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.0123456789!2d31.235711!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60c2e8e2b%3A0x7d0b0e2e8e2b!2z2YXYr9mK2YbYqSDYp9mE2KfZhNmK2Kkg2KfZhNin2YTYqSDYp9mE2KfZhNmK2Kkg2KfZhNin2YTYqQ!5e0!3m2!1sar!2seg!4v1680000000000!5m2!1sar!2seg";
const MAP_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=30.044420,31.235711";

const initialFaqs = [
  {
    q: "كيف يمكنني التواصل معكم بسرعة؟",
    a: "يمكنك استخدام النموذج أدناه أو التواصل عبر الهاتف أو البريد الإلكتروني."
  },
  {
    q: "ما هي ساعات العمل؟",
    a: "نعمل من الأحد إلى الخميس من 9 صباحاً حتى 6 مساءً."
  },
  {
    q: "هل يمكنني زيارة مقر الشركة؟",
    a: "نعم، يمكنك زيارتنا في العنوان الموضح على الخريطة أدناه."
  }
];

const testimonials = [
  {
    name: "أحمد علي",
    text: "خدمة ممتازة وسرعة في التوريد. أنصح بالتعامل مع لنشات!",
    company: "شركة النور للصناعات"
  },
  {
    name: "سارة محمد",
    text: "فريق محترف ودعم فني متواصل. شكراً لكم!",
    company: "مصنع المستقبل"
  }
];

const trustBadges = [];

const inquiryTypes = [
  "طلب عرض سعر",
  "دعم فني",
  "شراكة",
  "أخرى"
];

const aiSuggestedQuestions = [
  "ما هي ساعات العمل؟",
  "كيف أتابع طلبي؟",
  "هل تقدمون خدمات ما بعد البيع؟",
  "هل يمكن الشحن خارج مصر؟"
];

const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [form, setForm] = useState({ name: "", email: "", phone: "", inquiryType: t.inquiryTypes[0], message: "", file: null });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const fileInputRef = useRef();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("inquiryType", form.inquiryType);
      formData.append("message", form.message);
      if (form.file) {
        formData.append("file", form.file);
      }
      const res = await axios.post(`${BACKAPI}/api/inquiry/contact`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setSent(true);
        setForm({ name: "", email: "", phone: "", inquiryType: t.inquiryTypes[0], message: "", file: null });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setSent(false), 4000);
      } else {
        setError(res.data.message || t.errorSubmitting);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(t.errorSubmitting);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <Helmet>
        <title>{`${t.contactTitle || 'Contact Us'} | ${t.companyName || 'Lanshat'}`}</title>
        <meta name="description" content={t.contactDesc || 'Contact Lanshat for all your industrial machinery needs'} />
        <meta name="keywords" content="تواصل, لنشات, دعم, استفسار, تجارة دولية, حلول صناعية, مصر" />
        <meta property="og:title" content={`${t.contactTitle} | ${t.companyName}`} />
        <meta property="og:description" content={t.contactDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lanshat.com/contact" />
        <meta property="og:image" content="https://lanshat.com/assets/logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t.contactTitle} | ${t.companyName}`} />
        <meta name="twitter:description" content={t.contactDesc} />
        <meta name="twitter:image" content="https://lanshat.com/assets/logo.webp" />
        <link rel="canonical" href="https://lanshat.com/contact" />
      </Helmet>
      {/* Watermark Logo */}
      <div className="fixed left-0 bottom-0 z-0 opacity-10 pointer-events-none select-none hidden md:block">
        <picture>
          <source srcSet={logoImgAvif} type="image/avif" />
          <img src="/assets/logo.webp" alt={t.companyName} className="w-72" />
        </picture>
      </div>
      <Header />
      <main className="flex-1 pt-20 pb-8 px-2 md:px-0 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row bg-white/90 rounded-2xl shadow-2xl p-2 md:p-0 overflow-hidden">
          {/* Illustration (left on desktop, top on mobile) */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 w-1/3 min-h-full p-6 relative">
            {/* Mascot SVG */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="60" fill="#2563eb" fillOpacity="0.12" />
              <rect x="35" y="40" width="50" height="40" rx="8" fill="#2563eb" fillOpacity="0.18" />
              <rect x="45" y="50" width="30" height="20" rx="4" fill="#2563eb" fillOpacity="0.25" />
              <circle cx="60" cy="60" r="8" fill="#2563eb" fillOpacity="0.4" />
              <rect x="55" y="80" width="10" height="10" rx="2" fill="#2563eb" fillOpacity="0.18" />
              <ellipse cx="60" cy="100" rx="18" ry="6" fill="#22d3ee" fillOpacity="0.18" />
            </svg>
            <div className="mt-4 text-blue-700 font-bold text-lg text-center">{t.smartSupport}</div>
          </div>
          {/* Form & Info Card */}
          <div className="flex-1 flex flex-col justify-center p-4 md:p-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-1 text-center md:text-right">{t.contactTitle}</h1>
            <p className="text-center md:text-right text-gray-600 mb-2 text-sm md:text-base">{t.contactDesc}</p>
            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-end gap-4 mb-2">
              <a href="https://wa.me/201224070331" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp className="w-6 h-6 text-green-500 hover:scale-110 transition-transform" /></a>
              <a href="https://facebook.com/AltamayozforRealEstateInvestment" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="w-6 h-6 text-blue-600 hover:scale-110 transition-transform" /></a>
              <a href="https://linkedin.com/YOUR_PAGE" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="w-6 h-6 text-blue-800 hover:scale-110 transition-transform" /></a>
              <a href="mailto:info@lanshat.com" aria-label="Email"><Mail className="w-6 h-6 text-blue-400 hover:scale-110 transition-transform" /></a>
              <a href="https://instagram.com/YOUR_PAGE" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="w-6 h-6 text-pink-500 hover:scale-110 transition-transform" /></a>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Contact Form */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 space-y-2 bg-white rounded-xl shadow p-4"
                aria-label={t.contactTitle}
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-700"><Mail size={18} /></span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    placeholder={t.emailAddress}
                    aria-label={t.emailAddress}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-700"><MapPin size={18} /></span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    placeholder={t.fullName}
                    aria-label={t.fullName}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-700"><Phone size={18} /></span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10,15}"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    placeholder={t.phoneNumber}
                    aria-label={t.phoneNumber}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-700"><File size={18} /></span>
                  <input
                    type="file"
                    name="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    className="w-full text-sm"
                    aria-label={t.attachFile}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="inquiryType" className="text-blue-700 text-sm font-semibold">{t.inquiryType}:</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    className="flex-1 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    aria-label={t.inquiryType}
                  >
                    {t.inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-700 mt-2"><Send size={18} /></span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    placeholder={t.writeMessage}
                    aria-label={t.writeMessage}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all duration-300 text-sm"
                  aria-label={t.sendMessage}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                  {loading ? t.sending : t.sendMessage}
                </button>
                {sent && (
                  <div className="text-green-600 text-center font-semibold mt-2 text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {t.messageSentSuccess}
                  </div>
                )}
                {error && <div className="text-red-600 text-center text-sm mb-2">{error}</div>}
                <div className="text-xs text-gray-500 mt-2 text-center">{t.privacyNotice}</div>
                {/* Trust Badges */}
                <div className="flex justify-center gap-2 mt-2">
                  <span className="text-gray-400 text-xs">{t.qualityCertificates}</span>
                </div>
              </form>
              {/* Contact Info & Map */}
              <div className="flex-1 flex flex-col gap-2 bg-blue-50 rounded-xl shadow p-4 min-w-[220px]" aria-label={t.contactInfo}>
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <MapPin />
                  <span>{t.city}, {t.country}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <Mail />
                  <span>info@lanshat.com</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <Phone />
                  <span>+20 122 407 0331</span>
                </div>
                <div className="rounded-lg overflow-hidden shadow border h-28 md:h-24 mt-2">
                  {showMap && (
                    <iframe
                      src={MAP_EMBED_URL}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lanshat Location"
                    ></iframe>
                  )}
                </div>
                <button
                  onClick={() => window.open(MAP_DIRECTIONS_URL, "_blank")}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full transition-all"
                  aria-label={t.getDirections}
                >
                  {t.getDirections}
                </button>
                <button
                  onClick={() => setShowMap((v) => !v)}
                  className="mt-1 text-blue-600 underline text-xs md:hidden"
                  aria-label={showMap ? t.hideMap : t.showMap}
                >
                  {showMap ? t.hideMap : t.showMap}
                </button>
                <div className="mt-4">
                  <h3 className="font-semibold text-blue-800 mb-2 text-xs">{t.testimonials}:</h3>
                  <div className="space-y-1">
                    {t.testimonialsList.map((testimonial, idx) => (
                      <div key={idx} className="bg-white rounded p-2 shadow text-xs">
                        <div className="text-blue-700 font-bold">{testimonial.name}</div>
                        <div className="text-gray-700">{testimonial.text}</div>
                        <div className="text-gray-400 text-xxs">{testimonial.company}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact; 