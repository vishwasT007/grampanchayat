import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Languages, 
  Search,
  Filter,
  File
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
      'Certificate': 'bg-blue-100 text-blue-700 border-blue-300',
      'APPLICATION': 'bg-green-100 text-green-700 border-green-300',
      'Tax': 'bg-orange-100 text-orange-700 border-orange-300',
      'LICENSE': 'bg-purple-100 text-purple-700 border-purple-300',
      'OTHER': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Forms & Downloads' : 'फॉर्म आणि डाउनलोड'}
          </h1>
          <p className="text-xl text-white/90">
            {language === 'en' 
              ? 'Download application forms, certificates, and important documents' 
              : 'अर्ज फॉर्म, प्रमाणपत्रे आणि महत्त्वाचे दस्तऐवज डाउनलोड करा'}
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search forms...' : 'फॉर्म शोधा...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00] appearance-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'ALL' ? (language === 'en' ? 'All Categories' : 'सर्व श्रेणी') : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forms List */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ff6b00]"></div>
            </div>
          ) : filteredForms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => (
                <div 
                  key={form.id} 
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#138808] to-[#1aa910] p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                          <FileText className="text-white" size={28} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg leading-tight">
                            {language === 'en' ? form.titleEn : (form.titleMr || form.titleEn)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {language === 'en' ? form.descriptionEn : (form.descriptionMr || form.descriptionEn)}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getCategoryColor(form.category)}`}>
                        {form.category}
                      </span>
                      {form.language && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-orange-500 text-white flex items-center gap-1">
                          <Languages size={12} />
                          {form.language}
                        </span>
                      )}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(form)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white rounded-lg hover:from-[#ff8533] hover:to-[#ff6b00] transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                      <Download size={18} />
                      {language === 'en' ? 'Download Form' : 'फॉर्म डाउनलोड करा'}
                    </button>
                  </div>

                  {/* File Info Footer */}
                  {form.fileName && (
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <File size={14} />
                          <span className="truncate">{form.fileName}</span>
                        </div>
                        {form.fileSize && (
                          <span className="ml-2 text-gray-400">
                            {(form.fileSize / 1024).toFixed(1)} KB
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <FileText size={64} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {language === 'en' ? 'No Forms Available' : 'कोणतेही फॉर्म उपलब्ध नाहीत'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Forms and documents will be displayed here once they are uploaded by the admin.' 
                  : 'प्रशासकाद्वारे अपलोड केल्यानंतर येथे फॉर्म आणि दस्तऐवज प्रदर्शित केले जातील.'}
              </p>
            </div>
          )}

          {/* Info Section */}
          {filteredForms.length > 0 && (
            <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <FileText size={20} />
                {language === 'en' ? 'Download Instructions' : 'डाउनलोड सूचना'}
              </h3>
              <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                <li>
                  {language === 'en' 
                    ? 'Click on the "Download Form" button to download the PDF file' 
                    : 'PDF फाईल डाउनलोड करण्यासाठी "फॉर्म डाउनलोड करा" बटणावर क्लिक करा'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Fill the form completely and attach required documents' 
                    : 'फॉर्म पूर्णपणे भरा आणि आवश्यक कागदपत्रे जोडा'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Submit the filled form at the Gram Panchayat office' 
                    : 'भरलेला फॉर्म ग्रामपंचायत कार्यालयात जमा करा'}
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Downloads;
