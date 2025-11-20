import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, UserCircle } from 'lucide-react';
import { mockMembers } from '../../data/mockData';

const MembersManagement = () => {
  const [members, setMembers] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.name.mr.includes(searchTerm);
    const matchesType = filterType === 'ALL' || member.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== id));
      // TODO: Save to localStorage or API
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      SARPANCH: 'bg-orange-100 text-orange-700',
      UPSARPANCH: 'bg-green-100 text-green-700',
      MEMBER: 'bg-blue-100 text-blue-700',
      STAFF: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Members Management</h1>
          <p className="text-gray-600 mt-1">Manage Sarpanch, Upsarpanch, Members and Staff</p>
        </div>
        <Link
          to="/admin/members/new"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
          Add Member
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
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filter by Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="ALL">All Members</option>
            <option value="SARPANCH">Sarpanch</option>
            <option value="UPSARPANCH">Upsarpanch</option>
            <option value="MEMBER">Members</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              {/* Member Photo */}
              <div className="h-48 bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name.en} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={80} className="text-gray-400" />
                )}
              </div>

              {/* Member Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name.en}</h3>
                    <p className="text-sm text-gray-600 mb-2">{member.name.mr}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(member.type)}`}>
                    {member.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Designation:</span> {member.designation.en}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Phone:</span> {member.phone}
                  </p>
                  {member.termStart && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Term:</span> {new Date(member.termStart).getFullYear()} - {new Date(member.termEnd).getFullYear()}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/admin/members/edit/${member.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <UserCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No members found</p>
            <Link
              to="/admin/members/new"
              className="inline-flex items-center gap-2 mt-4 text-orange-600 hover:text-orange-700 font-semibold"
            >
              <Plus size={20} />
              Add your first member
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersManagement;
