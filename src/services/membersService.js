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
import { uploadImage, deleteImage } from './storageService';

const COLLECTION_NAME = 'members';

/**
 * Get all members from Firebase
 */
export const getMembers = async () => {
  try {
    const membersRef = collection(db, COLLECTION_NAME);
    const q = query(membersRef, orderBy('position', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

/**
 * Get members by type (SARPANCH, UPSARPANCH, MEMBER, STAFF)
 */
export const getMembersByType = async (type) => {
  try {
    const membersRef = collection(db, COLLECTION_NAME);
    const q = query(
      membersRef, 
      where('type', '==', type),
      orderBy('position', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching members by type:', error);
    throw error;
  }
};

/**
 * Get a single member by ID
 */
export const getMember = async (memberId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, memberId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
};

/**
 * Create a new member
 */
export const createMember = async (memberData, photoFile = null) => {
  try {
    let photoURL = memberData.photo || '';
    
    // Upload photo if provided
    if (photoFile) {
      photoURL = await uploadImage(photoFile, 'members');
    }
    
    const membersRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(membersRef, {
      ...memberData,
      photo: photoURL,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Member created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

/**
 * Update an existing member
 */
export const updateMember = async (memberId, memberData, photoFile = null) => {
  try {
    let photoURL = memberData.photo || '';
    
    // Upload new photo if provided
    if (photoFile) {
      // Get old member data to delete old photo
      const oldMember = await getMember(memberId);
      if (oldMember && oldMember.photo) {
        try {
          await deleteImage(oldMember.photo);
        } catch (error) {
          console.warn('Failed to delete old photo:', error);
        }
      }
      
      photoURL = await uploadImage(photoFile, 'members');
    }
    
    const docRef = doc(db, COLLECTION_NAME, memberId);
    await updateDoc(docRef, {
      ...memberData,
      photo: photoURL,
      updatedAt: Timestamp.now()
    });
    
    console.log('Member updated successfully:', memberId);
    return memberId;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

/**
 * Delete a member
 */
export const deleteMember = async (memberId) => {
  try {
    // Get member data to delete photo
    const member = await getMember(memberId);
    if (member && member.photo) {
      try {
        await deleteImage(member.photo);
      } catch (error) {
        console.warn('Failed to delete member photo:', error);
      }
    }
    
    const docRef = doc(db, COLLECTION_NAME, memberId);
    await deleteDoc(docRef);
    
    console.log('Member deleted successfully:', memberId);
    return true;
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};
