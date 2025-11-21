import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import {
  getAllVillages,
  getDemographicsByYear,
  bulkUpsertDemographics
} from '../../../services/villageStatisticsService';

const DemographicsTab = ({ selectedYear }) => {
  const [villages, setVillages] = useState([]);
  const [demographicsData, setDemographicsData] = useState({});
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
      const yearDemographics = await getDemographicsByYear(selectedYear);

      // Create a map of village demographics
      const dataMap = {};
      allVillages.forEach(village => {
        const existing = yearDemographics.find(d => d.villageId === village.id);
        dataMap[village.id] = {
          villageId: village.id,
          year: selectedYear,
          totalPopulation: existing?.totalPopulation || 0,
          malePopulation: existing?.malePopulation || 0,
          femalePopulation: existing?.femalePopulation || 0,
          source: existing?.source || ''
        };
      });

      setVillages(allVillages);
      setDemographicsData(dataMap);
    } catch (error) {
      console.error('Error loading demographics:', error);
      setMessage({ type: 'error', text: 'Failed to load demographics data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (villageId, field, value) => {
    setDemographicsData(prev => ({
      ...prev,
      [villageId]: {
        ...prev[villageId],
        [field]: field === 'source' ? value : parseInt(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate data
      const dataArray = Object.values(demographicsData);
      for (const data of dataArray) {
        if (data.totalPopulation < 0 || data.malePopulation < 0 || data.femalePopulation < 0) {
          setMessage({ type: 'error', text: 'Population counts cannot be negative' });
          setSaving(false);
          return;
        }
      }

      // Save all demographics
      await bulkUpsertDemographics(dataArray);
      bulkUpsertDemographics(dataArray);

      setMessage({ type: 'success', text: `Demographics for year ${selectedYear} saved successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save demographics. Please try again.' });
    } finally {
      setSaving(false);
    }
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
            Population Demographics - {selectedYear}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage total, male, and female population for each village
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-orange-50 to-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Village Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Population
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Male Population
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Female Population
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data Source
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      value={demographicsData[village.id]?.totalPopulation || 0}
                      onChange={(e) => handleChange(village.id, 'totalPopulation', e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      value={demographicsData[village.id]?.malePopulation || 0}
                      onChange={(e) => handleChange(village.id, 'malePopulation', e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      value={demographicsData[village.id]?.femalePopulation || 0}
                      onChange={(e) => handleChange(village.id, 'femalePopulation', e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={demographicsData[village.id]?.source || ''}
                      onChange={(e) => handleChange(village.id, 'source', e.target.value)}
                      placeholder="e.g., Census 2011"
                      className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Population</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {Object.values(demographicsData).reduce((sum, d) => sum + (d.totalPopulation || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="text-sm text-indigo-600 font-medium">Male Population</div>
          <div className="text-2xl font-bold text-indigo-900 mt-1">
            {Object.values(demographicsData).reduce((sum, d) => sum + (d.malePopulation || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
          <div className="text-sm text-pink-600 font-medium">Female Population</div>
          <div className="text-2xl font-bold text-pink-900 mt-1">
            {Object.values(demographicsData).reduce((sum, d) => sum + (d.femalePopulation || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicsTab;
