import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Briefcase, 
  Phone,
  Mail,
  MapPin,
  Clock,
  IndianRupee,
  Download,
  Award,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Home = () => {
  const { t, getContent } = useLanguage();
  const { settings: siteSettings, loading: settingsLoading } = useSiteSettings();

  // Show loading state while data is being fetched
  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Modern Government Style */}
      <section className="relative overflow-hidden min-h-[650px] md:min-h-[700px] lg:min-h-[750px] flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-white to-green-600">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          </div>
        </div>

        {/* Floating Ashoka Chakra */}
        <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 opacity-5 animate-spin-slow">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-900"/>
            {[...Array(24)].map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="100"
                x2="100"
                y2="20"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-900"
                transform={`rotate(${i * 15} 100 100)`}
              />
            ))}
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            {/* Emblem & Title Section */}
            <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
              {/* National Emblem Placeholder */}
              <div className="inline-block mb-6 p-4 bg-white rounded-full shadow-2xl">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-600 via-blue-900 to-green-600 rounded-full flex items-center justify-center">
                  <Award className="text-white w-8 h-8 md:w-10 md:h-10" />
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 leading-tight">
                <span className="block text-orange-600">{t('home.welcomeTitle')}</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                  {getContent(siteSettings.panchayatName)}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto mb-8 px-4">
                {getContent(siteSettings.tagline)}
              </p>

              {/* India Flag Stripe */}
              <div className="w-32 h-1 mx-auto mb-8 flex rounded-full overflow-hidden shadow-lg">
                <div className="flex-1 bg-orange-600"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-green-600"></div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-4 rounded-lg text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  {t('home.knowMore')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-gray-200"
                >
                  {t('home.importantServices')}
                  <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16 md:h-24 fill-current text-white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Quick Info Section - Government Contact Cards */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('home.quickInfo')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-600 to-green-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {/* Phone Card */}
            <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-orange-600 transform hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Phone className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{t('home.phone')}</h3>
                  <a href={`tel:${siteSettings.contact.phone}`} className="text-gray-700 hover:text-orange-600 font-medium transition-colors block truncate">
                    {siteSettings.contact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-600 transform hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Mail className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{t('home.email')}</h3>
                  <a href={`mailto:${siteSettings.contact.email}`} className="text-gray-700 hover:text-green-600 font-medium transition-colors block break-all text-sm md:text-base">
                    {siteSettings.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-600 transform hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MapPin className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{t('home.address')}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getContent(siteSettings.contact.address)}
                  </p>
                </div>
              </div>
            </div>

            {/* Timings Card */}
            <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-orange-600 transform hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Clock className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{t('home.timings')}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getContent(siteSettings.officeTimings)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section - Modern Service Cards */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('home.quickLinks')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-600 to-green-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            <Link
              to="/financials#property-tax"
              className="group relative bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <IndianRupee size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t('home.payPropertyTax')}</h3>
                <p className="text-white/90 text-sm mb-4">Pay your property tax online</p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>Pay Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              to="/financials#water-tax"
              className="group relative bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <IndianRupee size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t('home.payWaterTax')}</h3>
                <p className="text-white/90 text-sm mb-4">Pay your water bill online</p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>Pay Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              to="/schemes"
              className="group relative bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Briefcase size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t('home.viewSchemes')}</h3>
                <p className="text-white/90 text-sm mb-4">Browse government schemes</p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>View All</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              to="/downloads"
              className="group relative bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Download size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t('home.downloadForms')}</h3>
                <p className="text-white/90 text-sm mb-4">Download application forms</p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>Download</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section - Statistics */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t('home.highlights')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Link 
              to="/panchayat" 
              className="group bg-white/10 backdrop-blur-sm p-8 md:p-10 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <Users className="text-white" size={40} />
              </div>
              <p className="text-xl font-semibold mb-2 text-orange-300">
                {t('home.members')}
              </p>
              <p className="text-white/80 text-sm">
                Panchayat Representatives
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-orange-300 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Details</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            <Link 
              to="/schemes" 
              className="group bg-white/10 backdrop-blur-sm p-8 md:p-10 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <Briefcase className="text-white" size={40} />
              </div>
              <p className="text-xl font-semibold mb-2 text-green-300">
                {t('home.popularSchemes')}
              </p>
              <p className="text-white/80 text-sm">
                Government Schemes
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-green-300 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Details</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            <Link 
              to="/services" 
              className="group bg-white/10 backdrop-blur-sm p-8 md:p-10 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <FileText className="text-white" size={40} />
              </div>
              <p className="text-xl font-semibold mb-2 text-blue-300">
                {t('home.importantServices')}
              </p>
              <p className="text-white/80 text-sm">
                Panchayat Services
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-300 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Details</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
