import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Collection reference
const COLLECTION_NAME = 'financialRecords';
const financialRecordsRef = collection(db, COLLECTION_NAME);

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
};

// Income Categories
export const INCOME_CATEGORIES = {
  TAX: 'TAX',
  GRANT: 'GRANT',
  FEES: 'FEES',
  DONATION: 'DONATION',
  OTHER_INCOME: 'OTHER_INCOME'
};

// Expense Categories
export const EXPENSE_CATEGORIES = {
  SALARY: 'SALARY',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  UTILITIES: 'UTILITIES',
  MAINTENANCE: 'MAINTENANCE',
  SUPPLIES: 'SUPPLIES',
  OTHER_EXPENSE: 'OTHER_EXPENSE'
};

// Payment Modes
export const PAYMENT_MODES = {
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  ONLINE: 'ONLINE',
  NEFT: 'NEFT',
  RTGS: 'RTGS',
  BANK_TRANSFER: 'BANK_TRANSFER'
};

/**
 * Get all financial records
 * @returns {Promise<Array>} Array of financial records
 */
export const getAllRecords = async () => {
  try {
    const q = query(financialRecordsRef, orderBy('transactionDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const records = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to ISO string for easier handling
        transactionDate: data.transactionDate?.toDate?.()?.toISOString?.() || data.transactionDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt
      });
    });
    
    return records;
  } catch (error) {
    console.error('Error fetching financial records:', error);
    throw new Error('Failed to fetch financial records');
  }
};

/**
 * Get financial records by type (INCOME or EXPENSE)
 * @param {string} type - Transaction type
 * @returns {Promise<Array>} Array of financial records
 */
export const getRecordsByType = async (type) => {
  try {
    const q = query(
      financialRecordsRef,
      where('type', '==', type),
      orderBy('transactionDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const records = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        transactionDate: data.transactionDate?.toDate?.()?.toISOString?.() || data.transactionDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt
      });
    });
    
    return records;
  } catch (error) {
    console.error('Error fetching records by type:', error);
    throw new Error('Failed to fetch records by type');
  }
};

/**
 * Get financial records by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of financial records
 */
export const getRecordsByCategory = async (category) => {
  try {
    const q = query(
      financialRecordsRef,
      where('category', '==', category),
      orderBy('transactionDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const records = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        transactionDate: data.transactionDate?.toDate?.()?.toISOString?.() || data.transactionDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt
      });
    });
    
    return records;
  } catch (error) {
    console.error('Error fetching records by category:', error);
    throw new Error('Failed to fetch records by category');
  }
};

/**
 * Get a single financial record by ID
 * @param {string} id - Record ID
 * @returns {Promise<Object>} Financial record
 */
export const getRecordById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        transactionDate: data.transactionDate?.toDate?.()?.toISOString?.() || data.transactionDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt
      };
    } else {
      throw new Error('Record not found');
    }
  } catch (error) {
    console.error('Error fetching record:', error);
    throw new Error('Failed to fetch record');
  }
};

/**
 * Create a new financial record
 * @param {Object} data - Record data
 * @returns {Promise<string>} Created record ID
 */
