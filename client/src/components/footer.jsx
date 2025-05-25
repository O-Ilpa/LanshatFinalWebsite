import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3">{t.companyName}</h3>
          <p className="text-gray-300 text-sm mb-2">
            {t.footerDesc}
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://www.facebook.com/lanshat"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="text-blue-500 hover:text-blue-700 w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/lanshat"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-pink-500 hover:text-pink-600 w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/company/lanshat"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-blue-800 hover:text-blue-900 w-6 h-6" />
            </a>
            <a
              href="https://wa.me/201224070331"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-green-500 hover:text-green-600 w-6 h-6" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t.quickLinks}</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>
              <a href="/" className="hover:underline">
                {t.home}
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline">
                {t.products}
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                {t.about}
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                {t.contact}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t.contactInfo}</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> <span>+20 122 407 0331</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> <span>info@lanshat.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>{t.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-8">
        © {new Date().getFullYear()} {t.companyName}. {t.allRightsReserved}
      </div>
    </footer>
  );
};

export default Footer;
