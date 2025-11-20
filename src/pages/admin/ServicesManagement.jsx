import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import { mockServices } from '../../data/mockData';

const ServicesManagement = () => {
  const [services, setServices] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const categories = ['ALL', 'Certificate', 'Tax', 'License', 'Registration', 'Other'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.name.mr.includes(searchTerm);
    const matchesCategory = filterCategory === 'ALL' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
      // TODO: Save to localStorage or API
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Certificate: 'bg-blue-100 text-blue-700',
      Tax: 'bg-green-100 text-green-700',
      License: 'bg-purple-100 text-purple-700',
      Registration: 'bg-orange-100 text-orange-700',
      Other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>
          <p className="text-gray-600 mt-1">Manage all services provided by Gram Panchayat</p>
        </div>
        <Link
          to="/admin/services/new"
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
          Add Service
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter by Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <FileText size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{service.name.en}</h3>
                        <p className="text-gray-600">{service.name.mr}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm">{service.description.en}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Fees:</span>
                      <span className="text-green-600 font-bold">{service.fees}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Processing Time:</span>
                      <span className="text-blue-600 font-semibold">{service.processingTime}</span>
                    </div>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Required Documents</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{service.requiredDocuments.en}</pre>
                  </div>
                </div>

                {/* How to Apply */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">How to Apply</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{service.howToApply.en}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Link
                    to={`/admin/services/edit/${service.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                  >
                    <Edit size={18} />
                    Edit Service
                  </Link>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No services found</p>
            <Link
              to="/admin/services/new"
              className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 font-semibold"
            >
              <Plus size={20} />
              Add your first service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesManagement;
