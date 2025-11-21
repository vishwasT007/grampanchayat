import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Image, Calendar, Eye, EyeOff } from 'lucide-react';
import { getAllPrograms, deleteProgram } from '../../services/galleryService';

function GalleryManagement() {
  const navigate = useNavigate();
  
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load programs from Firebase
  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await getAllPrograms();
      console.log('Loaded gallery programs from Firebase:', data.length);
      setPrograms(data);
    } catch (error) {
      console.error('Error loading gallery programs:', error);
      alert('Failed to load gallery programs');
    } finally {
      setLoading(false);
    }
  };

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.titleMr?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program/photo? All images will be permanently deleted.')) {
      try {
        await deleteProgram(id);
        setPrograms(programs.filter(program => program.id !== id));
        alert('Program deleted successfully!');
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('Failed to delete program');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage photos and programs</p>
        </div>
        <button
          onClick={() => navigate('/admin/gallery/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Photo/Program
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Programs</p>
                  <p className="text-2xl font-bold text-gray-800">{programs.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Images</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {programs.reduce((sum, p) => sum + (p.images?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {programs.filter(p => {
                      const programDate = new Date(p.date);
                      const now = new Date();
                      return programDate.getMonth() === now.getMonth() && 
                             programDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Photos Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? 'Try adjusting your search'
                    : 'Get started by adding your first photo or program'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => navigate('/admin/gallery/new')}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Add Photo/Program
                  </button>
                )}
              </div>
            ) : (
              filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {program.images && program.images.length > 0 ? (
                      <img
                        src={program.images[0]}
                        alt={program.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Image Count Badge */}
                    {program.images && program.images.length > 1 && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white shadow-lg flex items-center gap-1">
                          <Image className="w-3 h-3" />
                          {program.images.length} photos
                        </span>
                      </div>
                    )}

                    {/* Edit/Delete Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => navigate(`/admin/gallery/edit/${program.id}`)}
                        className="p-3 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(program.id)}
                        className="p-3 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(program.date)}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {program.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{program.titleMr}</p>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                      {program.descriptionEn}
                    </p>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {program.descriptionMr}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default GalleryManagement;
