import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Footer = () => {
  const { t, getContent } = useLanguage();
  const { settings: siteSettings, loading } = useSiteSettings();

  // Don't render footer content until settings are loaded
  if (loading || !siteSettings) {
    return null;
  }

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/schemes', label: t('nav.schemes') },
    { path: '/downloads', label: t('nav.downloads') },
    { path: '/notices', label: t('nav.notices') },
  ];

  const importantLinks = [
    { label: 'Ministry of Panchayati Raj', url: 'https://panchayat.gov.in' },
    { label: 'Digital India', url: 'https://digitalindia.gov.in' },
    { label: 'MyGov', url: 'https://mygov.in' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {getContent(siteSettings.panchayatName)}
            </h3>
            <p className="text-sm mb-4">
              {getContent(siteSettings.tagline)}
            </p>
            <div className="flex gap-3">
              <a
                href={siteSettings.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href={siteSettings.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href={siteSettings.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin/login"
                  className="text-sm hover:text-primary-400 transition-colors font-semibold"
                >
                  🔐 Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {t('footer.importantLinks')}
            </h3>
            <ul className="space-y-2">
              {importantLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm">
                <MapPin size={16} className="flex-shrink-0 mt-1" />
                <span>{getContent(siteSettings.contact.address)}</span>
              </li>
              <li className="flex gap-2 text-sm">
                <Phone size={16} className="flex-shrink-0" />
                <a
                  href={`tel:${siteSettings.contact.phone}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {siteSettings.contact.phone}
                </a>
              </li>
              <li className="flex gap-2 text-sm">
                <Mail size={16} className="flex-shrink-0" />
                <a
                  href={`mailto:${siteSettings.contact.email}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {siteSettings.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4">
          <div className="text-center text-sm">
            <p>
              © {new Date().getFullYear()}{' '}
              {getContent(siteSettings.panchayatName)}. {t('footer.copyright')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
