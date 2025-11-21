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
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const COLLECTION_NAME = 'schemes';

/**
 * Get all schemes from Firebase
 */
export const getSchemes = async () => {
  try {
    const schemesRef = collection(db, COLLECTION_NAME);
    const q = query(schemesRef, orderBy('name.en', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const schemes = [];
    querySnapshot.forEach((doc) => {
      schemes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return schemes;
  } catch (error) {
    console.error('Error fetching schemes:', error);
    throw error;
  }
};

/**
 * Get schemes by category
 */
export const getSchemesByCategory = async (category) => {
  try {
    const schemesRef = collection(db, COLLECTION_NAME);
    const q = query(
      schemesRef, 
      where('category', '==', category),
      orderBy('name.en', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const schemes = [];
    querySnapshot.forEach((doc) => {
      schemes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return schemes;
  } catch (error) {
    console.error('Error fetching schemes by category:', error);
    throw error;
  }
};

/**
 * Get a single scheme by ID
 */
export const getScheme = async (schemeId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, schemeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching scheme:', error);
    throw error;
  }
};

/**
 * Create a new scheme
 */
export const createScheme = async (schemeData) => {
  try {
    const schemesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(schemesRef, {
      ...schemeData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Scheme created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating scheme:', error);
    throw error;
  }
};

/**
 * Update an existing scheme
 */
export const updateScheme = async (schemeId, schemeData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, schemeId);
    await updateDoc(docRef, {
      ...schemeData,
      updatedAt: Timestamp.now()
    });
    
    console.log('Scheme updated successfully:', schemeId);
    return schemeId;
  } catch (error) {
    console.error('Error updating scheme:', error);
    throw error;
  }
};

/**
 * Delete a scheme
 */
export const deleteScheme = async (schemeId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, schemeId);
    await deleteDoc(docRef);
    
    console.log('Scheme deleted successfully:', schemeId);
    return true;
  } catch (error) {
    console.error('Error deleting scheme:', error);
    throw error;
  }
};
