import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, FileText, Download, Languages } from 'lucide-react';
import { mockForms } from '../../data/mockData';

function FormsManagement() {
  const navigate = useNavigate();
  
  // Load forms from localStorage or use initial mock data
  const [forms, setForms] = useState(() => {
    const savedForms = localStorage.getItem('FORMS');
    console.log('Admin: Loading Forms:', savedForms ? 'Found' : 'Not Found');
    
    if (savedForms) {
      try {
        const parsed = JSON.parse(savedForms);
        console.log('Admin: Parsed Forms:', parsed);
        return parsed;
      } catch (error) {
        console.error('Admin: Error parsing forms:', error);
        return mockForms;
      }
    }
    // If no saved data, use initial mock data and save it
    localStorage.setItem('FORMS', JSON.stringify(mockForms));
    console.log('Admin: Initialized with mock data');
    return mockForms;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterLanguage, setFilterLanguage] = useState('ALL');

  // Save to localStorage whenever forms change
  useEffect(() => {
    console.log('Admin: Saving forms to localStorage:', forms.length);
    localStorage.setItem('FORMS', JSON.stringify(forms));
  }, [forms]);

  // Filter forms
  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.title.mr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || form.category === filterCategory;
    const matchesLanguage = filterLanguage === 'ALL' || form.language === filterLanguage;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      setForms(forms.filter(form => form.id !== id));
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      CERTIFICATE: 'bg-blue-100 text-blue-700',
      APPLICATION: 'bg-green-100 text-green-700',
      TAX: 'bg-orange-100 text-orange-700',
      LICENSE: 'bg-purple-100 text-purple-700',
      OTHER: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[category]}`}>
        {category}
      </span>
    );
  };

  const getLanguageBadge = (language) => {
    const colors = {
      ENGLISH: 'bg-blue-500 text-white',
      MARATHI: 'bg-orange-500 text-white',
      BOTH: 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${colors[language]}`}>
        <Languages className="w-3 h-3" />
        {language}
      </span>
    );
  };

  const handleDownload = (form) => {
    // In a real app, this would trigger actual file download
    console.log('Downloading:', form.title.en);
    // For demo, we'll just show an alert
    alert(`Downloading: ${form.title.en}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Forms & Downloads</h1>
          <p className="text-sm text-gray-600 mt-1">Manage downloadable forms and documents</p>
        </div>
        <button
          onClick={() => navigate('/admin/forms/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Upload Form
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Forms</p>
              <p className="text-2xl font-bold text-gray-800">{forms.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">English</p>
              <p className="text-2xl font-bold text-gray-800">
                {forms.filter(f => f.language === 'ENGLISH' || f.language === 'BOTH').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Marathi</p>
              <p className="text-2xl font-bold text-gray-800">
                {forms.filter(f => f.language === 'MARATHI' || f.language === 'BOTH').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-800">
                {forms.reduce((sum, f) => sum + (f.downloads || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ALL">All Categories</option>
              <option value="CERTIFICATE">Certificate</option>
              <option value="APPLICATION">Application</option>
              <option value="TAX">Tax</option>
              <option value="LICENSE">License</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ALL">All Languages</option>
              <option value="ENGLISH">English Only</option>
              <option value="MARATHI">Marathi Only</option>
              <option value="BOTH">Both Languages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forms List */}
      <div className="space-y-4">
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Forms Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'ALL' || filterLanguage !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Get started by uploading your first form'}
            </p>
            {!searchTerm && filterCategory === 'ALL' && filterLanguage === 'ALL' && (
              <button
                onClick={() => navigate('/admin/forms/new')}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Upload Form
              </button>
            )}
          </div>
        ) : (
          filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getCategoryBadge(form.category)}
                    {getLanguageBadge(form.language)}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {form.title.en}
                  </h3>
                  <p className="text-base text-gray-600 mb-3">{form.title.mr}</p>
                  
                  <p className="text-gray-700 mb-2">{form.description.en}</p>
                  <p className="text-gray-600 text-sm mb-4">{form.description.mr}</p>

                  {/* File Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>PDF Document</span>
                    </div>
                    {form.downloads && (
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>{form.downloads} downloads</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleDownload(form)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/forms/edit/${form.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FormsManagement;
