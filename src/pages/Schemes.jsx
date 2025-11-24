import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getSchemes } from '../services/schemesService';

const Schemes = () => {
  const { t, getContent } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setLoading(true);
        const data = await getSchemes();
        setSchemes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading schemes:', error);
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, []);

  const categories = ['All', 'CENTRAL', 'STATE', 'LOCAL', 'OTHER'];
  const statuses = ['All', 'ACTIVE', 'CLOSED', 'UPCOMING'];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = getContent(scheme.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' || scheme.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">{t('nav.schemes')}</h1>
          <p className="text-xl text-primary-100">
            Government schemes and welfare programs for villagers
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-secondary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {schemes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {t('common.language') === 'en' 
                  ? 'No schemes have been added yet.' 
                  : 'अद्याप कोणत्याही योजना जोडल्या गेल्या नाहीत.'}
              </p>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('common.noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSchemes.map((scheme) => (
                <div key={scheme.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1">
                      {getContent(scheme.name)}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {scheme.category}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        scheme.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        scheme.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {scheme.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getContent(scheme.description)}
                  </p>
                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('common.viewDetails')}
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Schemes;