export const createRecord = async (data) => {
  try {
    // Validate required fields
    if (!data.type || !data.category || !data.amount || !data.transactionDate) {
      throw new Error('Missing required fields');
    }

    // Convert date string to Firestore Timestamp
    const transactionDate = data.transactionDate instanceof Date 
      ? Timestamp.fromDate(data.transactionDate)
      : Timestamp.fromDate(new Date(data.transactionDate));

    const recordData = {
      type: data.type,
      category: data.category,
      subcategory: data.subcategory || '',
      subcategoryMr: data.subcategoryMr || '',
      amount: parseFloat(data.amount),
      description: data.description || '',
      descriptionMr: data.descriptionMr || '',
      transactionDate: transactionDate,
      paymentMode: data.paymentMode || 'CASH',
      referenceNumber: data.referenceNumber || '',
      // For INCOME transactions
      receivedFrom: data.receivedFrom || '',
      receivedFromMr: data.receivedFromMr || '',
      // For EXPENSE transactions
      paidTo: data.paidTo || '',
      paidToMr: data.paidToMr || '',
      // Attachment (if any)
      attachment: data.attachment || null,
      // Timestamps
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(financialRecordsRef, recordData);
    console.log('Financial record created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating financial record:', error);
    throw new Error('Failed to create financial record');
  }
};

/**
 * Update an existing financial record
 * @param {string} id - Record ID
 * @param {Object} data - Updated record data
 * @returns {Promise<void>}
 */
export const updateRecord = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Convert date string to Firestore Timestamp if provided
    let transactionDate = data.transactionDate;
    if (transactionDate && !(transactionDate instanceof Timestamp)) {
      transactionDate = transactionDate instanceof Date 
        ? Timestamp.fromDate(transactionDate)
        : Timestamp.fromDate(new Date(transactionDate));
    }

    const updateData = {
      ...data,
      ...(transactionDate && { transactionDate }),
      ...(data.amount && { amount: parseFloat(data.amount) }),
      updatedAt: Timestamp.now()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    await updateDoc(docRef, updateData);
    console.log('Financial record updated:', id);
  } catch (error) {
    console.error('Error updating financial record:', error);
    throw new Error('Failed to update financial record');
  }
};

/**
 * Delete a financial record
 * @param {string} id - Record ID
 * @returns {Promise<void>}
 */
export const deleteRecord = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('Financial record deleted:', id);
  } catch (error) {
    console.error('Error deleting financial record:', error);
    throw new Error('Failed to delete financial record');
  }
};

/**
 * Get financial summary (total income, total expense, balance)
 * @returns {Promise<Object>} Financial summary
 */
export const getFinancialSummary = async () => {
  try {
    const records = await getAllRecords();
    
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      incomeCount: 0,
      expenseCount: 0,
      recentTransactions: []
    };

    records.forEach(record => {
      if (record.type === TRANSACTION_TYPES.INCOME) {
        summary.totalIncome += record.amount;
        summary.incomeCount++;
      } else if (record.type === TRANSACTION_TYPES.EXPENSE) {
        summary.totalExpense += record.amount;
        summary.expenseCount++;
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpense;
    summary.recentTransactions = records.slice(0, 10); // Last 10 transactions

    return summary;
  } catch (error) {
    console.error('Error calculating financial summary:', error);
    throw new Error('Failed to calculate financial summary');
  }
};

/**
 * Get records by date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Promise<Array>} Array of financial records
 */
export const getRecordsByDateRange = async (startDate, endDate) => {
  try {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    // Set time to start and end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const q = query(
      financialRecordsRef,
      where('transactionDate', '>=', Timestamp.fromDate(start)),
      where('transactionDate', '<=', Timestamp.fromDate(end)),
      orderBy('transactionDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const records = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        transactionDate: data.transactionDate?.toDate?.()?.toISOString?.() || data.transactionDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt
      });
    });
    
    return records;
  } catch (error) {
    console.error('Error fetching records by date range:', error);
    throw new Error('Failed to fetch records by date range');
  }
};

/**
 * Search financial records
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching financial records
 */
export const searchRecords = async (searchTerm) => {
  try {
    // Firestore doesn't support full-text search, so we fetch all and filter
    const records = await getAllRecords();
    
    const term = searchTerm.toLowerCase();
    return records.filter(record => 
      record.description?.toLowerCase().includes(term) ||
      record.descriptionMr?.toLowerCase().includes(term) ||
      record.subcategory?.toLowerCase().includes(term) ||
      record.subcategoryMr?.toLowerCase().includes(term) ||
      record.referenceNumber?.toLowerCase().includes(term) ||
      record.receivedFrom?.toLowerCase().includes(term) ||
      record.receivedFromMr?.toLowerCase().includes(term) ||
      record.paidTo?.toLowerCase().includes(term) ||
      record.paidToMr?.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error searching records:', error);
    throw new Error('Failed to search records');
  }
};
