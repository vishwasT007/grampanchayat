# 🚀 Ready to Deploy - Quick Checklist

## ✅ Pre-Deployment Verification

### 1. Code Changes Ready
- ✅ 4 new Firebase services created (services, members, schemes, grievances)
- ✅ 8 UI components updated with Firebase integration
- ✅ Firestore rules updated
- ✅ All files compile without errors

### 2. Local Testing
- [ ] Run `npm run dev` and test locally
- [ ] Login as admin works
- [ ] All 4 modules (Services, Members, Schemes, Grievances) work
- [ ] Data persists after page refresh
- [ ] No console errors

### 3. Build Test
- [ ] Run `npm run build` successfully
- [ ] Run `npm run preview` and test build

---

## 🔧 Vercel Environment Variables (IMPORTANT!)

You **MUST** add these to Vercel Dashboard **BEFORE** deployment works properly:

### How to Add:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below

### Variables to Add:

```
Name: VITE_FIREBASE_API_KEY
Value: AIzaSyDZg8nBI53IfImn8-jTUGOVs6G4XeGJh1M
Environments: ✅ Production ✅ Preview ✅ Development

Name: VITE_FIREBASE_AUTH_DOMAIN
Value: grampanchayat-f0aa7.firebaseapp.com
Environments: ✅ Production ✅ Preview ✅ Development

Name: VITE_FIREBASE_PROJECT_ID
Value: grampanchayat-f0aa7
Environments: ✅ Production ✅ Preview ✅ Development

Name: VITE_FIREBASE_STORAGE_BUCKET
Value: grampanchayat-f0aa7.firebasestorage.app
Environments: ✅ Production ✅ Preview ✅ Development

Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 394538115264
Environments: ✅ Production ✅ Preview ✅ Development

Name: VITE_FIREBASE_APP_ID
Value: 1:394538115264:web:9ecd75d9b17c5d34774d25
Environments: ✅ Production ✅ Preview ✅ Development
```

⚠️ **Without these, your Firebase connection will fail in production!**

---

## 🚀 Deployment Methods

### Method 1: Auto-Deploy via Git (Easiest)

```bash
# Use the deployment script
./deploy.sh

# OR manually:
git add .
git commit -m "feat: Complete Firebase migration for 4 modules"
git push origin main
```

Vercel will automatically build and deploy!

### Method 2: Vercel CLI

```bash
# Install Vercel CLI (if needed)
npm install -g vercel

# Deploy to production
vercel --prod
```

### Method 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments"
4. Click "Redeploy" on latest deployment

---

## 🔐 Firebase Configuration

### Add Vercel Domain to Firebase

1. Go to https://console.firebase.google.com/
2. Select project: `grampanchayat-f0aa7`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click "Add domain"
5. Add your Vercel domain: `your-project.vercel.app`

---

## ✅ Post-Deployment Testing

After deployment, test these URLs:

### Your Deployed Site:
```
https://your-project.vercel.app/
```

### Test Checklist:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Admin login (`/admin/login`)
- [ ] Services page (`/admin/services`)
  - [ ] List loads from Firebase
  - [ ] Create new service
  - [ ] Edit service
  - [ ] Delete service
- [ ] Members page (`/admin/members`)
  - [ ] List loads with photos
  - [ ] Create member with photo upload
  - [ ] Edit member
  - [ ] Delete member
- [ ] Schemes page (`/admin/schemes`)
  - [ ] List loads
  - [ ] Create scheme
  - [ ] Edit scheme
  - [ ] Delete scheme
- [ ] Grievances page (`/admin/grievances`)
  - [ ] List loads
  - [ ] Create grievance
  - [ ] Update status
  - [ ] Delete grievance
- [ ] Language toggle works (English/Marathi)
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### Issue 1: "Firebase not defined"
**Fix**: Add environment variables in Vercel Dashboard (see above)

### Issue 2: "Permission denied"
**Fix**: Ensure Firestore rules are deployed:
```bash
firebase deploy --only firestore:rules
```

### Issue 3: "Auth domain not authorized"
**Fix**: Add Vercel domain to Firebase authorized domains

### Issue 4: Build fails
**Fix**: Test build locally first:
```bash
npm run build
```

---

## 📊 Monitor Deployment

### Vercel Dashboard:
- https://vercel.com/dashboard → Your Project
- Check "Deployments" for status
- Check "Build Logs" for errors

### Firebase Console:
- https://console.firebase.google.com/
- Check Firestore for data
- Check Storage for uploaded photos
- Check Authentication for users

---

## 🎯 Quick Commands

```bash
# Test locally
npm run dev

# Build locally
npm run build

# Preview build
npm run preview

# Deploy (auto-deploy via git)
./deploy.sh

# Or manually
git add .
git commit -m "Your message"
git push origin main

# Check deployment logs
vercel logs
```

---

## ✅ Deployment Complete!

Once deployed and tested, you're done! 🎉

**Your Firebase-powered Gram Panchayat website is live!**

---

**Last Updated**: November 21, 2025
**Status**: Ready to Deploy
**Next Action**: Run `./deploy.sh` or push to git
