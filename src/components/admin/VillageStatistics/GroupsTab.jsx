import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Users } from 'lucide-react';
import {
  getAllVillages,
  getGroupsByYear,
  bulkUpsertVillageGroups
} from '../../../services/villageStatisticsService';

const GroupsTab = ({ selectedYear }) => {
  const [villages, setVillages] = useState([]);
  const [groupsData, setGroupsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allVillages = await getAllVillages();
      const yearGroups = await getGroupsByYear(selectedYear);

      const dataMap = {};
      allVillages.forEach(village => {
        const existing = yearGroups.find(g => g.villageId === village.id);
        dataMap[village.id] = {
          villageId: village.id,
          year: selectedYear,
          mahilaBachatGatCount: existing?.mahilaBachatGatCount || 0,
          yuvakMandalCount: existing?.yuvakMandalCount || 0,
          kisanGatCount: existing?.kisanGatCount || 0,
          otherGroupCount: existing?.otherGroupCount || 0
        };
      });

      setVillages(allVillages);
      setGroupsData(dataMap);
    } catch (error) {
      console.error('Error loading groups data:', error);
      setMessage({ type: 'error', text: 'Failed to load groups data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (villageId, field, value) => {
    setGroupsData(prev => ({
      ...prev,
      [villageId]: {
        ...prev[villageId],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataArray = Object.values(groupsData);
      
      // Validate
      for (const data of dataArray) {
        if (data.mahilaBachatGatCount < 0 || data.yuvakMandalCount < 0 || 
            data.kisanGatCount < 0 || data.otherGroupCount < 0) {
          throw new Error('Group counts cannot be negative');
        }
      }

      console.log('Saving groups & committees data:', dataArray.length, 'records');
      await bulkUpsertVillageGroups(dataArray);
      console.log('Groups & committees data saved successfully');

      setMessage({ 
        type: 'success', 
        text: `Groups & Committees data for ${selectedYear} saved successfully!` 
      });
    } catch (error) {
      console.error('Error saving groups data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save data. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getTotalGroups = (villageId) => {
    const data = groupsData[villageId];
    if (!data) return 0;
    return (data.mahilaBachatGatCount || 0) + (data.yuvakMandalCount || 0) + 
           (data.kisanGatCount || 0) + (data.otherGroupCount || 0);
  };

  const getGrandTotal = (field) => {
    return Object.values(groupsData).reduce((sum, d) => sum + (d[field] || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Groups & Committees - {selectedYear}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage community groups count for each village
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-600" />
            <div className="text-sm text-pink-600 font-medium">Mahila Bachat Gat</div>
          </div>
          <div className="text-sm text-pink-500 mt-1">Women's Self-Help Groups</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-blue-600 font-medium">Yuvak Mandal</div>
          </div>
          <div className="text-sm text-blue-500 mt-1">Youth Organizations</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <div className="text-sm text-green-600 font-medium">Kisan Gat</div>
          </div>
          <div className="text-sm text-green-500 mt-1">Farmers' Groups</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <div className="text-sm text-purple-600 font-medium">Other Groups</div>
          </div>
          <div className="text-sm text-purple-500 mt-1">Other Community Groups</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-orange-50 to-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Village Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Mahila Bachat Gat<br/>
                  <span className="text-xs font-normal text-gray-500">(महिला बचत गट)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Yuvak Mandal<br/>
                  <span className="text-xs font-normal text-gray-500">(युवक मंडळ)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Kisan Gat<br/>
                  <span className="text-xs font-normal text-gray-500">(किसान गट)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Other Groups<br/>
                  <span className="text-xs font-normal text-gray-500">(इतर गट)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {villages.map((village, index) => (
                <tr key={village.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{village.nameEn}</div>
                      <div className="text-sm text-gray-500">{village.nameMr}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={groupsData[village.id]?.mahilaBachatGatCount || 0}
                      onChange={(e) => handleChange(village.id, 'mahilaBachatGatCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={groupsData[village.id]?.yuvakMandalCount || 0}
                      onChange={(e) => handleChange(village.id, 'yuvakMandalCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={groupsData[village.id]?.kisanGatCount || 0}
                      onChange={(e) => handleChange(village.id, 'kisanGatCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={groupsData[village.id]?.otherGroupCount || 0}
                      onChange={(e) => handleChange(village.id, 'otherGroupCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-700">
                      {getTotalGroups(village.id)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Grand Total</td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('mahilaBachatGatCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('yuvakMandalCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('kisanGatCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('otherGroupCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('mahilaBachatGatCount') + getGrandTotal('yuvakMandalCount') + 
                   getGrandTotal('kisanGatCount') + getGrandTotal('otherGroupCount')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
          <div className="text-sm text-pink-600 font-medium">Mahila Bachat Gat</div>
          <div className="text-2xl font-bold text-pink-900 mt-1">
            {getGrandTotal('mahilaBachatGatCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Yuvak Mandal</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {getGrandTotal('yuvakMandalCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-medium">Kisan Gat</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {getGrandTotal('kisanGatCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Other Groups</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            {getGrandTotal('otherGroupCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-600 font-medium">Total Groups</div>
          <div className="text-2xl font-bold text-orange-900 mt-1">
            {getGrandTotal('mahilaBachatGatCount') + getGrandTotal('yuvakMandalCount') + 
             getGrandTotal('kisanGatCount') + getGrandTotal('otherGroupCount')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsTab;
