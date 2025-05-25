import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "./header";
import Landing from "./landing";
import Filter from "./filter";
import axios from "axios";
import MachineCard from "./machineCard";
import Footer from "./footer";
import BackToTop from "./BackToTop";
import RecentlyViewed from "./RecentlyViewed";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaCogs,
  FaTruck,
  FaComments,
  FaTools,
  FaPhoneAlt,
  FaStar,
  FaBoxOpen,
  FaThList,
  FaWrench,
  FaGlobe,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Truck, Shield, Clock, AlertCircle, RefreshCw } from "lucide-react";
import PartnersSection from "./PartnersSection";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

// Fallback data for when API is down
const FALLBACK_MACHINES = [
  {
    _id: "fallback-1",
    name: "ماكينة تعبئة وتغليف أوتوماتيكية",
    description: "ماكينة تعبئة وتغليف عالية الكفاءة مناسبة للمشروبات والمواد الغذائية",
    price: "250,000",
    image: "/images/fallback-1.jpg",
    category: "ماكينات تعبئة",
    featured: true
  },
  {
    _id: "fallback-2",
    name: "خط إنتاج متكامل",
    description: "خط إنتاج متكامل للمواد الغذائية مع نظام تحكم ذكي",
    price: "500,000",
    image: "/images/fallback-2.jpg",
    category: "ماكينات صناعية أخرى",
    featured: true
  },
  {
    _id: "fallback-3",
    name: "ماكينة تغليف حراري",
    description: "ماكينة تغليف حراري عالية السرعة للمواد الغذائية",
    price: "180,000",
    image: "/images/fallback-3.jpg",
    category: "ماكينات تغليف",
    featured: true
  },
  {
    _id: "fallback-4",
    name: "قطع غيار أصلية",
    description: "مجموعة قطع غيار أصلية لجميع أنواع الماكينات",
    price: "50,000",
    image: "/images/fallback-4.jpg",
    category: "قطع غيار",
    featured: true
  }
];

const mainCategories = [
  { name: "ماكينات تعبئة", icon: <FaBoxOpen className="text-2xl" /> },
  { name: "ماكينات تغليف", icon: <FaThList className="text-2xl" /> },
  { name: "ماكينات صناعية أخرى", icon: <FaCogs className="text-2xl" /> },
  { name: "قطع غيار", icon: <FaWrench className="text-2xl" /> },
];

