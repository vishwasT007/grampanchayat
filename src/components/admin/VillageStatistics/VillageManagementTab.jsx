import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import {
  getAllVillages,
  createVillage,
  updateVillage,
  deleteVillage
} from '../../../services/villageStatisticsService';

const VillageManagementTab = () => {
  const [villages, setVillages] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    nameEn: '',
    nameMr: '',
    code: ''
  });

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const allVillages = await getAllVillages();
      setVillages(allVillages);
    } catch (error) {
      console.error('Error loading villages:', error);
      setMessage({ type: 'error', text: 'Failed to load villages' });
    }
  };

  const resetForm = () => {
    setFormData({ nameEn: '', nameMr: '', code: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.nameEn.trim() || !formData.nameMr.trim()) {
      setMessage({ type: 'error', text: 'Village name in both English and Marathi is required' });
      return;
    }

    try {
      await createVillage(formData);
      await loadVillages();
      resetForm();
      setMessage({ type: 'success', text: `Village "${formData.nameEn}" added successfully!` });
    } catch (error) {
      console.error('Error adding village:', error);
      setMessage({ type: 'error', text: 'Failed to add village. Please try again.' });
    }
  };

  const handleEdit = (village) => {
    setEditingId(village.id);
    setFormData({
      nameEn: village.nameEn,
      nameMr: village.nameMr,
      code: village.code || ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleUpdate = async () => {
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.nameEn.trim() || !formData.nameMr.trim()) {
      setMessage({ type: 'error', text: 'Village name in both English and Marathi is required' });
      return;
    }

    try {
      await updateVillage(editingId, formData);
      await loadVillages();
      resetForm();
      setMessage({ type: 'success', text: `Village "${formData.nameEn}" updated successfully!` });
    } catch (error) {
      console.error('Error updating village:', error);
      setMessage({ type: 'error', text: 'Failed to update village. Please try again.' });
    }
  };

  const handleDelete = async (village) => {
    if (!confirm(`Are you sure you want to delete "${village.nameEn}"?\n\nWarning: This will NOT delete associated statistics data. The data will remain but won't be visible unless you recreate the village.`)) {
      return;
    }

    try {
      await deleteVillage(village.id);
      await loadVillages();
      setMessage({ type: 'success', text: `Village "${village.nameEn}" deleted successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete village. Please try again.' });
    }
  };

  const handleCancel = () => {
    resetForm();
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Village Management
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Add, edit, or delete villages in your Gram Panchayat
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Village
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-gradient-to-br from-orange-50 to-green-50 border border-orange-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            {isAdding ? 'Add New Village' : 'Edit Village'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => handleInputChange('nameEn', e.target.value)}
                placeholder="e.g., Kothrud"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village Name (Marathi) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nameMr}
                onChange={(e) => handleInputChange('nameMr', e.target.value)}
                placeholder="e.g., कोथरूड"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village Code (Optional)
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="e.g., V001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={isAdding ? handleAdd : handleUpdate}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isAdding ? 'Add Village' : 'Update Village'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Villages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {villages.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No villages found</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add Your First Village
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-50 to-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Village Name (English)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Village Name (Marathi)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {villages.map((village, index) => (
                  <tr key={village.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{village.nameEn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{village.nameMr}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{village.code || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(village)}
                          disabled={isAdding || editingId}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(village)}
                          disabled={isAdding || editingId}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Add all your villages here before entering statistics data</li>
              <li>Deleting a village won't delete its statistics data (data remains orphaned)</li>
              <li>Village names should be unique to avoid confusion</li>
              <li>After adding villages, go to other tabs to enter their statistics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-600 font-medium">Total Villages</div>
          <div className="text-2xl font-bold text-orange-900 mt-1">
            {villages.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-medium">Villages with Code</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {villages.filter(v => v.code).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Last Added</div>
          <div className="text-sm font-semibold text-blue-900 mt-1">
            {villages.length > 0 ? villages[villages.length - 1].nameEn : 'None'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillageManagementTab;
