# Visual Step-by-Step Guide
## Adding grampanchayatwarghat.in to Vercel

---

## 🖥️ PART 1: VERCEL DASHBOARD

### Step 1: Login to Vercel
```
URL: https://vercel.com
Click: "Login" or "Dashboard"
```

### Step 2: Select Your Project
```
You should see: "grampanchayat" project in your dashboard
Click: On the project card
```

### Step 3: Go to Settings
```
Top navigation: Overview | Analytics | Deployments | Settings
Click: "Settings" tab
```

### Step 4: Navigate to Domains
```
Left sidebar options:
- General
- Build & Development
- Environment Variables
→ Domains  ← (Click this)
- Git
- etc.
```

### Step 5: Add Domain
```
You'll see a section: "Add Domain"

Input field: [                    ] Add
Type: grampanchayatwarghat.in
Click: "Add" button

Vercel will show: "Configure DNS" instructions
```

### Step 6: Add WWW Subdomain
```
Add another domain:

Input field: [                    ] Add
Type: www.grampanchayatwarghat.in
Click: "Add" button
```

### Step 7: Note the DNS Instructions
```
Vercel will display something like:

┌─────────────────────────────────────────────────┐
│ Configure DNS                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ Option 1: Use Vercel Nameservers (Recommended)  │
│                                                  │
│ ns1.vercel-dns.com                              │
│ ns2.vercel-dns.com                              │
│                                                  │
│ Option 2: Add DNS Records                       │
│                                                  │
│ A Record                                         │
│ Host: @                                          │
│ Value: 76.76.21.21                              │
│                                                  │
│ CNAME Record                                     │
│ Host: www                                        │
│ Value: cname.vercel-dns.com                     │
└─────────────────────────────────────────────────┘
```

**Keep this page open - you'll need these values!**

---

## 🌐 PART 2: DOMAIN REGISTRAR (Examples)

### 📘 GoDaddy Instructions

#### Step 1: Login
```
URL: https://www.godaddy.com
Login with your credentials
```

#### Step 2: Navigate to Domains
```
Top menu: Click "My Products"
Find: "Domains" section
Click: "DNS" button next to grampanchayatwarghat.in
```

#### Step 3A: Change Nameservers (Recommended)
```
Scroll to: "Nameservers" section
Click: "Change" button
Select: "Enter my own nameservers (advanced)"

Nameserver 1: [ns1.vercel-dns.com        ]
Nameserver 2: [ns2.vercel-dns.com        ]

Click: "Save"
```

#### Step 3B: OR Add DNS Records Manually
```
In DNS Records section:
Click: "Add" button

Record 1 (A Record):
┌──────────────────────────────────┐
│ Type:     [A              ▼]     │
│ Name:     [@              ]      │
│ Value:    [76.76.21.21    ]      │
│ TTL:      [1 Hour         ▼]     │
└──────────────────────────────────┘
Click: "Save"

Record 2 (CNAME):
┌──────────────────────────────────┐
│ Type:     [CNAME          ▼]     │
│ Name:     [www            ]      │
│ Value:    [cname.vercel-dns.com] │
│ TTL:      [1 Hour         ▼]     │
└──────────────────────────────────┘
Click: "Save"
```

---

### 📙 Namecheap Instructions

#### Step 1: Login
```
URL: https://www.namecheap.com
Login with your credentials
```

#### Step 2: Navigate to Domain List
```
Left sidebar: Click "Domain List"
Find: grampanchayatwarghat.in
Click: "Manage" button
```

#### Step 3A: Change Nameservers (Recommended)
```
Section: "NAMESERVERS"
Dropdown: Select "Custom DNS"

Nameserver 1: [ns1.vercel-dns.com        ]
Nameserver 2: [ns2.vercel-dns.com        ]

Click: "✓" (green checkmark) to save
```

#### Step 3B: OR Add DNS Records Manually
```
Click: "Advanced DNS" tab

Click: "Add New Record"

Record 1 (A Record):
┌──────────────────────────────────┐
│ Type:     [A Record       ▼]     │
│ Host:     [@              ]      │
│ Value:    [76.76.21.21    ]      │
│ TTL:      [Automatic      ▼]     │
└──────────────────────────────────┘
Click: "Save All Changes"

Record 2 (CNAME):
┌──────────────────────────────────┐
│ Type:     [CNAME Record   ▼]     │
│ Host:     [www            ]      │
│ Value:    [cname.vercel-dns.com] │
│ TTL:      [Automatic      ▼]     │
└──────────────────────────────────┘
Click: "Save All Changes"
```

---

### 📕 Google Domains Instructions

#### Step 1: Login
```
URL: https://domains.google.com
Login with your Google account
```

#### Step 2: Select Domain
```
Find: grampanchayatwarghat.in in your domain list
Click: On the domain name
```

#### Step 3: Navigate to DNS
```
Left sidebar: Click "DNS"
```

#### Step 4A: Change Nameservers (Recommended)
```
Section: "Name servers"
Click: "Switch to custom name servers"

Name server 1: [ns1.vercel-dns.com        ]
Name server 2: [ns2.vercel-dns.com        ]

Click: "Save"
```

#### Step 4B: OR Add DNS Records Manually
```
Section: "Custom resource records"

Record 1 (A Record):
┌──────────────────────────────────┐
│ Name:     [@              ]      │
│ Type:     [A              ▼]     │
│ TTL:      [1H             ▼]     │
│ Data:     [76.76.21.21    ]      │
└──────────────────────────────────┘
Click: "Add"

Record 2 (CNAME):
┌──────────────────────────────────┐
│ Name:     [www            ]      │
│ Type:     [CNAME          ▼]     │
│ TTL:      [1H             ▼]     │
│ Data:     [cname.vercel-dns.com] │
└──────────────────────────────────┘
Click: "Add"
```