let BACKAPI;
if (import.meta.env.MODE === "development") {
  BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
} else {
  BACKAPI = import.meta.env.VITE_PRODUCTION_API;
}

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [allMachines, setAllMachines] = useState([]);
  const [pagerLoading, setPagerLoading] = useState(true);
  const [pagerError, setPagerError] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const heroSlides = [
    {
      title: t.heroSlide1Title,
      description: t.heroSlide1Desc,
      image: "/images/hero-1.jpg",
      cta: t.browseProducts,
      link: "/machines"
    },
    {
      title: t.heroSlide2Title,
      description: t.heroSlide2Desc,
      image: "/images/hero-2.jpg",
      cta: t.browseSpareParts,
      link: "/products?category=spare-parts"
    },
    {
      title: t.heroSlide3Title,
      description: t.heroSlide3Desc,
      image: "/images/hero-3.jpg",
      cta: t.contactUs,
      link: "/contact"
    }
  ];

  useEffect(() => {
    axios
      .get(`${BACKAPI}/api/machines/get?featured=true`)
      .then((res) => {
        console.log("Featured machines response:", res.data);
        if (res.data.success && res.data.machines.length > 0) {
          // setProducts(res.data.machines);
        } else {
          // Fallback: fetch all and show latest 4
          axios.get(`${BACKAPI}/api/machines/get`).then((res2) => {
            console.log("All machines response:", res2.data);
            if (res2.data.success) {
              // setProducts(res2.data.machines.slice(0, 4));
            } else {
              setPagerError("لم يتم العثور على المنتجات.");
            }
            setLoading(false);
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured machines:", err);
        setPagerError("حدث خطأ أثناء جلب البيانات.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKAPI}/api/machines/get`)
      .then((res) => {
        console.log("Latest machines response:", res.data);
        if (res.data.success) {
          // Sort by creation date, newest first
          const sortedMachines = res.data.machines.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAllMachines(sortedMachines);
        } else {
          setPagerError("لم يتم العثور على المنتجات.");
        }
        setPagerLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching latest machines:", err);
        setPagerError("حدث خطأ أثناء جلب البيانات.");
        setPagerLoading(false);
      });
  }, []);

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: t.fastDelivery,
      description: t.deliveryDescription
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.qualityGuarantee,
      description: t.guaranteeDescription
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t.support247,
      description: t.supportDescription
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t.seoHomeTitle}</title>
        <meta
          name="description"
          content={t.seoHomeDesc}
        />
        <meta
          name="keywords"
          content={t.seoHomeKeywords}
        />
        <meta property="og:title" content={t.seoHomeTitle} />
        <meta
          property="og:description"
          content={t.seoHomeDesc}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lanshat.com" />
        <meta property="og:image" content="https://lanshat.com/assets/logo.webp" />
        <meta property="og:locale" content={language === 'ar' ? 'ar_EG' : language === 'de' ? 'de_DE' : 'en_US'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoHomeTitle} />
        <meta
          name="twitter:description"
          content={t.seoHomeDesc}
        />
        <meta name="twitter:image" content="https://lanshat.com/assets/logo.webp" />
        <link rel="canonical" href="https://lanshat.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": t.companyName,
            "url": "https://lanshat.com",
            "logo": "https://lanshat.com/assets/logo.webp",
            "description": t.seoHomeDesc,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": t.city,
              "addressCountry": t.country
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+20-122-407-0331",
              "contactType": "customer service",
              "email": "info@lanshat.com",
              "availableLanguage": ["Arabic", "English", "German"]
            },
            "sameAs": [
              "https://www.facebook.com/lanshat",
              "https://instagram.com/lanshat",
              "https://linkedin.com/company/lanshat"
            ],
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "31.2001",
                "longitude": "29.9187"
              },
              "geoRadius": "100000"
            }
          })}
        </script>
      </Helmet>

      <Header />
      <main>
        <Landing />
      </main>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8">
                    {slide.description}
                  </p>
                  <div>
                    <Link
                      to={slide.link}
                      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <PartnersSection />

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{t.featuredProducts}</h2>
            <Link
              to="/machines"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              {t.viewAll}
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg h-80 animate-pulse"
                />
              ))}
            </div>
          ) : pagerError ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h3 className="text-2xl font-bold text-gray-900">عذراً، حدث خطأ</h3>
                <p className="text-gray-600 max-w-md">
                  {pagerError}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    إعادة المحاولة
                  </button>
                  <button
                    onClick={() => setPagerError(null)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    عرض البيانات الاحتياطية
                  </button>
                </div>
              </div>
            </div>
          ) : allMachines.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl shadow-lg p-8 inline-block">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">لا توجد ماكينات متاحة حالياً</h3>
                <p className="text-gray-600 mb-6">نعتذر، لا توجد ماكينات متاحة للعرض في الوقت الحالي</p>
                <button
                  onClick={() => setPagerError(null)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  عرض البيانات الاحتياطية
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(pagerError ? FALLBACK_MACHINES : allMachines).map((machine) => (
                <MachineCard key={machine._id} machine={machine} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed Section */}
      <RecentlyViewed />

      {/* Egypt Raw Materials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  {t.facilitatingTrade}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {t.egyptianMaterialsDesc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/egypt-materials")}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {t.discoverMaterials}
                  </button>
                  <button
                    onClick={() => navigate("/contact")}
                    className="bg-white hover:bg-gray-100 text-blue-700 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {t.contactUs}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                  <FaBoxOpen className="text-4xl text-blue-600 mb-2" />
                  <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
                  <div className="text-gray-600">{t.availableProducts}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                  <FaGlobe className="text-4xl text-blue-600 mb-2" />
                  <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">{t.importingCountries}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                  <FaStar className="text-4xl text-blue-600 mb-2" />
                  <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-gray-600">{t.happyClients}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                  <FaTools className="text-4xl text-blue-600 mb-2" />
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">{t.support247}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-900">آراء عملائنا</h3>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            className="pb-8"
          >
            {[{
              name: "أحمد علي",
              text: "خدمة ممتازة وسرعة في التوريد. أنصح بالتعامل مع لنشات!",
              company: "شركة النور للصناعات"
            }, {
              name: "سارة محمد",
              text: "فريق محترف ودعم فني متواصل. شكراً لكم!",
              company: "مصنع المستقبل"
            }, {
              name: "محمد حسن",
              text: "أفضل تجربة استيراد معدات صناعية مررت بها.",
              company: "مجموعة حسن التجارية"
            }].map((testimonial, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-xl mx-auto">
                  <p className="text-lg text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div className="font-bold text-blue-700">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.company}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Categories Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.mainCategories}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.categoriesDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: t.packagingMachines, icon: <FaCogs /> },
              { name: t.wrappingMachines, icon: <FaWrench /> },
              { name: t.industrialMachines, icon: <FaThList /> },
              { name: t.spareParts, icon: <FaTools /> }
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="group bg-white hover:bg-blue-50 rounded-xl p-6 shadow-md transition-all duration-300 transform hover:scale-105 flex flex-col items-center"
              >
                <div className="text-blue-600 group-hover:text-blue-700 mb-4 text-4xl">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {cat.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t.discoverOurRange} {cat.name}
                </p>
                <span className="mt-auto bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">{t.browseCategory}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-900">الأسئلة الشائعة</h3>
          <div className="space-y-4">
            {[{
              q: "كيف يمكنني طلب ماكينة أو مادة خام؟",
              a: "يمكنك تصفح المنتجات أو المواد الخام والتواصل معنا عبر نموذج التواصل أو الهاتف لإتمام الطلب."
            }, {
              q: "هل تقدمون خدمات ما بعد البيع؟",
              a: "نعم، نوفر دعم فني وصيانة لجميع المنتجات الموردة من خلالنا."
            }, {
              q: "هل يمكن الشحن خارج مصر؟",
              a: "نعم، نقوم بتصدير المواد الخام إلى أكثر من 50 دولة حول العالم."
            }].map((faq, idx) => (
              <details key={idx} className="bg-blue-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-blue-700 mb-2 cursor-pointer">{faq.q}</summary>
                <p className="text-gray-700 mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Machines Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              أحدث الماكينات
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تعرف على أحدث الماكينات الصناعية المضافة إلى مجموعتنا
            </p>
          </div>
          {pagerLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loader w-12 h-12 border-t-transparent"></div>
            </div>
          ) : pagerError ? (
            <div className="text-center py-12 text-red-600">{pagerError}</div>
          ) : allMachines.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              لا توجد ماكينات متاحة حالياً.
            </div>
          ) : (
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation
                className="pb-12"
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {allMachines.map((machine) => (
                  <SwiperSlide key={machine._id}>
                    <div
                      onClick={() => navigate(`/${machine.slug}`)}
                      className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                    >
                      <MachineCard machine={machine} horizontal={true} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
                <button
                  onClick={() => navigate("/products")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  {t.viewAll}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
};

export default Home;
