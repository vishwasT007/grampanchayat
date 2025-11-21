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

const COLLECTION_NAME = 'services';

/**
 * Get all services from Firebase
 */
export const getServices = async () => {
  try {
    const servicesRef = collection(db, COLLECTION_NAME);
    const q = query(servicesRef, orderBy('name.en', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Get services by category
 */
export const getServicesByCategory = async (category) => {
  try {
    const servicesRef = collection(db, COLLECTION_NAME);
    const q = query(
      servicesRef, 
      where('category', '==', category),
      orderBy('name.en', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return services;
  } catch (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }
};

/**
 * Get a single service by ID
 */
export const getService = async (serviceId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, serviceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

/**
 * Create a new service
 */
export const createService = async (serviceData) => {
  try {
    const servicesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Service created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * Update an existing service
 */
export const updateService = async (serviceId, serviceData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, serviceId);
    await updateDoc(docRef, {
      ...serviceData,
      updatedAt: Timestamp.now()
    });
    
    console.log('Service updated successfully:', serviceId);
    return serviceId;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

/**
 * Delete a service
 */
export const deleteService = async (serviceId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, serviceId);
    await deleteDoc(docRef);
    
    console.log('Service deleted successfully:', serviceId);
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};
