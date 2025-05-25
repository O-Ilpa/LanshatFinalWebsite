import React from 'react';

const PartnersSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          شركاؤنا الاستراتيجيون
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/3">
                  <img 
                    src="https://www.gerb.com/fileadmin/templates/gerb/img/logo.svg" 
                    alt="شعار شركة جيرب" 
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    جيرب لأنظمة التحكم في الاهتزازات
                  </h3>
                  <p className="text-gray-600 mb-4 text-right">
                    منذ عام 1908، تعد شركة جيرب الرائدة عالمياً في حلول التحكم في الاهتزازات. 
                    كشريك استراتيجي لنا، نقدم لكم أفضل منتجات الهندسة الألمانية في مجال عزل الاهتزازات 
                    وأساسات الهندسة المدنية.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      التحكم في الاهتزازات
                    </span>
                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      صنع في ألمانيا
                    </span>
                    <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                      حلول صناعية
                    </span>
                  </div>
                  <a 
                    href="https://www.gerb.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    زيارة موقع الشريك
                    <svg 
                      className="w-5 h-5 ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection; 