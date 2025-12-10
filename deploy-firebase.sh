#!/bin/bash

# Firebase Hosting Deployment Script
# Gram Panchayat Warghat - grampanchayatwarghat.in

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Firebase Hosting Deployment Script   ║${NC}"
echo -e "${BLUE}║  Gram Panchayat Warghat               ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo -e "${YELLOW}Please run this script from the project root directory.${NC}"
    exit 1
fi

if [ ! -f "firebase.json" ]; then
    echo -e "${RED}❌ Error: firebase.json not found!${NC}"
    echo -e "${YELLOW}Please ensure Firebase is configured for this project.${NC}"
    exit 1
fi

# Step 1: Check Firebase CLI
echo -e "${BLUE}[1/5] Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found!${NC}"
    echo -e "${YELLOW}Install with: npm install -g firebase-tools${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Firebase CLI installed${NC}"
echo ""

# Step 2: Check Firebase login
echo -e "${BLUE}[2/5] Checking Firebase authentication...${NC}"
firebase login:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Not logged in to Firebase${NC}"
    echo -e "${YELLOW}Running: firebase login${NC}"
    firebase login
else
    echo -e "${GREEN}✓ Logged in to Firebase${NC}"
fi
echo ""

# Step 3: Install dependencies (if needed)
echo -e "${BLUE}[3/5] Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ node_modules not found, installing dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi
echo ""

# Step 4: Build project
echo -e "${BLUE}[4/5] Building production build...${NC}"
echo -e "${YELLOW}Running: npm run build${NC}"
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ dist directory not found after build!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Build successful!${NC}"
echo -e "${GREEN}  Files ready in ./dist${NC}"
echo ""

# Step 5: Deploy to Firebase
echo -e "${BLUE}[5/5] Deploying to Firebase Hosting...${NC}"
echo -e "${YELLOW}Running: firebase deploy --only hosting${NC}"
echo ""

firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    Deployment Successful! 🎉          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Your site is now live at:${NC}"
echo -e "${BLUE}→ https://grampanchayat-f0aa7.web.app${NC}"
echo -e "${BLUE}→ https://grampanchayat-f0aa7.firebaseapp.com${NC}"
echo ""
echo -e "${YELLOW}Next steps for custom domain:${NC}"
echo -e "1. Open Firebase Console: ${BLUE}firebase open hosting${NC}"
echo -e "2. Click 'Add custom domain'"
echo -e "3. Enter: ${BLUE}grampanchayatwarghat.in${NC}"
echo -e "4. Follow DNS configuration instructions"
echo ""
echo -e "${GREEN}For detailed instructions, see:${NC}"
echo -e "${BLUE}→ FIREBASE_HOSTING_GUIDE.md${NC}"
echo ""
