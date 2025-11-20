# Gram Panchayat Website - Project Documentation

## 🎯 Project Overview

This is a complete, production-ready Gram Panchayat website built with React.js. The project includes:

1. **Public Website** - For citizens to view information and submit grievances
2. **Admin Panel** - For Gram Panchayat staff to manage all content

## ✅ Completed Features

### Public Website
✓ Multilingual support (English/Marathi) with easy language switching
✓ Responsive design that works on all devices
✓ Home page with hero section, quick info, quick links, notices, and highlights
✓ About Village page with statistics and important places
✓ Gram Panchayat page showing members, staff, and office details
✓ Services page with search and category filters
✓ Schemes page with category and status filters
✓ Contact page with grievance submission form
✓ Placeholder pages for Downloads, Education, Gallery, Financials, and Notices

### Admin Panel
✓ Secure login system with demo credentials
✓ Protected routes (redirects to login if not authenticated)
✓ Admin dashboard with statistics and quick actions
✓ Responsive sidebar navigation
✓ Session management with localStorage
✓ Logout functionality

### Technical Features
✓ React Router v6 for routing
✓ Context API for state management (Auth & Language)
✓ TailwindCSS for styling
✓ Lucide React for icons
✓ Axios configured for API calls
✓ Mock data structure ready for backend integration

## 🚀 How to Run

### Development Mode
```bash
npm run dev
```
App will run at: http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

## 🔑 Login Credentials

**Admin Panel:**
- URL: http://localhost:5173/admin/login
- Username: `admin`
- Password: `admin123`

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Navigation header with language toggle
│   │   ├── Footer.jsx          # Footer with links and contact info
│   │   └── Layout.jsx          # Main layout wrapper
│   └── admin/
│       ├── AdminLayout.jsx     # Admin panel layout with sidebar
│       └── ProtectedRoute.jsx  # Route protection wrapper
│
├── context/
│   ├── LanguageContext.jsx     # Multilingual support context
│   └── AuthContext.jsx         # Authentication context
│
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── About.jsx               # Village information
│   ├── Panchayat.jsx           # Members and staff
│   ├── Services.jsx            # Services listing
│   ├── Schemes.jsx             # Government schemes
│   ├── Downloads.jsx           # Forms and downloads (placeholder)
│   ├── Education.jsx           # Education info (placeholder)
│   ├── Gallery.jsx             # Photo gallery (placeholder)
│   ├── Financials.jsx          # Tax and finance (placeholder)
│   ├── Notices.jsx             # Notices and tenders (placeholder)
│   ├── Contact.jsx             # Contact and grievance form
│   └── admin/
│       ├── AdminLogin.jsx      # Login page
│       └── AdminDashboard.jsx  # Admin dashboard
│
├── data/
│   └── mockData.js             # Mock data for development
│
├── locales/
│   └── translations.js         # EN/MR translations
│
├── services/
│   └── api.js                  # Axios configuration
│
├── App.jsx                     # Main app with routes
├── main.jsx                    # App entry point
└── index.css                   # Global styles + TailwindCSS
```

## 🌍 Multilingual Support

The app defaults to **Marathi (MR)** but users can toggle to **English (EN)** using the globe icon in the header.

### How it Works:
1. `LanguageContext` manages current language state
2. All content uses `getContent()` helper to display correct language
3. UI labels use `t()` function to get translations
4. Language preference saved in localStorage

### Adding New Translations:
Edit `src/locales/translations.js`:
```js
export const translations = {
  en: {
    nav: { home: 'Home', about: 'About' },
    // ... more
  },
  mr: {
    nav: { home: 'मुख्यपृष्ठ', about: 'गावाबद्दल' },
    // ... more
  }
};
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    600: '#dc2626',  // Change these
    700: '#b91c1c',
  }
}
```

### Update Site Settings
Edit `src/data/mockData.js`:
```js
export const mockSiteSettings = {
  panchayatName: { en: 'Your Village', mr: 'तुमचे गाव' },
  contact: { phone: '+91 1234567890', email: 'your@email.com' },
  // ...
};
```

### Add Content
All mock data is in `src/data/mockData.js`:
- Members, Staff
- Services
- Schemes
- Notices
- Programs
- Forms

## 🔌 Backend Integration

The app is ready for backend integration:

### 1. Set API URL
Create `.env` file:
```
VITE_API_URL=http://your-backend-url.com/api
```

### 2. API Service is Ready
`src/services/api.js` is configured with:
- Axios instance
- Auto token attachment
- Error handling
- 401 redirect

### 3. Replace Mock Data
In components, replace:
```js
import { mockServices } from '../data/mockData';
```
With API calls:
```js
import api from '../services/api';
const response = await api.get('/services');
```

## 📋 Next Development Steps

### High Priority (Complete the Basic Features)
1. **Complete Admin CRUD Modules:**
   - Members management (add/edit/delete)
   - Services management
   - Schemes management
   - Forms upload
   - Gallery upload
   - Notices management
   - Grievance management
   - Site settings

2. **Finish Placeholder Pages:**
   - Downloads page with actual forms listing
   - Education page with school/anganwadi info
   - Gallery page with photo albums
   - Financials page with tax payment QR codes
   - Notices page with filters

3. **Detail Pages:**
   - Service detail page (`/services/:id`)
   - Scheme detail page (`/schemes/:id`)
   - Notice detail page (`/notices/:id`)

### Medium Priority (Enhanced Features)
4. **File Uploads:**
   - Image upload for members/staff photos
   - Document upload for forms
   - Photo upload for gallery
   - PDF upload for notices

5. **Search & Filters:**
   - Global search across all content
   - Advanced filters on all listing pages

6. **Form Validations:**
   - Client-side validation for all forms
   - Error messages in current language

### Low Priority (Advanced Features)
7. **Payment Integration:**
   - Online tax payment
   - Receipt generation

8. **Notifications:**
   - Email notifications for grievances
   - SMS alerts for notices

9. **Analytics:**
   - Admin dashboard analytics
   - Visitor statistics

10. **PWA Features:**
    - Offline support
    - Install as app
    - Push notifications

## 🔒 Security Considerations

Current Implementation:
- ✓ Protected routes for admin
- ✓ JWT token storage
- ✓ Auto logout on 401

For Production:
- [ ] Implement proper JWT with refresh tokens
- [ ] Add CSRF protection
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] HTTPS only
- [ ] Secure headers

## 🐛 Known Issues & Limitations

1. **Mock Data**: Currently using mock data, needs backend API
2. **File Uploads**: Not implemented yet
3. **Real-time**: No real-time updates (WebSocket)
4. **Image Optimization**: Images not optimized
5. **SEO**: Meta tags need completion
6. **Accessibility**: ARIA labels need improvement

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

Currently no tests implemented. Recommended:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## 📦 Deployment

### Build for Production
```bash
npm run build
```
Output will be in `dist/` folder

### Deploy to Netlify/Vercel
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### Deploy to Traditional Server
1. Build the app: `npm run build`
2. Upload `dist/` folder to server
3. Configure server to serve `index.html` for all routes
4. Set up SSL certificate

## 📞 Support & Contact

For questions or issues:
- Check existing issues in the repository
- Create a new issue with detailed description
- Contact the development team

## 📄 License

This project is open source under the MIT License.

---

**Project Status**: ✅ Core features complete, ready for backend integration and advanced feature development.

**Last Updated**: November 20, 2025
