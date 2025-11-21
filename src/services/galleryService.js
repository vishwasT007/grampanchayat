import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { uploadImage, deleteImage, uploadMultipleImages } from './storageService';

const COLLECTION_NAME = 'galleryPrograms';

/**
 * Gallery Service
 * Manages gallery programs in Firestore and images in Firebase Storage
 */

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get all gallery programs
 * @returns {Promise<Array>} Array of gallery programs with images
 */
export const getAllPrograms = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.() || new Date(doc.data().date),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error('Error getting gallery programs:', error);
    throw new Error('Failed to fetch gallery programs');
  }
};

/**
 * Get a single gallery program by ID
 * @param {string} programId - Program ID
 * @returns {Promise<Object>} Gallery program data
 */
export const getProgramById = async (programId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, programId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Program not found');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      date: docSnap.data().date?.toDate?.() || new Date(docSnap.data().date),
      createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date()
    };
  } catch (error) {
    console.error('Error getting program:', error);
    throw new Error('Failed to fetch program');
  }
};

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new gallery program with images
 * @param {Object} programData - Program data
 * @param {Array<File>} imageFiles - Array of image files to upload
 * @returns {Promise<Object>} Created program data with ID
 */
export const createProgram = async (programData, imageFiles = []) => {
  try {
    // Upload images to Firebase Storage
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      const uploadPath = `gallery/${Date.now()}`;
      imageUrls = await uploadMultipleImages(imageFiles, uploadPath);
    }
    
    // Create program document
    const programToSave = {
      titleEn: programData.titleEn || '',
      titleMr: programData.titleMr || '',
      descriptionEn: programData.descriptionEn || '',
      descriptionMr: programData.descriptionMr || '',
      date: Timestamp.fromDate(new Date(programData.date)),
      images: imageUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), programToSave);
    
    return {
      id: docRef.id,
      ...programToSave,
      date: new Date(programData.date),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating program:', error);
    throw new Error('Failed to create gallery program');
  }
};

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update an existing gallery program
 * @param {string} programId - Program ID
 * @param {Object} programData - Updated program data
 * @param {Array<File>} newImageFiles - New image files to upload (optional)
 * @param {Array<string>} existingImageUrls - Existing image URLs to keep
 * @returns {Promise<Object>} Updated program data
 */
export const updateProgram = async (programId, programData, newImageFiles = [], existingImageUrls = []) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, programId);
    
    // Upload new images if provided
    let newImageUrls = [];
    if (newImageFiles && newImageFiles.length > 0) {
      const uploadPath = `gallery/${programId}`;
      newImageUrls = await uploadMultipleImages(newImageFiles, uploadPath);
    }
    
    // Combine existing and new image URLs
    const allImageUrls = [...existingImageUrls, ...newImageUrls];
    
    const updates = {
      titleEn: programData.titleEn || '',
      titleMr: programData.titleMr || '',
      descriptionEn: programData.descriptionEn || '',
      descriptionMr: programData.descriptionMr || '',
      date: Timestamp.fromDate(new Date(programData.date)),
      images: allImageUrls,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updates);
    
    return {
      id: programId,
      ...updates,
      date: new Date(programData.date),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error updating program:', error);
    throw new Error('Failed to update gallery program');
  }
};

/**
 * Delete an image from a program
 * @param {string} programId - Program ID
 * @param {string} imageUrl - Image URL to delete
 * @returns {Promise<void>}
 */
export const deleteImageFromProgram = async (programId, imageUrl) => {
  try {
    // Get current program
    const program = await getProgramById(programId);
    
    // Delete image from storage
    await deleteImage(imageUrl);
    
    // Update program with remaining images
    const remainingImages = program.images.filter(url => url !== imageUrl);
    await updateDoc(doc(db, COLLECTION_NAME, programId), {
      images: remainingImages,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting image from program:', error);
    throw new Error('Failed to delete image');
  }
};

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a gallery program and all its images
 * @param {string} programId - Program ID
 * @returns {Promise<void>}
 */
export const deleteProgram = async (programId) => {
  try {
    // Get program to delete its images
    const program = await getProgramById(programId);
    
    // Delete all images from storage
    if (program.images && program.images.length > 0) {
      await Promise.all(
        program.images.map(imageUrl => deleteImage(imageUrl).catch(err => {
          console.warn('Failed to delete image:', imageUrl, err);
        }))
      );
    }
    
    // Delete program document
    await deleteDoc(doc(db, COLLECTION_NAME, programId));
  } catch (error) {
    console.error('Error deleting program:', error);
    throw new Error('Failed to delete gallery program');
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get programs count
 * @returns {Promise<number>} Total number of programs
 */
export const getProgramsCount = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.size;
  } catch (error) {
    console.error('Error getting programs count:', error);
    return 0;
  }
};

/**
 * Search programs by title
 * @param {string} searchTerm - Search term
 * @param {string} language - Language ('en' or 'mr')
 * @returns {Promise<Array>} Filtered programs
 */
export const searchPrograms = async (searchTerm, language = 'en') => {
  try {
    const allPrograms = await getAllPrograms();
    const titleField = language === 'en' ? 'titleEn' : 'titleMr';
    
    return allPrograms.filter(program =>
      program[titleField]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching programs:', error);
    throw new Error('Failed to search programs');
  }
};

export default {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  deleteImageFromProgram,
  getProgramsCount,
  searchPrograms
};
