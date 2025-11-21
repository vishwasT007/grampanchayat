#!/bin/bash

# Firebase Migration Setup Script
# This script will help you set up Firebase for your Gram Panchayat project

echo "🔥 Firebase Migration Setup"
echo "=========================="
echo ""

# Step 1: Install Firebase
echo "📦 Step 1: Installing Firebase..."
npm install firebase
echo "✅ Firebase installed"
echo ""

# Step 2: Check for .env file
echo "🔐 Step 2: Setting up environment variables..."
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "📋 Copying .env.example to .env..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your Firebase credentials"
    echo "   Get credentials from: https://console.firebase.google.com/"
else
    echo "✅ .env file already exists"
fi
echo ""

# Step 3: Instructions
echo "📚 Next Steps:"
echo "=============="
echo ""
echo "1. 🌐 Go to https://console.firebase.google.com/"
echo "2. ➕ Create a new Firebase project"
echo "3. ⚙️  Add a Web app to your project"
echo "4. 📋 Copy the Firebase configuration"
echo "5. ✏️  Edit .env file and paste your config"
echo "6. 🔥 Enable Firestore Database (Test mode)"
echo "7. 🔐 Enable Authentication (Email/Password)"
echo "8. 📁 Enable Storage"
echo "9. ▶️  Run: npm run dev"
echo ""
echo "📖 For detailed guide, read FIREBASE_MIGRATION_GUIDE.md"
echo ""
echo "✅ Setup complete! Edit .env file with your Firebase credentials."
