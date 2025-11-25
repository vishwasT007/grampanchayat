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
          // Table 1: Water Supply Sources
          privateWells: existing?.privateWells || 0,
          publicWells: existing?.publicWells || 0,
          nitScheme: existing?.nitScheme || 0,
          handpumps: existing?.handpumps || 0,
          waterTankCapacity: existing?.waterTankCapacity || '',
          waterFilterPlant: existing?.waterFilterPlant || 0,
          privatePonds: existing?.privatePonds || 0,
          // Table 2: Tap Connection Details
          families: existing?.families || 0,
          oldTapConnections: existing?.oldTapConnections || 0,
          newTapConnections: existing?.newTapConnections || 0,
          totalTapConnections: existing?.totalTapConnections || 0,
          privateWellsForTap: existing?.privateWellsForTap || 0,
          pendingTapConnections: existing?.pendingTapConnections || 0,
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
    setInfrastructureData(prev => {
      const updated = {
        ...prev,
        [villageId]: {
          ...prev[villageId],
          [field]: (field === 'notes' || field === 'waterTankCapacity') ? value : parseInt(value) || 0
        }
      };
      
      // Auto-calculate total tap connections
      if (field === 'oldTapConnections' || field === 'newTapConnections') {
        const old = field === 'oldTapConnections' ? (parseInt(value) || 0) : updated[villageId].oldTapConnections;
        const newConn = field === 'newTapConnections' ? (parseInt(value) || 0) : updated[villageId].newTapConnections;
        updated[villageId].totalTapConnections = old + newConn;
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataArray = Object.values(infrastructureData);
      
      console.log('Saving water & infrastructure data:', dataArray.length, 'records');
      await bulkUpsertVillageInfrastructure(dataArray);
      console.log('Water & infrastructure data saved successfully');

      setMessage({ 
        type: 'success', 
        text: `Water & Infrastructure data for ${selectedYear} saved successfully!` 
      });
    } catch (error) {
      console.error('Error saving infrastructure data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save data. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getTotal = (field) => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Water Supply Information - {selectedYear}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            पाणीपुरवठा माहिती | Manage water resources and infrastructure
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

      {/* TABLE 1: Water Supply Sources */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Table 1: Water Supply Sources | पाणी पुरवठा साधने
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-orange-50 to-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Sr. No.<br/>
                  <span className="text-xs font-normal text-gray-500">अ.क्र.</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Water Source<br/>
                  <span className="text-xs font-normal text-gray-500">पाणी स्रोत</span>
                </th>
                {villages.map(village => (
                  <th key={village.id} className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {village.nameEn}<br/>
                    <span className="text-xs font-normal text-gray-500">{village.nameMr}</span>
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-50">
                  Total<br/>
                  <span className="text-xs font-normal text-gray-500">एकूण</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Row 1: Private Wells */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">1</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Private Wells<br/>
                  <span className="text-xs text-gray-500">खाजगी विहीर</span>
                </td>
                {villages.map(village => (
                  <td key={village.id} className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.privateWells || 0}
                      onChange={(e) => handleChange(village.id, 'privateWells', e.target.value)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                  {getTotal('privateWells')}
                </td>
              </tr>

              {/* Row 2: Public Wells */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">2</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Public Wells<br/>
                  <span className="text-xs text-gray-500">सार्वजनिक विहीर</span>
                </td>
                {villages.map(village => (
                  <td key={village.id} className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.publicWells || 0}
                      onChange={(e) => handleChange(village.id, 'publicWells', e.target.value)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                  {getTotal('publicWells')}
                </td>
              </tr>

              {/* Row 3: NIT Scheme */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">3</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  NIT Scheme<br/>
                  <span className="text-xs text-gray-500">एनआयटी योजना</span>
                </td>
                {villages.map(village => (
                  <td key={village.id} className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.nitScheme || 0}
                      onChange={(e) => handleChange(village.id, 'nitScheme', e.target.value)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                  {getTotal('nitScheme')}
                </td>
              </tr>

              {/* Row 4: Handpumps */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">4</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Handpumps<br/>
                  <span className="text-xs text-gray-500">हँडपंप</span>
                </td>
                {villages.map(village => (
                  <td key={village.id} className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.handpumps || 0}
                      onChange={(e) => handleChange(village.id, 'handpumps', e.target.value)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                  {getTotal('handpumps')}
                </td>
              </tr>

              {/* Row 5: Water Tank Capacity */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">5</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Water Tank Capacity<br/>
                  <span className="text-xs text-gray-500">पाणी टाकीची क्षमता</span>
                </td>
                {villages.map(village => (
                  <td key={village.id} className="px-6 py-4 text-center">
                    <input
                      type="text"
                      value={infrastructureData[village.id]?.waterTankCapacity || ''}
                      onChange={(e) => handleChange(village.id, 'waterTankCapacity', e.target.value)}
                      placeholder="e.g., 8 lakh liters"
                      className="w-32 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center text-gray-500 bg-blue-50">—</td>
              </tr>

              {/* Row 6: Water Filter Plant */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">6</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Water Filter Plant<br/>
                  <span className="text-xs text-gray-500">पाणी गाळणी प्रकल्प</span>
                </td>
                {villages.map(village => (
                  <td key={village.id} className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.waterFilterPlant || 0}
                      onChange={(e) => handleChange(village.id, 'waterFilterPlant', e.target.value)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                  {getTotal('waterFilterPlant')}
                </td>
              </tr>

              {/* Row 7: Private Ponds */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">7</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Private Ponds<br/>
                  <span className="text-xs text-gray-500">खाजगी तलाव</span>
                </td>
                {villages.map(village => (
                  <td key={village.id} className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.privatePonds || 0}
                      onChange={(e) => handleChange(village.id, 'privatePonds', e.target.value)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                  {getTotal('privatePonds')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 2: Tap Connection Details */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Table 2: Tap Connection Details | नळ जोडणी माहिती
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-orange-50 to-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Sr. No.<br/>
                  <span className="text-xs font-normal text-gray-500">अ.क्र.</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Village<br/>
                  <span className="text-xs font-normal text-gray-500">गाव</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Families<br/>
                  <span className="text-xs font-normal text-gray-500">कुटुंबे</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Old Tap Connections<br/>
                  <span className="text-xs font-normal text-gray-500">जुने नळ</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  New Tap Connections<br/>
                  <span className="text-xs font-normal text-gray-500">नवीन नळ</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider bg-indigo-50">
                  Total Tap Connections<br/>
                  <span className="text-xs font-normal text-gray-500">(Auto)</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Private Wells<br/>
                  <span className="text-xs font-normal text-gray-500">खाजगी विहीर</span>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Pending<br/>
                  <span className="text-xs font-normal text-gray-500">प्रलंबित</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {villages.map((village, index) => (
                <tr key={village.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{village.nameEn}</div>
                    <div className="text-xs text-gray-500">{village.nameMr}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.families || 0}
                      onChange={(e) => handleChange(village.id, 'families', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.oldTapConnections || 0}
                      onChange={(e) => handleChange(village.id, 'oldTapConnections', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.newTapConnections || 0}
                      onChange={(e) => handleChange(village.id, 'newTapConnections', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center bg-indigo-50">
                    <input
                      type="number"
                      value={infrastructureData[village.id]?.totalTapConnections || 0}
                      readOnly
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded bg-gray-100 font-semibold cursor-not-allowed"
                      title="Auto-calculated: Old + New"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.privateWellsForTap || 0}
                      onChange={(e) => handleChange(village.id, 'privateWellsForTap', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={infrastructureData[village.id]?.pendingTapConnections || 0}
                      onChange={(e) => handleChange(village.id, 'pendingTapConnections', e.target.value)}
                      className="w-24 px-3 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-indigo-50">
              <tr className="font-bold">
                <td className="px-6 py-4" colSpan="2">Total | एकूण</td>
                <td className="px-6 py-4 text-center text-indigo-900">
                  {getTotal('families')}
                </td>
                <td className="px-6 py-4 text-center text-indigo-900">
                  {getTotal('oldTapConnections')}
                </td>
                <td className="px-6 py-4 text-center text-indigo-900">
                  {getTotal('newTapConnections')}
                </td>
                <td className="px-6 py-4 text-center text-indigo-900 bg-indigo-100">
                  {getTotal('totalTapConnections')}
                </td>
                <td className="px-6 py-4 text-center text-indigo-900">
                  {getTotal('privateWellsForTap')}
                </td>
                <td className="px-6 py-4 text-center text-indigo-900">
                  {getTotal('pendingTapConnections')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureTab;