---

### 📗 Hostinger Instructions

#### Step 1: Login
```
URL: https://www.hostinger.com
Login to your control panel
```

#### Step 2: Navigate to Domains
```
Top menu: Click "Domains"
Find: grampanchayatwarghat.in
Click: "Manage" button
```

#### Step 3: DNS Settings
```
Click: "DNS / Nameservers"
```

#### Step 4A: Change Nameservers (Recommended)
```
Tab: "Nameservers"
Select: "Change nameservers"

Nameserver 1: [ns1.vercel-dns.com        ]
Nameserver 2: [ns2.vercel-dns.com        ]

Click: "Save Changes"
```

#### Step 4B: OR Add DNS Records Manually
```
Tab: "DNS Records"

Click: "Add Record"

Record 1 (A Record):
┌──────────────────────────────────┐
│ Type:     [A              ▼]     │
│ Name:     [@              ]      │
│ Points to:[76.76.21.21    ]      │
│ TTL:      [3600           ]      │
└──────────────────────────────────┘
Click: "Add Record"

Record 2 (CNAME):
┌──────────────────────────────────┐
│ Type:     [CNAME          ▼]     │
│ Name:     [www            ]      │
│ Points to:[cname.vercel-dns.com] │
│ TTL:      [3600           ]      │
└──────────────────────────────────┘
Click: "Add Record"
```

---

## ⏱️ PART 3: WAITING FOR DNS PROPAGATION

### What Happens Now?
```
After you save DNS changes:

1. Your domain registrar updates its records
2. DNS servers worldwide slowly update (propagation)
3. This takes 1-48 hours (usually 1-4 hours)
```

### How to Check Progress?

#### Online Tools:
```
1. Visit: https://www.whatsmydns.net/
   
   Enter: grampanchayatwarghat.in
   Type: A
   
   You'll see a world map showing:
   ✓ Green checkmarks = Propagated
   ✗ Red X = Not yet propagated
   
2. Visit: https://dnschecker.org/
   
   Enter: grampanchayatwarghat.in
   
   Shows DNS status from 100+ locations worldwide
```

#### Terminal Command:
```bash
# Check A record
dig grampanchayatwarghat.in A

# Should show:
# grampanchayatwarghat.in. 3600 IN A 76.76.21.21

# Check CNAME record
dig www.grampanchayatwarghat.in CNAME

# Should show:
# www.grampanchayatwarghat.in. 3600 IN CNAME cname.vercel-dns.com.
```

---

## ✅ PART 4: VERIFICATION

### Check Domain Works

#### Browser Test:
```
1. Open browser (Chrome/Firefox/Safari)
2. Clear cache (Ctrl+Shift+Del)
3. Visit: https://grampanchayatwarghat.in
4. Visit: https://www.grampanchayatwarghat.in

Both should load your Gram Panchayat website!
```

#### Look For:
```
✓ Website loads correctly
✓ URL bar shows grampanchayatwarghat.in
✓ Padlock icon (🔒) appears (HTTPS/SSL)
✓ No security warnings
✓ All images and styles load properly
```

### Verify in Vercel Dashboard

```
Go back to Vercel → Settings → Domains

You should see:

┌─────────────────────────────────────────────┐
│ Domains                                      │
├─────────────────────────────────────────────┤
│ grampanchayatwarghat.in                     │
│ ✓ Valid Configuration                       │
│ ✓ SSL Certificate Issued                    │
├─────────────────────────────────────────────┤
│ www.grampanchayatwarghat.in                 │
│ ✓ Valid Configuration                       │
│ ✓ Redirects to grampanchayatwarghat.in     │
└─────────────────────────────────────────────┘
```

---

## 🎉 SUCCESS INDICATORS

When everything is working:

```
✅ Domain resolves correctly
✅ HTTPS works (padlock icon)
✅ No browser warnings
✅ Images load properly
✅ Navigation works smoothly
✅ Mobile view works perfectly
✅ Vercel shows green checkmarks
```

---

## 🔧 FINAL CONFIGURATION

### Set Primary Domain (in Vercel)

```
Vercel → Settings → Domains

You'll see options:
○ Redirect www.grampanchayatwarghat.in → grampanchayatwarghat.in
○ Redirect grampanchayatwarghat.in → www.grampanchayatwarghat.in

Recommended: Select first option (redirect www to non-www)
```

### Update Firebase (if needed)

```
1. Go to: https://console.firebase.google.com
2. Select: grampanchayat-f0aa7 project
3. Settings → Project Settings
4. Scroll to: "Authorized domains"
5. Click: "Add domain"
6. Enter: grampanchayatwarghat.in
7. Click: "Add"
```

---

## 📱 TEST ON DEVICES

After setup, test on:

```
✓ Desktop Chrome
✓ Desktop Firefox
✓ Desktop Safari
✓ Mobile Chrome (Android)
✓ Mobile Safari (iOS)
✓ Tablet devices
✓ Different WiFi networks
✓ Mobile data
```

---

## 🚀 YOU'RE DONE!

Your Gram Panchayat website is now live at:
**https://grampanchayatwarghat.in**

Share with:
- Village residents
- Government officials
- Social media
- WhatsApp groups

---

## 📞 NEED HELP?

If something doesn't work:

1. **Wait longer** - DNS can take up to 48 hours
2. **Clear browser cache** - Ctrl+Shift+Del
3. **Try incognito mode** - Ctrl+Shift+N
4. **Check DNS tools** - whatsmydns.net
5. **Contact Vercel support** - vercel.com/support
6. **Run verification script**: `./verify-domain.sh`

---

**Last Updated:** December 8, 2025
**Your Domain:** grampanchayatwarghat.in
**Status:** Ready to configure! 🎉
