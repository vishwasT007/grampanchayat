import React, { useState } from 'react';
import { testFirebaseConnection, migrateAllData, clearLocalStorage } from '../utils/migrateToFirebase';
import { createAdminUser } from '../services/authService';

const FirebaseSetup = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@grampanchayat.com');
  const [adminPassword, setAdminPassword] = useState('');

  const handleTestConnection = async () => {
    setLoading(true);
    setStatus('🔍 Testing Firebase connection...');
    
    try {
      const result = await testFirebaseConnection();
      if (result) {
        setStatus('✅ Firebase connected successfully! Check console for details.');
      } else {
        setStatus('❌ Connection failed. Check console for errors.');
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateData = async () => {
    if (!confirm('⚠️ This will migrate all localStorage data to Firebase. Continue?')) {
      return;
    }
    
    setLoading(true);
    setStatus('🔄 Migrating data to Firebase... Check console for progress.');
    
    try {
      const result = await migrateAllData();
      setStatus(`✅ Migration complete! Migrated ${JSON.stringify(result)} records. Check console for details.`);
    } catch (error) {
      setStatus(`❌ Migration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminEmail || !adminPassword) {
      setStatus('❌ Please enter email and password');
      return;
    }
    
    if (adminPassword.length < 6) {
      setStatus('❌ Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setStatus('👤 Creating admin user...');
    
    try {
      await createAdminUser(adminEmail, adminPassword, {
        name: 'Admin',
        role: 'admin'
      });
      setStatus(`✅ Admin user created successfully! Email: ${adminEmail}`);
      setAdminPassword('');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setStatus('❌ Email already in use. Admin user already exists.');
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearLocalStorage = () => {
    const result = clearLocalStorage();
    if (result) {
      setStatus('✅ localStorage cleared successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔥 Firebase Setup & Migration
          </h1>
          <p className="text-gray-600">
            Configure Firebase and migrate your data from localStorage
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <p className="text-sm font-mono whitespace-pre-wrap">{status}</p>
          </div>
        )}

        {/* Step 1: Test Connection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 1: Test Firebase Connection
          </h2>
          <p className="text-gray-600 mb-4">
            Verify that Firebase is configured correctly.
          </p>
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : '🔍 Test Connection'}
          </button>
        </div>

        {/* Step 2: Create Admin User */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 2: Create Admin User
          </h2>
          <p className="text-gray-600 mb-4">
            Create an admin account for Firebase Authentication.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="admin@grampanchayat.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password (min 6 characters)
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Enter secure password"
              />
            </div>
            
            <button
              onClick={handleCreateAdmin}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '👤 Create Admin User'}
            </button>
          </div>
        </div>

        {/* Step 3: Migrate Data */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 3: Migrate Data from localStorage
          </h2>
          <p className="text-gray-600 mb-4">
            Transfer all existing data from localStorage to Firebase Firestore.
          </p>
          <button
            onClick={handleMigrateData}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Migrating...' : '🔄 Migrate Data to Firebase'}
          </button>
        </div>

        {/* Step 4: Clear localStorage (Optional) */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 4: Clear localStorage (Optional)
          </h2>
          <p className="text-gray-600 mb-4">
            After verifying data in Firebase Console, you can clear localStorage.
          </p>
          <button
            onClick={handleClearLocalStorage}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🗑️ Clear localStorage
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-orange-100 to-green-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📋 Setup Instructions
          </h3>
          <ol className="space-y-2 text-gray-700">
            <li>1. Enable <b>Firestore Database</b> in Firebase Console (Test mode)</li>
            <li>2. Enable <b>Authentication</b> → Email/Password</li>
            <li>3. Enable <b>Storage</b> (Test mode)</li>
            <li>4. Click "Test Connection" above</li>
            <li>5. Create admin user with email and password</li>
            <li>6. Migrate your data (if you have existing data)</li>
            <li>7. Verify data in Firebase Console</li>
            <li>8. Deploy security rules from <code>firestore.rules</code> and <code>storage.rules</code></li>
          </ol>
          
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              🔗 Firebase Console: <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://console.firebase.google.com/</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
