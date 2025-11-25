import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import {
  getAllVillages,
  getBreakdownsByYear,
  bulkUpsertPopulationBreakdowns,
  bulkUpsertDemographics
} from '../../../services/villageStatisticsService';

const CATEGORIES = ['ST', 'SC', 'OBC', 'OTHER'];

const CategoryPopulationTab = ({ selectedYear }) => {
  const [villages, setVillages] = useState([]);
  const [breakdownsData, setBreakdownsData] = useState({});
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
      const yearBreakdowns = await getBreakdownsByYear(selectedYear);

      // Create nested map: villageId -> category -> {maleCount, femaleCount}
      const dataMap = {};
      allVillages.forEach(village => {
        dataMap[village.id] = {};
        CATEGORIES.forEach(category => {
          const existing = yearBreakdowns.find(
            b => b.villageId === village.id && b.category === category
          );
          dataMap[village.id][category] = {
            maleCount: existing?.maleCount || 0,
            femaleCount: existing?.femaleCount || 0
          };
        });
      });

      setVillages(allVillages);
      setBreakdownsData(dataMap);
    } catch (error) {
      console.error('Error loading category data:', error);
      setMessage({ type: 'error', text: 'Failed to load category data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (villageId, category, field, value) => {
    setBreakdownsData(prev => ({
      ...prev,
      [villageId]: {
        ...prev[villageId],
        [category]: {
          ...prev[villageId][category],
          [field]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert nested structure to flat array
      const dataArray = [];
      Object.entries(breakdownsData).forEach(([villageId, categories]) => {
        Object.entries(categories).forEach(([category, counts]) => {
          if (counts.maleCount < 0 || counts.femaleCount < 0) {
            throw new Error('Population counts cannot be negative');
          }
          dataArray.push({
            villageId,
            year: selectedYear,
            category,
            maleCount: counts.maleCount,
            femaleCount: counts.femaleCount
          });
        });
      });

      console.log('Saving category-wise data:', dataArray.length, 'records');
      await bulkUpsertPopulationBreakdowns(dataArray);
      console.log('Category-wise data saved successfully');

      // 🔄 AUTO-SYNC: Update Demographics based on category totals
      const demographicsArray = [];
      Object.entries(breakdownsData).forEach(([villageId, categories]) => {
        let totalMale = 0;
        let totalFemale = 0;
        
        // Sum up all categories
        Object.values(categories).forEach(counts => {
          totalMale += counts.maleCount || 0;
          totalFemale += counts.femaleCount || 0;
        });

        demographicsArray.push({
          villageId,
          year: selectedYear,
          totalPopulation: totalMale + totalFemale,
          malePopulation: totalMale,
          femalePopulation: totalFemale,
          source: 'Auto-calculated from Category-wise data'
        });
      });

      // Update demographics automatically
      console.log('Auto-updating demographics from category data:', demographicsArray.length, 'villages');
      await bulkUpsertDemographics(demographicsArray);
      console.log('Demographics auto-updated successfully');

      setMessage({ 
        type: 'success', 
        text: `✅ Category-wise data saved! Demographics auto-updated for ${selectedYear}.` 
      });
    } catch (error) {
      console.error('Error saving category-wise data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save data. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getTotalForCategory = (villageId, category) => {
    const data = breakdownsData[villageId]?.[category];
    return (data?.maleCount || 0) + (data?.femaleCount || 0);
  };

  const getCategoryGrandTotal = (category) => {
    return villages.reduce((sum, village) => {
      return sum + getTotalForCategory(village.id, category);
    }, 0);
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
            Category-wise Population - {selectedYear}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage ST/SC/OBC/Other population breakdown for each village
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
                <th rowSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                  Village Name
                </th>
                {CATEGORIES.map(category => (
                  <th key={category} colSpan="3" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                    {category}
                  </th>
                ))}
              </tr>
              <tr>
                {CATEGORIES.map(category => (
                  <React.Fragment key={category}>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Male</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Female</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 border-r">Total</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {villages.map((village, index) => (
                <tr key={village.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{village.nameEn}</div>
                      <div className="text-sm text-gray-500">{village.nameMr}</div>
                    </div>
                  </td>
                  {CATEGORIES.map(category => (
                    <React.Fragment key={category}>
                      <td className="px-2 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={breakdownsData[village.id]?.[category]?.maleCount || 0}
                          onChange={(e) => handleChange(village.id, category, 'maleCount', e.target.value)}
                          className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-2 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={breakdownsData[village.id]?.[category]?.femaleCount || 0}
                          onChange={(e) => handleChange(village.id, category, 'femaleCount', e.target.value)}
                          className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-2 py-4 text-center border-r">
                        <span className="font-semibold text-gray-700">
                          {getTotalForCategory(village.id, category)}
                        </span>
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900 border-r">Grand Total</td>
                {CATEGORIES.map(category => (
                  <React.Fragment key={category}>
                    <td className="px-2 py-4 text-center font-semibold text-gray-700">
                      {villages.reduce((sum, v) => sum + (breakdownsData[v.id]?.[category]?.maleCount || 0), 0)}
                    </td>
                    <td className="px-2 py-4 text-center font-semibold text-gray-700">
                      {villages.reduce((sum, v) => sum + (breakdownsData[v.id]?.[category]?.femaleCount || 0), 0)}
                    </td>
                    <td className="px-2 py-4 text-center font-bold text-gray-900 border-r">
                      {getCategoryGrandTotal(category)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {CATEGORIES.map((category, idx) => {
          const colors = [
            { from: 'purple-50', to: 'purple-100', border: 'purple-200', text: 'purple-600', value: 'purple-900' },
            { from: 'blue-50', to: 'blue-100', border: 'blue-200', text: 'blue-600', value: 'blue-900' },
            { from: 'green-50', to: 'green-100', border: 'green-200', text: 'green-600', value: 'green-900' },
            { from: 'amber-50', to: 'amber-100', border: 'amber-200', text: 'amber-600', value: 'amber-900' }
          ][idx];
          
          return (
            <div 
              key={category} 
              className={`bg-gradient-to-br from-${colors.from} to-${colors.to} p-4 rounded-lg border border-${colors.border}`}
            >
              <div className={`text-sm text-${colors.text} font-medium`}>{category} Population</div>
              <div className={`text-2xl font-bold text-${colors.value} mt-1`}>
                {getCategoryGrandTotal(category).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPopulationTab;
