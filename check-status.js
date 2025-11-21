/**
 * Quick Status Check - Run this in browser console
 * This will tell you if Firebase is actually being used or not
 */

console.log('🔍 Checking Firebase Migration Status...\n');

// Check 1: Is Firebase initialized?
try {
  const { db, auth, storage } = await import('./src/config/firebaseConfig');
  console.log('✅ Firebase SDK: Initialized');
  console.log('   - Firestore:', db ? 'Connected' : 'Not connected');
  console.log('   - Auth:', auth ? 'Connected' : 'Not connected');
  console.log('   - Storage:', storage ? 'Connected' : 'Not connected');
} catch (error) {
  console.log('❌ Firebase SDK: Not initialized', error.message);
}

// Check 2: Do you have data in localStorage?
console.log('\n📦 localStorage Data:');
const localStorageKeys = [
  'VILLAGES',
  'VILLAGE_DEMOGRAPHICS',
  'VILLAGE_POPULATION_BREAKDOWNS',
  'VILLAGE_GROUPS',
  'VILLAGE_INFRASTRUCTURE',
  'STATISTICS_YEARS',
  'NEWS',
  'SCHEMES',
  'ADMIN_USER'
];

let hasLocalData = false;
localStorageKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data && data !== '[]') {
    const parsed = JSON.parse(data);
    const count = Array.isArray(parsed) ? parsed.length : 'exists';
    console.log(`   ${key}: ${count} items`);
    hasLocalData = true;
  }
});

if (!hasLocalData) {
  console.log('   ❌ No data in localStorage');
}

// Check 3: Are components using Firebase?
console.log('\n🔧 Components Status:');
console.log('   ⚠️  Components are STILL using localStorage');
console.log('   ⚠️  Migration to Firebase services: NOT DONE');

// Summary
console.log('\n📊 SUMMARY:');
console.log('════════════════════════════════════════');
console.log('Infrastructure Setup: ✅ COMPLETE');
console.log('Firebase Services Enabled: ❓ CHECK FIREBASE CONSOLE');
console.log('Data Migrated to Firebase: ❓ CHECK BELOW');
console.log('Components Using Firebase: ❌ NOT YET');
console.log('════════════════════════════════════════');

// Check 4: Test Firebase connection
console.log('\n🔥 Testing Firebase Connection...');
try {
  const { testFirebaseConnection } = await import('./src/utils/migrateToFirebase');
  const isConnected = await testFirebaseConnection();
  if (isConnected) {
    console.log('✅ Firebase is connected and working!');
  } else {
    console.log('❌ Firebase connection failed - check Firebase Console');
  }
} catch (error) {
  console.log('❌ Firebase test failed:', error.message);
}

console.log('\n🎯 NEXT STEPS:');
console.log('1. Visit http://localhost:5173/firebase-setup');
console.log('2. Click "Test Connection"');
console.log('3. Click "Create Admin User"');
console.log('4. Click "Migrate Data"');
console.log('5. Update components to use Firebase services');
