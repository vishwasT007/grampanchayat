import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone, Mail, Clock, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t, getContent } = useLanguage();
  const { settings: siteSettings, loading } = useSiteSettings();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/panchayat', label: t('nav.panchayat') },
    { path: '/services', label: t('nav.services') },
    { path: '/schemes', label: t('nav.schemes') },
    { path: '/downloads', label: t('nav.downloads') },
    { path: '/education', label: t('nav.education') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/financials', label: t('nav.financials') },
    { path: '/village-statistics', label: language === 'en' ? 'Statistics' : 'सांख्यिकी' },
    { path: '/notices', label: t('nav.notices') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path) => location.pathname === path;

  // Don't render header content until settings are loaded
  if (loading || !siteSettings) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="h-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
      {/* Top Info Bar - Compact India Flag Colors */}
      <div className="bg-gradient-to-r from-orange-600 via-blue-900 to-green-600 text-white py-1.5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center text-xs">
            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
              <a 
                href={`tel:${siteSettings.contact.phone}`} 
                className="flex items-center gap-1 hover:text-orange-200 transition-colors"
              >
                <Phone size={12} />
                <span className="font-medium">{siteSettings.contact.phone}</span>
              </a>
              <a 
                href={`mailto:${siteSettings.contact.email}`} 
                className="hidden sm:flex items-center gap-1 hover:text-orange-200 transition-colors"
              >
                <Mail size={12} />
                <span className="font-medium truncate max-w-[160px]">{siteSettings.contact.email}</span>
              </a>
              <div className="hidden lg:flex items-center gap-1 text-white/90">
                <Clock size={12} />
                <span className="font-medium">{getContent(siteSettings.officeTimings)}</span>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-all font-semibold text-xs"
            >
              <Globe size={12} />
              <span>{language === 'en' ? 'EN' : 'मर'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header - Compact White Background */}
      <div className={`bg-white border-b border-gray-100 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center lg:justify-center lg:relative">
            {/* Panchayat Name - Text Only */}
            <Link to="/" className="group text-center">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent leading-tight group-hover:from-orange-600 group-hover:via-orange-700 group-hover:to-orange-600 transition-all duration-300">
                {getContent(siteSettings.panchayatName)}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-tight font-medium hidden sm:block mt-0.5">
                {getContent(siteSettings.tagline)}
              </p>
              {/* India Flag Stripe */}
              <div className="w-20 h-0.5 mx-auto mt-1 flex rounded-full overflow-hidden">
                <div className="flex-1 bg-orange-600"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-green-600"></div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Compact Gradient */}
      <nav className={`bg-gradient-to-r from-blue-900 via-gray-800 to-blue-900 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-0.5">
            {navItems.map((item) => (
              <li key={item.path} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 lg:px-4 py-2.5 lg:py-2.5 text-white font-medium transition-all relative overflow-hidden text-sm ${
                    isActive(item.path) 
                      ? 'bg-orange-600 lg:bg-transparent' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive(item.path) && (
                    <span className="hidden lg:block absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>
                  )}
                  
                  {/* Hover Effect */}
                  <span className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
