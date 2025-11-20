# 📚 Data Persistence Implementation Guide

## Overview

This guide explains how to implement localStorage data persistence across all admin modules. The storage utility is already created at `src/utils/storage.js`.

---

## ✅ Storage Utility Created

**File:** `src/utils/storage.js`

**Features:**
- Save/Load/Remove data
- Storage availability check
- Export/Import all data
- Download backup as JSON
- Initialize with default data
- Storage size monitoring

---

## 🔧 How to Use in Your Components

### 1. Import the Utility

```javascript
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';
```

### 2. Load Data on Component Mount

**Before (using mockData):**
```javascript
const [members, setMembers] = useState(mockMembers);
```

**After (with localStorage):**
```javascript
const [members, setMembers] = useState(
  loadFromStorage(STORAGE_KEYS.MEMBERS, mockMembers)
);
```

### 3. Save Data on Changes

**After creating/updating/deleting:**
```javascript
const handleCreate = (newMember) => {
  const updatedMembers = [...members, newMember];
  setMembers(updatedMembers);
  saveToStorage(STORAGE_KEYS.MEMBERS, updatedMembers);
};

const handleUpdate = (id, updatedMember) => {
  const updatedMembers = members.map(m => 
    m.id === id ? updatedMember : m
  );
  setMembers(updatedMembers);
  saveToStorage(STORAGE_KEYS.MEMBERS, updatedMembers);
};

const handleDelete = (id) => {
  const updatedMembers = members.filter(m => m.id !== id);
  setMembers(updatedMembers);
  saveToStorage(STORAGE_KEYS.MEMBERS, updatedMembers);
};
```

---

## 📋 Storage Keys Reference

```javascript
STORAGE_KEYS = {
  SITE_SETTINGS: 'grampanchayat_settings',
  MEMBERS: 'grampanchayat_members',
  STAFF: 'grampanchayat_staff',
  SERVICES: 'grampanchayat_services',
  SCHEMES: 'grampanchayat_schemes',
  NOTICES: 'grampanchayat_notices',
  PROGRAMS: 'grampanchayat_programs',
  FORMS: 'grampanchayat_forms'
}
```

---

## 🔄 Update Each Module

### MembersManagement.jsx

**Current:**
```javascript
const [members, setMembers] = useState(mockMembers);
```

**Update to:**
```javascript
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';

const [members, setMembers] = useState(
  loadFromStorage(STORAGE_KEYS.MEMBERS, mockMembers)
);

const handleDelete = (id) => {
  if (window.confirm('Are you sure?')) {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveToStorage(STORAGE_KEYS.MEMBERS, updated);
  }
};
```

### MemberForm.jsx

**In handleSubmit:**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;

  // Get current members from storage
  const currentMembers = loadFromStorage(STORAGE_KEYS.MEMBERS, mockMembers);
  
  const memberData = { /* ... */ };
  
  let updatedMembers;
  if (isEdit) {
    updatedMembers = currentMembers.map(m => 
      m.id === parseInt(id) ? memberData : m
    );
  } else {
    updatedMembers = [...currentMembers, memberData];
  }
  
  // Save to storage
  saveToStorage(STORAGE_KEYS.MEMBERS, updatedMembers);
  
  navigate('/admin/members');
};
```

---

## 🗂️ Modules to Update

### ✅ Apply localStorage to:

1. **MembersManagement.jsx** + **MemberForm.jsx**
   - Key: `STORAGE_KEYS.MEMBERS`

2. **ServicesManagement.jsx** + **ServiceForm.jsx**
   - Key: `STORAGE_KEYS.SERVICES`

3. **SchemesManagement.jsx** + **SchemeForm.jsx**
   - Key: `STORAGE_KEYS.SCHEMES`

4. **NoticesManagement.jsx** + **NoticeForm.jsx**
   - Key: `STORAGE_KEYS.NOTICES`

5. **GalleryManagement.jsx** + **GalleryForm.jsx**
   - Key: `STORAGE_KEYS.PROGRAMS`

6. **FormsManagement.jsx** + **FormUpload.jsx**
   - Key: `STORAGE_KEYS.FORMS`

7. **SiteSettings.jsx**
   - Key: `STORAGE_KEYS.SITE_SETTINGS`

---

## 💾 Initialize Storage

Add this to your `App.jsx` or `main.jsx`:

```javascript
import { initializeStorage, STORAGE_KEYS } from './utils/storage';
import { 
  mockSiteSettings, 
  mockMembers, 
  mockStaff,
  mockServices, 
  mockSchemes, 
  mockNotices, 
  mockPrograms, 
  mockForms 
} from './data/mockData';

