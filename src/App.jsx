import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Panchayat from './pages/Panchayat';
import Services from './pages/Services';
import Schemes from './pages/Schemes';
import Downloads from './pages/Downloads';
import Education from './pages/Education';
import Gallery from './pages/Gallery';
import Financials from './pages/Financials';
import Notices from './pages/Notices';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MembersManagement from './pages/admin/MembersManagement';
import MemberForm from './pages/admin/MemberForm';
import ServicesManagement from './pages/admin/ServicesManagement';
import ServiceForm from './pages/admin/ServiceForm';
import SchemesManagement from './pages/admin/SchemesManagement';
import SchemeForm from './pages/admin/SchemeForm';
import NoticesManagement from './pages/admin/NoticesManagement';
import NoticeForm from './pages/admin/NoticeForm';
import GalleryManagement from './pages/admin/GalleryManagement';
import GalleryForm from './pages/admin/GalleryForm';
import FormsManagement from './pages/admin/FormsManagement';
import FormUpload from './pages/admin/FormUpload';
import SiteSettings from './pages/admin/SiteSettings';
import GrievancesManagement from './pages/admin/GrievancesManagement';
import GrievanceForm from './pages/admin/GrievanceForm';
import FinancialsManagement from './pages/admin/FinancialsManagement';
import FinancialForm from './pages/admin/FinancialForm';
import AboutPageManagement from './pages/admin/AboutPageManagement';
import EducationPageManagement from './pages/admin/EducationPageManagement';
import VillageStatistics from './pages/admin/VillageStatistics';
import VillageStatisticsPublic from './pages/VillageStatistics';
import FirebaseSetup from './pages/FirebaseSetup';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SiteSettingsProvider>
          <LanguageProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="panchayat" element={<Panchayat />} />
                <Route path="services" element={<Services />} />
                <Route path="schemes" element={<Schemes />} />
                <Route path="downloads" element={<Downloads />} />
                <Route path="education" element={<Education />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="financials" element={<Financials />} />
                <Route path="notices" element={<Notices />} />
                <Route path="contact" element={<Contact />} />
                <Route path="village-statistics" element={<VillageStatisticsPublic />} />
              </Route>

              {/* Firebase Setup (Temporary - remove after setup complete) */}
              <Route path="/firebase-setup" element={<FirebaseSetup />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="members" element={<MembersManagement />} />
                <Route path="members/new" element={<MemberForm />} />
                <Route path="members/edit/:id" element={<MemberForm />} />
                <Route path="services" element={<ServicesManagement />} />
                <Route path="services/new" element={<ServiceForm />} />
                <Route path="services/edit/:id" element={<ServiceForm />} />
                <Route path="schemes" element={<SchemesManagement />} />
                <Route path="schemes/new" element={<SchemeForm />} />
                <Route path="schemes/edit/:id" element={<SchemeForm />} />
                <Route path="notices" element={<NoticesManagement />} />
                <Route path="notices/new" element={<NoticeForm />} />
                <Route path="notices/edit/:id" element={<NoticeForm />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="gallery/new" element={<GalleryForm />} />
                <Route path="gallery/edit/:id" element={<GalleryForm />} />
                <Route path="forms" element={<FormsManagement />} />
                <Route path="forms/new" element={<FormUpload />} />
                <Route path="forms/edit/:id" element={<FormUpload />} />
                <Route path="settings" element={<SiteSettings />} />
                <Route path="grievances" element={<GrievancesManagement />} />
                <Route path="grievances/new" element={<GrievanceForm />} />
                <Route path="grievances/edit/:id" element={<GrievanceForm />} />
                <Route path="financials" element={<FinancialsManagement />} />
                <Route path="financials/new" element={<FinancialForm />} />
                <Route path="financials/edit/:id" element={<FinancialForm />} />
                <Route path="content/about" element={<AboutPageManagement />} />
                <Route path="content/education" element={<EducationPageManagement />} />
                <Route path="village-statistics" element={<VillageStatistics />} />
              </Route>
            </Routes>
          </LanguageProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
