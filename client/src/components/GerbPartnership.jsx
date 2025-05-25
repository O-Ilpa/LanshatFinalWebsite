import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './header';
import Footer from './footer';
import BackToTop from './BackToTop';
import { FaIndustry, FaBuilding, FaCog, FaTools, FaChartLine, FaRobot, FaLightbulb, FaShieldAlt, FaDownload, FaFilePdf, FaPlay, FaInfoCircle } from 'react-icons/fa';

const GerbPartnership = () => {
  const [showVideo, setShowVideo] = useState(false);

  const caseStudies = [
    {
      title: "مشروع محطة الطاقة النووية",
      description: "تطبيق نظام عزل الاهتزازات في محطة الطاقة النووية",
      image: "https://www.gerb.com/fileadmin/_processed_/csm_GERB_Case_Study_01_7c8c8c8c8c.jpg",
      results: [
        "تقليل الاهتزازات بنسبة 95%",
        "تحسين كفاءة التشغيل",
        "توفير في تكاليف الصيانة",
        "زيادة عمر المعدات",
        "تحسين السلامة",
        "توفير في الطاقة"
      ],
      location: "ألمانيا",
      year: "2020",
      pdf: "https://www.gerb.com/fileadmin/user_upload/Downloads/Case_Studies/GERB_Nuclear_Power_Plant_EN.pdf"
    },
    {
      title: "مشروع المختبرات المتقدمة",
      description: "تطبيق نظام NOVODAMP® في المختبرات المتقدمة",
      image: "https://www.gerb.com/fileadmin/_processed_/csm_GERB_Case_Study_02_7c8c8c8c8c.jpg",
      results: [
        "تحسين دقة القياسات",
        "تقليل الضوضاء",
        "زيادة كفاءة العمل",
        "تحسين جودة البيئة",
        "توفير في الطاقة",
        "زيادة رضا المستخدمين"
      ],
      location: "سويسرا",
      year: "2021",
      pdf: "https://www.gerb.com/fileadmin/user_upload/Downloads/Case_Studies/GERB_Advanced_Laboratories_EN.pdf"
    },
    {
      title: "مشروع الجسر المعلق",
      description: "تطبيق نظام المخمدات اللزجة في الجسر المعلق",
      image: "https://www.gerb.com/fileadmin/_processed_/csm_GERB_Case_Study_03_7c8c8c8c8c.jpg",
      results: [
        "تحسين استقرار الجسر",
        "تقليل الاهتزازات",
        "زيادة عمر الجسر",
        "تحسين السلامة",
        "توفير في الصيانة",
        "تحسين راحة المستخدمين"
      ],
      location: "إيطاليا",
      year: "2019",
      pdf: "https://www.gerb.com/fileadmin/user_upload/Downloads/Case_Studies/GERB_Suspension_Bridge_EN.pdf"
    }
  ];

  const timeline = [
    {
      year: "1908",
      title: "تأسيس الشركة",
      description: "تأسيس شركة جيرب في برلين، ألمانيا"
    },
    {
      year: "1950",
      title: "التوسع الدولي",
      description: "بداية التوسع في الأسواق الدولية"
    },
    {
      year: "1980",
      title: "الابتكار التكنولوجي",
      description: "تطوير تقنيات متقدمة في مجال التحكم في الاهتزازات"
    },
    {
      year: "2000",
      title: "الريادة العالمية",
      description: "تصبح جيرب الشركة الرائدة عالمياً في مجال حلول التحكم في الاهتزازات"
    },
    {
      year: "2020",
      title: "التحول الرقمي",
      description: "إطلاق منصات رقمية متقدمة للتحكم في الاهتزازات"
    }
  ];

  return (
    <>
      <Helmet>
        <title>شراكة لنشات مع جيرب - حلول متقدمة للتحكم في الاهتزازات</title>
        <meta
          name="description"
          content="شراكة استراتيجية بين لنشات وجيرب لتقديم أحدث حلول التحكم في الاهتزازات والهندسة المدنية في مصر"
        />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section id="hero" className="relative w-screen h-screen flex items-center justify-center text-white text-right overflow-hidden" dir="rtl" style={{width: '100vw'}}>
          {/* YouTube Video Background */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <iframe
              src="https://www.youtube.com/embed/GLtwVv9TrKU?autoplay=1&mute=1&controls=0&loop=1&playlist=GLtwVv9TrKU&modestbranding=1&showinfo=0&rel=0&playsinline=1"
              title="GERB Background Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
            {/* Gradient overlays for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
            {/* Animated circles */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#FFD600]/30 rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 border-2 border-[#FFD600]/20 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 right-1/3 w-24 h-24 border-2 border-[#FFD600]/40 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
          </div>

          {/* Main Content */}
          <div className="relative z-30 w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center">
            {/* Logo */}
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/images/gerb-logo.svg" 
                alt="شعار GERB" 
                className="h-32 w-auto bg-black/50 p-4 rounded-2xl shadow-2xl"
              />
            </div>

            {/* Main Title with Animation */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg transform hover:scale-105 transition-transform duration-300">
              <span className="text-[#FFD600]">لانشت</span> – الشريك الحصري لشركة <span className="text-[#FFD600]">GERB</span> في الشرق الأوسط
            </h1>

            {/* Subtitle with Decorative Line */}
            <div className="relative mb-8">
              <p className="text-2xl md:text-3xl mb-4 drop-shadow-lg">
                حلول ألمانية لعزل الاهتزازات منذ عام 1908
              </p>
              <div className="w-48 h-1 bg-[#FFD600] mx-auto rounded-full" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-[#FFD600]">115+</div>
                <div className="text-sm">سنوات من الخبرة</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-[#FFD600]">1000+</div>
                <div className="text-sm">مشروع ناجح</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-[#FFD600]">50+</div>
                <div className="text-sm">دولة حول العالم</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-[#FFD600]">24/7</div>
                <div className="text-sm">دعم فني</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links by Sector */}
        <section className="py-8  text-right" dir="rtl">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button onClick={() => document.getElementById('sector-energy').scrollIntoView({behavior: 'smooth'})} className="flex-1 bg-[#0a424e] text-white rounded-lg p-6 shadow-lg hover:bg-[#0d5a6b] transition-colors flex flex-col items-center">
                <span className="text-4xl mb-2">🏭</span>
                الطاقة والتصنيع
              </button>
              <button onClick={() => document.getElementById('sector-buildings').scrollIntoView({behavior: 'smooth'})} className="flex-1 bg-[#0a424e] text-white rounded-lg p-6 shadow-lg hover:bg-[#0d5a6b] transition-colors flex flex-col items-center">
                <span className="text-4xl mb-2">🏗️</span>
                المباني والبنية التحتية
              </button>
            </div>
          </div>
        </section>

        {/* About GERB */}
        <section id="about" className="py-12 bg-white text-right" dir="rtl">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="w-full flex justify-center my-8">
              <img src="/images/gerb-logo.svg" alt="شعار GERB" className="h-32 w-auto rounded-2xl shadow-2xl bg-black p-4" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-2" style={{fontWeight: '900'}}>من هي شركة GERB؟</h2>
            <div className="w-24 h-1 bg-[#FFD600] rounded mb-6"></div>
            <ul className="list-disc list-inside text-black mb-4">
              <li>تأسست في برلين عام 1908</li>
              <li>متخصصة في حلول عزل الاهتزاز والضجيج للأنظمة الصناعية والمعمارية</li>
              <li>مكاتب حول العالم: ألمانيا، أمريكا، آسيا، الشرق الأوسط</li>
              <li>الهدف: حماية المعدات والبُنى من الاهتزازات وتحسين الأداء والعمر الافتراضي</li>
            </ul>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="bg-[#0a424e] text-white px-3 py-1 rounded-lg">خبرة هندسية منذ 1908</span>
              <span className="bg-[#0a424e] text-white px-3 py-1 rounded-lg">انتشار عالمي</span>
              <span className="bg-[#0a424e] text-white px-3 py-1 rounded-lg">حلول صناعية ومعمارية</span>
            </div>
            {/* TODO: Add a world map or animated icons for global presence */}
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              خريطة أو أيقونات انتشار عالمي
            </div>
          </div>
          <div className="w-full h-2 bg-[#FFD600] my-0" />
        </section>

        {/* Products & Solutions */}
        <section id="products" className="py-12 bg-white text-right" dir="rtl">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-[#0a424e] mb-8">المنتجات والحلول</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductCard
                icon="🌀"
                title="نوابض معدنية (Steel Springs)"
                desc="حلول متقدمة لعزل الاهتزازات باستخدام النوابض الفولاذية عالية القوة."
                img="/images/spring-product.jpg"
                imgAlt="نوابض معدنية GERB"
              />
              <ProductCard
                icon="🧊"
                title="مخمدات فيسكو (Viscodampers®)"
                desc="تكنولوجيا متطورة لتخميد الاهتزازات في التطبيقات الصناعية والمعمارية."
                img="/images/viscodamper-product.jpg"
                imgAlt="مخمدات فيسكو GERB"
              />
              <ProductCard
                icon="🏢"
                title="كتل الكتلة المولفة (Tuned Mass Dampers)"
                desc="تقنيات فعالة لتقليل الاهتزازات في الهياكل الطويلة والجسور."
                img="/images/bridge-case.jpg"
                imgAlt="تطبيق مخمدات على جسر"
              />
              <ProductCard
                icon="🔩"
                title="نوڤودامب (NOVODAMP®)"
                desc="حلول مرونة من البولي يوريثان لعزل الاهتزازات."
                img="/images/steel-abstract.jpg"
                imgAlt="مادة فولاذية - نوڤودامب"
              />
              <ProductCard
                icon="🧱"
                title="محامل انزلاقية (Sliding Bearings)"
                desc="أنظمة دعم مرنة للمباني والمنشآت."
                img="/images/steel-abstract.jpg"
                imgAlt="محامل انزلاقية GERB"
              />
            </div>
            {/* TODO: On click, expand card or open modal with more info, features, and media */}
          </div>
        </section>

        {/* Applications Section */}
        <section id="applications" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#0a424e]">
                مجالات التطبيق
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Example application card */}
                <div
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <img 
                    src="https://www.gerb.com/fileadmin/_processed_/csm_GERB_Industrial_01_7c8c8c8c8c.jpg"
                    alt="المصانع والمنشآت الصناعية"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="p-6">
                    <div className="text-[#0a424e] mb-4">🏭</div>
                    <h3 className="text-xl font-semibold mb-2 text-[#0a424e]">
                      المصانع والمنشآت الصناعية
                    </h3>
                    <p className="text-gray-600 mb-4">
                      حلول متكاملة لعزل الاهتزازات في المنشآت الصناعية
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section id="case-studies" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#0a424e]">
                دراسات الحالة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {caseStudies.map((study, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <img 
                      src={study.image}
                      alt={study.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">{study.location}</span>
                        <span className="text-sm text-gray-500">{study.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-[#0a424e]">
                        {study.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {study.description}
                      </p>
                      <ul className="list-disc list-inside text-gray-600 mb-4">
                        {study.results.map((result, idx) => (
                          <li key={idx}>{result}</li>
                        ))}
                      </ul>
                      <a
                        href={study.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0a424e] text-white px-4 py-2 rounded-lg hover:bg-[#0d5a6b] transition-colors"
                      >
                        <FaFilePdf className="w-4 h-4" />
                        تحميل دراسة الحالة
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#0a424e]">
                تاريخنا
              </h2>
              <div className="relative">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-8 transition-all duration-300 hover:transform hover:translate-x-2"
                  >
                    <div className="w-24 text-center flex flex-col items-center">
                      <img 
                        src={
                          item.year === '1908' ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' :
                          item.year === '1980' ? 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' :
                          'https://www.gerb.com/fileadmin/templates/gerb/img/logo.svg'
                        }
                        alt="Timeline Icon"
                        className="w-10 h-10 rounded-full mb-2 object-cover"
                      />
                      <span className="text-2xl font-bold text-[#0a424e]">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-4 hover:shadow-md transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-2 text-[#0a424e]">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center transition-all duration-500">
              <h2 className="text-3xl font-bold mb-6 text-[#0a424e]">
                تواصل معنا
              </h2>
              <p className="text-gray-600 mb-8">
                لمعرفة المزيد عن حلولنا المتكاملة وكيف يمكننا مساعدتك في مشروعك
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-[#0a424e] text-white px-8 py-3 rounded-lg hover:bg-[#0d5a6b] transition-all duration-300 transform hover:scale-105"
              >
                تواصل الآن
              </a>
            </div>
          </div>
        </section>

        {/* 5. TARGET SECTORS */}
        <section id="sectors" className="py-12 bg-white text-right" dir="rtl">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-[#0a424e] mb-8">القطاعات المستهدفة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SectorCard icon="🏭" title="محطات الطاقة والمصانع" desc="تقليل الاهتزازات الناتجة عن المعدات الثقيلة (مولدات، ضواغط، توربينات)" example="مثال: دعم مرن لتوربينات محطة كهرباء" />
              <SectorCard icon="🏥" title="المباني والمنشآت العامة" desc="عزل زلزالي للمستشفيات، الجسور، المترو، المطارات" example="مثال: مستشفى في منطقة زلزالية" />
              <SectorCard icon="🚆" title="البنية التحتية للنقل" desc="تقليل الضوضاء والاهتزاز في سكك الحديد والقطارات" example="مثال: مترو القاهرة" />
              <SectorCard icon="⚓" title="المنشآت البحرية والنفطية" desc="ثبات عالٍ في السفن ومنصات الحفر" example="مثال: منصة نفطية في الخليج" />
              <SectorCard icon="🖥️" title="المراكز الحساسة" desc="عزل الاهتزاز لمراكز البيانات والمختبرات الدقيقة" example="مثال: مركز بيانات حديث" />
            </div>
          </div>
        </section>

        {/* 6. ENGINEERING SERVICES & SUPPORT */}
        <section id="services" className="py-12 bg-white text-right" dir="rtl">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-[#0a424e] mb-8">الخدمات الهندسية والدعم</h2>
            <div className="flex flex-wrap gap-6 mb-6">
              <ServiceCard icon="📐" title="تصميم هندسي حسب الحاجة" />
              <ServiceCard icon="🧪" title="أبحاث وتطوير مشترك" />
              <ServiceCard icon="🛠️" title="تركيب في الموقع" />
              <ServiceCard icon="✅" title="ضمان وجودة ألمانية" />
            </div>
            <div className="bg-[#0a424e] text-white rounded-lg p-6 text-lg font-semibold text-center">
              نقدّم حلولاً متكاملة لعزل الاهتزاز من التصميم حتى التشغيل
            </div>
          </div>
        </section>

        {/* 7. CASE STUDIES & REAL PROJECTS */}
        <section id="case-studies" className="py-12 bg-white text-right" dir="rtl">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-[#0a424e] mb-8">دراسات حالة ومشاريع واقعية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CaseStudyCard img="https://www.gerb.com/fileadmin/_processed_/csm_GERB_Case_Study_01_7c8c8c8c8c.jpg" title="مستشفى في منطقة زلزالية" stat="انخفاض الاهتزاز بنسبة 65%" result="زيادة عمر المعدات بمقدار الضعف" />
              <CaseStudyCard img="https://www.gerb.com/fileadmin/_processed_/csm_GERB_Case_Study_02_7c8c8c8c8c.jpg" title="محطة طاقة بها آلات دوارة" stat="تحسين كفاءة التشغيل" result="توفير في الصيانة" />
              <CaseStudyCard img="https://www.gerb.com/fileadmin/_processed_/csm_GERB_Case_Study_03_7c8c8c8c8c.jpg" title="برج Aspire | قطر" stat="حماية من الاهتزازات الناتجة عن الرياح" result="استخدام مخمد كتلة مضبوطة بوزن 140 طنًا" />
            </div>
            {/* TODO: Add carousel or more projects as needed */}
          </div>
        </section>

        {/* 8. WHY GERB VIA LANSHAT */}
        <section id="why-gerb" className="py-12 bg-white text-right" dir="rtl">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-[#0a424e] mb-8">لماذا GERB عبر لانشت؟</h2>
            <div className="w-24 h-1 bg-[#FFD600] rounded mb-6"></div>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>✔️ الشريك الحصري في الشرق الأوسط</li>
              <li>🧠 دعم فني وهندسي محلي بلغتك</li>
              <li>📞 تواصل مباشر مع فريق الخبراء</li>
            </ul>
            {/* Contact Form */}
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#0a424e] mb-4">نموذج تواصل مباشر</h3>
              {/* TODO: Implement form logic */}
              <form className="flex flex-col gap-4">
                <input type="text" placeholder="الاسم" className="px-4 py-2 rounded-lg border border-gray-300" />
                <input type="text" placeholder="الشركة" className="px-4 py-2 rounded-lg border border-gray-300" />
                <input type="email" placeholder="البريد الإلكتروني" className="px-4 py-2 rounded-lg border border-gray-300" />
                <textarea placeholder="وصف المشروع" className="px-4 py-2 rounded-lg border border-gray-300" rows={3}></textarea>
                <button type="submit" className="bg-[#FFD600] text-black font-bold px-6 py-2 rounded-lg hover:bg-black hover:text-[#FFD600] transition-colors">إرسال</button>
              </form>
            </div>
          </div>
        </section>

        {/* 9. INTERACTIVE FEATURES PLACEHOLDERS */}
        <section id="interactive" className="py-12 bg-white text-right" dir="rtl">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-[#0a424e] mb-8">ميزات تفاعلية مقترحة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">📍</span>
                <div className="font-bold mb-2">خريطة تفاعلية لمشاريع حول العالم</div>
                {/* TODO: Embed interactive map */}
                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">خريطة المشاريع</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">🔍</span>
                <div className="font-bold mb-2">عرض قبل/بعد لعزل الاهتزاز</div>
                {/* TODO: Add before/after slider */}
                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">قبل / بعد</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">🎥</span>
                <div className="font-bold mb-2">فيديوهات قصيرة: تعريف بالشركة + عرض منتج</div>
                {/* TODO: Embed video player */}
                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">فيديو</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">📖</span>
                <div className="font-bold mb-2">رسوم متحركة: كيف تعمل النوابض والمخمدات</div>
                {/* TODO: Add animation/diagram */}
                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">رسم توضيحي</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">📥</span>
                <div className="font-bold mb-2">تحميل كتيبات ومنشورات (PDF)</div>
                {/* TODO: Add download links */}
                <div className="w-full h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">روابط تحميل</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.youtube.com/embed/your-video-id"
                title="GERB Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />

      <style>{`
        .glow-icon { filter: drop-shadow(0 0 6px #0a424e88); transition: filter 0.3s; }
        .group:hover .glow-icon { filter: drop-shadow(0 0 16px #0a424e) brightness(1.2); }

        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.5; }
        }

        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// Add ProductCard component at the bottom for now
function ProductCard({ icon, title, desc, img, imgAlt }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow hover:scale-105 border border-gray-200 transition-all duration-300 cursor-pointer flex flex-col items-center text-center">
      <span className="text-5xl mb-4 bg-[#FFD600] text-black rounded-full p-3" style={{fontWeight: 'bold'}}>{icon}</span>
      <h3 className="text-2xl font-bold text-black mb-2" style={{fontWeight: '900'}}>{title}</h3>
      <p className="text-black mb-2 text-lg">{desc}</p>
      {img && (
        <img src={img} alt={imgAlt} className="w-full h-24 object-cover rounded-lg mb-2 border border-gray-200" />
      )}
      {/* TODO: Expandable area/modal for more info */}
    </div>
  );
}

// Add SectorCard, ServiceCard, CaseStudyCard components at the bottom
function SectorCard({ icon, title, desc, example }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center text-center hover:scale-105 transition-all duration-300 border border-gray-200">
      <span className="text-4xl mb-2 bg-[#FFD600] text-black rounded-full p-2" style={{fontWeight: 'bold'}}>{icon}</span>
      <h3 className="text-2xl font-bold text-black mb-1" style={{fontWeight: '900'}}>{title}</h3>
      <p className="text-black mb-1 text-lg">{desc}</p>
      <div className="text-[#FFD600] text-base font-bold">{example}</div>
    </div>
  );
}
function ServiceCard({ icon, title }) {
  return (
    <div className="flex items-center gap-2 bg-[#FFD600]/20 rounded-lg px-4 py-2 text-black font-bold text-lg border border-gray-200">
      <span className="text-2xl bg-[#FFD600] text-black rounded-full p-1">{icon}</span>
      <span className="text-lg">{title}</span>
    </div>
  );
}
function CaseStudyCard({ img, title, stat, result }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center text-center hover:scale-105 transition-all duration-300 border border-gray-200">
      <img src={img} alt={title} className="w-full h-32 object-cover rounded-lg mb-2 border border-gray-200" />
      <h3 className="text-2xl font-bold text-black mb-1" style={{fontWeight: '900'}}>{title}</h3>
      <div className="text-[#FFD600] font-bold mb-1 text-lg">{stat}</div>
      <div className="text-black text-lg">{result}</div>
    </div>
  );
}

export default GerbPartnership; 