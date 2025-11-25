/**
 * Village Statistics Firebase Service
 * Replaces villageStatisticsData.js localStorage implementation
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  getDocsFromServer  // Force server fetch, bypass cache
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Collection names
const COLLECTIONS = {
  VILLAGES: 'villages',
  DEMOGRAPHICS: 'demographics',
  POPULATION_BREAKDOWNS: 'populationBreakdowns',
  VILLAGE_GROUPS: 'villageGroups',
  INFRASTRUCTURE: 'infrastructure',
  STATISTICS_YEARS: 'statisticsYears'
};

// ===========================
// VILLAGES
// ===========================

/**
 * Get all villages
 */
export async function getAllVillages() {
  try {
    console.log('Fetching villages from Firebase server (bypassing cache)...');
    // Use getDocsFromServer to force fresh data from server, not cache
    const querySnapshot = await getDocsFromServer(collection(db, COLLECTIONS.VILLAGES));
    const villages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Remove the internal 'id' field if it exists, use Firebase doc.id instead
      const { id: internalId, ...restData } = data;
      return { 
        id: doc.id,  // Use Firebase document ID, not the internal id field
        ...restData 
      };
    });
    
    // Sort villages by createdAt timestamp (oldest first)
    villages.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeA - timeB;
    });
    
    console.log('Fetched from server:', villages.length, 'villages');
    console.log('Village IDs:', villages.map(v => ({ docId: v.id, name: v.nameEn, createdAt: v.createdAt })));
    return villages;
  } catch (error) {
    console.error('Error getting villages:', error);
    throw error;
  }
}

/**
 * Get village by ID
 */
export async function getVillageById(villageId) {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.VILLAGES, villageId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting village:', error);
    throw error;
  }
}

/**
 * Create new village
 */
export async function createVillage(villageData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.VILLAGES), {
      ...villageData,
      gramPanchayatId: villageData.gramPanchayatId || 'default',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...villageData };
  } catch (error) {
    console.error('Error creating village:', error);
    throw error;
  }
}

/**
 * Update village
 */
export async function updateVillage(villageId, updates) {
  try {
    // Use setDoc with merge option to create if not exists or update if exists
    await setDoc(doc(db, COLLECTIONS.VILLAGES, villageId), {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { id: villageId, ...updates };
  } catch (error) {
    console.error('Error updating village:', error);
    throw error;
  }
}

/**
 * Delete village
 */
export async function deleteVillage(villageId) {
  try {
    console.log('Attempting to delete village from Firebase, ID:', villageId);
    const villageRef = doc(db, COLLECTIONS.VILLAGES, villageId);
    console.log('Village reference created:', villageRef.path);
    await deleteDoc(villageRef);
    console.log('Firebase deleteDoc completed successfully for:', villageId);
    return true;
  } catch (error) {
    console.error('Error deleting village from Firebase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
}

// ===========================
// DEMOGRAPHICS
// ===========================

/**
 * Get all demographics
 */
export async function getAllDemographics() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.DEMOGRAPHICS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting demographics:', error);
    throw error;
  }
}

/**
 * Get demographics by village and year
 */
export async function getDemographicsByVillageAndYear(villageId, year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.DEMOGRAPHICS),
      where('villageId', '==', villageId),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting demographics:', error);
    throw error;
  }
}

/**
 * Get demographics by year
 */
export async function getDemographicsByYear(year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.DEMOGRAPHICS),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting demographics by year:', error);
    throw error;
  }
}

/**
 * Create or update demographics (upsert)
 */
