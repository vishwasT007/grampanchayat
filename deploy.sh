#!/bin/bash

# Gram Panchayat - Quick Deployment Script
# This script helps deploy your Firebase-integrated website to Vercel

echo "🚀 Gram Panchayat Deployment Helper"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "✅ Project directory confirmed"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Make sure to add environment variables in Vercel Dashboard."
    echo ""
else
    echo "✅ .env file found (local development)"
    echo ""
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized!"
    echo "Please initialize git first: git init"
    exit 1
fi

echo "✅ Git repository confirmed"
echo ""

# Show current git status
echo "📊 Current Git Status:"
echo "--------------------"
git status --short
echo ""

# Ask if user wants to proceed
read -p "Do you want to test build locally first? (recommended) [y/N]: " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Building project locally..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed! Please fix errors before deploying."
        exit 1
    fi
    
    echo "✅ Build successful!"
    echo ""
    
    read -p "Do you want to preview the build? [y/N]: " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌐 Starting preview server..."
        echo "Press Ctrl+C to stop when done testing"
        npm run preview
    fi
fi

echo ""
echo "📦 Deployment Options:"
echo "--------------------"
echo "1. Deploy via Git Push (Auto-deploy)"
echo "2. Deploy via Vercel CLI"
echo "3. Show environment variables to add to Vercel"
echo "4. Exit"
echo ""

read -p "Choose option [1-4]: " -n 1 -r
echo ""

case $REPLY in
    1)
        echo "🔄 Preparing Git commit and push..."
        echo ""
        
        # Stage all changes
        git add .
        
        # Ask for commit message
        echo "Enter commit message (or press Enter for default):"
        read commit_message
        
        if [ -z "$commit_message" ]; then
            commit_message="feat: Deploy Firebase migration updates for Services, Members, Schemes, Grievances"
        fi
        
        # Commit
        git commit -m "$commit_message"
        
        if [ $? -ne 0 ]; then
            echo "⚠️  Nothing to commit or commit failed"
            echo "Changes may already be committed"
        fi
        
        echo ""
        echo "🚀 Pushing to GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully pushed to GitHub!"
            echo "📡 Vercel will auto-deploy in a few moments..."
            echo "Check your Vercel dashboard for deployment status"
        else
            echo "❌ Push failed! Check your git remote configuration."
            echo "Run: git remote -v"
        fi
        ;;
        
    2)
        echo "🚀 Deploying with Vercel CLI..."
        echo ""
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "⚠️  Vercel CLI not found!"
            read -p "Install Vercel CLI globally? [y/N]: " -n 1 -r
            echo ""
            
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                npm install -g vercel
            else
                echo "Please install Vercel CLI: npm install -g vercel"
                exit 1
            fi
        fi
        
        echo "Deploying to production..."
        vercel --prod
        ;;
        
    3)
        echo "🔐 Environment Variables for Vercel Dashboard:"
        echo "=============================================="
        echo ""
        echo "Go to: Vercel Dashboard → Your Project → Settings → Environment Variables"
        echo ""
        echo "Add these variables:"
        echo ""
        
        if [ -f ".env" ]; then
            cat .env | grep "^VITE_" | while read line; do
                key=$(echo $line | cut -d'=' -f1)
                value=$(echo $line | cut -d'=' -f2-)
                echo "Name:  $key"
                echo "Value: $value"
                echo ""
            done
        else
            echo "VITE_FIREBASE_API_KEY=AIzaSyDZg8nBI53IfImn8-jTUGOVs6G4XeGJh1M"
            echo "VITE_FIREBASE_AUTH_DOMAIN=grampanchayat-f0aa7.firebaseapp.com"
            echo "VITE_FIREBASE_PROJECT_ID=grampanchayat-f0aa7"
            echo "VITE_FIREBASE_STORAGE_BUCKET=grampanchayat-f0aa7.firebasestorage.app"
            echo "VITE_FIREBASE_MESSAGING_SENDER_ID=394538115264"
            echo "VITE_FIREBASE_APP_ID=1:394538115264:web:9ecd75d9b17c5d34774d25"
            echo ""
        fi
        
        echo "Remember to select: Production, Preview, and Development"
        echo ""
        ;;
        
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process initiated!"
echo ""
echo "📋 Next Steps:"
echo "1. Check Vercel Dashboard for deployment status"
echo "2. Verify environment variables are set in Vercel"
echo "3. Test your deployed site"
echo "4. Check Firebase Console for data"
echo ""
echo "📚 For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
