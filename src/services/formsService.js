/**
 * Forms Service - Firebase Firestore + Storage operations for forms/downloads
 * Handles CRUD operations and PDF file management
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
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';

const COLLECTION_NAME = 'forms';
const STORAGE_PATH = 'forms';

/**
 * Get all forms from Firestore
 * @returns {Promise<Array>} Array of form objects with IDs
 */
export const getAllForms = async () => {
  try {
    const formsRef = collection(db, COLLECTION_NAME);
    const q = query(formsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const forms = [];
    querySnapshot.forEach((doc) => {
      forms.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    console.log(`Loaded ${forms.length} forms from Firebase`);
    return forms;
  } catch (error) {
    console.error('Error loading forms:', error);
    throw error;
  }
};

/**
 * Get forms by category
 * @param {string} category - Form category
 * @returns {Promise<Array>} Array of forms in the specified category
 */
export const getFormsByCategory = async (category) => {
  try {
    const formsRef = collection(db, COLLECTION_NAME);
    const q = query(
      formsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const forms = [];
    querySnapshot.forEach((doc) => {
      forms.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    console.log(`Loaded ${forms.length} forms in category ${category}`);
    return forms;
  } catch (error) {
    console.error('Error loading forms by category:', error);
    throw error;
  }
};

/**
 * Get a single form by ID
 * @param {string} formId - The form document ID
 * @returns {Promise<Object>} Form object with ID
 */
export const getFormById = async (formId) => {
  try {
    const formRef = doc(db, COLLECTION_NAME, formId);
    const formSnap = await getDoc(formRef);
    
    if (formSnap.exists()) {
      return {
        id: formSnap.id,
        ...formSnap.data(),
      };
    } else {
      throw new Error('Form not found');
    }
  } catch (error) {
    console.error('Error loading form:', error);
    throw error;
  }
};

/**
 * Upload a PDF file to Firebase Storage with progress tracking
 * @param {File} file - PDF file to upload
 * @param {string} formId - Form ID for storage path
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<string>} Download URL of uploaded file
 */
export const uploadPDF = async (file, formId, onProgress = null) => {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Create storage reference
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${formId}/${fileName}`);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Error uploading PDF:', error);
          reject(error);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('PDF uploaded successfully:', downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadPDF:', error);
    throw error;
  }
};

/**
 * Delete a PDF file from Firebase Storage
 * @param {string} fileUrl - Full download URL of the file
 * @returns {Promise<void>}
 */
export const deletePDF = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.log('No file URL provided, skipping deletion');
      return;
    }

    // Extract storage path from URL
    const urlParts = fileUrl.split('/o/');
    if (urlParts.length < 2) {
      console.warn('Invalid file URL format');
      return;
    }

    const pathWithParams = urlParts[1];
    const filePath = decodeURIComponent(pathWithParams.split('?')[0]);

    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    console.log('PDF deleted from storage:', filePath);
  } catch (error) {
    // Don't throw error if file doesn't exist
    if (error.code === 'storage/object-not-found') {
      console.log('File already deleted or does not exist');
    } else {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  }
};

/**
 * Create a new form with PDF upload
 * @param {Object} formData - Form data object
 * @param {string} formData.titleEn - Title in English
 * @param {string} formData.titleMr - Title in Marathi (optional)
 * @param {string} formData.descriptionEn - Description in English
 * @param {string} formData.descriptionMr - Description in Marathi (optional)
 * @param {string} formData.category - Form category
 * @param {string} formData.language - Form language (ENGLISH, MARATHI, BOTH)
 * @param {File} pdfFile - PDF file to upload
 * @param {Function} onProgress - Upload progress callback
 * @returns {Promise<string>} The ID of the created form
 */
export const createForm = async (formData, pdfFile, onProgress = null) => {
  try {
    const formsRef = collection(db, COLLECTION_NAME);
    
    // Create form document first to get ID
    const formDoc = {
      titleEn: formData.titleEn || '',
      titleMr: formData.titleMr || '',
      descriptionEn: formData.descriptionEn || '',
      descriptionMr: formData.descriptionMr || '',
      category: formData.category || 'General',
      language: formData.language || 'BOTH',
      fileUrl: '', // Will be updated after upload
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(formsRef, formDoc);
    console.log('Form document created with ID:', docRef.id);
    
    // Upload PDF file
    const fileUrl = await uploadPDF(pdfFile, docRef.id, onProgress);
    
    // Update form with file URL
    await updateDoc(docRef, { fileUrl });
    console.log('Form updated with file URL');
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
};

/**
 * Update an existing form (with optional new PDF)
 * @param {string} formId - The form document ID
 * @param {Object} formData - Form data object (same structure as createForm)
 * @param {File|null} pdfFile - New PDF file (optional)
 * @param {string|null} existingFileUrl - Current file URL (for deletion if replacing)
 * @param {Function} onProgress - Upload progress callback
 * @returns {Promise<void>}
 */
export const updateForm = async (formId, formData, pdfFile = null, existingFileUrl = null, onProgress = null) => {
  try {
    const formRef = doc(db, COLLECTION_NAME, formId);
    
    // Prepare update data
    const updateData = {
      titleEn: formData.titleEn || '',
      titleMr: formData.titleMr || '',
      descriptionEn: formData.descriptionEn || '',
      descriptionMr: formData.descriptionMr || '',
      category: formData.category || 'General',
      language: formData.language || 'BOTH',
      updatedAt: serverTimestamp(),
    };
    
    // If new PDF file is provided
    if (pdfFile) {
      // Delete old file if exists
      if (existingFileUrl) {
        await deletePDF(existingFileUrl);
      }
      
      // Upload new file
      const fileUrl = await uploadPDF(pdfFile, formId, onProgress);
      updateData.fileUrl = fileUrl;
      updateData.fileName = pdfFile.name;
      updateData.fileSize = pdfFile.size;
    }
    
    await updateDoc(formRef, updateData);
    console.log('Form updated:', formId);
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};

/**
 * Delete a form and its PDF file
 * @param {string} formId - The form document ID
 * @param {string} fileUrl - The PDF file URL
 * @returns {Promise<void>}
 */
export const deleteForm = async (formId, fileUrl) => {
  try {
    // Delete PDF file from Storage
    if (fileUrl) {
      await deletePDF(fileUrl);
    }
    
    // Delete form document from Firestore
    const formRef = doc(db, COLLECTION_NAME, formId);
    await deleteDoc(formRef);
    
    console.log('Form deleted:', formId);
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
};

/**
 * Search forms by title or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching forms
 */
export const searchForms = async (searchTerm) => {
  try {
    const allForms = await getAllForms();
    const term = searchTerm.toLowerCase();
    
    const results = allForms.filter(form => 
      form.titleEn.toLowerCase().includes(term) ||
      form.titleMr.toLowerCase().includes(term) ||
      form.descriptionEn.toLowerCase().includes(term) ||
      form.descriptionMr.toLowerCase().includes(term) ||
      form.category.toLowerCase().includes(term)
    );
    
    console.log(`Search for "${searchTerm}" found ${results.length} forms`);
    return results;
  } catch (error) {
    console.error('Error searching forms:', error);
    throw error;
  }
};

/**
 * Form categories enum for reference
 */
export const FORM_CATEGORIES = {
  CERTIFICATE: 'Certificate',
  TAX: 'Tax',
  LICENSE: 'License',
  APPLICATION: 'Application',
  COMPLAINT: 'Complaint',
  SCHEME: 'Scheme',
  GENERAL: 'General',
  OTHER: 'Other',
};

/**
 * Form language options
 */
export const FORM_LANGUAGES = {
  ENGLISH: 'ENGLISH',
  MARATHI: 'MARATHI',
  BOTH: 'BOTH',
};
