import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import { getGrievances, deleteGrievance } from '../../services/grievancesService';
function GrievancesManagement() {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrievances();
  }, []);

  const loadGrievances = async () => {
    try {
      const data = await getGrievances();
      setGrievances(data);
    } catch (error) {
      console.error('Error loading grievances:', error);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Filter grievances
  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = 
      grievance.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.title.mr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || grievance.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || grievance.category === filterCategory;
    const matchesPriority = filterPriority === 'ALL' || grievance.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      setGrievances(grievances.filter(g => g.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-300',
      RESOLVED: 'bg-green-100 text-green-700 border-green-300',
      REJECTED: 'bg-red-100 text-red-700 border-red-300'
    };
    const icons = {
      PENDING: <Clock className="w-3 h-3" />,
      IN_PROGRESS: <AlertCircle className="w-3 h-3" />,
      RESOLVED: <CheckCircle className="w-3 h-3" />,
      REJECTED: <XCircle className="w-3 h-3" />
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${styles[status]}`}>
        {icons[status]}
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      LOW: 'bg-gray-100 text-gray-700',
      MEDIUM: 'bg-orange-100 text-orange-700',
      HIGH: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const styles = {
      WATER: 'bg-blue-100 text-blue-700',
      ROAD: 'bg-gray-100 text-gray-700',
      ELECTRICITY: 'bg-yellow-100 text-yellow-700',
      SANITATION: 'bg-green-100 text-green-700',
      TAX: 'bg-purple-100 text-purple-700',
      OTHER: 'bg-pink-100 text-pink-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[category]}`}>
        {category}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
          <h1 className="text-2xl font-bold text-gray-800">Grievances Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage citizen complaints and feedback</p>
        </div>
        <button
          onClick={() => navigate('/admin/grievances/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Grievance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {grievances.filter(g => g.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {grievances.filter(g => g.status === 'IN_PROGRESS').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-800">
                {grievances.filter(g => g.status === 'RESOLVED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{grievances.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search grievances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ALL">All Categories</option>
              <option value="WATER">Water</option>
              <option value="ROAD">Road</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="SANITATION">Sanitation</option>
              <option value="TAX">Tax</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Grievances Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'ALL' || filterCategory !== 'ALL' || filterPriority !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first grievance'}
            </p>
            {!searchTerm && filterStatus === 'ALL' && filterCategory === 'ALL' && filterPriority === 'ALL' && (
              <button
                onClick={() => navigate('/admin/grievances/new')}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Add Grievance
              </button>
            )}
          </div>
        ) : (
          filteredGrievances.map((grievance) => (
            <div
              key={grievance.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {getStatusBadge(grievance.status)}
                    {getPriorityBadge(grievance.priority)}
                    {getCategoryBadge(grievance.category)}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {grievance.title.en}
                  </h3>
                  <p className="text-base text-gray-600 mb-3">{grievance.title.mr}</p>
                  
                  {/* Description */}
                  <p className="text-gray-700 mb-2">{grievance.description.en}</p>
                  <p className="text-gray-600 text-sm mb-4">{grievance.description.mr}</p>

                  {/* Submitted By */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Submitted By:</span> {grievance.submittedBy}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {grievance.phone}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {grievance.email}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {grievance.address}
                    </div>
                    <div>
                      <span className="font-medium">Submitted Date:</span> {formatDate(grievance.submittedDate)}
                    </div>
                    <div>
                      <span className="font-medium">Assigned To:</span> {grievance.assignedTo}
                    </div>
                  </div>

                  {/* Response */}
                  {grievance.response && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Response:</p>
                      <p className="text-blue-800 text-sm">{grievance.response.en}</p>
                      <p className="text-blue-700 text-xs mt-1">{grievance.response.mr}</p>
                    </div>
                  )}

                  {/* Resolved Date */}
                  {grievance.resolvedDate && (
                    <div className="mt-2 text-sm text-green-700">
                      <span className="font-medium">Resolved on:</span> {formatDate(grievance.resolvedDate)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/admin/grievances/edit/${grievance.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(grievance.id)}
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

export default GrievancesManagement;
