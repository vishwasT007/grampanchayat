import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Users, 
  FileText, 
  Briefcase, 
  Phone,
  Mail,
  MapPin,
  Clock,
  IndianRupee,
  Download,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  mockSiteSettings, 
  mockNotices, 
  mockPrograms,
  mockMembers,
  mockSchemes,
  mockServices 
} from '../data/mockData';

const Home = () => {
  const { t, getContent } = useLanguage();

  // Get latest 3 notices
  const latestNotices = mockNotices.filter(n => n.showOnHome).slice(0, 3);
  
  // Get latest 3 programs
  const recentPrograms = mockPrograms.filter(p => p.showOnHome).slice(0, 3);

  return (
    <div>
      {/* Hero Section with Indian Flag Gradient */}
      <section className="relative overflow-hidden h-screen max-h-[800px] min-h-[600px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/images/panchayat-building.jpg')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Subtle Gradient Overlay - only on edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-green-600/20"></div>
        
        <div className="container-custom relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            {/* Modern transparent card with subtle shadow */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(255,107,0,0.2)] border border-white/10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {t('home.welcomeTitle')}
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {getContent(mockSiteSettings.panchayatName)}
              </h2>
              <p className="text-2xl md:text-3xl mb-10 text-white font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {getContent(mockSiteSettings.tagline)}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 hover:from-orange-700 hover:via-orange-600 hover:to-orange-800 text-white px-10 py-5 rounded-full text-lg font-bold shadow-[0_8px_24px_0_rgba(255,107,0,0.4)] hover:shadow-[0_12px_32px_0_rgba(255,107,0,0.6)] transition-all transform hover:scale-110"
              >
                {t('home.knowMore')}
                <ChevronRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-12 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            {t('home.quickInfo')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-orange-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{t('home.phone')}</h3>
              </div>
              <a href={`tel:${mockSiteSettings.contact.phone}`} className="text-gray-700 hover:text-orange-600 font-medium">
                {mockSiteSettings.contact.phone}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-md">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{t('home.email')}</h3>
              </div>
              <a href={`mailto:${mockSiteSettings.contact.email}`} className="text-gray-700 hover:text-green-600 break-all font-medium">
                {mockSiteSettings.contact.email}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full flex items-center justify-center shadow-md">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{t('home.address')}</h3>
              </div>
              <p className="text-gray-700 text-sm">
                {getContent(mockSiteSettings.contact.address)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-orange-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                  <Clock className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{t('home.timings')}</h3>
              </div>
              <p className="text-gray-700 text-sm">
                {getContent(mockSiteSettings.officeTimings)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 via-blue-800 to-green-600 bg-clip-text text-transparent">
            {t('home.quickLinks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/financials#property-tax"
              className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 group"
            >
              <IndianRupee size={32} className="mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">{t('home.payPropertyTax')}</h3>
              <ChevronRight className="ml-auto" />
            </Link>

            <Link
              to="/financials#water-tax"
              className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 group"
            >
              <IndianRupee size={32} className="mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">{t('home.payWaterTax')}</h3>
              <ChevronRight className="ml-auto" />
            </Link>

            <Link
              to="/schemes"
              className="bg-gradient-to-br from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 group"
            >
              <Briefcase size={32} className="mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">{t('home.viewSchemes')}</h3>
              <ChevronRight className="ml-auto" />
            </Link>

            <Link
              to="/downloads"
              className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 group"
            >
              <Download size={32} className="mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">{t('home.downloadForms')}</h3>
              <ChevronRight className="ml-auto" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Notices Section */}
      <section className="py-12 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              {t('home.latestNotices')}
            </h2>
            <Link
              to="/notices"
              className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 transition-colors"
            >
              {t('home.viewAllNotices')}
              <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNotices.map((notice, index) => {
              const borderColors = ['border-orange-500', 'border-green-600', 'border-blue-800'];
              const badgeColors = [
                'bg-orange-100 text-orange-700',
                'bg-green-100 text-green-700',
                'bg-blue-100 text-blue-700'
              ];
              
              return (
                <div key={notice.id} className={`card p-6 border-l-4 ${borderColors[index % 3]} hover:shadow-xl transition-shadow`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 ${badgeColors[index % 3]} text-xs font-semibold rounded-full`}>
                      {notice.type}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(notice.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    {getContent(notice.title)}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {getContent(notice.description)}
                  </p>
                  <Link
                    to={`/notices/${notice.id}`}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-4 inline-flex items-center gap-1 transition-colors"
                  >
                    {t('common.readMore')}
                    <ChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 via-blue-800 to-green-600 bg-clip-text text-transparent">
            {t('home.highlights')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/panchayat" className="card p-8 text-center group hover:scale-105 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {t('home.members')}
              </h3>
              <p className="text-gray-600">
                {mockMembers.length} {t('common.active')}
              </p>
            </Link>

            <Link to="/schemes" className="card p-8 text-center group hover:scale-105 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Briefcase className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {t('home.popularSchemes')}
              </h3>
              <p className="text-gray-600">
                {mockSchemes.length} {t('common.active')}
              </p>
            </Link>

            <Link to="/services" className="card p-8 text-center group hover:scale-105 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <FileText className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {t('home.importantServices')}
              </h3>
              <p className="text-gray-600">
                {mockServices.length} {t('common.active')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Programs Section */}
      {recentPrograms.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {t('home.recentPrograms')}
              </h2>
              <Link
                to="/gallery"
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
              >
                {t('home.viewAllPrograms')}
                <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPrograms.map((program) => (
                <div key={program.id} className="card">
                  <img
                    src={program.photoUrl}
                    alt={getContent(program.title)}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(program.date).toLocaleDateString()}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">
                      {getContent(program.title)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {getContent(program.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
