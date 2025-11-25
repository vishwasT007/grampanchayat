import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Briefcase, 
  Bell, 
  Image, 
  Download,
  Settings,
  TrendingUp,
  Calendar,
  UserPlus,
  BookOpen,
  Edit3
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getMembers } from '../../services/membersService';
import { getServices } from '../../services/servicesService';
import { getSchemes } from '../../services/schemesService';
import { getAllNotices, getActiveNotices } from '../../services/noticesService';
import { getAllPrograms } from '../../services/galleryService';
import { getAllForms } from '../../services/formsService';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    services: 0,
    schemes: 0,
    activeNotices: 0,
    programs: 0,
    forms: 0
  });
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentPrograms, setRecentPrograms] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        membersData,
        servicesData,
        schemesData,
        allNoticesData,
        programsData,
        formsData
      ] = await Promise.all([
        getMembers(),
        getServices(),
        getSchemes(),
        getAllNotices(),
        getAllPrograms(),
        getAllForms()
      ]);

      // Update stats
      setStats({
        members: membersData?.length || 0,
        services: servicesData?.length || 0,
        schemes: schemesData?.length || 0,
        activeNotices: allNoticesData?.filter(n => n.status === 'ACTIVE')?.length || 0,
        programs: programsData?.length || 0,
        forms: formsData?.length || 0
      });

      // Set recent items (last 3)
      setRecentNotices(allNoticesData?.slice(0, 3) || []);
      setRecentPrograms(programsData?.slice(0, 3) || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Members',
      count: stats.members,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/members'
    },
    {
      title: 'Services',
      count: stats.services,
      icon: FileText,
      color: 'from-green-600 to-green-700',
      link: '/admin/services'
    },
    {
      title: 'Schemes',
      count: stats.schemes,
      icon: Briefcase,
      color: 'from-blue-800 to-blue-900',
      link: '/admin/schemes'
    },
    {
      title: 'Active Notices',
      count: stats.activeNotices,
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/notices'
    },
    {
      title: 'Programs',
      count: stats.programs,
      icon: Image,
      color: 'from-pink-500 to-pink-600',
      link: '/admin/gallery'
    },
    {
      title: 'Forms',
      count: stats.forms,
      icon: Download,
      color: 'from-indigo-500 to-indigo-600',
      link: '/admin/forms'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your Gram Panchayat.</p>
        </div>
        <Link
          to="/admin/settings"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Settings size={20} />
          Site Settings
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden group"
          >
            <div className={`bg-gradient-to-br ${stat.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-4xl font-bold">{stat.count}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <stat.icon size={32} />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                Manage {stat.title}
                <TrendingUp size={16} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserPlus size={24} className="text-orange-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/members/new"
            className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Users size={20} className="text-orange-600" />
            </div>
            <span className="font-semibold text-gray-700">Add Member</span>
          </Link>
          
          <Link
            to="/admin/services/new"
            className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FileText size={20} className="text-green-600" />
            </div>
            <span className="font-semibold text-gray-700">Add Service</span>
          </Link>
          
          <Link
            to="/admin/notices/new"
            className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Bell size={20} className="text-purple-600" />
            </div>
            <span className="font-semibold text-gray-700">Add Notice</span>
          </Link>
          
          <Link
            to="/admin/gallery/new"
            className="flex items-center gap-3 p-4 border-2 border-pink-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all group"
          >
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <Image size={20} className="text-pink-600" />
            </div>
            <span className="font-semibold text-gray-700">Add Program</span>
          </Link>
        </div>
      </div>

      {/* Content Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Edit3 size={24} className="text-blue-600" />
          Content Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/content/about"
            className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-700">Edit About Page</div>
              <div className="text-sm text-gray-500">Village info, history, vision & mission</div>
            </div>
          </Link>
          
          <Link
            to="/admin/content/education"
            className="flex items-center gap-3 p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <BookOpen size={20} className="text-indigo-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-700">Edit Education Page</div>
              <div className="text-sm text-gray-500">Schools, anganwadis & programs</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell size={24} className="text-purple-600" />
              Recent Notices
            </h2>
            <Link to="/admin/notices" className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotices.length > 0 ? (
              recentNotices.map(notice => (
                <div key={notice.id} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{notice.title.en}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notice.description.en}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(notice.startDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${notice.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {notice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No notices yet</p>
            )}
          </div>
        </div>

        {/* Recent Programs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Image size={24} className="text-pink-600" />
              Recent Programs
            </h2>
            <Link to="/admin/gallery" className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentPrograms.length > 0 ? (
              recentPrograms.map(program => (
                <div key={program.id} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                  <div className="flex items-start gap-3">
                    <img 
                      src={program.photoUrl} 
                      alt={program.title.en}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{program.title.en}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{program.description.en}</p>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(program.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No programs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