export async function upsertDemographics(demographicsData) {
  try {
    const { villageId, year } = demographicsData;
    
    // Check if exists
    const existing = await getDemographicsByVillageAndYear(villageId, year);
    
    if (existing) {
      // Update
      await updateDoc(doc(db, COLLECTIONS.DEMOGRAPHICS, existing.id), {
        ...demographicsData,
        updatedAt: serverTimestamp()
      });
      return { id: existing.id, ...demographicsData };
    } else {
      // Create
      const docRef = await addDoc(collection(db, COLLECTIONS.DEMOGRAPHICS), {
        ...demographicsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...demographicsData };
    }
  } catch (error) {
    console.error('Error upserting demographics:', error);
    throw error;
  }
}

/**
 * Bulk upsert demographics
 */
export async function bulkUpsertDemographics(demographicsArray) {
  try {
    const batch = writeBatch(db);
    
    for (const data of demographicsArray) {
      const existing = await getDemographicsByVillageAndYear(data.villageId, data.year);
      
      if (existing) {
        // Update existing
        const docRef = doc(db, COLLECTIONS.DEMOGRAPHICS, existing.id);
        batch.update(docRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new
        const docRef = doc(collection(db, COLLECTIONS.DEMOGRAPHICS));
        batch.set(docRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error bulk upserting demographics:', error);
    throw error;
  }
}

// ===========================
// POPULATION BREAKDOWNS
// ===========================

/**
 * Get breakdowns by village and year
 */
export async function getBreakdownsByVillageAndYear(villageId, year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.POPULATION_BREAKDOWNS),
      where('villageId', '==', villageId),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting breakdowns:', error);
    throw error;
  }
}

/**
 * Get breakdowns by year
 */
export async function getBreakdownsByYear(year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.POPULATION_BREAKDOWNS),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting breakdowns by year:', error);
    throw error;
  }
}

/**
 * Upsert population breakdown
 */
export async function upsertPopulationBreakdown(breakdownData) {
  try {
    const { villageId, year, category } = breakdownData;
    
    const q = query(
      collection(db, COLLECTIONS.POPULATION_BREAKDOWNS),
      where('villageId', '==', villageId),
      where('year', '==', year),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update
      const existing = querySnapshot.docs[0];
      await updateDoc(doc(db, COLLECTIONS.POPULATION_BREAKDOWNS, existing.id), {
        ...breakdownData,
        totalCount: (breakdownData.maleCount || 0) + (breakdownData.femaleCount || 0),
        updatedAt: serverTimestamp()
      });
      return { id: existing.id, ...breakdownData };
    } else {
      // Create
      const docRef = await addDoc(collection(db, COLLECTIONS.POPULATION_BREAKDOWNS), {
        ...breakdownData,
        totalCount: (breakdownData.maleCount || 0) + (breakdownData.femaleCount || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...breakdownData };
    }
  } catch (error) {
    console.error('Error upserting breakdown:', error);
    throw error;
  }
}

/**
 * Bulk upsert population breakdowns
 */
export async function bulkUpsertPopulationBreakdowns(breakdownsArray) {
  try {
    const batch = writeBatch(db);
    
    for (const data of breakdownsArray) {
      const q = query(
        collection(db, COLLECTIONS.POPULATION_BREAKDOWNS),
        where('villageId', '==', data.villageId),
        where('year', '==', data.year),
        where('category', '==', data.category)
      );
      const querySnapshot = await getDocs(q);
      
      const totalCount = (data.maleCount || 0) + (data.femaleCount || 0);
      
      if (!querySnapshot.empty) {
        // Update
        const existing = querySnapshot.docs[0];
        const docRef = doc(db, COLLECTIONS.POPULATION_BREAKDOWNS, existing.id);
        batch.update(docRef, {
          ...data,
          totalCount,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create
        const docRef = doc(collection(db, COLLECTIONS.POPULATION_BREAKDOWNS));
        batch.set(docRef, {
          ...data,
          totalCount,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error bulk upserting breakdowns:', error);
    throw error;
  }
}

// ===========================
// VILLAGE GROUPS
// ===========================

/**
 * Get groups by village and year
 */
export async function getGroupsByVillageAndYear(villageId, year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.VILLAGE_GROUPS),
      where('villageId', '==', villageId),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting groups:', error);
    throw error;
  }
}

/**
 * Get groups by year
 */
export async function getGroupsByYear(year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.VILLAGE_GROUPS),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting groups by year:', error);
    throw error;
  }
}

/**
 * Upsert village groups
 */
export async function upsertVillageGroups(groupsData) {
  try {
    const { villageId, year } = groupsData;
    const existing = await getGroupsByVillageAndYear(villageId, year);
    
    if (existing) {
      await updateDoc(doc(db, COLLECTIONS.VILLAGE_GROUPS, existing.id), {
        ...groupsData,
        updatedAt: serverTimestamp()
      });
      return { id: existing.id, ...groupsData };
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.VILLAGE_GROUPS), {
        ...groupsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...groupsData };
    }
  } catch (error) {
    console.error('Error upserting groups:', error);
    throw error;
  }
}

/**
 * Bulk upsert village groups
 */
export async function bulkUpsertVillageGroups(groupsArray) {
  try {
    const batch = writeBatch(db);
    
    for (const data of groupsArray) {
      const existing = await getGroupsByVillageAndYear(data.villageId, data.year);
      
      if (existing) {
        const docRef = doc(db, COLLECTIONS.VILLAGE_GROUPS, existing.id);
        batch.update(docRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = doc(collection(db, COLLECTIONS.VILLAGE_GROUPS));
        batch.set(docRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error bulk upserting groups:', error);
    throw error;
  }
}

// ===========================
// INFRASTRUCTURE
// ===========================

/**
 * Get infrastructure by village and year
 */
export async function getInfrastructureByVillageAndYear(villageId, year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.INFRASTRUCTURE),
      where('villageId', '==', villageId),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting infrastructure:', error);
    throw error;
  }
}

/**
 * Get infrastructure by year
 */
export async function getInfrastructureByYear(year) {
  try {
    const q = query(
      collection(db, COLLECTIONS.INFRASTRUCTURE),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting infrastructure by year:', error);
    throw error;
  }
}

/**
 * Upsert village infrastructure
 */
export async function upsertVillageInfrastructure(infrastructureData) {
  try {
    const { villageId, year } = infrastructureData;
    const existing = await getInfrastructureByVillageAndYear(villageId, year);
    
    if (existing) {
      await updateDoc(doc(db, COLLECTIONS.INFRASTRUCTURE, existing.id), {
        ...infrastructureData,
        updatedAt: serverTimestamp()
      });
      return { id: existing.id, ...infrastructureData };
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.INFRASTRUCTURE), {
        ...infrastructureData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...infrastructureData };
    }
  } catch (error) {
    console.error('Error upserting infrastructure:', error);
    throw error;
  }
}

/**
 * Bulk upsert infrastructure
 */
export async function bulkUpsertVillageInfrastructure(infrastructureArray) {
  try {
    const batch = writeBatch(db);
    
    for (const data of infrastructureArray) {
      const existing = await getInfrastructureByVillageAndYear(data.villageId, data.year);
      
      if (existing) {
        const docRef = doc(db, COLLECTIONS.INFRASTRUCTURE, existing.id);
        batch.update(docRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = doc(collection(db, COLLECTIONS.INFRASTRUCTURE));
        batch.set(docRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error bulk upserting infrastructure:', error);
    throw error;
  }
}

// ===========================
// YEARS MANAGEMENT
// ===========================

/**
 * Get all years
 */
export async function getAllYears() {
  try {
    const q = query(collection(db, COLLECTIONS.STATISTICS_YEARS), orderBy('year', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().year);
  } catch (error) {
    console.error('Error getting years:', error);
    throw error;
  }
}

/**
 * Add new year
 */
export async function addYear(year) {
  try {
    // Check if year already exists
    const q = query(
      collection(db, COLLECTIONS.STATISTICS_YEARS),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Year already exists');
    }
    
    await addDoc(collection(db, COLLECTIONS.STATISTICS_YEARS), {
      year,
      createdAt: serverTimestamp()
    });
    
    return year;
  } catch (error) {
    console.error('Error adding year:', error);
    throw error;
  }
}

/**
 * Get latest year
 */
export async function getLatestYear() {
  try {
    const years = await getAllYears();
    return years.length > 0 ? years[0] : new Date().getFullYear();
  } catch (error) {
    console.error('Error getting latest year:', error);
    return new Date().getFullYear();
  }
}

// ===========================
// SUMMARY
// ===========================

/**
 * Get complete statistics summary for a year
 */
export async function getStatisticsSummaryByYear(year) {
  try {
    const [villages, demographics, breakdowns, groups, infrastructure] = await Promise.all([
      getAllVillages(),
      getDemographicsByYear(year),
      getBreakdownsByYear(year),
      getGroupsByYear(year),
      getInfrastructureByYear(year)
    ]);
    
    return {
      year,
      villages,
      demographics,
      breakdowns,
      groups,
      infrastructure
    };
  } catch (error) {
    console.error('Error getting summary:', error);
    throw error;
  }
}
