import React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Award, Building2, Clock, Globe } from "lucide-react";
import Header from "./header";
import Footer from "./footer";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const AboutUs = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Helmet>
        <title>{t.aboutUsTitle}</title>
        <meta name="description" content={t.aboutUsDesc} />
        <meta name="keywords" content={t.aboutUsKeywords} />
      </Helmet>
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/about-hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <motion.div 
          className="relative text-center text-white px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.aboutUs}</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            {t.aboutUsHeroDesc}
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">{t.ourStory}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.storyPart1}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.storyPart2}
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/about-story.jpg" 
                alt={t.ourStoryImageAlt} 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.ourValues}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.valuesDesc}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-12 h-12 text-blue-600" />,
                title: t.valueQuality,
                description: t.valueQualityDesc
              },
              {
                icon: <Users className="w-12 h-12 text-blue-600" />,
                title: t.valuePartnership,
                description: t.valuePartnershipDesc
              },
              {
                icon: <Globe className="w-12 h-12 text-blue-600" />,
                title: t.valueInnovation,
                description: t.valueInnovationDesc
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="p-8 rounded-2xl bg-gray-50 text-center hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">{t.ourLocation}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.locationDesc}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-600">{t.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-600">{t.workingHours}</span>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/LLQ1EjvKF4uesrD88"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.openInGoogleMaps}
              </a>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.0123456789!2d31.235711!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDguNiJF!5e0!3m2!1sen!2seg!4v1234567890!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.locationMapTitle}
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">فريقنا</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              فريقنا من الخبراء المتخصصين يعملون معاً لتقديم أفضل الحلول لعملائنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد محمد",
                role: "المدير التنفيذي",
                image: "/images/team-1.jpg"
              },
              {
                name: "سارة أحمد",
                role: "مدير العمليات",
                image: "/images/team-2.jpg"
              },
              {
                name: "محمد علي",
                role: "مدير المبيعات",
                image: "/images/team-3.jpg"
              }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
