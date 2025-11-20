// Storage utility for managing localStorage data persistence

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export const saveToStorage = (key, data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} fallback - Fallback data if key doesn't exist
 * @returns {any} Stored data or fallback
 */
export const loadFromStorage = (key, fallback = null) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return fallback;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return fallback;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all data from localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get storage size in bytes
 * @returns {number}
 */
export const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

/**
 * Get storage size in a human-readable format
 * @returns {string}
 */
export const getStorageSizeFormatted = () => {
  const bytes = getStorageSize();
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Storage keys
export const STORAGE_KEYS = {
  SITE_SETTINGS: 'grampanchayat_settings',
  MEMBERS: 'grampanchayat_members',
  STAFF: 'grampanchayat_staff',
  SERVICES: 'grampanchayat_services',
  SCHEMES: 'grampanchayat_schemes',
  NOTICES: 'grampanchayat_notices',
  PROGRAMS: 'grampanchayat_programs',
  FORMS: 'grampanchayat_forms'
};

/**
 * Export all data as JSON
 * @returns {object} All stored data
 */
export const exportAllData = () => {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = loadFromStorage(key);
  });
  return data;
};

/**
 * Import data from JSON
 * @param {object} data - Data to import
 */
export const importAllData = (data) => {
  try {
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      if (data[name]) {
        saveToStorage(key, data[name]);
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Download data as JSON file
 */
export const downloadDataBackup = () => {
  const data = exportAllData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportName = `grampanchayat_backup_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

/**
 * Initialize storage with default data if empty
 * @param {object} defaultData - Default data object with keys matching STORAGE_KEYS
 */
export const initializeStorage = (defaultData) => {
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const existing = loadFromStorage(key);
    if (!existing && defaultData[name]) {
      saveToStorage(key, defaultData[name]);
    }
  });
};
