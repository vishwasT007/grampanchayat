/**
 * Data Migration Utility - localStorage to Firebase
 * Run this script ONCE after Firebase setup to migrate existing data
 */

import { db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Migrate all localStorage data to Firebase
 */
export async function migrateAllData() {
  console.log('🔄 Starting data migration from localStorage to Firebase...');
  console.log('====================================================');
  
  const results = {
    villages: 0,
    demographics: 0,
    breakdowns: 0,
    groups: 0,
    infrastructure: 0,
    years: 0,
    news: 0,
    schemes: 0,
    achievements: 0,
    complaints: 0,
    errors: []
  };
  
  try {
    // Migrate Villages
    console.log('\n📍 Migrating Villages...');
    const villages = JSON.parse(localStorage.getItem('VILLAGES') || '[]');
    for (const village of villages) {
      try {
        await addDoc(collection(db, 'villages'), {
          ...village,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.villages++;
      } catch (error) {
        results.errors.push({ type: 'village', data: village, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.villages} villages`);
    
    // Migrate Demographics
    console.log('\n👥 Migrating Demographics...');
    const demographics = JSON.parse(localStorage.getItem('VILLAGE_DEMOGRAPHICS') || '[]');
    for (const demo of demographics) {
      try {
        await addDoc(collection(db, 'demographics'), {
          ...demo,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.demographics++;
      } catch (error) {
        results.errors.push({ type: 'demographics', data: demo, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.demographics} demographics records`);
    
    // Migrate Population Breakdowns
    console.log('\n📊 Migrating Population Breakdowns...');
    const breakdowns = JSON.parse(localStorage.getItem('VILLAGE_POPULATION_BREAKDOWNS') || '[]');
    for (const breakdown of breakdowns) {
      try {
        await addDoc(collection(db, 'populationBreakdowns'), {
          ...breakdown,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.breakdowns++;
      } catch (error) {
        results.errors.push({ type: 'breakdown', data: breakdown, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.breakdowns} population breakdowns`);
    
    // Migrate Village Groups
    console.log('\n👨‍👩‍👧‍👦 Migrating Village Groups...');
    const groups = JSON.parse(localStorage.getItem('VILLAGE_GROUPS') || '[]');
    for (const group of groups) {
      try {
        await addDoc(collection(db, 'villageGroups'), {
          ...group,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.groups++;
      } catch (error) {
        results.errors.push({ type: 'groups', data: group, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.groups} village groups`);
    
    // Migrate Infrastructure
    console.log('\n🏗️  Migrating Infrastructure...');
    const infrastructure = JSON.parse(localStorage.getItem('VILLAGE_INFRASTRUCTURE') || '[]');
    for (const infra of infrastructure) {
      try {
        await addDoc(collection(db, 'infrastructure'), {
          ...infra,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.infrastructure++;
      } catch (error) {
        results.errors.push({ type: 'infrastructure', data: infra, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.infrastructure} infrastructure records`);
    
    // Migrate Years
    console.log('\n📅 Migrating Years...');
    const years = JSON.parse(localStorage.getItem('STATISTICS_YEARS') || '[]');
    for (const year of years) {
      try {
        await addDoc(collection(db, 'statisticsYears'), {
          year: year,
          createdAt: serverTimestamp()
        });
        results.years++;
      } catch (error) {
        results.errors.push({ type: 'year', data: year, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.years} years`);
    
    // Migrate News
    console.log('\n📰 Migrating News...');
    const news = JSON.parse(localStorage.getItem('NEWS') || '[]');
    for (const item of news) {
      try {
        await addDoc(collection(db, 'news'), {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.news++;
      } catch (error) {
        results.errors.push({ type: 'news', data: item, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.news} news items`);
    
    // Migrate Schemes
    console.log('\n📋 Migrating Schemes...');
    const schemes = JSON.parse(localStorage.getItem('SCHEMES') || '[]');
    for (const scheme of schemes) {
      try {
        await addDoc(collection(db, 'schemes'), {
          ...scheme,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.schemes++;
      } catch (error) {
        results.errors.push({ type: 'scheme', data: scheme, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.schemes} schemes`);
    
    // Migrate Achievements
    console.log('\n🏆 Migrating Achievements...');
    const achievements = JSON.parse(localStorage.getItem('ACHIEVEMENTS') || '[]');
    for (const achievement of achievements) {
      try {
        await addDoc(collection(db, 'achievements'), {
          ...achievement,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.achievements++;
      } catch (error) {
        results.errors.push({ type: 'achievement', data: achievement, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.achievements} achievements`);
    
    // Migrate Complaints
    console.log('\n📝 Migrating Complaints...');
    const complaints = JSON.parse(localStorage.getItem('COMPLAINTS') || '[]');
    for (const complaint of complaints) {
      try {
        await addDoc(collection(db, 'complaints'), {
          ...complaint,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.complaints++;
      } catch (error) {
        results.errors.push({ type: 'complaint', data: complaint, error: error.message });
      }
    }
    console.log(`✅ Migrated ${results.complaints} complaints`);
    
    // Summary
    console.log('\n====================================================');
    console.log('📊 MIGRATION SUMMARY:');
    console.log('====================================================');
    console.log(`Villages:            ${results.villages}`);
    console.log(`Demographics:        ${results.demographics}`);
    console.log(`Breakdowns:          ${results.breakdowns}`);
    console.log(`Groups:              ${results.groups}`);
    console.log(`Infrastructure:      ${results.infrastructure}`);
    console.log(`Years:               ${results.years}`);
    console.log(`News:                ${results.news}`);
    console.log(`Schemes:             ${results.schemes}`);
    console.log(`Achievements:        ${results.achievements}`);
    console.log(`Complaints:          ${results.complaints}`);
    console.log('====================================================');
    console.log(`Total migrated:      ${Object.values(results).reduce((a, b) => typeof b === 'number' ? a + b : a, 0)}`);
    console.log(`Errors:              ${results.errors.length}`);
    console.log('====================================================');
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      results.errors.forEach((err, i) => {
        console.log(`${i + 1}. ${err.type}:`, err.error);
      });
    }
    
    console.log('\n🎉 Migration complete!');
    console.log('⚠️  IMPORTANT: After verifying data in Firebase Console,');
    console.log('    you can safely clear localStorage.');
    
    return results;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Clear localStorage (run AFTER verifying Firebase data)
 */
export function clearLocalStorage() {
  if (confirm('⚠️ WARNING: This will clear all localStorage data. Have you verified data in Firebase? This cannot be undone!')) {
    localStorage.removeItem('VILLAGES');
    localStorage.removeItem('VILLAGE_DEMOGRAPHICS');
    localStorage.removeItem('VILLAGE_POPULATION_BREAKDOWNS');
    localStorage.removeItem('VILLAGE_GROUPS');
    localStorage.removeItem('VILLAGE_INFRASTRUCTURE');
    localStorage.removeItem('STATISTICS_YEARS');
    localStorage.removeItem('NEWS');
    localStorage.removeItem('SCHEMES');
    localStorage.removeItem('ACHIEVEMENTS');
    localStorage.removeItem('COMPLAINTS');
    localStorage.removeItem('ADMIN_USER');
    localStorage.removeItem('SITE_SETTINGS');
    
    console.log('✅ localStorage cleared');
    return true;
  }
  return false;
}

/**
 * Test Firebase connection
 */
export async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Try to add a test document
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: serverTimestamp()
    });
    
    console.log('✅ Firebase connected successfully!');
    console.log('   Test document ID:', testDoc.id);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.error('   Check your .env file and Firebase configuration');
    return false;
  }
}
