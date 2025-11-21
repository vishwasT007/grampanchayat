import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const COLLECTION_NAME = 'settings';
const DOCUMENT_ID = 'siteConfig';

/**
 * Get site settings from Firebase
 * Returns singleton settings document
 */
export const getSettings = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    // Return null if no settings found
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Update site settings in Firebase
 * Creates or updates the singleton settings document
 */
export const updateSettings = async (settingsData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    
    // Use setDoc with merge to create or update
    await setDoc(docRef, settingsData, { merge: true });
    
    console.log('Settings updated successfully in Firebase');
    return settingsData;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

/**
 * Initialize settings with default data
 * Only creates if settings don't exist
 */
export const initializeSettings = async (defaultSettings) => {
  try {
    const existing = await getSettings();
    
    // Only initialize if no settings exist
    if (!existing) {
      await updateSettings(defaultSettings);
      console.log('Settings initialized with default data');
      return defaultSettings;
    }
    
    return existing;
  } catch (error) {
    console.error('Error initializing settings:', error);
    throw error;
  }
};
