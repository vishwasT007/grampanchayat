import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { 
  Bell, 
  FileText, 
  Megaphone,
  Calendar,
  Filter,
  AlertCircle,
  Clock
} from 'lucide-react';

const Notices = () => {
  const { language } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    const loadNotices = () => {
      const savedNotices = localStorage.getItem('NOTICES');
      console.log('Loading Notices:', savedNotices ? 'Found' : 'Not Found');
      
      if (savedNotices) {
        try {
          const parsed = JSON.parse(savedNotices);
          console.log('Parsed Notices:', parsed);
          // Filter only active notices and sort by start date (newest first)
          const activeNotices = parsed
            .filter(notice => {
              const now = new Date();
              const end = new Date(notice.endDate);
              return end >= now; // Show notices that haven't expired
            })
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setNotices(activeNotices);
        } catch (error) {
          console.error('Error parsing notices:', error);
          setNotices([]);
        }
      } else {
        console.log('No notices in localStorage');
        setNotices([]);
      }
    };

    loadNotices();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'NOTICES') {
        console.log('Notices updated!');
        loadNotices();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get unique types
  const types = ['ALL', ...new Set(notices.map(notice => notice.type))];

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
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'MEETING':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'TENDER':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'ANNOUNCEMENT':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const isExpiringSoon = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const daysUntilExpiry = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Notices & Announcements' : 'सूचना आणि घोषणा'}
          </h1>
          <p className="text-xl text-white/90">
            {language === 'en' 
              ? 'Stay updated with important notices, meetings, tenders, and announcements' 
              : 'महत्त्वाच्या सूचना, सभा, निविदा आणि घोषणांसह अपडेट रहा'}
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'ALL' 
                      ? (language === 'en' ? 'All Types' : 'सर्व प्रकार') 
                      : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-12">
        <div className="container-custom">
          {filteredNotices.length > 0 ? (
            <div className="space-y-6">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Notice Header */}
                  <div className={`bg-gradient-to-r ${getTypeColor(notice.type)} p-4`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                          {getTypeIcon(notice.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/90 ${getTypeBadgeColor(notice.type).split(' ')[1]}`}>
                              {notice.type}
                            </span>
                            {isExpiringSoon(notice.endDate) && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                                <Clock size={12} />
                                {language === 'en' ? 'Expiring Soon' : 'लवकर समाप्त होत आहे'}
                              </span>
                            )}
                          </div>
                          <h2 className="font-bold text-white text-xl">
                            {language === 'en' ? notice.title.en : notice.title.mr}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notice Body */}
                  <div className="p-6">
                    <p className="text-gray-700 text-base mb-6 leading-relaxed">
                      {language === 'en' ? notice.description.en : notice.description.mr}
                    </p>

                    {/* Date Information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={18} className="text-green-600" />
                        <div>
                          <span className="font-semibold">
                            {language === 'en' ? 'From:' : 'पासून:'}
                          </span>
                          <span className="ml-1">{formatDate(notice.startDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={18} className="text-red-600" />
                        <div>
                          <span className="font-semibold">
                            {language === 'en' ? 'Until:' : 'पर्यंत:'}
                          </span>
                          <span className="ml-1">{formatDate(notice.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <Bell size={64} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {language === 'en' ? 'No Active Notices' : 'कोणत्याही सक्रिय सूचना नाहीत'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'There are currently no active notices. Check back later for updates.' 
                  : 'सध्या कोणत्याही सक्रिय सूचना नाहीत. अपडेटसाठी पुन्हा तपासा.'}
              </p>
            </div>
          )}

          {/* Info Box */}
          {filteredNotices.length > 0 && (
            <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle size={20} />
                {language === 'en' ? 'Important Information' : 'महत्त्वाची माहिती'}
              </h3>
              <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                <li>
                  {language === 'en' 
                    ? 'Please check the start and end dates for each notice' 
                    : 'कृपया प्रत्येक सूचनेसाठी प्रारंभ आणि समाप्ती तारखा तपासा'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'For tender submissions, contact the Gram Panchayat office before the deadline' 
                    : 'निविदा सबमिशनसाठी, शेवटच्या तारखेपूर्वी ग्रामपंचायत कार्यालयाशी संपर्क साधा'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Meeting attendance is mandatory for all members' 
                    : 'सर्व सदस्यांसाठी बैठकीत उपस्थिती अनिवार्य आहे'}
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Notices;
