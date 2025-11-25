import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { 
  Bell, 
  FileText, 
  Megaphone,
  Calendar,
  Filter,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { getActiveNotices } from '../services/noticesService';

const Notices = () => {
  const { language } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const activeNotices = await getActiveNotices();
      // Sort by start date (newest first)
      const sorted = activeNotices.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setNotices(sorted);
    } catch (error) {
      console.error('Error loading notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter notices
  const filteredNotices = notices.filter(notice => {
    return filterType === 'ALL' || notice.type === filterType;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'MEETING':
        return <Bell className="w-5 h-5" />;
      case 'TENDER':
        return <FileText className="w-5 h-5" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'MEETING':
        return 'from-blue-500 to-blue-600';
      case 'TENDER':
        return 'from-green-500 to-green-600';
      case 'ANNOUNCEMENT':
        return 'from-orange-500 to-orange-600';
      case 'EVENT':
        return 'from-purple-500 to-purple-600';
      case 'URGENT':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'MEETING':
        return 'text-blue-700';
      case 'TENDER':
        return 'text-green-700';
      case 'ANNOUNCEMENT':
        return 'text-orange-700';
      case 'EVENT':
        return 'text-purple-700';
      case 'URGENT':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const isExpiringSoon = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft >= 0;
  };

  return (
    <div>
      {/* Premium Hero Section with Tricolor Gradient */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Tricolor Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 via-white to-green-600"></div>

        <div className="container-custom relative z-10">
          <div className="text-center">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-green-600 rounded-full mb-6 shadow-2xl shadow-orange-500/50 animate-bounce-slow">
              <Bell size={40} className="text-white" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {language === 'en' ? 'Notices & Announcements' : 'सूचना आणि घोषणा'}
            </h1>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-orange-500 to-orange-600 rounded-full"></div>
              <Sparkles className="text-orange-400" size={24} />
              <div className="h-1 w-20 bg-gradient-to-r from-green-600 via-green-500 to-transparent rounded-full"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Stay updated with important notices, meetings, tenders, and announcements' 
                : 'महत्त्वाच्या सूचना, सभा, निविदा आणि घोषणांसह अपडेट रहा'}
            </p>

            {/* Cultural Elements */}
            <div className="flex items-center justify-center gap-8 mt-8 text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm">{language === 'en' ? 'Official' : 'अधिकृत'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                <span className="text-sm">{language === 'en' ? 'Verified' : 'सत्यापित'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-700"></div>
                <span className="text-sm">{language === 'en' ? 'Updated' : 'अद्यतनित'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Filter Section */}
      <section className="py-8 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-xl border-t-4 border-orange-600 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <Filter size={20} className="text-white" />
                  </div>
                  <label className="font-bold text-blue-900 text-lg">
                    {language === 'en' ? 'Filter by Type' : 'प्रकारानुसार फिल्टर करा'}
                  </label>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-1 min-w-[200px] px-5 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gradient-to-r from-orange-50 to-green-50 font-semibold text-gray-700 transition-all hover:border-orange-500"
                >
                  <option value="ALL">{language === 'en' ? '📋 All Types' : '📋 सर्व प्रकार'}</option>
                  <option value="MEETING">🔔 Meeting</option>
                  <option value="TENDER">📄 Tender</option>
                  <option value="ANNOUNCEMENT">📢 Announcement</option>
                  <option value="EVENT">🎉 Event</option>
                  <option value="URGENT">⚠️ Urgent</option>
                  <option value="OTHER">📌 Other</option>
                </select>
                {filterType !== 'ALL' && (
                  <button
                    onClick={() => setFilterType('ALL')}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold transition-all"
                  >
                    {language === 'en' ? 'Clear Filter' : 'फिल्टर साफ करा'}
                  </button>
                )}
              </div>
              
              {/* Filter Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-orange-600">
                    {filteredNotices.length}
                  </span>
                  {' '}
                  {language === 'en' 
                    ? filterType === 'ALL' 
                      ? 'active notices found' 
                      : `${filterType.toLowerCase()} notices found`
                    : filterType === 'ALL'
                      ? 'सक्रिय सूचना आढळल्या'
                      : `${filterType.toLowerCase()} सूचना आढळल्या`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Notices List */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mb-4"></div>
              <p className="text-gray-600 font-semibold">
                {language === 'en' ? 'Loading notices...' : 'सूचना लोड करत आहे...'}
              </p>
            </div>
          ) : filteredNotices.length > 0 ? (
            <div className="space-y-6">
              {filteredNotices.map((notice, index) => (
                <div
                  key={notice.id}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-orange-600 transform hover:scale-[1.02]"
                >
                  <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
                  
                  {/* Notice Header */}
                  <div className={`bg-gradient-to-r ${getTypeColor(notice.type)} p-6`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Number Badge */}
                        <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {index + 1}
                        </div>
                        
                        {/* Icon Badge */}
                        <div className="flex-shrink-0 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <div className={`${getTypeBadgeColor(notice.type)}`}>
                            {getTypeIcon(notice.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-white/95 ${getTypeBadgeColor(notice.type)} shadow-md`}>
                              {notice.type}
                            </span>
                            {isExpiringSoon(notice.endDate) && (
                              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700 flex items-center gap-2 shadow-md animate-pulse">
                                <AlertTriangle size={16} />
                                {language === 'en' ? 'Expiring Soon' : 'लवकर समाप्त होत आहे'}
                              </span>
                            )}
                          </div>
                          <h2 className="font-bold text-white text-2xl mb-2 leading-tight">
                            {language === 'en' ? notice.titleEn : (notice.titleMr || notice.titleEn)}
                          </h2>
                          
                          {/* Date Pills in Header */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold">
                              <Calendar size={16} />
                              <span>{formatDate(notice.startDate)}</span>
                            </div>
                            <ChevronRight size={16} className="text-white/60" />
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold">
                              <Calendar size={16} />
                              <span>{formatDate(notice.endDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notice Body */}
                  <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center mt-1">
                        <FileText size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-900 text-lg mb-3">
                          {language === 'en' ? 'Description' : 'वर्णन'}
                        </h3>
                        <p className="text-gray-700 text-base leading-relaxed">
                          {language === 'en' ? notice.descriptionEn : (notice.descriptionMr || notice.descriptionEn)}
                        </p>
                      </div>
                    </div>

                    {/* Date Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-white rounded-xl p-4 border-l-4 border-green-600 shadow-md hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Calendar size={20} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">
                              {language === 'en' ? 'Start Date' : 'प्रारंभ तारीख'}
                            </p>
                            <p className="font-bold text-gray-800">{formatDate(notice.startDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 border-l-4 border-red-600 shadow-md hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Calendar size={20} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">
                              {language === 'en' ? 'End Date' : 'समाप्ती तारीख'}
                            </p>
                            <p className="font-bold text-gray-800">{formatDate(notice.endDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl border-2 border-dashed border-orange-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full mb-6">
                <Bell size={48} className="text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                {language === 'en' ? 'No Active Notices' : 'कोणत्याही सक्रिय सूचना नाहीत'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {language === 'en' 
                  ? 'There are currently no active notices. Check back later for updates.' 
                  : 'सध्या कोणत्याही सक्रिय सूचना नाहीत. अपडेटसाठी पुन्हा तपासा.'}
              </p>
            </div>
          )}

          {/* Premium Info Box */}
          {filteredNotices.length > 0 && (
            <div className="mt-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl border-t-4 border-blue-600 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2"></div>
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <AlertCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-2xl mb-2">
                      {language === 'en' ? 'Important Information' : 'महत्त्वाची माहिती'}
                    </h3>
                    <p className="text-blue-700 text-sm">
                      {language === 'en' 
                        ? 'Please read the following guidelines carefully' 
                        : 'कृपया खालील मार्गदर्शक तत्त्वे काळजीपूर्वक वाचा'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <p className="text-blue-900 font-medium">
                      {language === 'en' 
                        ? 'Please check the start and end dates for each notice carefully' 
                        : 'कृपया प्रत्येक सूचनेसाठी प्रारंभ आणि समाप्ती तारखा काळजीपूर्वक तपासा'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <p className="text-blue-900 font-medium">
                      {language === 'en' 
                        ? 'For tender submissions, contact the Gram Panchayat office before the deadline' 
                        : 'निविदा सबमिशनसाठी, शेवटच्या तारखेपूर्वी ग्रामपंचायत कार्यालयाशी संपर्क साधा'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <p className="text-blue-900 font-medium">
                      {language === 'en' 
                        ? 'Meeting attendance is mandatory for all members and important for village development' 
                        : 'सर्व सदस्यांसाठी बैठकीत उपस्थिती अनिवार्य आहे आणि गावाच्या विकासासाठी महत्त्वाची आहे'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Notices;
