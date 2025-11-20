# Deployment Guide - Gram Panchayat Website

## 🚀 Deploy to Vercel (Recommended - FREE)

### Prerequisites
- GitHub account with your code pushed
- Vercel account (sign up with GitHub at https://vercel.com)

### Step-by-Step Deployment

#### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find "vishwasT007/grampanchayat" and click "Import"

3. **Configure Project**
   - Project Name: `grampanchayat` (or your choice)
   - Framework Preset: Vite (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)
   - Install Command: `npm install` (auto-filled)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://grampanchayat-<random>.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain if you have one

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your GitHub repository
   - Confirm settings

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### 🔄 Automatic Deployments

Once connected:
- **Every push to `main` branch** → Automatic production deployment
- **Every pull request** → Preview deployment with unique URL
- No manual deployment needed after initial setup!

---

## 🌐 Alternative Hosting Options

### 2. Netlify (FREE)

1. **Go to Netlify**
   - Visit https://www.netlify.com
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select "vishwasT007/grampanchayat"

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

### 3. GitHub Pages (FREE)

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add these scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js**
   Add base path:
   ```javascript
   export default defineConfig({
     base: '/grampanchayat/',
     plugins: [react()],
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch → `gh-pages` → `/root`
   - Your site: `https://vishwasT007.github.io/grampanchayat/`

---

## 📝 Post-Deployment Checklist

✅ **Test your deployed site:**
- [ ] Home page loads correctly
- [ ] All 12 public pages work
- [ ] Language switcher (English/Marathi) works
- [ ] Admin login works (default: admin/admin123)
- [ ] All 10 admin modules accessible
- [ ] Auto-translation works in forms
- [ ] Images load correctly
- [ ] Forms save data to localStorage
- [ ] Mobile responsive design works

✅ **Important Notes:**
- localStorage works on deployed site (data persists in browser)
- Each user's browser has separate data
- For shared data across users, you'll need a backend (future enhancement)
- Admin credentials are hardcoded in AuthContext.jsx

✅ **Security Recommendations:**
- Change default admin password in production
- Consider adding environment variables for sensitive data
- Add backend API for real database storage (future)

---

## 🛠️ Troubleshooting

### Build Fails
- Check Node.js version (use v18 or v20)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Test local build: `npm run build && npm run preview`

### Routes Not Working (404 on refresh)
- Ensure `vercel.json` has rewrite rules (already configured)
- For Netlify, create `_redirects` file in `public/` folder:
  ```
  /*    /index.html   200
  ```

### Images Not Loading
- Check image paths (should be relative)
- Ensure images are in `public/` folder or imported in code

---

## 🎉 Your Site is Live!

Share your Gram Panchayat website with:
- Village residents
- Government officials
- Stakeholders
- Public for transparency

**Next Steps:**
- Add SSL certificate (auto on Vercel/Netlify)
- Set up custom domain
- Monitor analytics
- Gather user feedback
- Plan backend integration for shared data

---

## 📧 Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Deployment: https://vite.dev/guide/static-deploy.html

Good luck with your deployment! 🚀
