# Quick Start Guide - Testing Your Firebase-Integrated Modules

## 🚀 How to Test Each Module

### 1. Services Module

**Navigate to**: http://localhost:5173/admin/services

**Test Steps**:
1. Click "Add Service" button
2. Fill in:
   - Service Name (English & Marathi)
   - Category (Education, Health, Agriculture, etc.)
   - Description (English & Marathi)
   - Eligibility criteria
   - Required documents
   - Application process
3. Click "Save Service"
4. Verify it appears in the list
5. Click Edit icon ✏️ to modify
6. Click Delete icon 🗑️ to remove

**Expected Behavior**:
- Loading spinner appears while fetching services
- "Saving..." appears on button during save
- Data persists after page refresh
- Success navigation to list after save

---

### 2. Members Module

**Navigate to**: http://localhost:5173/admin/members

**Test Steps**:
1. Click "Add Member" button
2. Fill in:
   - Member Name (English & Marathi)
   - Position (English & Marathi)
   - Type (Sarpanch, Panchayat Samiti, Gram Sevak, etc.)
   - Phone, Email, Address
   - Upload photo
3. Click "Save Member"
4. Verify member appears with photo
5. Click Edit to change photo
6. Click Delete and verify photo is removed from storage

**Expected Behavior**:
- Photo preview before save
- Loading spinner while fetching members
- "Saving..." during upload
- Photo persists in Firebase Storage
- Photo auto-deleted when member deleted

---

### 3. Schemes Module

**Navigate to**: http://localhost:5173/admin/schemes

**Test Steps**:
1. Click "Add Scheme" button
2. Fill in:
   - Scheme Name (English & Marathi)
   - Category (Central, State, District)
   - Description (English & Marathi)
   - Eligibility criteria
   - Required documents (one per line)
   - Application process
   - Status (Active/Inactive)
3. Click "Save Scheme"
4. Verify scheme appears in list
5. Test category filter
6. Edit and delete schemes

**Expected Behavior**:
- Loading spinner during fetch
- "Saving..." during save
- Multi-line documents preserved
- Category badges display correctly
- Data persists after refresh

---

### 4. Grievances Module

**Navigate to**: http://localhost:5173/admin/grievances

**Test Steps**:
1. Click "Add Grievance" button
2. Fill in:
   - Title (English & Marathi)
   - Description (English & Marathi)
   - Category (Water, Road, Electricity, etc.)
   - Priority (High, Medium, Low)
   - Submitted By, Phone, Email, Address
   - Assigned To
   - Status (Pending, In Progress, Resolved)
   - Response (if resolved)
3. Click "Submit Grievance"
4. Verify grievance appears with correct status badge
5. Edit status from Pending → In Progress → Resolved
6. Filter by status, category, priority

**Expected Behavior**:
- Loading spinner during fetch
- "Saving..." during save
- Status badges colored correctly:
  - 🟡 Pending (yellow)
  - 🔵 In Progress (blue)
  - 🟢 Resolved (green)
- Resolved date auto-set when status = Resolved
- Stats cards update automatically

---

## 🔍 What to Look For

### ✅ Success Indicators:
- No console errors
- Loading spinners appear briefly
- Buttons show "Saving..." during operations
- Data appears immediately after save
- Page refresh shows same data (persistence!)
- Filters and search work correctly

### ❌ Potential Issues:
- **"Permission denied"**: Not logged in as admin
  - Solution: Login as warghatgrampanchayat@gmail.com
- **Infinite loading spinner**: Firebase rules not deployed
  - Solution: Run `firebase deploy --only firestore:rules`
- **Console errors**: Check Firebase config
  - Solution: Verify .env file has correct credentials
- **Photo not uploading**: Storage rules issue
  - Solution: Check Storage rules allow admin writes

---

## 🛠️ Troubleshooting

### Check Firebase Console:
1. Open https://console.firebase.google.com
2. Select `grampanchayat-f0aa7` project
3. Go to Firestore Database
4. Verify collections exist: `services`, `members`, `schemes`, `grievances`
5. Click into a collection to see documents

### Check Browser DevTools:
1. Press F12 to open DevTools
2. **Console tab**: Look for errors
3. **Network tab**: Check if Firebase requests succeed
4. **Application tab** → IndexedDB → firebaseLocalStorageDb

### Common Fixes:
```bash
# If data not loading
firebase deploy --only firestore:rules

# If permissions error
# Re-login in the app as admin

# If imports fail
npm install

# If compilation errors
npm run dev
```

---

## 📊 Verify Data in Firebase

### Services Collection:
```
services/
  {docId}/
    - name: { en: "...", mr: "..." }
    - category: "EDUCATION"
    - description: { en: "...", mr: "..." }
    - eligibility: { en: "...", mr: "..." }
    - documentsRequired: { en: [...], mr: [...] }
    - applicationProcess: { en: "...", mr: "..." }
    - status: "ACTIVE"
    - createdAt: timestamp
    - updatedAt: timestamp
```

### Members Collection:
```
members/
  {docId}/
    - name: { en: "...", mr: "..." }
    - position: { en: "...", mr: "..." }
    - type: "SARPANCH"
    - photo: "https://firebasestorage.../members/..."
    - phone: "+91..."
    - email: "..."
    - address: "..."
    - createdAt: timestamp
```

### Schemes Collection:
```
schemes/
  {docId}/
    - name: { en: "...", mr: "..." }
    - category: "CENTRAL"
    - description: { en: "...", mr: "..." }
    - eligibility: { en: "...", mr: "..." }
    - documentsRequired: { en: [...], mr: [...] }
    - applicationProcess: { en: "...", mr: "..." }
    - status: "ACTIVE"
    - createdAt: timestamp
```

### Grievances Collection:
```
grievances/
  {docId}/
    - title: { en: "...", mr: "..." }
    - description: { en: "...", mr: "..." }
    - category: "WATER"
    - status: "PENDING"
    - priority: "HIGH"
    - submittedBy: "..."
    - phone: "+91..."
    - email: "..."
    - address: "..."
    - submittedDate: "2024-11-21"
    - resolvedDate: null
    - assignedTo: "..."
    - response: { en: "...", mr: "..." }
    - createdAt: timestamp
```

---

## 🎉 Success Criteria

Your migration is 100% successful if:

- ✅ All 4 modules load data from Firestore
- ✅ Create new items successfully
- ✅ Edit existing items works
- ✅ Delete removes from Firestore
- ✅ Photos upload to Storage (Members)
- ✅ Data persists across page refreshes
- ✅ Loading states display during operations
- ✅ Error handling shows user-friendly messages
- ✅ No console errors in browser
- ✅ Firestore console shows all documents

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review FIREBASE_MIGRATION_COMPLETE.md
3. Check browser console for specific errors
4. Verify Firebase login status
5. Ensure Firestore rules are deployed

**Happy Testing! 🚀**
