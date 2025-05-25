import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImgAvif from "../assets/logo.avif";
import { Search, Menu, X, ChevronDown, User, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../CartContext";
import { useAuth } from "../context/AuthContext";
import EnhancedSearch from "./EnhancedSearch";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { cart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const navItems = [
    { 
      name: t.home, 
      path: "/" 
    },
    { 
      name: t.products, 
      path: "/machines",
      submenu: [
        { name: t.packagingMachines, path: "/products?category=packaging" },
        { name: t.wrappingMachines, path: "/products?category=wrapping" },
        { name: t.industrialMachines, path: "/products?category=industrial" },
        { name: t.spareParts, path: "/products?category=spare-parts" }
      ]
    },
    { 
      name: t.egyptianMaterials, 
      path: "/egypt-materials" 
    },
    { 
      name: t.about, 
      path: "/about" 
    },
    { 
      name: t.contact, 
      path: "/contact" 
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoImgAvif} alt="Lanshat Logo" className="h-12 w-auto rounded-lg shadow" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className={`text-lg font-medium transition-colors hover:text-blue-600 flex items-center gap-1 ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="w-4 h-4" />}
                </Link>
                
                {/* Mega Menu */}
                {item.submenu && activeSubmenu === item.name && (
                  <div 
                    className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl p-4 mt-2"
                    onMouseEnter={() => setActiveSubmenu(item.name)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <div className="grid gap-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search, Cart, User Menu, and Language Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setShowSearch(true)}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
              aria-label={t.search}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link
              to="/favorites"
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors relative ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              to="/cart"
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors relative ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/dashboard" : "/login"}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              <User className="w-5 h-5" />
            </Link>

            <div className="border-l border-gray-200 mx-2 h-6" />
            
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button and Language Switcher */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-lg ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4">
            <div className="space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.path}
                    className="block text-gray-900 hover:text-blue-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pr-4 mt-2 space-y-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block text-gray-600 hover:text-blue-600 text-sm"
                          onClick={() => setMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-gray-900 hover:text-blue-600"
                >
                  <Search className="w-5 h-5" />
                  {t.search}
                </button>
                <Link
                  to="/favorites"
                  className="flex items-center gap-2 text-gray-900 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  {t.favorites}
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-gray-900 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t.cart}
                  {cart.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <Link
                  to={user ? "/dashboard" : "/login"}
                  className="flex items-center gap-2 text-gray-900 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  {user ? t.myAccount : t.login}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {showSearch && <EnhancedSearch onClose={() => setShowSearch(false)} />}
    </header>
  );
};

export default Header;
