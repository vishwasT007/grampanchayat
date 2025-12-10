# Custom Domain Setup Guide
# Deploy grampanchayatwarghat.in to Vercel

## Project Overview
- **Project Name:** Gram Panchayat Warghat
- **Framework:** React + Vite
- **Deployment Platform:** Vercel
- **Custom Domain:** grampanchayatwarghat.in
- **Firebase Project:** grampanchayat-f0aa7

## Current Status
✅ Project deployed to Vercel (default .vercel.app domain)
✅ vercel.json configured correctly
✅ Build command: `npm run build`
✅ Output directory: `dist`

---

## Step-by-Step: Add Custom Domain

### 1. Access Vercel Dashboard

1. Go to https://vercel.com and log in
2. Select your **grampanchayat** project
3. Click **Settings** → **Domains**

### 2. Add Custom Domain in Vercel

Add both root and www domains:

```
grampanchayatwarghat.in
www.grampanchayatwarghat.in
```

### 3. Configure DNS Records

#### Option A: Use Vercel Nameservers (Recommended)

**Best for:** Simplicity and automatic SSL certificate management

1. Go to your domain registrar where you purchased `grampanchayatwarghat.in`
2. Navigate to Domain Management or DNS Settings
3. Find **Nameservers** section
4. Change nameservers to:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
5. Save changes
6. Wait 24-48 hours for DNS propagation (usually 1-2 hours)

#### Option B: Manual DNS Records

**If you want to keep your current nameservers:**

##### For Root Domain (`grampanchayatwarghat.in`):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |

##### For WWW Subdomain (`www.grampanchayatwarghat.in`):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | cname.vercel-dns.com | 3600 |

---

## Domain Registrar-Specific Guides

### GoDaddy
1. Log in to GoDaddy account
2. Go to **My Products** → **Domains**
3. Click **DNS** next to your domain
4. For Nameservers: Click **Change** → **Custom** → Enter Vercel nameservers
5. For Manual DNS: Click **Add** → Select record type → Enter values

### Namecheap
1. Log in to Namecheap account
2. Go to **Domain List** → Click **Manage** next to your domain
3. For Nameservers: **Nameservers** section → **Custom DNS** → Enter Vercel nameservers
4. For Manual DNS: **Advanced DNS** tab → Add new records

### Google Domains
1. Log in to Google Domains
2. Select your domain
3. Click **DNS** in the left menu
4. For Nameservers: **Custom name servers** → Enter Vercel nameservers
5. For Manual DNS: **Custom resource records** → Add records

### Cloudflare
1. Log in to Cloudflare dashboard
2. Select your domain
3. Go to **DNS** → **Records**
4. Add the A and CNAME records shown above
5. Ensure **Proxy status** is set to **DNS only** (gray cloud, not orange)

### Hostinger
1. Log in to Hostinger control panel
2. Go to **Domains** → Select your domain
3. Click **DNS / Nameservers**
4. For Nameservers: **Change nameservers** → Enter Vercel nameservers
5. For Manual DNS: Add A and CNAME records

---

## Verification Steps

### Check DNS Propagation

Use these tools to check if DNS is propagated:
- https://www.whatsmydns.net/
- https://dnschecker.org/

Enter your domain and check if:
- A record points to `76.76.21.21`
- CNAME record for `www` points to `cname.vercel-dns.com`

### Test Your Domain

1. Wait for DNS propagation (can take 1-48 hours)
2. Visit `https://grampanchayatwarghat.in` in your browser
3. Visit `https://www.grampanchayatwarghat.in` in your browser
4. Both should load your Gram Panchayat website

### SSL Certificate

Vercel automatically provisions SSL certificates (HTTPS) for your custom domain:
- Certificate is issued via Let's Encrypt
- Automatically renews before expiration
- No manual configuration needed
- Usually takes 1-2 minutes after DNS is configured

---

## Troubleshooting

### Domain Shows "Domain Not Found"
- **Cause:** DNS not propagated yet
- **Solution:** Wait 1-48 hours, check DNS propagation tools

### SSL Certificate Error
- **Cause:** DNS records incorrect or not propagated
- **Solution:** 
  1. Verify DNS records are correct
  2. Wait for DNS to propagate
  3. Click "Refresh" in Vercel Domains settings

### "Invalid Configuration" in Vercel
- **Cause:** DNS CNAME conflicts with other records
- **Solution:** Remove any conflicting A records for `www` subdomain

### Domain Shows Default Vercel Page
- **Cause:** Domain added but not assigned to this project
- **Solution:** Go to Vercel → Settings → Domains → Ensure domain is listed

