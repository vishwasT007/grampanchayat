import { 
  collection, 
  doc, 
  getDoc, 
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Collection reference
const COLLECTION_NAME = 'pages';

// Page Types
export const PAGE_TYPES = {
  ABOUT: 'about',
  EDUCATION: 'education'
};

/**
 * Get page content by page type
 * @param {string} pageType - Type of page (about, education)
 * @returns {Promise<Object|null>} Page content or null if not found
 */
export const getPageContent = async (pageType) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pageType);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt
      };
    } else {
      console.log(`No ${pageType} page content found`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching ${pageType} page content:`, error);
    throw new Error(`Failed to fetch ${pageType} page content`);
  }
};

/**
 * Update or create page content
 * @param {string} pageType - Type of page (about, education)
 * @param {Object} data - Page content data
 * @returns {Promise<void>}
 */
export const updatePageContent = async (pageType, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pageType);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    const isNew = !docSnap.exists();
    
    const pageData = {
      ...data,
      updatedAt: Timestamp.now(),
      ...(isNew && { createdAt: Timestamp.now() })
    };

    await setDoc(docRef, pageData, { merge: true });
    console.log(`${pageType} page content ${isNew ? 'created' : 'updated'}`);
  } catch (error) {
    console.error(`Error updating ${pageType} page content:`, error);
    throw new Error(`Failed to update ${pageType} page content`);
  }
};

/**
 * Get About page content
 * @returns {Promise<Object|null>} About page content
 */
export const getAboutContent = async () => {
  return await getPageContent(PAGE_TYPES.ABOUT);
};

/**
 * Update About page content
 * @param {Object} data - About page data
 * @returns {Promise<void>}
 */
export const updateAboutContent = async (data) => {
  return await updatePageContent(PAGE_TYPES.ABOUT, data);
};

/**
 * Get Education page content
 * @returns {Promise<Object|null>} Education page content
 */
export const getEducationContent = async () => {
  return await getPageContent(PAGE_TYPES.EDUCATION);
};

/**
 * Update Education page content
 * @param {Object} data - Education page data
 * @returns {Promise<void>}
 */
export const updateEducationContent = async (data) => {
  return await updatePageContent(PAGE_TYPES.EDUCATION, data);
};