// Initialize storage with default data on first load
useEffect(() => {
  initializeStorage({
    SITE_SETTINGS: mockSiteSettings,
    MEMBERS: mockMembers,
    STAFF: mockStaff,
    SERVICES: mockServices,
    SCHEMES: mockSchemes,
    NOTICES: mockNotices,
    PROGRAMS: mockPrograms,
    FORMS: mockForms
  });
}, []);
```

---

## 🎯 Example: Complete Update for MembersManagement

**Before:**
```javascript
import { useState } from 'react';
import { mockMembers } from '../../data/mockData';

function MembersManagement() {
  const [members, setMembers] = useState(mockMembers);
  
  const handleDelete = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };
  
  // ...
}
```

**After:**
```javascript
import { useState } from 'react';
import { mockMembers } from '../../data/mockData';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';

function MembersManagement() {
  const [members, setMembers] = useState(
    loadFromStorage(STORAGE_KEYS.MEMBERS, mockMembers)
  );
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      const updated = members.filter(m => m.id !== id);
      setMembers(updated);
      saveToStorage(STORAGE_KEYS.MEMBERS, updated);
    }
  };
  
  // ...
}
```

---

## 🔐 Bonus Features

### Export All Data
```javascript
import { downloadDataBackup } from '../../utils/storage';

// Add button in settings
<button onClick={downloadDataBackup}>
  Download Backup
</button>
```

### Check Storage Size
```javascript
import { getStorageSizeFormatted } from '../../utils/storage';

const size = getStorageSizeFormatted();
console.log('Storage used:', size);
```

### Import Data
```javascript
import { importAllData } from '../../utils/storage';

const handleImport = (jsonFile) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    importAllData(data);
    window.location.reload(); // Reload to show imported data
  };
  reader.readAsText(jsonFile);
};
```

---

## ⚡ Quick Start

### Step 1: Update One Module (Members)

1. Open `src/pages/admin/MembersManagement.jsx`
2. Add import: `import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';`
3. Change: `useState(mockMembers)` to `useState(loadFromStorage(STORAGE_KEYS.MEMBERS, mockMembers))`
4. In `handleDelete`, after `setMembers(updated)`, add: `saveToStorage(STORAGE_KEYS.MEMBERS, updated);`

### Step 2: Update MemberForm

1. Open `src/pages/admin/MemberForm.jsx`
2. Add the same import
3. In `handleSubmit`, load current data, update it, and save back

### Step 3: Repeat for Other Modules

Use the same pattern for all other modules.

---

## 🧪 Testing

1. **Add a member** → Check localStorage in browser DevTools
2. **Refresh page** → Member should still be there
3. **Delete member** → Should be removed from localStorage
4. **Edit member** → Changes should persist

**DevTools:** F12 → Application → Local Storage → http://localhost:5173

---

## ✨ Benefits

- ✅ Data persists across page refreshes
- ✅ No backend required for testing
- ✅ Easy to export/import data
- ✅ Works offline
- ✅ Simple backup/restore functionality

---

## 🚀 Production Note

For production, replace localStorage with:
- **REST API** (Node.js + Express + MongoDB/PostgreSQL)
- **Firebase** (Real-time Database or Firestore)
- **Supabase** (PostgreSQL with real-time)
- **AWS Amplify** (DynamoDB)

The same function structure works - just replace `saveToStorage` with API calls!

---

**File Created:** `src/utils/storage.js` ✅
**Status:** Ready to implement across all modules
**Next Step:** Start updating management components one by one