### Mixed Content Warning (HTTP/HTTPS)
- **Cause:** Some resources loading over HTTP
- **Solution:** Ensure all resources in your app use HTTPS or relative URLs

---

## Best Practices

### 1. Set Primary Domain
In Vercel Domains settings, set which domain should be primary:
- Redirect `www` → `non-www` (recommended for SEO)
- Or redirect `non-www` → `www`

### 2. Enable HSTS (HTTP Strict Transport Security)
Automatically enabled by Vercel for enhanced security

### 3. Test on Multiple Devices
After deployment, test on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- Different network connections

### 4. Update Firebase Configuration
If you have Firebase hosting or specific domain restrictions:
1. Go to Firebase Console → Project Settings
2. Add `grampanchayatwarghat.in` to **Authorized domains**
3. Update any CORS settings if needed

### 5. Google Search Console
After domain is live:
1. Add both versions to Google Search Console
2. Submit sitemap: `https://grampanchayatwarghat.in/sitemap.xml`
3. Request indexing for main pages

---

## Domain Configuration Checklist

- [ ] Purchase domain `grampanchayatwarghat.in`
- [ ] Add domain in Vercel Dashboard
- [ ] Add `www.grampanchayatwarghat.in` in Vercel Dashboard
- [ ] Configure nameservers OR add DNS records
- [ ] Wait for DNS propagation (check with online tools)
- [ ] Verify HTTPS certificate is issued
- [ ] Test domain loads correctly
- [ ] Test www subdomain loads correctly
- [ ] Set primary domain (redirect preference)
- [ ] Update Firebase authorized domains
- [ ] Test on mobile devices
- [ ] Add to Google Search Console
- [ ] Update any hardcoded URLs in your app
- [ ] Share new domain with users!

---

## Quick Reference

### Vercel DNS Values
```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com

A Record: 76.76.21.21
CNAME: cname.vercel-dns.com
```

### Vercel Project URL
Your Vercel project dashboard:
```
https://vercel.com/[your-username]/grampanchayat
```

### Domain Registrar Login
Keep your domain registrar credentials handy:
- Website: [Your registrar website]
- Email: [Your registered email]
- Account: [Your account ID]

---

## Support Resources

### Vercel Support
- Documentation: https://vercel.com/docs/concepts/projects/domains
- Support: https://vercel.com/support

### DNS Propagation Check
- https://www.whatsmydns.net/
- https://dnschecker.org/

### SSL Certificate Check
- https://www.ssllabs.com/ssltest/

---

## Expected Timeline

| Step | Time |
|------|------|
| Add domain in Vercel | Instant |
| Update DNS records | 5 minutes |
| DNS propagation starts | Immediate |
| DNS fully propagated | 1-48 hours (usually 1-4 hours) |
| SSL certificate issued | 1-5 minutes after DNS propagates |
| Domain fully live | 1-48 hours total |

---

## Success Indicators

You'll know the setup is successful when:

1. ✅ Visiting `grampanchayatwarghat.in` loads your website
2. ✅ Visiting `www.grampanchayatwarghat.in` loads your website
3. ✅ Browser shows padlock icon (HTTPS/SSL working)
4. ✅ No security warnings in browser
5. ✅ DNS checker tools show correct records
6. ✅ Vercel dashboard shows green checkmarks for domain

---

## Post-Deployment Tasks

### 1. Update Social Media Links
- Facebook
- Instagram
- Twitter
- WhatsApp Business

### 2. Update Printed Materials
- Business cards
- Letterheads
- Notice boards
- Official documents

### 3. Inform Stakeholders
- Village residents
- Government officials
- Partner organizations
- Staff members

### 4. Analytics Setup
If using Google Analytics:
```javascript
// Update GA tracking code with new domain
gtag('config', 'YOUR-GA-ID', {
  'page_title': 'Gram Panchayat Warghat',
  'page_location': 'https://grampanchayatwarghat.in'
});
```

### 5. SEO Updates
- Update meta tags with new domain
- Update Open Graph tags for social sharing
- Update sitemap.xml
- Submit to search engines

---

## Need Help?

If you encounter issues:

1. **Check Vercel Dashboard:** Look for error messages
2. **Check DNS Propagation:** Use online tools to verify
3. **Vercel Support:** Open a support ticket
4. **Community:** Vercel Discord or GitHub Discussions
5. **Domain Registrar:** Contact their support for DNS issues

---

**Last Updated:** December 8, 2025
**Project:** Gram Panchayat Warghat
**Domain:** grampanchayatwarghat.in
**Status:** Ready for custom domain setup
