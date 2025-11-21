/**
 * Notices Service - Firebase Firestore operations for notices management
 * Handles CRUD operations for village notices with bilingual support
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const COLLECTION_NAME = 'notices';

/**
 * Get all notices from Firestore
 * @returns {Promise<Array>} Array of notice objects with IDs
 */
export const getAllNotices = async () => {
  try {
    const noticesRef = collection(db, COLLECTION_NAME);
    const q = query(noticesRef, orderBy('startDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const notices = [];
    querySnapshot.forEach((doc) => {
      notices.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    console.log(`Loaded ${notices.length} notices from Firebase`);
    return notices;
  } catch (error) {
    console.error('Error loading notices:', error);
    throw error;
  }
};

/**
 * Get active notices (current date between startDate and endDate)
 * @returns {Promise<Array>} Array of active notice objects
 */
export const getActiveNotices = async () => {
  try {
    const allNotices = await getAllNotices();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const activeNotices = allNotices.filter(notice => {
      const startDate = new Date(notice.startDate);
      const endDate = new Date(notice.endDate);
      return startDate <= today && endDate >= today;
    });
    
    console.log(`Found ${activeNotices.length} active notices`);
    return activeNotices;
  } catch (error) {
    console.error('Error loading active notices:', error);
    throw error;
  }
};

/**
 * Get notices to show on homepage
 * @returns {Promise<Array>} Array of homepage notices
 */
export const getHomePageNotices = async () => {
  try {
    const activeNotices = await getActiveNotices();
    const homePageNotices = activeNotices.filter(notice => notice.showOnHome === true);
    
    console.log(`Found ${homePageNotices.length} homepage notices`);
    return homePageNotices;
  } catch (error) {
    console.error('Error loading homepage notices:', error);
    throw error;
  }
};

/**
 * Get a single notice by ID
 * @param {string} noticeId - The notice document ID
 * @returns {Promise<Object>} Notice object with ID
 */
export const getNoticeById = async (noticeId) => {
  try {
    const noticeRef = doc(db, COLLECTION_NAME, noticeId);
    const noticeSnap = await getDoc(noticeRef);
    
    if (noticeSnap.exists()) {
      return {
        id: noticeSnap.id,
        ...noticeSnap.data(),
      };
    } else {
      throw new Error('Notice not found');
    }
  } catch (error) {
    console.error('Error loading notice:', error);
    throw error;
  }
};

/**
 * Create a new notice
 * @param {Object} noticeData - Notice data object
 * @param {string} noticeData.titleEn - Title in English
 * @param {string} noticeData.titleMr - Title in Marathi (optional)
 * @param {string} noticeData.type - Notice type (ANNOUNCEMENT, MEETING, TENDER, etc.)
 * @param {string} noticeData.descriptionEn - Description in English
 * @param {string} noticeData.descriptionMr - Description in Marathi (optional)
 * @param {string} noticeData.startDate - Start date (YYYY-MM-DD)
 * @param {string} noticeData.endDate - End date (YYYY-MM-DD)
 * @param {boolean} noticeData.showOnHome - Whether to show on homepage
 * @returns {Promise<string>} The ID of the created notice
 */
export const createNotice = async (noticeData) => {
  try {
    const noticesRef = collection(db, COLLECTION_NAME);
    
    // Prepare notice document
    const noticeDoc = {
      titleEn: noticeData.titleEn || '',
      titleMr: noticeData.titleMr || '',
      type: noticeData.type || 'ANNOUNCEMENT',
      descriptionEn: noticeData.descriptionEn || '',
      descriptionMr: noticeData.descriptionMr || '',
      startDate: noticeData.startDate,
      endDate: noticeData.endDate,
      showOnHome: noticeData.showOnHome || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(noticesRef, noticeDoc);
    console.log('Notice created with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
};

/**
 * Update an existing notice
 * @param {string} noticeId - The notice document ID
 * @param {Object} noticeData - Notice data object (same structure as createNotice)
 * @returns {Promise<void>}
 */
export const updateNotice = async (noticeId, noticeData) => {
  try {
    const noticeRef = doc(db, COLLECTION_NAME, noticeId);
    
    // Prepare update data
    const updateData = {
      titleEn: noticeData.titleEn || '',
      titleMr: noticeData.titleMr || '',
      type: noticeData.type || 'ANNOUNCEMENT',
      descriptionEn: noticeData.descriptionEn || '',
      descriptionMr: noticeData.descriptionMr || '',
      startDate: noticeData.startDate,
      endDate: noticeData.endDate,
      showOnHome: noticeData.showOnHome || false,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(noticeRef, updateData);
    console.log('Notice updated:', noticeId);
  } catch (error) {
    console.error('Error updating notice:', error);
    throw error;
  }
};

/**
 * Delete a notice
 * @param {string} noticeId - The notice document ID
 * @returns {Promise<void>}
 */
export const deleteNotice = async (noticeId) => {
  try {
    const noticeRef = doc(db, COLLECTION_NAME, noticeId);
    await deleteDoc(noticeRef);
    console.log('Notice deleted:', noticeId);
  } catch (error) {
    console.error('Error deleting notice:', error);
    throw error;
  }
};

/**
 * Get notices by type
 * @param {string} type - Notice type (ANNOUNCEMENT, MEETING, TENDER, etc.)
 * @returns {Promise<Array>} Array of notices of specified type
 */
export const getNoticesByType = async (type) => {
  try {
    const noticesRef = collection(db, COLLECTION_NAME);
    const q = query(
      noticesRef, 
      where('type', '==', type),
      orderBy('startDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const notices = [];
    querySnapshot.forEach((doc) => {
      notices.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    console.log(`Loaded ${notices.length} notices of type ${type}`);
    return notices;
  } catch (error) {
    console.error('Error loading notices by type:', error);
    throw error;
  }
};

/**
 * Search notices by title or description (English and Marathi)
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching notices
 */
export const searchNotices = async (searchTerm) => {
  try {
    const allNotices = await getAllNotices();
    const term = searchTerm.toLowerCase();
    
    const results = allNotices.filter(notice => 
      notice.titleEn.toLowerCase().includes(term) ||
      notice.titleMr.toLowerCase().includes(term) ||
      notice.descriptionEn.toLowerCase().includes(term) ||
      notice.descriptionMr.toLowerCase().includes(term)
    );
    
    console.log(`Search for "${searchTerm}" found ${results.length} notices`);
    return results;
  } catch (error) {
    console.error('Error searching notices:', error);
    throw error;
  }
};

/**
 * Notice types enum for reference
 */
export const NOTICE_TYPES = {
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  MEETING: 'MEETING',
  TENDER: 'TENDER',
  EVENT: 'EVENT',
  HOLIDAY: 'HOLIDAY',
  URGENT: 'URGENT',
  OTHER: 'OTHER',
};
