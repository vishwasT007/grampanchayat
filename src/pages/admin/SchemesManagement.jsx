import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Briefcase } from 'lucide-react';
import { mockSchemes } from '../../data/mockData';
import { getSchemes, deleteScheme } from '../../services/schemesService';

const SchemesManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const categories = ['ALL', 'CENTRAL', 'STATE', 'DISTRICT'];

  // Load schemes from Firebase
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setLoading(true);
        const schemesData = await getSchemes();
        setSchemes(schemesData);
      } catch (error) {
        console.error('Error loading schemes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, []);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.name.mr.includes(searchTerm);
    const matchesCategory = filterCategory === 'ALL' || scheme.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await deleteScheme(id);
        setSchemes(schemes.filter(s => s.id !== id));
        console.log('Scheme deleted successfully');
      } catch (error) {
        console.error('Error deleting scheme:', error);
        alert('Failed to delete scheme. Please try again.');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      CENTRAL: 'bg-orange-100 text-orange-700',
      STATE: 'bg-green-100 text-green-700',
      DISTRICT: 'bg-blue-100 text-blue-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Schemes Management</h1>
          <p className="text-gray-600 mt-1">Manage government schemes and programs</p>
        </div>
        <Link
          to="/admin/schemes/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
          Add Scheme
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full flex items-center justify-center">
                        <Briefcase size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{scheme.name.en}</h3>
                        <p className="text-gray-600">{scheme.name.mr}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(scheme.category)}`}>
                      {scheme.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(scheme.status)}`}>
                      {scheme.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm">{scheme.description.en}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Eligibility Criteria</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{scheme.eligibility.en}</pre>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Required Documents</h4>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{scheme.documentsRequired.en}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Application Process</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{scheme.applicationProcess.en}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Link
                    to={`/admin/schemes/edit/${scheme.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                  >
                    <Edit size={18} />
                    Edit Scheme
                  </Link>
                  <button
                    onClick={() => handleDelete(scheme.id)}
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
            <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No schemes found</p>
            <Link
              to="/admin/schemes/new"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Plus size={20} />
              Add your first scheme
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesManagement;
