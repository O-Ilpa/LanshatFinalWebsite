import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Star, Globe, Users, Award } from "lucide-react";
import landingImgAvif from "../assets/landing.avif";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const Landing = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const stats = [
    { icon: <Star className="w-6 h-6" />, value: "1000+", label: t.happyClients },
    { icon: <Globe className="w-6 h-6" />, value: "50+", label: t.importingCountries },
    { icon: <Users className="w-6 h-6" />, value: "100+", label: t.businessPartners },
    { icon: <Award className="w-6 h-6" />, value: "15+", label: t.yearsExperience },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden" id="landing">
      <picture>
        <source srcSet={landingImgAvif} type="image/avif" />
        <img
          src="assets/landing.webp"
          alt={t.landingImageAlt}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-10000 hover:scale-105"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full max-w-4xl px-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 whitespace-normal break-words"
        >
          {t.heroTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl mb-8"
        >
          {t.heroSubtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            {t.browseProducts}
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/egypt-materials")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            {t.egyptianMaterials}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 text-lg text-gray-200"
        >
          {t.trustPartner}
        </motion.p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl px-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
            >
              <div className="text-blue-400 mb-2 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.a
        href="#featured-products"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown size={32} />
      </motion.a>

      {/* Floating Contact Button */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => navigate("/contact")}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        <span className="sr-only">{t.contactUs}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Landing;
