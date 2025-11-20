import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockServices } from '../data/mockData';

const Services = () => {
  const { t, getContent } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Certificate', 'Tax', 'NOC', 'Other'];

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = getContent(service.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">{t('nav.services')}</h1>
          <p className="text-xl text-primary-100">
            Explore various services provided by Gram Panchayat
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {getContent(service.name)}
                  </h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {service.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getContent(service.description)}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-500">Fees: </span>
                    <span className="font-semibold text-gray-700">{service.fees}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time: </span>
                    <span className="font-semibold text-gray-700">{service.processingTime}</span>
                  </div>
                </div>
                <Link
                  to={`/services/${service.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('common.viewDetails')}
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('common.noResults')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
