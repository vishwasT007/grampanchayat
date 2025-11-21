import { createContext, useContext, useState, useEffect } from 'react';
import { mockSiteSettings } from '../data/mockData';
import { getSettings, initializeSettings } from '../services/settingsService';

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(mockSiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from Firebase
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settings = await getSettings();
        
        if (settings) {
          setSiteSettings(settings);
          console.log('Site settings loaded from Firebase:', settings);
        } else {
          // First time - initialize with mock settings
          const initialized = await initializeSettings(mockSiteSettings);
          setSiteSettings(initialized);
          console.log('Site settings initialized in Firebase');
        }
      } catch (error) {
        console.error('Error loading site settings:', error);
        // Fallback to mock settings
        setSiteSettings(mockSiteSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings: siteSettings, loading, refresh: async () => {
      const settings = await getSettings();
      if (settings) setSiteSettings(settings);
    }}}>
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
