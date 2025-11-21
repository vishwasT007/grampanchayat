import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Droplets } from 'lucide-react';
import {
  getAllVillages,
  getInfrastructureByYear,
  bulkUpsertVillageInfrastructure
} from '../../../services/villageStatisticsService';

const InfrastructureTab = ({ selectedYear }) => {
  const [villages, setVillages] = useState([]);
  const [infrastructureData, setInfrastructureData] = useState({});
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
      const yearInfrastructure = await getInfrastructureByYear(selectedYear);

      const dataMap = {};
      allVillages.forEach(village => {
        const existing = yearInfrastructure.find(i => i.villageId === village.id);
        dataMap[village.id] = {
          villageId: village.id,
          year: selectedYear,
          wellsCount: existing?.wellsCount || 0,
          borewellsCount: existing?.borewellsCount || 0,
          handpumpsCount: existing?.handpumpsCount || 0,
          tapConnectionsCount: existing?.tapConnectionsCount || 0,
          notes: existing?.notes || ''
        };
      });

      setVillages(allVillages);
      setInfrastructureData(dataMap);
    } catch (error) {
      console.error('Error loading infrastructure:', error);
      setMessage({ type: 'error', text: 'Failed to load infrastructure data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (villageId, field, value) => {
    setInfrastructureData(prev => ({
      ...prev,
      [villageId]: {
        ...prev[villageId],
        [field]: field === 'notes' ? value : parseInt(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataArray = Object.values(infrastructureData);
      
      // Validate
      for (const data of dataArray) {
        if (data.wellsCount < 0 || data.borewellsCount < 0 || 
            data.handpumpsCount < 0 || data.tapConnectionsCount < 0) {
          throw new Error('Infrastructure counts cannot be negative');
        }
      }

      await bulkUpsertVillageInfrastructure(dataArray);

      setMessage({ 
        type: 'success', 
        text: `Water & Infrastructure data for ${selectedYear} saved successfully!` 
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to save data. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getTotalInfrastructure = (villageId) => {
    const data = infrastructureData[villageId];
    if (!data) return 0;
    return (data.wellsCount || 0) + (data.borewellsCount || 0) + 
           (data.handpumpsCount || 0) + (data.tapConnectionsCount || 0);
  };

  const getGrandTotal = (field) => {
    return Object.values(infrastructureData).reduce((sum, d) => sum + (d[field] || 0), 0);
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
            Water & Infrastructure - {selectedYear}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage water resources and infrastructure for each village
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-blue-600 font-medium">Wells</div>
          </div>
          <div className="text-sm text-blue-500 mt-1">विहीर</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-600" />
            <div className="text-sm text-cyan-600 font-medium">Borewells</div>
          </div>
          <div className="text-sm text-cyan-500 mt-1">बोअरवेल</div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-teal-600" />
            <div className="text-sm text-teal-600 font-medium">Handpumps</div>
          </div>
          <div className="text-sm text-teal-500 mt-1">हँडपंप</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-indigo-600" />
            <div className="text-sm text-indigo-600 font-medium">Tap Connections</div>
          </div>
          <div className="text-sm text-indigo-500 mt-1">नळ जोडणी</div>
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
                  Wells<br/>
                  <span className="text-xs font-normal text-gray-500">(विहीर)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Borewells<br/>
                  <span className="text-xs font-normal text-gray-500">(बोअरवेल)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Handpumps<br/>
                  <span className="text-xs font-normal text-gray-500">(हँडपंप)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tap Connections<br/>
                  <span className="text-xs font-normal text-gray-500">(नळ जोडणी)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Notes
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
                      value={infrastructureData[village.id]?.wellsCount || 0}
                      onChange={(e) => handleChange(village.id, 'wellsCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.borewellsCount || 0}
                      onChange={(e) => handleChange(village.id, 'borewellsCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.handpumpsCount || 0}
                      onChange={(e) => handleChange(village.id, 'handpumpsCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.tapConnectionsCount || 0}
                      onChange={(e) => handleChange(village.id, 'tapConnectionsCount', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-700">
                      {getTotalInfrastructure(village.id)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={infrastructureData[village.id]?.notes || ''}
                      onChange={(e) => handleChange(village.id, 'notes', e.target.value)}
                      placeholder="Additional notes..."
                      className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Grand Total</td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('wellsCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('borewellsCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('handpumpsCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('tapConnectionsCount')}
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {getGrandTotal('wellsCount') + getGrandTotal('borewellsCount') + 
                   getGrandTotal('handpumpsCount') + getGrandTotal('tapConnectionsCount')}
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Wells</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {getGrandTotal('wellsCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
          <div className="text-sm text-cyan-600 font-medium">Total Borewells</div>
          <div className="text-2xl font-bold text-cyan-900 mt-1">
            {getGrandTotal('borewellsCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
          <div className="text-sm text-teal-600 font-medium">Total Handpumps</div>
          <div className="text-2xl font-bold text-teal-900 mt-1">
            {getGrandTotal('handpumpsCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="text-sm text-indigo-600 font-medium">Tap Connections</div>
          <div className="text-2xl font-bold text-indigo-900 mt-1">
            {getGrandTotal('tapConnectionsCount')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Total Infrastructure</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            {getGrandTotal('wellsCount') + getGrandTotal('borewellsCount') + 
             getGrandTotal('handpumpsCount') + getGrandTotal('tapConnectionsCount')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureTab;
