import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => toggleLanguage('ar')}
        className={`px-2 py-1 rounded ${
          language === 'ar' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        عربي
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-2 py-1 rounded ${
          language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggleLanguage('de')}
        className={`px-2 py-1 rounded ${
          language === 'de' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        DE
      </button>
    </div>
  );
};

export default LanguageSwitcher; 