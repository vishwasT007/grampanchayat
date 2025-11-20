import { createContext, useContext, useState, useEffect } from 'react';
import { mockSiteSettings } from '../data/mockData';

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(mockSiteSettings);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('SITE_SETTINGS');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setSiteSettings(settings);
          console.log('Site settings loaded from localStorage:', settings);
        } catch (error) {
          console.error('Error loading site settings:', error);
          setSiteSettings(mockSiteSettings);
        }
      } else {
        // First time - save mock settings
        localStorage.setItem('SITE_SETTINGS', JSON.stringify(mockSiteSettings));
        setSiteSettings(mockSiteSettings);
      }
    };

    loadSettings();

    // Listen for storage changes (when settings are updated in admin)
    const handleStorageChange = (e) => {
      if (e.key === 'SITE_SETTINGS') {
        console.log('Site settings updated!');
        loadSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SiteSettingsContext.Provider value={siteSettings}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
