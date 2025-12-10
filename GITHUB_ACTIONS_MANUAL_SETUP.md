# 🚀 GitHub Actions Setup - Manual Steps Required

## ⚠️ Important: Your GitHub Token Needs Update

Your current GitHub token doesn't have permission to create workflows.

## 📋 Quick Setup (3 Steps)

### Step 1: Update Your GitHub Token

1. Go to: **https://github.com/settings/tokens**
2. Click on your existing token OR click **"Generate new token (classic)"**
3. **Important**: Check these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows) ← **This is needed!**
4. Click **"Generate token"** or **"Update token"**
5. **Copy the new token** (save it somewhere safe)

### Step 2: Push the Workflow File

The workflow file is already created locally at:
```
.github/workflows/firebase-deploy.yml
```

To push it manually using GitHub website:

**Option A: Push via Git (after updating token)**
```bash
git push origin main
```

**Option B: Upload via GitHub Website**
1. Go to: https://github.com/vishwasT007/grampanchayat
2. Click "Add file" → "Create new file"
3. In the name field, type: `.github/workflows/firebase-deploy.yml`
4. Copy and paste this content:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: grampanchayat-f0aa7
```

5. Click **"Commit new file"**

### Step 3: Add Firebase Token as GitHub Secret

1. **Get your Firebase token:**
   ```bash
   cat firebase-token.txt
   ```
   Copy the entire token.

2. **Go to GitHub Settings:**
   - https://github.com/vishwasT007/grampanchayat/settings/secrets/actions

3. **Click "New repository secret"**

4. **Add the secret:**
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: (paste the token from firebase-token.txt)
   - Click "Add secret"

---

## ✅ Test Auto-Deployment

After completing the steps above:

1. Make any small change to a file
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
3. Watch it deploy automatically! 🎉
4. Check: https://github.com/vishwasT007/grampanchayat/actions

---

## 📊 What Happens Next

Once set up, every time you push to GitHub:

```
git push origin main
       ↓
GitHub Actions triggers
       ↓
Builds your project
       ↓
Deploys to Firebase
       ↓
✅ Live at grampanchayatwarghat.in
```

**Time: ~2-3 minutes** (automatic, no manual steps!)

---

## 🆘 Alternative: Keep Manual Deployment

If you prefer to keep deploying manually (which works fine):

**Just use this command after every change:**
```bash
./deploy-firebase.sh
```

No GitHub Actions needed! Both approaches work.

---

## 📝 Your Firebase Token Location

Your Firebase CI token is saved in:
```
firebase-token.txt (local file, not on GitHub)
```

This file is in `.gitignore` so it won't be accidentally committed.

---

**Current Status**: 
- ✅ Workflow file created locally
- ✅ Firebase token generated
- ⏳ Needs: GitHub token with `workflow` scope to push
- ⏳ Needs: Firebase token added to GitHub Secrets

**Choose**: Auto-deployment (follow steps above) OR keep manual deployment (use ./deploy-firebase.sh)
