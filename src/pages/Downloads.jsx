import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Languages, 
  Search,
  Filter,
  File,
  FolderOpen,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileCheck,
  Info,
  Calendar
} from 'lucide-react';
import { getAllForms } from '../services/formsService';

const Downloads = () => {
  const { language } = useLanguage();
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        const fetchedForms = await getAllForms();
        setForms(fetchedForms);
      } catch (error) {
        console.error('Error loading forms:', error);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  // Get unique categories
  const categories = ['ALL', ...new Set(forms.map(form => form.category))];

  // Filter forms
  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      (form.titleEn && form.titleEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (form.titleMr && form.titleMr.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'ALL' || form.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Certificate': 'from-blue-500 to-blue-600 border-blue-400',
      'APPLICATION': 'from-green-500 to-green-600 border-green-400',
      'Tax': 'from-orange-500 to-orange-600 border-orange-400',
      'LICENSE': 'from-purple-500 to-purple-600 border-purple-400',
      'OTHER': 'from-gray-500 to-gray-600 border-gray-400'
    };
    return colors[category] || 'from-gray-500 to-gray-600 border-gray-400';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Certificate': '📜',
      'APPLICATION': '📝',
      'Tax': '💰',
      'LICENSE': '🎫',
      'OTHER': '📄'
    };
    return icons[category] || '📄';
  };

  const handleDownload = (form) => {
    // Open the Firebase Storage URL in a new tab
    if (form.fileUrl) {
      window.open(form.fileUrl, '_blank');
    } else {
      alert(
        language === 'en' 
          ? 'Download link not available'
          : 'डाउनलोड दुवा उपलब्ध नाही'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-white to-green-600 py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-900 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-white/30 shadow-lg">
              <FolderOpen className="text-blue-900" size={24} />
              <span className="text-blue-900 font-bold text-lg">
                {language === 'en' ? 'Document Center' : 'दस्तऐवज केंद्र'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-900 leading-tight">
              {language === 'en' ? 'Forms & Downloads' : 'फॉर्म आणि डाउनलोड'}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              {language === 'en' 
                ? 'Download application forms, certificates, and important documents with ease' 
                : 'अर्ज फॉर्म, प्रमाणपत्रे आणि महत्त्वाचे दस्तऐवज सहजपणे डाउनलोड करा'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-200">
                <div className="text-3xl font-bold text-orange-600">{forms.length}</div>
                <div className="text-sm text-gray-600 font-medium">
                  {language === 'en' ? 'Total Forms' : 'एकूण फॉर्म'}
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600">{categories.length - 1}</div>
                <div className="text-sm text-gray-600 font-medium">
                  {language === 'en' ? 'Categories' : 'श्रेणी'}
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-200 col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600 font-medium">
                  {language === 'en' ? 'Available' : 'उपलब्ध'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 -mt-12 relative z-20">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-orange-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-600 transition-colors" size={22} />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search forms by name...' : 'नावाने फॉर्म शोधा...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-700 font-medium"
                />
              </div>

              {/* Category Filter */}
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 group-focus-within:text-green-700 transition-colors z-10" size={22} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 appearance-none bg-white transition-all text-gray-700 font-medium cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'ALL' ? (language === 'en' ? '📁 All Categories' : '📁 सर्व श्रेणी') : `${getCategoryIcon(cat)} ${cat}`}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Results Count */}
            {searchTerm || filterCategory !== 'ALL' ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Sparkles size={16} className="text-orange-500" />
                  <span>
                    {language === 'en' 
                      ? `Found ${filteredForms.length} form${filteredForms.length !== 1 ? 's' : ''}` 
                      : `${filteredForms.length} फॉर्म सापडले`}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Forms List */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-orange-600"></div>
                <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600" size={32} />
              </div>
              <p className="text-gray-600 font-semibold mt-6 text-lg">
                {language === 'en' ? 'Loading forms...' : 'फॉर्म लोड करत आहे...'}
              </p>
            </div>
          ) : filteredForms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredForms.map((form, index) => (
                <div 
                  key={form.id} 
                  className="group relative bg-white rounded-2xl shadow-lg border-t-4 border-orange-600 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient Background Effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-green-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Card Header */}
                  <div className="relative bg-gradient-to-r from-blue-900 to-blue-800 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FileText className="text-white" size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2">
                          {language === 'en' ? form.titleEn : (form.titleMr || form.titleEn)}
                        </h3>
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getCategoryColor(form.category)} text-white shadow-md border-2`}>
                            {getCategoryIcon(form.category)} {form.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="relative p-6 space-y-4">
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[60px]">
                      {language === 'en' ? form.descriptionEn : (form.descriptionMr || form.descriptionEn)}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2">
                      {form.language && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
                          <Languages size={14} />
                          {form.language}
                        </span>
                      )}
                      {form.createdAt && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                          <Calendar size={14} />
                          {new Date(form.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(form)}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl font-bold text-sm group-hover:scale-105 transform duration-300"
                    >
                      <Download size={20} className="animate-bounce" />
                      <span>{language === 'en' ? 'Download Form' : 'फॉर्म डाउनलोड करा'}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* File Info Footer */}
                  {form.fileName && (
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-gray-600 flex-1 min-w-0">
                          <File size={14} className="flex-shrink-0 text-blue-600" />
                          <span className="truncate font-medium">{form.fileName}</span>
                        </div>
                        {form.fileSize && (
                          <span className="ml-3 text-gray-500 font-semibold bg-white px-2 py-1 rounded-md border border-gray-300">
                            {(form.fileSize / 1024).toFixed(1)} KB
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sparkle Effect */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="text-yellow-400" size={24} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-gradient-to-br from-orange-50 to-green-50 rounded-full mb-6 border-4 border-orange-200">
                <FolderOpen size={80} className="text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                {language === 'en' ? 'No Forms Available' : 'कोणतेही फॉर्म उपलब्ध नाहीत'}
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {language === 'en' 
                  ? 'Forms and documents will be displayed here once they are uploaded by the admin.' 
                  : 'प्रशासकाद्वारे अपलोड केल्यानंतर येथे फॉर्म आणि दस्तऐवज प्रदर्शित केले जातील.'}
              </p>
            </div>
          )}

          {/* Premium Info Section */}
          {filteredForms.length > 0 && (
            <div className="mt-16 bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 border-blue-300 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Info className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">
                    {language === 'en' ? 'How to Download & Submit Forms' : 'फॉर्म कसे डाउनलोड आणि सबमिट करावे'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' ? 'Follow these simple steps to complete your application' : 'आपला अर्ज पूर्ण करण्यासाठी या सोप्या चरणांचे अनुसरण करा'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="relative bg-white rounded-xl p-6 shadow-md border-t-4 border-orange-600 hover:shadow-lg transition-shadow">
                  <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Download className="text-orange-600" size={24} />
                      <h4 className="font-bold text-gray-800 text-lg">
                        {language === 'en' ? 'Download' : 'डाउनलोड'}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {language === 'en' 
                        ? 'Click the "Download Form" button to get the PDF file on your device' 
                        : 'आपल्या डिव्हाइसवर PDF फाईल मिळवण्यासाठी "फॉर्म डाउनलोड करा" बटणावर क्लिक करा'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative bg-white rounded-xl p-6 shadow-md border-t-4 border-green-600 hover:shadow-lg transition-shadow">
                  <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FileCheck className="text-green-600" size={24} />
                      <h4 className="font-bold text-gray-800 text-lg">
                        {language === 'en' ? 'Fill Form' : 'फॉर्म भरा'}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {language === 'en' 
                        ? 'Complete all required fields accurately and attach necessary documents' 
                        : 'सर्व आवश्यक फील्ड अचूकपणे पूर्ण करा आणि आवश्यक कागदपत्रे जोडा'}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative bg-white rounded-xl p-6 shadow-md border-t-4 border-blue-600 hover:shadow-lg transition-shadow">
                  <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="text-blue-600" size={24} />
                      <h4 className="font-bold text-gray-800 text-lg">
                        {language === 'en' ? 'Submit' : 'सबमिट करा'}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {language === 'en' 
                        ? 'Submit the completed form at the Gram Panchayat office during working hours' 
                        : 'कार्यालयीन वेळेत ग्रामपंचायत कार्यालयात पूर्ण केलेला फॉर्म सबमिट करा'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <p className="text-sm text-yellow-800 flex items-start gap-2">
                  <Info size={18} className="flex-shrink-0 mt-0.5" />
                  <span>
                    {language === 'en' 
                      ? 'For any assistance, please contact the Gram Panchayat office during working hours or call our helpline.' 
                      : 'कोणत्याही सहाय्यासाठी, कृपया कार्यालयीन वेळेत ग्रामपंचायत कार्यालयाशी संपर्क साधा किंवा आमच्या हेल्पलाइनवर कॉल करा.'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Downloads;
