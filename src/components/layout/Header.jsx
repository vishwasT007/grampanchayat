import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t, getContent } = useLanguage();
  const siteSettings = useSiteSettings();
  const location = useLocation();

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
    { path: '/notices', label: t('nav.notices') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-700 text-white py-2">
        <div className="container-custom">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${siteSettings.contact.phone}`} className="flex items-center gap-1 hover:text-primary-200">
                <Phone size={14} />
                <span>{siteSettings.contact.phone}</span>
              </a>
              <a href={`mailto:${siteSettings.contact.email}`} className="flex items-center gap-1 hover:text-primary-200">
                <Mail size={14} />
                <span className="hidden sm:inline">{siteSettings.contact.email}</span>
              </a>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span className="hidden md:inline">{getContent(siteSettings.officeTimings)}</span>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
            >
              <Globe size={14} />
              <span className="font-medium">{language === 'en' ? 'EN' : 'मर'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Name */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              GP
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {getContent(siteSettings.panchayatName)}
              </h1>
              <p className="text-sm text-gray-600">
                {getContent(siteSettings.tagline)}
              </p>
            </div>
          </Link>

          {/* Admin Login & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white rounded-lg font-medium transition-colors"
            >
              🔐 Admin
            </Link>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-primary-600 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="container-custom">
          <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 text-white hover:bg-primary-700 transition-colors ${
                    isActive(item.path) ? 'bg-primary-700 font-semibold' : ''
                  }`}
                >
                  {item.label}
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
