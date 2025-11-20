import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Bell, FileText, Megaphone, Calendar, Eye, EyeOff } from 'lucide-react';
import { mockNotices } from '../../data/mockData';

function NoticesManagement() {
  const navigate = useNavigate();
  
  // Load notices from localStorage or use initial mock data
  const [notices, setNotices] = useState(() => {
    const savedNotices = localStorage.getItem('NOTICES');
    console.log('Admin: Loading Notices:', savedNotices ? 'Found' : 'Not Found');
    
    if (savedNotices) {
      try {
        const parsed = JSON.parse(savedNotices);
        console.log('Admin: Parsed Notices:', parsed);
        return parsed;
      } catch (error) {
        console.error('Admin: Error parsing notices:', error);
        return mockNotices;
      }
    }
    // If no saved data, use initial mock data and save it
    localStorage.setItem('NOTICES', JSON.stringify(mockNotices));
    console.log('Admin: Initialized with mock data');
    return mockNotices;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Save to localStorage whenever notices change
  useEffect(() => {
    console.log('Admin: Saving notices to localStorage:', notices.length);
    localStorage.setItem('NOTICES', JSON.stringify(notices));
  }, [notices]);

  // Filter notices
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = 
      notice.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.title.mr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || notice.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(notice => notice.id !== id));
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'MEETING':
        return <Bell className="w-4 h-4" />;
      case 'TENDER':
        return <FileText className="w-4 h-4" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      MEETING: 'bg-blue-100 text-blue-700',
      TENDER: 'bg-green-100 text-green-700',
      ANNOUNCEMENT: 'bg-orange-100 text-orange-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${colors[type]}`}>
        {getTypeIcon(type)}
        {type}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const isActive = (notice) => {
    const now = new Date();
    const start = new Date(notice.startDate);
    const end = new Date(notice.endDate);
    return now >= start && now <= end;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notices Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage meetings, tenders, and announcements</p>
        </div>
        <button
          onClick={() => navigate('/admin/notices/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Notice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Meetings</p>
              <p className="text-2xl font-bold text-gray-800">
                {notices.filter(n => n.type === 'MEETING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tenders</p>
              <p className="text-2xl font-bold text-gray-800">
                {notices.filter(n => n.type === 'TENDER').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Announcements</p>
              <p className="text-2xl font-bold text-gray-800">
                {notices.filter(n => n.type === 'ANNOUNCEMENT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-800">
                {notices.filter(n => isActive(n)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="MEETING">Meetings</option>
              <option value="TENDER">Tenders</option>
              <option value="ANNOUNCEMENT">Announcements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Notices Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first notice'}
            </p>
            {!searchTerm && filterType === 'ALL' && (
              <button
                onClick={() => navigate('/admin/notices/new')}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Add Notice
              </button>
            )}
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeBadge(notice.type)}
                    {isActive(notice) ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        INACTIVE
                      </span>
                    )}
                    {notice.showOnHome && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        ON HOMEPAGE
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {notice.title.en}
                  </h3>
                  <p className="text-base text-gray-600 mb-3">{notice.title.mr}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>From: {formatDate(notice.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>To: {formatDate(notice.endDate)}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-2">{notice.description.en}</p>
                  <p className="text-gray-600 text-sm">{notice.description.mr}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/admin/notices/edit/${notice.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
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

export default NoticesManagement;
